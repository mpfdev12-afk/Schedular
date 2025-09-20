import React from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { capitalizeWords } from "../../utils/usableFunctions";

export default function AdvisorSearch({ setFilters }) {
  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];

    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/advisors/searchAdvisor",
        {
          params: { search: inputValue },
        }
      );

      const advisors = response.data.data.advisors;
      return advisors.map((advisor) => ({
        label: `${advisor.title} ${capitalizeWords(advisor.fullname)}`,
        value: advisor._id,
      }));
    } catch (error) {
      console.error("Error fetching advisors:", error);
      return [];
    }
  };

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      setFilters((prev) => ({ ...prev, advisorId: selectedOption.value }));
      console.log("Selected Advisor ID:", selectedOption.value);
    } else {
      setFilters((prev) => ({ ...prev, advisorId: "" })); // Clear selection
    }
  };

  return (
    <div style={{ width: 300 }}>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions={false}
        onChange={handleChange}
        placeholder="Search Advisor..."
        isClearable
      />
    </div>
  );
}
