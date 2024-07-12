import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingOverlay from "../loading/loader";
import * as XLSX from "xlsx";

const UploadExistingFile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rowsData, setRowsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [DeptUsers, setDeptUsers] = useState([]);

  const sendFormData =  `${process.env.REACT_APP_BACKEND_URL}/api/user/SendExistingFormData`;
  const userDepartmentUrl =  `${process.env.REACT_APP_BACKEND_URL}/api/user/getDepartmentUser`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          userDepartmentUrl,
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
        const users = await response.json();

        setDeptUsers(users.Data)

      } catch (error) {
        Swal.fire("Error", "Try again after sometime");
        // history.goBack()
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveData = async () => {
    setLoading(true);
    try {
      const payloadString = JSON.stringify(rowsData);
      const payloadSizeInBytes = new Blob([payloadString]).size;

      const response = await fetch(
        sendFormData,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(rowsData),
        }
      );

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
    } catch (error) {
      alert("Error saving data:" + error);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const handleOnChangeData = (event, index, fieldName) => {
    const updatedRowsData = [...rowsData];
    updatedRowsData[index][fieldName] = event.target.value;

    if (
      fieldName === "levelOfDocumentation" &&
      updatedRowsData[index]["establishedKey"] !== "No controls in place"
    ) {
      let value = null;
      if (event.target.value === "Adequately Documented") {
        value = 1;
      } else if (event.target.value === "Inadequately Documented") {
        value = 2;
      } else if (event.target.value === "Not Documented") {
        value = 3;
      } else {
        value = "";
        updatedRowsData[index]["levelOfDocumentation"] = "";
      }
      if (updatedRowsData[index]["levelOfAutomationOfControl"]) {
        updatedRowsData[index]["totalScore"] =
          value * updatedRowsData[index]["levelOfAutomationOfControl"];
      } else {
      }
      updatedRowsData[index]["documentaionOfControl"] = value;
    } else if (
      fieldName === "typesOfControl" &&
      updatedRowsData[index]["establishedKey"] !== "No controls in place"
    ) {
      let value = null;
      if (event.target.value === "Manual") {
        value = 3;
      } else if (event.target.value === "Automated") {
        value = 2;
      } else if (event.target.value === "Semi Automated") {
        value = 1;
      } else {
        value = "";
        updatedRowsData[index]["typesOfControl"] = "";
      }
      if (updatedRowsData[index]["documentaionOfControl"]) {
        updatedRowsData[index]["totalScore"] =
          value * updatedRowsData[index]["documentaionOfControl"];
      } else {
      }
      updatedRowsData[index]["levelOfAutomationOfControl"] = value;
    } else if (
      fieldName === "compliance" &&
      updatedRowsData[index]["establishedKey"] !== "No controls in place"
    ) {
      let value = null;
      if (
        event.target.value === "Not Applicable" ||
        event.target.value === "Fully Complied"
      ) {
        value = 1;
      } else if (event.target.value === "Partially Complied") {
        value = 2;
      } else if (event.target.value === "Not Complied") {
        value = 3;
      } else {
        value = "";
        updatedRowsData[index]["compliance"] = "";
      }
      if (updatedRowsData[index]["totalScore"] > 0) {
        updatedRowsData[index]["finalRiskScore"] =
          value * updatedRowsData[index]["totalScore"];
      } else {
      }
      updatedRowsData[index]["complianceScore"] = value;
    } else if (
      fieldName === "establishedKey" &&
      event.target.value === "No controls in place"
    ) {
      updatedRowsData[index]["documentaionOfControl"] = 3;
      updatedRowsData[index]["levelOfAutomationOfControl"] = 3;
      updatedRowsData[index]["complianceScore"] = 3;
      updatedRowsData[index]["totalScore"] = 9;
      updatedRowsData[index]["finalRiskScore"] = 27;
    } else {
    }
    setRowsData(updatedRowsData);
  };

  const handleFileUpload = async (event) => {
    setLoading(true);
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      const fileSizeInKB = uploadedFile.size / 1024;
      const maxSizeInKB = 30;

      if (fileSizeInKB > maxSizeInKB) {
        alert(`File size exceeds the limit of ${maxSizeInKB} KB`);
        event.target.value = null;
        setLoading(false);
        return;
      }

      try {
        const data = await readExcelFile(uploadedFile);
        data.shift();
        const mappedData = data.map((rowData) => ({
          product: rowData[0],
          process: rowData[1],
          subProcess: rowData[2],
          circular_reference: rowData[3],
          year: rowData[4],
          regulator: rowData[5],
          sectionReference: rowData[6],
          regulatoryExtract: rowData[7],
          applicability: rowData[8],
          policySopReference: rowData[9],
          policySopExtract: rowData[10],
          levelOfDocumentation: rowData[11],
          establishedKey: rowData[12],
          periodicity: rowData[13],
          typesOfControl: rowData[14],
          documentationOfControl: rowData[15],
          levelOfAutomationOfControl: rowData[16],
          totalScore: rowData[17],
          responsibleUnit: rowData[18],
          responsibleOwners: rowData[19],
          reAllocatedResponsibleOwner: rowData[20],
          testStep: rowData[21],
          testEvidence: rowData[22],
          compliance: rowData[23],
          complianceScore: rowData[24],
          finalRiskScore: rowData[25],
          mapStatus: rowData[26],
          mapCompletionDeadline: rowData[27],
          zone: rowData[28],
          office: rowData[29],
          complianceOfficer: rowData[30],
          reAllocatedComplianceOfficer: rowData[31],
          dataPointDefinition: rowData[32],
        }));
        setRowsData(mappedData);
      } catch (error) {
        setRowsData([]);
      } finally {
        setLoading(false);
      }
    }
  };
  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsBinaryString(file);
    });
  };
  const handleReload = () => {
    navigate(location.pathname);
  };
  return (
    <div className="table-container">
      {/* <Header /> */}
      {loading && <LoadingOverlay />}
      <div className="inner-container">
        <div className="button-container">
          <label for="fileInput">Upload file: </label>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          <button className="btn btn-intermediate" onClick={handleReload} >
            Reset
          </button>
        </div>

        <table>
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
              <th>Re-Allocated Responsible Owners</th>
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
              <th>Re-Allocated Compliance Officer</th>
              <th>Data point definition</th>
            </tr>
          </thead>
          <tbody>
            {rowsData.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <select
                    id={`product-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "product")}
                    value={row.product}
                  >
                    <option value="select product">Select Product</option>
                    <option value="Complaints Management">
                      Complaints Management
                    </option>
                    <option value="Digital Payment_ASBA">Digital Payment_ASBA</option>
                    <option value="P3">P3</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id={`process-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "process")}
                    value={row.process}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id={`subProcess-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "subProcess")}
                    value={row.subProcess}
                  />
                </td>
                <td>{`${rowsData[index].circular_reference}`}</td>
                <td>
                  <input
                    type="Number"
                    id={`year-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "year")}
                    value={row.year}
                  />
                </td>

                <td>
                  <select
                    id={`regulator-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "regulator")}
                    value={row.regulator}
                  >
                    <option>Select Regulator</option>
                    <option value="RBI">RBI</option>
                    <option value="SEBI">SEBI</option>
                    <option value="NHB">NHB</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id={`sectionReference-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "sectionReference")
                    }
                    value={row.sectionReference}
                  />
                </td>
                <td>
                  <textarea
                    rows="3"
                    cols="50"
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
                    id={`applicability-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "applicability")
                    }
                    value={row.applicability}
                  >
                    <option>Select Applicability</option>
                    <option value="Applicable">Applicable</option>
                    <option value="Not-Applicable">Not-Applicable</option>
                    <option value="Applicable - General Information">
                      Applicable - Generic Info.
                    </option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id={`policySopReference-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "policySopReference")
                    }
                    value={row.policySopReference}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id={`policySopExtract-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "policySopExtract")
                    }
                    value={row.policySopExtract}
                  />
                </td>
                <td>
                  <select
                    id={`levelOfDocumentation-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "levelOfDocumentation")
                    }
                    value={row.levelOfDocumentation}
                  >
                    <option>Select Document Level</option>
                    <option value="Adequately Documented">
                      Adequately Documented
                    </option>
                    <option value="Inadequately Documented">
                      Inadequately Documented
                    </option>
                    <option value="Not Documented">Not Documented</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id={`establishedKey-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "establishedKey")
                    }
                    value={row.establishedKey}
                  />
                </td>
                <td>
                  <select
                    id={`periodicity-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "periodicity")
                    }
                    value={row.periodicity}
                  >
                    <option>Select Periodicty</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                    <option value="Half Yearly">Half Yearly</option>
                    <option value="Event Based">Event Based</option>
                  </select>
                </td>
                <td>
                  <select
                    id={`typesOfControl-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "typesOfControl")
                    }
                    value={row.typesOfControl}
                  >
                    <option>Select Control Type</option>
                    <option value="Manual">Manual</option>
                    <option value="Automated">Automated</option>
                    <option value="Semi Automated">Semi Automated</option>
                  </select>
                </td>
                <td>
                  <input
                    type="Number"
                    id={`documentationOfControl-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "documentationOfControl")
                    }
                    value={row.documentationOfControl}
                    readOnly
                    style={{ textAlign: "center" }}
                  />
                </td>
                <td>
                  <input
                    type="Number"
                    id={`levelOfAutomationOfControl-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "levelOfAutomationOfControl")
                    }
                    value={row.levelOfAutomationOfControl}
                    readOnly
                    style={{ textAlign: "center" }}
                  />
                </td>
                <td>
                  <input
                    type="Number"
                    id={`totalScore-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "totalScore")}
                    value={row.totalScore}
                    readOnly
                    style={{ textAlign: "center" }}
                  />
                </td>
                <td>
                  <select
                    id={`Department-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "responsibleUnit")
                    }
                    value={row.responsibleUnit}
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
                    <option value="BROC- Digital Payment Channel_ASBA">
                    BROC- Digital Payment Channel_ASBA
                    </option>
                    
                  </select>
                </td>
                <td>
                  <select
                    id={`responsibleOwners-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "responsibleOwners")
                    }
                    value={row.responsibleOwners}
                  >
                    <option>select</option>
                  {
                    DeptUsers && DeptUsers.map((row,i) => (
                      <option value={DeptUsers[i]['email']}>
                        {DeptUsers[i]['name']}
                      </option>
                    ))
                  }
                  </select>
                </td>
                <td>
                  <select
                  required
                    id={`reAllocatedResponsibleOwner-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "reAllocatedResponsibleOwner")
                    }
                    value={row.reAllocatedResponsibleOwner}
                  >
                    <option>select</option>
                  {
                    DeptUsers && DeptUsers.map((row,i) => (
                      <option value={DeptUsers[i]['email']}>
                        {DeptUsers[i]['name']}
                      </option>
                    ))
                  }
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id={`testStep-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "testStep")}
                    value={row.testStep}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id={`testEvidence-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "testEvidence")
                    }
                    value={row.testEvidence}
                  />
                </td>
                <td>
                  <select
                    id={`compliance-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "compliance")}
                    value={row.compliance}
                  >
                    <option>Select Compliance</option>
                    <option value="Not Applicable">Not Applicable</option>
                    <option value="Fully Complied">Fully Complied</option>
                    <option value="Partially Complied">
                      Partially Complied
                    </option>
                    <option value="Not Complied">Not Complied</option>
                  </select>
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="Number"
                    id={`complianceScore-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "complianceScore")
                    }
                    value={row.complianceScore}
                    readOnly
                    style={{ textAlign: "center" }}
                  />
                </td>
                <td>
                  <input
                    type="Number"
                    id={`finalRiskScore-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "finalRiskScore")
                    }
                    value={row.finalRiskScore}
                    readOnly
                    style={{ textAlign: "center" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id={`mapStatus-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "mapStatus")}
                    value={row.mapStatus}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id={`mapCompletionDeadline-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "mapCompletionDeadline")
                    }
                    value={row.mapCompletionDeadline}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id={`zone-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "zone")}
                    value={row.zone}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id={`office-${index}`}
                    onChange={(e) => handleOnChangeData(e, index, "office")}
                    value={row.office}
                  />
                </td>
                <td>
                  <select
                    id={`complianceOfficer-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "complianceOfficer")
                    }
                    value={row.complianceOfficer}
                  >
                    <option>select</option>
                  {
                    DeptUsers && DeptUsers.map((row,i) => (
                      <option value={DeptUsers[i]['email']}>
                        {DeptUsers[i]['name']}
                      </option>
                    ))
                  }
                  </select>
                </td>
                <td>
                  <select
                    id={`reAllocatedComplianceOfficer-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "reAllocatedComplianceOfficer")
                    }
                    value={row.reAllocatedComplianceOfficer}
                  >
                    <option>select</option>
                  {
                    DeptUsers && DeptUsers.map((row,i) => (
                      <option value={DeptUsers[i]['email']}>
                        {DeptUsers[i]['name']}
                      </option>
                    ))
                  }
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    id={`dataPointDefinition-${index}`}
                    onChange={(e) =>
                      handleOnChangeData(e, index, "dataPointDefinition")
                    }
                    value={row.dataPointDefinition}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="button-content-container">
          <button className="btn btn-intermediate" onClick={handleSaveData}>
            Save Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadExistingFile;
