import React, { useMemo, useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaBed, FaUserMd, FaAmbulance } from "react-icons/fa";
import { fetchDataFromApi } from "../../utils/api";
import "./AdvisorDashboard.scss";
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
import { useDispatch, useSelector } from "react-redux";
import { Useraction } from "../../store/userSlice";
import { RoleAction } from "../../store/roleSlice";
import { useSocket } from "../../context/SocketContext";

import { Positivity } from "../PositivityZone/Positivity";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import EditProfileCard from "../../components/EditProfileCard/EditProfileCard";

export default function AdvisorDashboard() {
  const dispatch = useDispatch();
  const { notifications, clearNotifications } = useSocket();
  const reduxUser = useSelector((state) => state.user);
  const [user, setUser] = useState(null);

  // Keep local user state in sync when EditProfileCard updates Redux
  useEffect(() => {
    if (reduxUser && user) setUser(reduxUser);
  }, [reduxUser]);
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

  // Profile Modal State
  const [profileShow, setProfileShow] = useState(false);
  const [edit, setEdit] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchDataFromApi("/advisors/getloggedinAdvisor")
      .then((res) => {
        setUser(res?.data);
        // Sync with Redux to trigger Socket initialization
        dispatch(Useraction.loginUser(res?.data));
        dispatch(RoleAction.loginRole("advisor"));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  const fetchQuickSessions = () => {
    fetchDataFromApi(
      `/appointment/getQuickAppointments?limit=${tableLimit}&domain=${user.domain}`,
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
        `/appointment/filter?advisorId=${user._id}&page=${page}&limit=${tableLimit}&sortOrder=${sortOrder}&date=${selectedDate}`,
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
        `/batch/filter?advisorId=${user._id}&page=${page}&limit=${tableLimit}&sortOrder=${sortOrder}&domain=${domain}`,
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
        `/appointment//getallPastAppointment?userId=${user._id}&page=${page}&limit=${tableLimit}&sortOrder=${sortOrder}&domain=${domain}`,
      )
        .then((res) => {
          setTableData(res?.data?.appointments || []);
          setTotalData(res?.data?.total);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
      setPositivity(false);
    } else if (tab === "Positivity Zone") {
      setPositivity(true);
    } else {
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

  const [theme, setTheme] = useState(localStorage.getItem("advisor-theme") || "navy");

  useEffect(() => {
    localStorage.setItem("advisor-theme", theme);
  }, [theme]);

  const themes = [
    { id: "navy", color: "#0f172a", name: "Midnight Navy" },
    { id: "onyx", color: "#050505", name: "Deep Onyx" },
    { id: "forest", color: "#021f1a", name: "Deep Forest" },
  ];

  return (
    <div className={`dashboard theme-${theme}`}>
      <Sidebar
        theme={theme}
        searchText={searchText}
        setSearchText={setSearchText}
        onSelectTab={(t) => {
          if (t === "Community Feed") navigate("/community");
          else settab(t);
        }}
        activeTab={tab}
        tabs={[
          "Community Feed",
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
        <header className="header">
          <div className="title-area">
            <h2>{tab} Overview</h2>
            <p className="muted">Welcome back, {capitalizeWords(user?.fullname || "Advisor")}</p>
          </div>
          <div className="header-actions">
            <div className="theme-workspace-selector" title="Choose Workspace Theme">
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="theme-dropdown"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="live-status-pill">
              <span className="dot"></span>
              LIVE HUB
            </div>

            <div 
              className="header-profile-avatar" 
              onClick={() => setProfileShow(true)}
              title="My Account Profile"
            >
              {user?.profilepic ? (
                <img src={user.profilepic} alt="Profile" className="avatar-img" />
              ) : (
                <FaUserCircle size={24} />
              )}
            </div>
          </div>
        </header>

        <Stats
          onEdit={() => { setProfileShow(true); setEdit(false); }}
          stats={[
            { title: "Total Today's Appointment", value: 2 },
            { title: "Total Upcoming Events", value: 10 },
            { title: "Total Ongoing Batches", value: 12 },
            { title: "Total Past Events", value: 8 },
          ]}
        />

        <section className="two-col">
          {positivity ? (
            <div className="positivity-wrapper">
              <Positivity />
            </div>
          ) : (
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
            />
          )}

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
              <div className="notification">
                <div className="notification-header">
                  <span>Notifications ({notifications.length})</span>
                  {notifications.length > 0 && (
                    <button className="notification-clear" onClick={clearNotifications}>
                      Clear
                    </button>
                  )}
                </div>
                {notifications.length > 0 && (
                  <ul className="notification-list">
                    {notifications.map((n, i) => (
                      <li key={i} className="notification-item">{n.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Shared Global Profile Modal */}
      <AnimatePresence>
        {profileShow && (
          <div className="modal-overlay" onClick={() => { setProfileShow(false); setEdit(true); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {edit ? (
                <ProfileCard 
                  user={user} 
                  onEdit={() => setEdit(false)} 
                  onClose={() => { setProfileShow(false); setEdit(true); }} 
                />
              ) : (
                <EditProfileCard 
                  user={user} 
                  onEdit={() => setEdit(true)} 
                  onClose={() => { setProfileShow(false); setEdit(true); }} 
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
