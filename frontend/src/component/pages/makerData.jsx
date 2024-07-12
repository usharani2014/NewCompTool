import "../../css/table.css";
import React, { useState, useEffect, useReducer } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingOverlay from "../loading/loader";
import { useSelector } from "react-redux";
import { selectShowSidebar } from "../../features/sidebarSlice";

const changedDataReducer = (state, action) => {
    switch (action.type) {
        case "update":
            return {
                ...state,
                [action.payload.id]: {
                    ...state[action.payload.id],
                    [action.payload.field]: action.payload.value
                }
            };
        case "clear":
            return {};
        default:
            return state;
    }
};

const MakerDataTable = () => {
    const showSidebar = useSelector(selectShowSidebar);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [jsonData, setJsonData] = useState([]);
    const [user, setUser] = useState(null);  // Initial state should be null for user
    const [changedData, dispatch] = useReducer(changedDataReducer, {});

    const getFormDataUrl = `${process.env.REACT_APP_BACKEND_URL}/api/user/getMakerFormData`;
    const updateDataUrl = `${process.env.REACT_APP_BACKEND_URL}/api/user/makerUploadFormData`;
    const deleteDataUrl = `${process.env.REACT_APP_BACKEND_URL}/api/user/deleteFormData`;

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
            const url = `${deleteDataUrl}?id=${rowData._id}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                setJsonData((prevData) => prevData.filter((item) => item._id !== rowData._id));
                Swal.fire("Success!", "Data deleted successfully", "success");
            } else {
                Swal.fire("Error", "Failed to delete data", "error");
            }
        } catch (error) {
            Swal.fire("Error", "An error occurred", "error");
        }
    };

    const handleUpdateData = async () => {
        console.log(changedData)
        const confirmed = await Swal.fire({
            icon: 'info',
            title: 'Do you want to save the changes?',
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
                dispatch({ type: "clear" });
                fetchData(); // Re-fetch data to ensure the latest state is reflected
            } else {
                Swal.fire("Error", "Failed to update data", "error");
            }
        } catch (error) {
            Swal.fire("Error", "An error occurred", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e, row, field) => {
        const { value } = e.target;
        const updatedRow = [...jsonData];
        updatedRow[row][field] = value;
        setJsonData(updatedRow);
        dispatch({ type: "update", payload: { id: jsonData[row].id, field, value } });
    };

    const reset = () => {
        dispatch({ type: "clear" });
        fetchData();
    }
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(getFormDataUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setJsonData(data.Data);
                console.log(data.Data)

                if (data.Data.length === 0) {
                    Swal.fire("Info", "No data to display right now, try again later.", "info");
                }

                const userPosition = localStorage.getItem("user");
                setUser(JSON.parse(userPosition));
            } else if (response.status === 401) {
                Swal.fire("Unauthorized", "Unauthorized access", "error");
                localStorage.removeItem("user");
                navigate("/login");
            }
        } catch (error) {
            Swal.fire("Error", "Failed to fetch data", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); 

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
                                <th>Remarks</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jsonData.map((item, index) => (
                                <tr key={item._id} className="table-row">
                                    <td>{index + 1}</td>
                                    <td>
                                        <input type="text" value={item.product} onChange={(e) => handleInputChange(e, index, "product")} />
                                    </td>
                                    <td>
                                        <input type="text" value={item.process} onChange={(e) => handleInputChange(e, index, "process")} />
                                    </td>
                                    <td>
                                        <input type="text" value={item.subProcess} onChange={(e) => handleInputChange(e, index, "subProcess")} />
                                    </td>
                                    <td>
                                        <input type="text" value={item.circular_reference} onChange={(e) => handleInputChange(e, index, "circular_reference")} />
                                    </td>
                                    <td>
                                        <input type="text" value={item.year} onChange={(e) => handleInputChange(e, index, "year")} />
                                    </td>
                                    <td>
                                        <input type="text" value={item.regulator} onChange={(e) => handleInputChange(e, index, "regulator")} />
                                    </td>
                                    <td>
                                        <input type="text" value={item.sectionReference} onChange={(e) => handleInputChange(e, index, "sectionReference")} />
                                    </td>
                                    <td>
                                        <textarea rows="3" cols="50" value={item.regulatoryExtract} placeholder="Enter Regulatory Extract" className="table-textarea" onChange={(e) => handleInputChange(e, index, "regulatoryExtract")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.applicability} onChange={(e) => handleInputChange(e, index, "applicability")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.policySopReference} onChange={(e) => handleInputChange(e, index, "policySopReference")} />
                                        </td>
                                        <td>
                                            <textarea rows="3" cols="50" value={item.policySopExtract} placeholder="Enter Policy SOP Extract" className="table-textarea" onChange={(e) => handleInputChange(e, index, "policySopExtract")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.levelOfDocumentation} onChange={(e) => handleInputChange(e, index, "levelOfDocumentation")} />
                                        </td>
                                        <td>
                                            <textarea rows="3" cols="50" value={item.establishedKey} className="table-textarea" onChange={(e) => handleInputChange(e, index, "establishedKey")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.periodicity} onChange={(e) => handleInputChange(e, index, "periodicity")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.typesOfControl} onChange={(e) => handleInputChange(e, index, "typesOfControl")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.documentationOfControl} onChange={(e) => handleInputChange(e, index, "documentationOfControl")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.levelOfAutomationOfControl} onChange={(e) => handleInputChange(e, index, "levelOfAutomationOfControl")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.totalScore} onChange={(e) => handleInputChange(e, index, "totalScore")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.responsibleUnit} onChange={(e) => handleInputChange(e, index, "responsibleUnit")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.responsibleOwners} onChange={(e) => handleInputChange(e, index, "responsibleOwners")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.reAllocatedResponsibleOwner} onChange={(e) => handleInputChange(e, index, "reAllocatedResponsibleOwner")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.testStep} onChange={(e) => handleInputChange(e, index, "testStep")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.testEvidence} onChange={(e) => handleInputChange(e, index, "testEvidence")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.compliance} onChange={(e) => handleInputChange(e, index, "compliance")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.complianceScore} onChange={(e) => handleInputChange(e, index, "complianceScore")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.finalRiskScore} onChange={(e) => handleInputChange(e, index, "finalRiskScore")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.mapStatus} onChange={(e) => handleInputChange(e, index, "mapStatus")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.mapCompletionDeadline} onChange={(e) => handleInputChange(e, index, "mapCompletionDeadline")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.zone} onChange={(e) => handleInputChange(e, index, "zone")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.office} onChange={(e) => handleInputChange(e, index, "office")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.complianceOfficer} onChange={(e) => handleInputChange(e, index, "complianceOfficer")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.reAllocatedComplianceOfficer} onChange={(e) => handleInputChange(e, index, "reAllocatedComplianceOfficer")} />
                                        </td>
                                        <td>
                                            <input type="text" value={item.dataPointDefinition} onChange={(e) => handleInputChange(e, index, "dataPointDefinition")} />
                                        </td>
                                        <td>{formattedDate(item.updatedAt)}</td>
                                        <td>
                                            {item.CheckerCheckedState === false ? (
                                                <textarea rows="3" cols="20" placeholder="Enter remarks" className="table-textarea" value={item.complianceCheckRemarks || ""} onChange={(e) => handleInputChange(e, index, "complianceCheckRemarks")} />
                                            ) : (
                                                item.complianceCheckRemarks
                                            )}
                                        </td>
                                        <td>
                                            {(user?.position === "Compliance Admin Users" || user?.position === "Compliance Checker") && (
                                                <button className="btn btn-intermediate delete-button" onClick={() => handleDeleteData(item)}>
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
    
    export default MakerDataTable;
    