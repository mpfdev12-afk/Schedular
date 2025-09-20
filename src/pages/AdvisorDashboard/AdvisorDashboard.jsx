import React, { useMemo, useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaBed, FaUserMd, FaAmbulance } from "react-icons/fa";
import { fetchDataFromApi } from "../../utils/api";
import "./advisorDashboard.scss";
import {
  capitalizeWords,
  formatDateToYYYYMMDD,
} from "../../utils/usableFunctions";
import { formatDateToDDMMYYYY } from "../../utils/usableFunctions";
import Sidebar from "../../components/Sidebar/Sidebar";
import Table from "../../components/Table/Table";
import CalendarCard from "../../components/Cards/CalendarCard";
import Stats from "../../components/Stats/Stats";
import { tableConfigs } from "../../components/Table/tableConfig";
import { useNavigate } from "react-router-dom";
import { Positivity } from "../PositivityZone/Positivity";
export default function AdvisorDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [events, setEvents] = useState([]);
  const [domain, setdomain] = useState("");
  const [tab, settab] = useState("Appointments");
  const [tableLimit, setTableLimit] = useState(6);
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(formatDateToYYYYMMDD(today));
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  //tabelContents
  const [tableHeader, setTableHeader] = useState([]);
  const [tableContent, setTableContent] = useState([]);
  const [tableTitle, setTableTitle] = useState("Appointments");
  const [EmptyMessage, setEmptyMessage] = useState("No Appointments found");
  const [isMeetLink, setIsMeetLink] = useState(true);
  const [selectedFields, setSelectedFields] = useState([]);
  const [positivity, setPositivity] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchDataFromApi("/advisors/getloggedinAdvisor")
      .then((res) => setUser(res?.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  const fetchQuickSessions = () => {
    fetchDataFromApi(
      `/appointment/getQuickAppointments?limit=${tableLimit}&domain=${user.domain}`
    )
      .then((res) => {
        setTableData(res?.data || []);
        console.log("Quick Session:", res?.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    let intervalId;
    setTableData([]);

    if (tab === "Appointments") {
      fetchDataFromApi(
        `/appointment/filter?advisorId=${user._id}&page=${page}&limit=${tableLimit}&sortOrder=${sortOrder}&date=${selectedDate}`
      )
        .then((res) => {
          setTableData(res?.data?.appointments || []);
          setTotalData(res?.data?.total);
          console.log("Appointments Data:", res?.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (tab === "Quick Sessions") {
      fetchQuickSessions();
      intervalId = setInterval(() => {
        fetchQuickSessions();
      }, 3000);
    } else if (tab === "Batches") {
      fetchDataFromApi(
        `/batch/filter?advisorId=${user._id}&page=${page}&limit=${tableLimit}&sortOrder=${sortOrder}&domain=${domain}`
      )
        .then((res) => {
          setTableData(res?.data?.batches || []);
          setTotalData(res?.data?.total);
          console.log("Batches Data:", res?.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
      } else if (tab === "Past Events") {
            fetchDataFromApi(
              `/appointment//getallPastAppointment?userId=${user._id}&page=${page}&limit=${tableLimit}&sortOrder=${sortOrder}&domain=${domain}`
            )
              .then((res) => {
                setTableData(res?.data?.appointments || []);
                setTotalData(res?.data?.total);
              })
              .catch((err) => console.log(err))
              .finally(() => setLoading(false));
              setPositivity(false);
      } else if(tab === "Positivity Zone") {
        setPositivity(true);
      } else{
        setPositivity(false);
      }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, domain, page, selectedDate, tab]);

  useEffect(() => {
    const config = tableConfigs[tab] || tableConfigs["Appointments"];
    setTableHeader(config.header);
    setSelectedFields(config.fields);
    setTableTitle(config.title);
    setEmptyMessage(config.empty);
    setIsMeetLink(config.isMeetLink);
  }, [tab]);

  return (
    <div className="dashboard">
      <Sidebar
        searchText={searchText}
        setSearchText={setSearchText}
        onSelectTab={settab}
        activeTab={tab}
        tabs={[
          "Appointments",
          "Quick Sessions",
          "Batches",
          "Past Events",
          "My Tasks",
          "Positivity Zone",
          "Help Center",
          "Settings",
        ]}
      />

      <main className="dashboard-content">
        <Stats
          stats={[
            { title: "Total Today's Appointment", value: 2 },
            { title: "Total Upcoming Events", value: 10 },
            { title: "Total Ongoing Batches", value: 12 },
            { title: "Total Past Events", value: 8 },
          ]}
        />

        <section className="two-col">
          {positivity?
            <div className="positivity-wrapper">
              <Positivity />
            </div>:
          <Table
            TableContent={tableData}
            tableTitle={tableTitle}
            tableHeader={tableHeader}
            SelectedFields={selectedFields}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            setSearchText={setSearchText}
            setSelectedDate={setSelectedDate}
            page={page}
            setPage={setPage}
            isMeetLink={isMeetLink}
            limit={tableLimit}
            EmptyMessage={EmptyMessage}
            advisorId={user?._id}
            total={totalData}
          />}

          <div className="aside-sec">
            {tab == "Batches" && (
              <div
                className="newBatch"
                onClick={() => navigate(`/advisor/${user._id}/createBatch`)}
              >
                + Create Batch
              </div>
            )}
            {tab == "Batches" && (
              <div
                className="newBatch"
                onClick={() => navigate(`/advisor/${user._id}/updateBatch`)}
              >
                Update Your Old Batches
              </div>
            )}
            <CalendarCard
              events={events}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setPage(1);
              }}
              selectedDate={selectedDate}
            />
            {tab != "Batches" && (
              <div className="notification">Notifications(0)</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
