import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingOverlay from "../loading/loader";
import "../../css/table.css";
import { useSelector } from "react-redux";
import "../../css/paytm.css";

const PaytmEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [circularReference, setCircularReference] = useState("");
  const [regulatoryExtract, setRegulatoryExtract] = useState("");
  const [paytmRow, setpaytmRow] = useState([]);
  const [loading, setLoading] = useState(false);
  const tableData = useSelector((state) => state.table);

  const setestablishedurl = `${process.env.REACT_APP_BACKEND_URL}/api/user/SendFormData`;

  const handleAddRow = () => {
    const index = paytmRow.length + 1;
    setpaytmRow((prevData) => [...prevData, getEmptyRow(index)]);
    console.log(setpaytmRow);
  };

  useEffect(() => {
    if (!tableData) {
      navigate("/compliance/paytm");
    } else {
      const regExtract = tableData["regulatoryExtract"];
      setRegulatoryExtract(regExtract || "");
      const firstRow = getEmptyRow("1");
      firstRow["regulatoryExtract"] = regExtract;
      setpaytmRow([firstRow]);
    }
  }, [tableData]);

  const getEmptyRow = (index) => {
    return {
      InternalSNo: tableData["internalSystemNumber"] + "-" + `${index}`,
      regulatoryExtract: "",
      department1: "",
      departmentActionableAcceptance: "",
      deptTimeLines: "",
      department1Response: "",
      department1Status: "",
      supportingEvidenceAttachment: "",
      actionableDept1HOD: "",
      dateOfFinalClosure: "",
      ageing: "",
      status: "",
      currentStatusIf42IsOpen: "",
    };
  };

  const handleRemoveRow = (index) => {
    setpaytmRow((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleSaveData = async () => {
    const confirmed = await Swal.fire({
      icon: "info",
      title: "Do you want to submit the data?",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
    });

    if (!confirmed.isConfirmed) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(setestablishedurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(paytmRow),
      });

      const result = await response.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Data saved successfully!",
        });
        window.location.reload();
      } else {
        if (result.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Failed to submit data",
            text: result.message,
          });
          window.location.reload();
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to submit data",
            text: result.message,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error saving data",
        text: error,
      });
      window.location.reload();
      navigate("/compliance/paytm");
    } finally {
      setLoading(false);
    }
  };
  const handleOnChangeData = (event, index, fieldName) => {
    const updatedpaytmRow = [...paytmRow];
    updatedpaytmRow[index][fieldName] = event.target.value;
    setpaytmRow(updatedpaytmRow);
  };

  return (
    <div className="table-container">
      {loading && <LoadingOverlay />}
      <div className="inner-container">
        <table>
          <thead>
            <tr>
              <th>Internal SNo.</th>
              <th>Regulatory Extract</th>
              <th>Department</th>
              <th>Department Actionable Acceptance</th>
              <th>Departmwnt Time Lines</th>
              <th>Department Response</th>
              <th>Department Status</th>
              <th>Supporting Evidence Attachment</th>
              <th>Actionable Dept HOD</th>
              <th>Date of Final Closure</th>
              <th>Ageing</th>
              <th>Status</th>
              <th>Current status, if 42 is open</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paytmRow.map((row, index) => (
              <tr key={index}>
                <td>{row.InternalSNo}</td>
                <td>
                  <textarea
                    rows="3"
                    cols="70"
                    id={`regulatoryExtract-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "regulatoryExtract")
                    }
                    value={row.regulatoryExtract}
                    placeholder="Enter Regulatory Extract"
                  />
                </td>
                <td>
                  <select
                    className="select-input"
                    id={`departmentDate-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "department")}
                    value={row.department}
                  >
                    <option>Select Department</option>
                    <option value="Emerging Entrepreneur Business (EEB)">
                      Emerging Entrepreneur Business (EEB)
                    </option>
                    <option value="Commercial Banking (CB)">
                      Commercial Banking (CB)
                    </option>
                    <option value="Retail Banking">Retail Banking</option>
                    <option value="Commercial & Retail Credit">
                      Commercial & Retail Credit
                    </option>
                    <option value="Banking Operations & Customer Services">
                      Banking Operations & Customer Services
                    </option>
                    <option value="Finance & Accounts">
                      Finance & Accounts
                    </option>
                    <option value="Corporate Strategy">
                      Corporate Strategy
                    </option>
                    <option value="Corporate Services">
                      Corporate Services
                    </option>
                    <option value="Internal Audit">Internal Audit</option>
                    <option value="Risk Management">Risk Management</option>
                    <option value="Internal Vigilance">
                      Internal Vigilance
                    </option>
                    <option value="Compliance">Compliance</option>
                    <option value="Information Technology (IT)">
                      Information Technology (IT)
                    </option>
                    <option value="Human Resources (HR)">
                      Human Resources (HR)
                    </option>
                    <option value="Project & Premises">
                      Project & Premises
                    </option>
                    <option value="Company Secretary (CS)">
                      Company Secretary (CS)
                    </option>
                    <option value="Legal">Legal</option>
                    <option value="Trade Finance">Trade Finance</option>
                    <option value="Transaction Banking">
                      Transaction Banking
                    </option>
                  </select>
                </td>

                <td>
                  <select
                    id={`departmentActionableAcceptance-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(
                        e,
                        index,
                        "departmentActionableAcceptance"
                      )
                    }
                    value={row.departmentActionableAcceptance}
                    className="select-input"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    id={`departmentTimeLines-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "deptTimeLines")
                    }
                    value={row.deptTimeLines}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id={`departmentResponse-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "departmentResponse")
                    }
                    value={row.department1Response}
                  />
                </td>

                <td>
                  <select
                    id={`departmentStatus-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "department1Status")
                    }
                    value={row.department1Status}
                    className="select-input"
                  >
                    <option>Select</option>
                    <option value="Pending for compliance">
                      Pending for Compliance
                    </option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id={`supportingEvidence-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(
                        e,
                        index,
                        "supportingEvidenceAttachment"
                      )
                    }
                    value={row.supportingEvidenceAttachment}
                  />
                </td>
                <td>
                  <select
                    id={`actionableDept1HOD-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "actionableDept1HOD")
                    }
                    value={row.actionableDept1HOD}
                    className="select-input"
                  >
                    <option value="">Select HOD</option>
                    <option value="x">x</option>
                    <option value="y">y</option>
                    <option value="z">z</option>
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    id={`dateOfFinalClosure-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "dateOfFinalClosure")
                    }
                    value={row.dateOfFinalClosure}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    id={`ageing-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "ageing")}
                    value={row.ageing}
                  />
                </td>
                <td>
                  <select
                    id={`status-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "status")}
                    value={row.status}
                    className="select-input"
                  >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="Close">Close</option>
                  </select>
                </td>
                <td>
                  {row.status === "Open" ? (
                    <select
                      id={`currentStatus-${index}`}
                      onChange={(e) =>
                        handleOnChangeData(e, index, "currentStatusIf42IsOpen")
                      }
                      value={row.currentStatusIf42IsOpen}
                      className="select-input"
                    >
                      <option value="">Select Status</option>
                      <option value="Within Timelines">Within Timelines</option>
                    </select>
                  ) : (
                    <select
                      id={`currentStatus-${index}`}
                      value={row.currentStatusIf42IsOpen}
                      className="select-input"
                      disabled
                    >
                      <option value="">Select Status</option>
                      <option value="Within Timelines">Within Timelines</option>
                    </select>
                  )}
                </td>
                <td>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveRow(index)}
                  >
                    Remove Row
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-content-container">
          <button className="btn btn-intermediate" onClick={handleSaveData}>
            Save Data
          </button>
          <button className="btn btn-intermediate" onClick={handleAddRow}>
            Add Rows
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaytmEdit;
