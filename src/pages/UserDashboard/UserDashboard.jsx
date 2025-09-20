import React, { useMemo, useState, useEffect } from "react";
import { fetchDataFromApi } from "../../utils/api";
import {
  capitalizeWords,
  formatDateToYYYYMMDD,
} from "../../utils/usableFunctions";
import Sidebar from "../../components/Sidebar/Sidebar";
import Table from "../../components/Table/Table";
import CalendarCard from "../../components/Cards/CalendarCard";
import Stats from "../../components/Stats/Stats";
import { UsertableConfigs } from "../../components/Table/tableConfig";
import "./UserDashboard.scss";
import { useNavigate } from "react-router-dom";
import { Positivity } from "../PositivityZone/Positivity";
export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [events, setEvents] = useState([]);
  const [domain, setdomain] = useState("");
  const [tab, settab] = useState("Appointments");
  const [tableLimit, setTableLimit] = useState(8);
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(formatDateToYYYYMMDD(today));
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [page, setPage] = useState(1);

  //tabelContents
  const [tableHeader, setTableHeader] = useState([]);
  const [tableTitle, setTableTitle] = useState("Appointments");
  const [EmptyMessage, setEmptyMessage] = useState("No Appointments found");
  const [isMeetLink, setIsMeetLink] = useState(true);
  const [selectedFields, setSelectedFields] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [positivity,setPositivity] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchDataFromApi("/users/getloggedinUserAdvisor")
      .then((res) => setUser(res?.data?.user))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    let intervalId;
    setTableData([]);

    if (tab === "Appointments") {
      fetchDataFromApi(
        `/appointment/filter?userId=${user._id}&page=${page}&limit=${tableLimit}&sortOrder=${sortOrder}&domain=${domain}`
      )
        .then((res) => {
          setTableData(res?.data?.appointments || []);
          setTotalData(res?.data?.total);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
        setPositivity(false);
    } else if (tab === "Batches") {
      fetchDataFromApi(
        `/batch/filter?userId=${user._id}&page=${page}&limit=${tableLimit}&sortOrder=${sortOrder}&domain=${domain}`
      )
        .then((res) => {
          setTableData(res?.data?.batches || []);
          setTotalData(res?.data?.total);
          console.log("Batches Data:", res?.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
        setPositivity(false);
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
  }, [user, page, domain, tab]);

  useEffect(() => {
    const config = UsertableConfigs[tab] || UsertableConfigs["Appointments"];
    setTableHeader(config.header);
    setSelectedFields(config.fields);
    setTableTitle(config.title);
    setEmptyMessage(config.empty);
    setIsMeetLink(config.isMeetLink);
  }, [tab]);

  return (
    <div className="user-dashboard">
      <Sidebar
        searchText={searchText}
        setSearchText={setSearchText}
        onSelectTab={settab}
        activeTab={tab}
        tabs={[
          "Appointments",
          "Batches",
          "Learning Resources",
          "Past Events",
          "Positivity Zone",
          "Help Center",
          "Settings",
        ]}
      />

      <main className="dashboard-content">
        <header className="header"></header>
        <Stats
          stats={[
            { title: "Total Today's Appointment", value: 2 },
            { title: "Total Upcoming Events", value: 10 },
            { title: "Total Ongoing Batches", value: 12 },
            { title: "Total Past Events", value: 15 },
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
            isProfilepic={tab === "Appointments"}
            total={totalData}
          />}

          {/* <CalendarCard
            events={events}
            onDateSelect={(date) => {
              setSelectedDate(date);
              setPage(1);
            }}
            selectedDate={selectedDate}
          /> */}
          <div className="filter-sec">
            <div
              className="sec newMeeting"
              onClick={() => navigate("/category")}
            >
              + New Meeting
            </div>
            <div className="sec">
              <label htmlFor="domain">Domain: </label>
              <select
                name="domain"
                id="domain"
                value={domain}
                onChange={(e) => {
                  console.log(e.target.value);
                  setdomain(e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="mental">Mental</option>
                <option value="physical">Physical</option>
                <option value="financial">Financial</option>
              </select>
            </div>
            <div className="sec-full">
              <div className="title">Notifications(0)</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
