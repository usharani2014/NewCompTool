import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingOverlay from "../loading/loader";

const PAPTable = () => {
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRow, setTotalRow] = useState({
    total_Score: 0,
    total_Weight: 0,
    total_Weighted_Score: 0,
    total_Weighted_Percentage: 100,
    total_Target_Score: 0,
    total_Target_Percentage: 0,
  });
  const getPAPData = `${process.env.REACT_APP_BACKEND_URL}/api/user/getMaturityData?type=PAP`;
  const setPAPData = `${process.env.REACT_APP_BACKEND_URL}/api/user/uploadMaturityData?type=PAP`;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          getPAPData,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok && response.status === 401) {
          Swal.fire("Unauthorized access");
          // localStorage.clear();
          localStorage.removeItem("user");
          navigate("/login");
        }
        const data = await response.json();
        console.log("Check state Calling");
        setJsonData(data.Data);
        if (data.Data.length === 0) {
          Swal.fire("No Data to display right now, Try after sometime!!");
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ navigate]);

  useEffect(() => {
    console.log(unsavedChanges);
    const handleBeforeUnload = (event) => {
      if (unsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  useEffect(() => {
    const calculateTotalRow = () => {
      const total = {
        total_Score: 0,
        total_Weight: 0,
        total_Weighted_Score: 0,
        Weighted_Score_Percentage: 100,
        total_Target_Score: 0,
        total_Target_Percentage: 0,
      };

      if(jsonData && jsonData.length > 0){jsonData.forEach((item) => {
        total.total_Score += parseFloat(item.Score);
        total.total_Weight += parseFloat(item.Weight);
        total.total_Weighted_Score += parseFloat(item.Weighted_Score);
        total.total_Target_Score += parseFloat(item.Target_Score);
        total.total_Target_Percentage += parseFloat(item.Target_Percentage);
      });}
      else { }

      setTotalRow(total);
    };

    calculateTotalRow();
  }, [jsonData]);

  useEffect(() => {
    const changeRowData = () => {
      let totalWeightedScore = 0;
      if(jsonData && jsonData.length > 0){jsonData.forEach((item) => {
        totalWeightedScore += parseFloat(item.Weighted_Score);
      });}
      else { }


      if(jsonData && jsonData.length > 0){jsonData.forEach((item) => {
        const percentage =
          (item.Weighted_Score / totalWeightedScore) * 100 || 0;
        item.Weighted_Score_Percentage = Math.round(percentage);
      });}
      else { }
    };

    changeRowData();
  }, [jsonData]);

  const handleOnChangeData = (event, index, fieldName) => {
    const value =
      fieldName === "Remarks" ? event.target.value : parseFloat(event.target.value);

    const updatedRowsData = [...jsonData];
    updatedRowsData[index][fieldName] = value;

    if (fieldName === "Score") {
      updatedRowsData[index]["Weighted_Score"] =
        value * updatedRowsData[index]["Weight"];
    }

    setJsonData(updatedRowsData);
    setUnsavedChanges(true);
  };

  const handleSaveData = async () => {
    console.log(jsonData);
    try {
      const response = await fetch(
        setPAPData,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(jsonData),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Data saved successfully!");
        setUnsavedChanges(false);
      } else {
        const errorMessage =
          result.status === 401
            ? "Failed to submit data:" + result.message
            : "Failed to submit data:" + result.message;
        alert(errorMessage);
        window.location.reload();
      }
    } catch (error) {
      alert("Error saving data:" + error);
      window.location.reload();
    }
  };

  return (
    <div style={{ overflowY: "auto" }}>
      {loading ? (
        <LoadingOverlay />
      ) : (
        <div className="co-scrollable-table-container">
        <table className="co-table">
          <thead>
            <tr>
              <th>SNo.</th>
              <th>Particulars</th>
              <th>Score</th>
              <th>Weight</th>
              <th>Weighted Score</th>
              <th>Weighted Score Percentage</th>
              <th>Target Score</th>
              <th>Target Percentage</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {jsonData && jsonData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <textarea
                    rows="2"
                    cols="50"
                    id={`Particulars-${index}`}
                    value={item.Particulars}
                    placeholder="Enter Particulars"
                  />
                </td>
                <td>
                  <select
                    id={`score-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "Score")}
                    value={item.Score}
                  >
                    <option>Select score</option>
                    <option value={1}>1.00</option>
                    <option value={2}>2.00</option>
                    <option value={3}>3.00</option>
                    <option value={4}>4.00</option>
                    <option value={5}>5.00</option>
                  </select>
                </td>
                <td>{item.Weight}</td>
                <td>{item.Weighted_Score}</td>
                <td>{item.Weighted_Score_Percentage}%</td>
                <td>{item.Target_Score}</td>
                <td>{item.Target_Percentage}%</td>
                <td>
                  <textarea
                    rows="2"
                    cols="25"
                    id={`Remarks-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "Remarks")}
                    value={item.Remarks}
                    placeholder="Enter Remarks"
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td>Total</td>
              <td>{totalRow.total_Score}</td>
              <td>{totalRow.total_Weight}</td>
              <td>{totalRow.total_Weighted_Score}</td>
              <td>{totalRow.Weighted_Score_Percentage}%</td>
              <td>{totalRow.total_Target_Score}</td>
              <td>{totalRow.total_Target_Percentage}%</td>
            </tr>
          </tbody>
        </table>
        <div className="co-button-content-container">
          <button className="co-btn co-btn-intermediate" onClick={handleSaveData}>
            Save Data
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default PAPTable;

