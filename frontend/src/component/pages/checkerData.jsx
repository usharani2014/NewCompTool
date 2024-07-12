import "../../css/table.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingOverlay from "../loading/loader";
import { useSelector } from "react-redux";
import { selectShowSidebar } from "../../features/sidebarSlice";
 
const CheckerDataTable = () => {
  const showSidebar = useSelector(selectShowSidebar);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState([]);
  const [user, setUser] = useState([]);
  const [changedData, setChangedData] = useState([]);
 
  const getformData = `${process.env.REACT_APP_BACKEND_URL}/api/user/getCheckerFormData`;
  const updateDataUrl = `${process.env.REACT_APP_BACKEND_URL}/api/user/checkerUpdateFormData`;
  const deleteData = `${process.env.REACT_APP_BACKEND_URL}/api/user/deleteFormData`;
 
  const formattedDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };
 
  const handleDeleteData = async (rowData) => {
    try {
      const url = deleteData + `?id=${rowData.id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
 
      if (response.ok) {
        setJsonData((prevData) =>
          prevData.filter((item) => item.id !== rowData.id)
        );
        Swal.fire("Success!", "Data deleted successfully", "success");
      } else {
        Swal.fire("Error", "Failed to delete data", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred", "error");
    }
  };
 
  const handleUpdateData = async () => {
    if (changedData.length === 0 || changedData.every(item => item.complianceLineState === "Pending")) {
      Swal.fire("Error", "No data to save", "error");
      return;
    }
 
    const confirmed = await Swal.fire({
      icon: 'info',
      title: 'Do you want to Save the line items?',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    });
 
    if (!confirmed.isConfirmed) {
      return;
    }
 
    setLoading(true);
 
    try {
      const response = await fetch(updateDataUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(changedData),
      });
      const result = await response.json();
 
      if (result.success) {
        Swal.fire("Success!", "Data updated successfully", "success");
        window.location.reload();
      } else {
        Swal.fire("Error", "Failed to update data", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };
 
  const handleInputChange = (e, index, field) => {
    const value = e.target.value;
    const updatedRow = [...jsonData];
    const updatedChangedData = [...changedData];
 
    updatedRow[index][field] = value;
 
    if (field === "complianceLineState" && value !== "Pending") {
      const existingIndex = updatedChangedData.findIndex(item => item.id === updatedRow[index].id);
      if (existingIndex > -1) {
        updatedChangedData[existingIndex][field] = value;
      } else {
        updatedChangedData.push({
          id: updatedRow[index].id,
          complianceLineState: updatedRow[index].complianceLineState,
          complianceCheckRemarks: updatedRow[index].complianceCheckRemarks
        });
      }
    } else if (field === "complianceCheckRemarks") {
      const existingIndex = updatedChangedData.findIndex(item => item.id === updatedRow[index].id);
      if (existingIndex > -1) {
        updatedChangedData[existingIndex][field] = value;
      }
    }
 
    setJsonData(updatedRow);
    setChangedData(updatedChangedData);
  };
 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getformData, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok && response.status === 401) {
          alert("Unauthorized access");
          localStorage.removeItem("user");
          navigate("/login");
        }
        const data = await response.json();
        setJsonData(data.Data);
        if(data.Data.length < 0){
        setChangedData(prev => {
          return data.Data.filter(item => item.complianceLineState !== "Pending").map(item => ({
            id: item.id,
            complianceLineState: item.complianceLineState,
            complianceCheckRemarks: item.complianceCheckRemarks
          }));
        });
      }
      else { }

        if (data.Data.length === 0) {
          alert("No Data to display right now, Try after sometime!!");
        }
        const userPosition = localStorage.getItem("user");
        setUser(JSON.parse(userPosition));
      } catch (error) {
        Swal.fire("Error", "Failed to fetch data", "error");
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, []); // Removed getformData, location, and navigate from the dependency array
 
  return (
    <div style={{ display: "flex" }}>
      {showSidebar && <div className="extra-div"></div>}
      <div className="table-container" style={{ flex: 1 }}>
        {loading && <LoadingOverlay />}
        <div className="inner-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Product</th>
                <th>Process</th>
                <th>Subprocess</th>
                <th>Circular Reference</th>
                <th>Year</th>
                <th>Regulator</th>
                <th>Section Reference</th>
                <th>Regulatory Extract</th>
                <th>Applicability</th>
                <th>Policy / SOP Reference</th>
                <th>Policy / SOP Extract</th>
                <th>Level of Documentation</th>
                <th>
                  Established Key Internal Controls and Procedures/ Control
                  Description
                </th>
                <th>Periodicity</th>
                <th>Types of Control</th>
                <th>Documentation of Control (m)</th>
                <th>Level of Automation of Control (n)</th>
                <th>Total Score</th>
                <th>Responsible Unit</th>
                <th>Responsible Owners</th>
                <th>Re-allocated Responsible Owner</th>
                <th>Test Step</th>
                <th>Test Evidence</th>
                <th>Compliance</th>
                <th>Compliance Score (Y)</th>
                <th>Final Risk Score (Z = X * Y)</th>
                <th>Map Status</th>
                <th>Map Completion Deadline</th>
                <th>Zone</th>
                <th>Office</th>
                <th>Compliance Officer</th>
                <th>Re-allocated Compliance Officer</th>
                <th>Data point definition</th>
                <th>Last Updated On</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jsonData && jsonData.map((item, index) => (
                <tr key={index} className="table-row">
                  <td>{index + 1}.</td>
                  <td>{item.product}</td>
                  <td>{item.process}</td>
                  <td>{item.subProcess}</td>
                  <td>{item.circular_reference}</td>
                  <td>{item.year}</td>
                  <td>{item.regulator}</td>
                  <td>{item.sectionReference}</td>
                  <td>
                    <textarea
                      rows="3"
                      cols="50"
                      value={item.regulatoryExtract}
                      placeholder="Enter Regulatory Extract"
                      className="table-textarea"
                      readOnly
                    />
                  </td>
                  <td>{item.applicability}</td>
                  <td>{item.policySopReference}</td>
                  <td>
                    <textarea
                      rows="3"
                      cols="50"
                      value={item.policySopExtract}
                      placeholder="Enter Policy SOP Extract"
                      className="table-textarea"
                      readOnly
                    />
                  </td>
                  <td>{item.levelOfDocumentation}</td>
                  <td>
                    <textarea
                      rows="3"
                      cols="50"
                      value={item.establishedKey}
                      className="table-textarea"
                      readOnly
                    />
                  </td>
                  <td>{item.periodicity}</td>
                  <td>{item.typesOfControl}</td>
                  <td>{item.documentaionOfControl}</td>
                  <td>{item.levelOfAutomationOfControl}</td>
                  <td>{item.totalScore}</td>
                  <td>{item.responsibleUnit}</td>
                  <td>{item.responsibleOwners}</td>
                  <td>{item.reAllocatedResponsibleOwner}</td>
                  <td>{item.testStep}</td>
                  <td>{item.testEvidence}</td>
                  <td>{item.compliance}</td>
                  <td>{item.complianceScore}</td>
                  <td>{item.finalRiskScore}</td>
                  <td>{item.mapStatus}</td>
                  <td>{item.mapCompletionDeadline}</td>
                  <td>{item.zone}</td>
                  <td>{item.office}</td>
                  <td>{item.complianceOfficer}</td>
                  <td>{item.reAllocatedComplianceOfficer}</td>
                  <td>{item.dataPointDefinition}</td>
                  <td>{formattedDate(item.updatedAt)}</td>
                  <td>
                    {item.CheckerCheckedState === false ? (
                      <select
                        value={item.complianceLineState || "pending"}
                        onChange={(e) => handleInputChange(e, index, "complianceLineState")}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      item.complianceLineState || "pending"
                    )}
                  </td>
                  <td>
                    {item.CheckerCheckedState === false ? (
                      <textarea
                        rows="3"
                        cols="20"
                        placeholder="Enter remarks"
                        className="table-textarea"
                        value={item.complianceCheckRemarks || ""}
                        onChange={(e) => handleInputChange(e, index, "complianceCheckRemarks")}
                      />
                    ) : (
                      item.complianceCheckRemarks
                    )}
                  </td>
                  <td>
                    {user.position === "Compliance Admin Users" || "Compliance Checker" && (
                      <button
                        className="btn btn-intermediate delete-button"
                        onClick={() => handleDeleteData(item)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUpdateData} className="btn btn-intermediate">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default CheckerDataTable;