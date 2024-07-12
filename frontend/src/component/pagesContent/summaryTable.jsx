import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import RadarGraph from "../graphs/graph3";
import "../../css/summary.css";

const SummaryTable = () => {
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [totalRow, setTotalRow] = useState({
    total_Score: 0,
    total_Target_Score: 0,
    achieved_Percentage: 0,
    total_Percentage: 100,
  });
  const getmaturitySummary = `${process.env.REACT_APP_BACKEND_URL}/api/user/getMaturitySummary`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getmaturitySummary, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok && response.status === 401) {
          alert("Unauthorized access");
          // localStorage.clear();
          localStorage.removeItem("user");
          navigate.push("/login");
        }
        const data = await response.json();
        setJsonData(data.Data);
        if (data.Data.length === 0) {
          alert("No Data to display right now, Try after sometime!!");
        } else {
          const calculatedData = data.Data.map((item) => ({
            type: item.type,
            totalWeightedScore: item.totalWeightedScore,
            totalTargetScore: item.totalTargetScore,
            achievedPercentage:
              (item.totalWeightedScore / item.totalTargetScore) * 100,
            totalPercentage:
              (item.totalTargetScore /
                data.Data.reduce(
                  (acc, curr) => acc + curr.totalTargetScore,
                  0
                )) *
              100,
          }));
          setGraphData(calculatedData);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch data", "error");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const calculateTotalRow = () => {
      const total = {
        total_Score: 0,
        total_Target_Score: 0,
        achieved_Percentage: 0,
        total_Percentage: 100,
      };

      if(jsonData && jsonData.length > 0){ jsonData.forEach((item) => {
        total.total_Score += parseFloat(item.totalWeightedScore);
        total.total_Target_Score += parseFloat(item.totalTargetScore);
      });
    }
    else { }

      total.achieved_Percentage = (
        (total.total_Score / total.total_Target_Score) *
        100
      ).toPrecision(2);
      setTotalRow(total);
    };

    calculateTotalRow();
  }, [jsonData]);

  return (
    <div className="outer">
      <table className="table">
        <thead>
          <tr>
            <th>S no.</th>
            <th>Key Areas</th>
            <th>Current Score</th>
            <th>Target Score</th>
            <th>Achieved Percentage</th>
            <th>Total Percentage</th>
          </tr>
        </thead>
        <tbody>
          {jsonData && jsonData.map((data, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{data.type}</td> {/* Update with actual key area name */}
              <td>{data.totalWeightedScore}</td>
              <td>{data.totalTargetScore}</td>
              <td>
                {graphData[index]
                  ? graphData[index].achievedPercentage.toFixed(2) + "%"
                  : ""}
              </td>
              <td>
                {graphData[index]
                  ? graphData[index].totalPercentage.toFixed(2) + "%"
                  : ""}
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>Total</td>
            <td>{totalRow.total_Score}</td>
            <td>{totalRow.total_Target_Score}</td>
            <td>{totalRow.achieved_Percentage}%</td>
            <td>{totalRow.total_Percentage}%</td>
          </tr>
        </tbody>
      </table>
      {/* <div className="graph-container">
        <div className="graph-item">
          <BarGraph2 graphData={graphData} />
        </div>
        <div className="graph-item">
          <BarGraph graph1Data={totalRow} />
        </div>
      </div> */}
      <div
        className="radar-graph-container"
        style={{ width: "500px", height: "500px" }}
      >
        <p>Maturity Model for Compliance Function</p>
        <RadarGraph graphData={graphData} />
      </div>
    </div>
  );
};

export default SummaryTable;
