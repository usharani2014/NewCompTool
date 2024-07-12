import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "../../css/return.css";

const Return = () => {
  const [tableData, setTableData] = useState([]);
  const uploadReturns = `${process.env.REACT_APP_BACKEND_URL}/api/user/uploadReturns`;

  useEffect(() => {
    const savedState = localStorage.getItem("retursData");
    if (savedState) {
      setTableData(JSON.parse(savedState));
    }
  }, []);

  const handleOnChangeData = (event, index, fieldName) => {
    const updatedRowsData = [...tableData];
    if (fieldName === "filling_date") {
      const dueDate = new Date(updatedRowsData[index].due_date);
      const filingDate = new Date(event.target.value);
      const delay = Math.floor((filingDate - dueDate) / (1000 * 60 * 60 * 24));
      updatedRowsData[index].delay = delay;
    }
    updatedRowsData[index][fieldName] = event.target.value;
    setTableData(updatedRowsData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Exclude the first row from jsonData
      const jsonDataExcludingFirstRow = jsonData.slice(1);
      const mappedData = jsonDataExcludingFirstRow.map((rowData) => ({
        name: rowData[0],
        description: rowData[1],
        frequency: rowData[2],
        concerned_department: rowData[3],
        reporting_entity: rowData[4],
        circulars: rowData[5],
        due_date: "",
        filling_date: "",
        filed_delay: "",
        delay: "",
        approval: "",
        remarks: "",
      }));

      localStorage.setItem("retursData", JSON.stringify(mappedData));
      setTableData(mappedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleReset = () => {
    setTableData([]);
  };

  const handleSaveSubmit = async (rowIndex, action) => {
    // Implement save/submit functionality here

    localStorage.setItem("retursData", JSON.stringify(tableData));

    const response = await fetch(uploadReturns, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(tableData[rowIndex]),
    });
    const result = await response.json();

    if (result.success) {
      window.location.reload();
      alert("Data saved successfully!");
    } else {
      const errorMessage =
        result.status === 401
          ? "Failed to submit data:" + result.message
          : "Failed to submit data:" + result.message;
      alert(errorMessage);
      window.location.reload();
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <div>
        <div
          className="button-container"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="upload-btn"
            style={{ backgroundColor: "#742190" }}
          >
            Upload
          </label>
          <button
            onClick={handleReset}
            className="reset-btn"
            style={{ backgroundColor: "#742190" }}
          >
            Reset
          </button>
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th className="table-header">S No.</th>
                <th className="table-header">Return Name</th>
                <th className="table-header">Return Description</th>
                <th className="table-header">Frequency</th>
                <th className="table-header">Department Concerned</th>
                <th className="table-header">
                  Reporting Entity Required to Submit the Return
                </th>
                <th className="table-header">Details of Related Circulars</th>
                <th className="table-header">Return Due Date</th>
                <th className="table-header">Date of Filing</th>
                <th className="table-header">Filed with Delay</th>
                <th className="table-header">Delay</th>
                <th className="table-header">Approval Taken</th>
                <th className="table-header">Remarks</th>
                <th className="table-header">Save</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.name}</td>
                  <td>{rowData.description}</td>
                  <td>{rowData.frequency}</td>
                  <td>{rowData.concerned_department}</td>
                  <td>{rowData.reporting_entity}</td>
                  <td>{rowData.circulars}</td>
                  <td>
                    <input
                      type="Date"
                      id={`due_date-${rowIndex}`}
                      onChange={(e) =>
                        handleOnChangeData(e, rowIndex, "due_date")
                      }
                      value={rowData.due_date}
                      className="table-input"
                    />
                  </td>
                  <td>
                    <input
                      type="Date"
                      id={`filling_date-${rowIndex}`}
                      onChange={(e) =>
                        handleOnChangeData(e, rowIndex, "filling_date")
                      }
                      value={rowData.filling_date}
                      className="table-input"
                    />
                  </td>
                  <td>
                    <select
                      id={`filed_delay-${rowIndex}`}
                      onChange={(e) =>
                        handleOnChangeData(e, rowIndex, "filed_delay")
                      }
                      value={rowData.filed_delay}
                    >
                      <option>Choose filed delay</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="Number"
                      id={`delay-${rowIndex}`}
                      onChange={(e) =>
                        handleOnChangeData(e, rowIndex, "delay")
                      }
                      value={rowData.delay}
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td>
                    <select
                      id={`approval-${rowIndex}`}
                      onChange={(e) =>
                        handleOnChangeData(e, rowIndex, "approval")
                      }
                      value={rowData.approval}
                    >
                      <option>Choose Delay</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      id={`remarks-${rowIndex}`}
                      onChange={(e) =>
                        handleOnChangeData(e, rowIndex, "remarks")
                      }
                      value={rowData.remarks}
                      className="table-input"
                    />
                  </td>
                  <td className="table-cell">
                    <button
                      className="save-btn"
                      onClick={() => handleSaveSubmit(rowIndex, "Save")}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Return;
