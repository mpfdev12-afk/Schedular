import { useParams } from "react-router-dom";
import Cards from "../../components/Cards/Cards";
import { fetchDataFromApi } from "../../utils/api";
import "./AdvisorList.scss";
import React, { useEffect, useState } from "react";

const AdvisorList = () => {
  const [advisor, setadvisor] = useState([]);
  const [loading, setLoading] = useState(false);
  const { category } = useParams();

  useEffect(() => {
    fetchDataFromApi("/advisors/getallAdvisors", {
      domain: `${category}`,
    })
      .then((res) => {
        setadvisor(res?.data?.advisor);
        console.log(res?.data?.advisor);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);
  return (
    <div className="list">
      {advisor.map((advisor) => (
        <Cards advisor={advisor} />
      ))}
    </div>
  );
};

export default AdvisorList;
