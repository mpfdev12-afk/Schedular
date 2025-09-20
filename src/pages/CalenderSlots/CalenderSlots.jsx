import React, { useState } from "react";
import Calendar from "react-calendar";
import Slot from "../../components/Slot/Slot";
import "./CalenderSlots.scss";
import { fetchDataFromApi } from "../../utils/api";

const CalenderSlots = ({ appointments, advisor, DateandTime }) => {
  const [isSlot, setIsSlot] = useState(false);
  const [date, setDate] = useState("");
  const [slotTime, setSlotTime] = useState();
  const [disabledSlots, setDisabledSlots] = useState([]);

  const formatTime = (num) => {
    const hours = String(Math.floor(num / 100)).padStart(2, "0");
    const minutes = String(num % 100).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const parseTime = (str) => {
    const [hours, minutes] = str.split(":").map(Number);
    return hours * 100 + minutes;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const disablePastDates = ({ date, view }) => {
    if (view === "month") {
      return date < new Date().setHours(0, 0, 0, 0);
    }
    return false;
  };

  const onClickDate = async (selectedDate) => {
    const formatted = formatDate(selectedDate);
    setIsSlot(true);
    setDate(formatted);

    try {
      const disabled =
        appointments
          ?.filter((x) => x?.date === formatted)
          .map((x) => formatTime(x?.slotTime)) || [];
      setDisabledSlots(disabled);
      console.log("Disabled Slots", disabled);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const slotClick = (time) => {
    const parsed = parseTime(time.substr(0, 5)); // safer: "09:00"
    setSlotTime(parsed);
    DateandTime(date, parsed);
    console.log("Slot Clicked", parsed);
  };

  const slotStart = advisor?.availability?.slotStartTime ?? 900;
  const slotEnd = advisor?.availability?.slotEndTime ?? 1700;

  return (
    <div className="cal">
      <Calendar onClickDay={onClickDate} tileDisabled={disablePastDates} />
      {isSlot && (
        <Slot
          onSlotClick={slotClick}
          slotTimeStart={formatTime(slotStart)}
          slotTimeEnd={formatTime(slotEnd)}
          disabledSlots={disabledSlots}
        />
      )}
    </div>
  );
};

export default CalenderSlots;
