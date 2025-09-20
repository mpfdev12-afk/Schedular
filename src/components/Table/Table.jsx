import React, { useState } from "react";
import { capitalizeWords, formatIfDate } from "../../utils/usableFunctions";
import "./Table.scss";
import { toast } from "react-toastify";
import { updateDatatoapi } from "../../utils/api";
import TableCard from "../TableCard/TableCard";

export default function Table({
  tableHeader = [],
  TableContent = [],
  SelectedFields = [],
  sortOrder,
  setSortOrder,
  setSearchText,
  setSelectedDate,
  page,
  setPage,
  limit = 8,
  tableTitle = "Table",
  EmptyMessage = "No Content found",
  isMeetLink = false,
  advisorId = "",
  isProfilepic = false,
  total = 0,
}) {
  const resetFilters = () => {
    setSearchText("");
    setSortOrder("A - Z");
    setSelectedDate("");
    setPage(1);
  };
  const [cardShow,setCardShow] = useState(false);
  const [id,setId] = useState(null);
  const handleQuickJoin = async (id) => {
    try {
      await updateDatatoapi(
        `/appointment/joinQuickAppointment/${id}?advisorId=${advisorId}`,
        "application/json"
      ).then((res) => {
        window.open(res?.data?.data?.meetlink, "_blank");
        // reload to see updated list
      });
      toast.success("Joined appointment successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join appointment");
    }
  };

  return (
    <div className="main-card">
      <div>
        <div className="section-header">
          <h3>
            {tableTitle} ({total})
          </h3>
          <div className="controls">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option>A - Z</option>
              <option>Z - A</option>
            </select>
            <button className="link" onClick={resetFilters}>
              See All
            </button>
          </div>
        </div>

        {TableContent.length === 0 ? (
          <div className="no-content">{EmptyMessage}</div>
        ) : (
          <table className="main-table">
            <thead>
              <tr>
                {isProfilepic && <th className="prof-pic">Profile</th>}
                {tableHeader.map((header, index) => (
                  <th key={index} className="center">
                    {capitalizeWords(header)}
                  </th>
                ))}
                {isMeetLink && <th className="center">Link</th>}
              </tr>
            </thead>
            <tbody>
              {TableContent.map((p, idx) => (
                <tr key={p.id || idx} onClick={()=>{setCardShow(true);setId(p)}}>
                  {isProfilepic && (
                    <td className="prof-pic center">
                      <img
                        src={p?.advisorId?.profilepic || "/no-profile.jpg"}
                      ></img>
                    </td>
                  )}
                  {SelectedFields.map((field, index) => (
                    <td key={index} className="center">
                      {(() => {
                        const path = field.split(" ");
                        let value = p;
                        for (const key of path) value = value?.[key];
                        return capitalizeWords(formatIfDate(value)) ?? "-";
                      })()}
                    </td>
                  ))}

                  {isMeetLink && (
                    <td className="center">
                      {p.isQuick ? (
                        <a
                          href={p.status === "pending" ? p.meetlink : "#"}
                          target={p.status === "pending" ? "_blank" : ""}
                          rel="noopener noreferrer"
                          className="join"
                          onClick={() => {
                            if (p.status == "pending") handleQuickJoin(p._id);
                          }}
                        >
                          {p.status === "pending" ? "Join" : "-"}
                        </a>
                      ) : (
                        <a
                          href={p.meetlink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="join"
                        >
                          Join
                        </a>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {cardShow && (
        <div className="modal-overlay" onClick={() => setCardShow(false)}>
          <div
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <TableCard user={id} />
            <button className="close-btn" onClick={() => setCardShow(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

      {TableContent.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            hidden={page === 1}
            className="pagenav"
          >
            {"< Previous"}
          </button>
          <button
            onClick={() => setPage(page + 1)}
            hidden={TableContent.length <= limit}
            className="pagenav"
          >
            {"Next >"}
          </button>
        </div>
      )}
    </div>
  );
}
