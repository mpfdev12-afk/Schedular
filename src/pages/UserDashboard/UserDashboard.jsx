import React, { useMemo, useState, useEffect } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { useSelector } from "react-redux";
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
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import EditProfileCard from "../../components/EditProfileCard/EditProfileCard";
import BatchCoopCard from "../../components/BatchCoopCard/BatchCoopCard";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [events, setEvents] = useState([]);
  const [domain, setdomain] = useState("");
  const role = useSelector((state) => state.role);
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
  const [positivity, setPositivity] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState([]);

  // Profile Modal State
  const [profileShow, setProfileShow] = useState(false);
  const [edit, setEdit] = useState(true);

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
        `/appointment/filter?userId=${user._id}&page=${page}&limit=${tableLimit}&sortOrder=${sortOrder}&domain=${domain}`,
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
        `/batch/filter?userId=${user._id}&page=${page}&limit=${tableLimit}&sortOrder=${sortOrder}&domain=${domain}`,
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
  }, [user, page, domain, tab]);

  // Fetch Trending Community Posts
  useEffect(() => {
    if(user) {
      fetchDataFromApi(`/community/posts`)
        .then(res => setTrendingPosts(res?.data?.slice(0, 3) || []))
        .catch(err => console.log("Failed to fetch trending posts", err));
    }
  }, [user]);

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
        theme="pearl"
        searchText={searchText}
        setSearchText={setSearchText}
        onSelectTab={(t) => {
          if (t === "Control Hub") navigate("/admin/dashboard");
          else if (t === "Community Feed") navigate("/community");
          else settab(t);
        }}
        activeTab={tab}
        tabs={[
          "Community Feed",
          "Appointments",
          "Batches",
          "Learning Resources",
          "Past Events",
          "Positivity Zone",
          "Help Center",
          "Settings",
          ...(role === "admin" ? ["Control Hub"] : [])
        ]}
      />

      <main className="dashboard-content">
        <header className="header">
          <div className="title-area">
            <h2>{tab} Overview</h2>
            <p className="muted">Welcome back, {capitalizeWords(user?.fullname || "User")}</p>
          </div>
          <div className="header-actions">
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
            { title: "Total Grace Tokens", value: user?.graceTokens || 0 },
            { title: "Active Wellness Streak", value: `${user?.currentStreak || 0} Days` },
            { title: "Total Appointments", value: totalData || 0 },
            { title: "Total Past Events", value: 15 },
          ]}
        />

        <section className="two-col">
          {positivity ? (
            <div className="positivity-wrapper">
              <Positivity />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {tab === "Batches" && tableData.length > 0 && (
                <BatchCoopCard batch={tableData[0]} />
              )}
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
              />
            </div>
          )}

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

            {/* Trending Community Widget */}
            <div className="sec-full trending-community-widget" style={{ marginTop: '1rem', background: 'var(--org-primary-light)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--org-primary)', opacity: 0.8 }}>
              <h3 style={{ fontSize: '1rem', color: '#334155', marginBottom: '0.5rem' }}>Trending in Community</h3>
              {trendingPosts.length === 0 ? <p style={{fontSize: '0.85rem', color: '#64748b'}}>No recent discussions.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {trendingPosts.map(post => (
                    <div 
                      key={post._id} 
                      className="trending-post-item"
                      style={{ padding: '8px', background: 'white', borderRadius: '8px', cursor: 'pointer', border: '1px solid #e2e8f0'}} 
                      onClick={() => navigate(`/community/post/${post._id}`)}
                    >
                      <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--org-primary)', marginTop: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>{post.domain} Circle</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
