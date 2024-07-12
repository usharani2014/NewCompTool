import "../../css/table.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingOverlay from "../loading/loader";
import { useSelector } from 'react-redux';
import { selectShowSidebar } from '../../features/sidebarSlice';
import * as XLSX from 'xlsx';

const ViewDataTable = () => {
  const showSidebar = useSelector(selectShowSidebar);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState([]);
  const [user, setUser] = useState([]);
  const [filterResponsibleUnit, setFilterResponsibleUnit] = useState('');
  const [filterResponsibleOwner, setFilterResponsibleOwner] = useState('');
  const [filterCompliance, setFilterCompliance] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterRegulator, setFilterRegulator] = useState('');
  const responsibleUnitOptions = ['Banking Operations & Customer Services', 'Information Technology (IT)', 'BROC- Digital Payment Channel_ASBA', 'Company Secretary (CS)']; // Replace with actual options
  const productOptions = ['Digital Payment_ASBA', 'E-Banking (NEFT)', 'Electronic Banking - RTGS', 'Complaints Management']; // Replace with actual options
  const regulatorOptions = ['NHB', 'SEBI', 'RBI'];
  const getformData = `${process.env.REACT_APP_BACKEND_URL}/api/user/getformData`;
  const deleteData = `${process.env.REACT_APP_BACKEND_URL}/api/user/deleteFormData`;

  const formattedDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const handleDeleteData = async (rowData) => {
    try {
      const url = deleteData + `?id=${rowData._id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Update the state to trigger a re-render without reloading the page
        setJsonData((prevData) =>
          prevData.filter((item) => item._id !== rowData._id)
        );
        Swal.fire("Success!", "Data deleted successfully", "success");
      } else {
        Swal.fire("Error", "Failed to delete data", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred", "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          getformData,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
          }
        );
        if (!response.ok && response.status === 401) {
          alert("Unauthorized access");
          // localStorage.removeItem("user");
          // navigate('/login');
        }
        const data = await response.json();
        setJsonData(data.Data);
        if (data.Data.length === 0) {
          alert("No Data to display right now, Try after sometime!!")
        }
        const userPosition = localStorage.getItem('user');
        setUser(JSON.parse(userPosition))
      } catch (error) {
        Swal.fire("Error", "Failed to fetch data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    if (location.state && location.state.badgeContent) {
      setFilterResponsibleOwner(location.state.badgeContent.responsibleOwners)
      setFilterCompliance('Not Complied')
    }
  }, []); // Removed getformData, location, and navigate from the dependency array

  const handleOnChangeData = () => {
  }

  const handleResetFilters = () => {
    setFilterResponsibleOwner("");
    setFilterCompliance("");
    setFilterRegulator("");
  }

  const handleDownloadExcel = () => {
    const filteredData = jsonData
      .filter(
        (item) =>
          item.responsibleUnit.includes(filterResponsibleUnit) &&
          item.product.includes(filterProduct) &&
          item.regulator.includes(filterRegulator) &&
          item.responsibleOwners.includes(filterResponsibleOwner) &&
          item.compliance.includes(filterCompliance)
      );

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.writeFile(workbook, "data.xlsx");
  }

  return (
    <div style={{ display: 'flex' }}>
      {showSidebar &&
        <div className='extra-div'>
        </div>
      }
      <div className="table-container" style={{ flex: 1 }}>
        {loading && <LoadingOverlay />}
        <div className="button-container">
          <label htmlFor="responsibleUnitFilter">Department:</label>
          <select
            id="responsibleUnitFilter"
            value={filterResponsibleUnit}
            onChange={(e) => setFilterResponsibleUnit(e.target.value)}
          >
            <option value="">All</option>
            {responsibleUnitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="productFilter">Product:</label>
          <select
            id="productFilter"
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
          >
            <option value="">All</option>
            {productOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="RegulatorFilter">Regulator:</label>
          <select
            id="RegulatorFilter"
            value={filterRegulator}
            onChange={(e) => setFilterRegulator(e.target.value)}
          >
            <option value="">All</option>
            {regulatorOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button className="btn btn-intermediate" onClick={handleResetFilters}>Reset Filters</button>
          <button className="btn btn-intermediate" onClick={handleDownloadExcel}>Download Excel</button>
        </div>
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
                <th>Established Key Internal Controls and Procedures/ Control Description</th>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jsonData && jsonData
                .filter(
                  (item) =>
                    item.responsibleUnit.includes(filterResponsibleUnit) &&
                    item.product.includes(filterProduct) &&
                    item.regulator.includes(filterRegulator) &&
                    item.responsibleOwners.includes(filterResponsibleOwner) &&
                    item.compliance.includes(filterCompliance)
                )
                .map(
                  (item, index) => (
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
                        />
                      </td>
                      <td>{item.levelOfDocumentation}</td>
                      <td>
                        <textarea
                          rows="3"
                          cols="50"
                          value={item.establishedKey}
                          className="table-textarea"
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
                      <td>
                        <textarea
                          rows="3"
                          cols="50"
                          value={item.testStep}
                          className="table-textarea"
                        />
                      </td>
                      <td>
                        <textarea
                          rows="3"
                          cols="50"
                          value={item.testEvidence}
                          className="table-textarea"
                        />
                      </td>
                      <td>{item.compliance}</td>
                      <td>{item.complianceScore}</td>
                      <td>{item.finalRiskScore}</td>
                      <td>{item.mapStatus}</td>
                      <td>{item.mapCompletionDeadline}</td>
                      <td>{item.zone}</td>
                      <td>{item.office}</td>
                      <td>{item.complianceOfficer}</td>
                      <td>{item.reAllocatedComplianceOfficer}</td>
                      <td>
                        <textarea
                          rows="3"
                          cols="50"
                          value={item.dataPointDefinition}
                          className="table-textarea"
                        /></td>
                      <td>{formattedDate(item.updatedAt)}</td>
                      <td>
                        {user.position === 'Compliance Admin Users' && (
                          <button
                            className="btn btn-intermediate delete-button"
                            onClick={() => handleDeleteData(item)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewDataTable;
