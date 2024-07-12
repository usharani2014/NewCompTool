import "../../css/complianceRepo.css";
import React, { useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import LoadingOverlay from "../loading/loader.jsx";
import Cookies from "js-cookie";
import NotificationIcon from "./notificationIcon.jsx";
import { setTableState } from "../../features/tableActions.js"; // Import the action creator
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSidebar,
  selectShowSidebar,
} from "../../features/sidebarSlice.js";
import "../../css/paytm.css";

const PaytmExcelTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const isLoggedIn =
    Cookies.get("accessToken") || localStorage.getItem("token");
  const [notiData, setNotiData] = useState({
    count: 0,
    responsibleOwners: null,
  });
  const showSidebar = useSelector(selectShowSidebar);
  const notifi = `${process.env.REACT_APP_BACKEND_URL}/api/user/getAlertNoti`;
  const yearOptions = ['2024', '2023', '2022', '2021', '2020'];
  const [filterYear, setFilterYear] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isLoggedIn) {
          navigate("/login");
        } else {
          const savedState = localStorage.getItem("paytmExcelTableState");
          if (savedState) {
            setData(JSON.parse(savedState));
          }

          const readExcel = (file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const workbook = XLSX.read(e.target.result, { type: "binary" });
              const sheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[sheetName];
              const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
              setData(excelData.slice(1));
              localStorage.setItem(
                "paytmExcelTableState",
                JSON.stringify(excelData.slice(1))
              );
            };
            reader.readAsBinaryString(file);
          };

          const handleChange = (e) => {
            const file = e.target.files[0];
            if (file) {
              readExcel(file);
            }
          };

          const fileInput = document.getElementById("fileInput");
          fileInput.addEventListener("change", handleChange);

          return () => {
            fileInput.removeEventListener("change", handleChange);
          };
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(notifi, {
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
          navigate("/login");
        }

        const result = await response.json();
        if (result.success) {
          setNotiData(result.Data);
        } else {
          setNotiData({
            count: 0,
            responsibleOwners: null,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate, notifi]);

  const handleNavigation = async (pathname, rowData) => {
    try {
      setShowLoader(true);
      dispatch(setTableState(rowData)); // Dispatch the action here
      navigate(pathname);
    } finally {
      setShowLoader(false);
    }
  };

  const handleReload = () => {
    localStorage.removeItem("paytmExcelTableState");
    setData([]);
  };

  const getEmptyRow = () => {
    return {
      financialYear: "",
      internalSystemNumber: "",
      dateOfDissemenation: "",
      regulationDate: "",
      regulatorName: "",
      subDept: "",
      regulatoryReferenceNumber: "",
      circularTitle: "",
      applicableToOurBank: "",
      reasonForNotApplicable: "",
      gist: "",
      whetherPolicyToBeMade: "",
      toBePlacedToBoard: "",
      whichCommitteeIfYesToAbove: "",
      regulatoryTimelines: "",
      ifYesToRegulatoryTimelines: "",
      actionType: "",
      regulatorWebsiteLink: "",
      attachment: "",
      whetherLinkedToEarlierCircular: "",
      linkedWithOtherCircularNo: "",
      regulatoryExtract: "",
    };
  };

  const handleScrapAndFileClick = async (url) => {
    try {
      setShowLoader(true);
      const output = await fetch(url, { method: "POST" });
      const response = await output.json();

      const stringData = response.data;

      const jsonDataArray = [];
      let uniqueSystemNo = 1000;
      for (let i = 0; i < stringData.length; i++) {
        const dataRow = stringData[i];
        const emptyRowTemplate = getEmptyRow();
        emptyRowTemplate.financialYear = dataRow[0];
        emptyRowTemplate.internalSystemNumber = uniqueSystemNo;
        emptyRowTemplate.regulationDate = dataRow[1];
        emptyRowTemplate.regulatorName = dataRow[2];
        emptyRowTemplate.regulatoryReferenceNumber = dataRow[3];
        emptyRowTemplate.circularTitle = dataRow[4];
        emptyRowTemplate.regulatoryExtract = dataRow[5];
        emptyRowTemplate.regulatorWebsiteLink = dataRow[6];
        jsonDataArray.push(emptyRowTemplate);

        uniqueSystemNo += 1;
      }

      setData(jsonDataArray);
      localStorage.setItem(
        "paytmExcelTableState",
        JSON.stringify(jsonDataArray)
      );
    } catch (error) {
      alert(error.message);
      console.error("Error scraping and updating:", error);
    } finally {
      setShowLoader(false);
    }
  };

  const handleToggleSidebar = () => {
    if (showSidebar) {
      dispatch(toggleSidebar());
    }
  };

  const handleSave = (row) => { };

  const handleChange = (event, index, fieldName) => {
    const newValue = event.target.value;
    const newData = [...data];
    newData[index][fieldName] = newValue;
    if (
      fieldName === "applicableToOurBank" &&
      newData[index]["applicableToOurBank"] === "Yes"
    ) {
      newData[index]["reasonForNotApplicable"] = "";
    } else if (fieldName === "toBePlacedToBoard" && newData[index][fieldName] === "No") {
      newData[index]["whichCommitteeIfYesToAbove"] = "";
    } else if (fieldName === "regulatoryTimelines" && newData[index][fieldName] === "No") {
      newData[index]['ifYesToRegulatoryTimelines'] = "";
    } else { }
    setData(newData);
  };

  return (
    <div className="fullBody" onClick={handleToggleSidebar}>
      {showLoader && <LoadingOverlay />}
      <div className="button-container">
        <form>
          <label htmlFor="fileInput">Upload file: </label>
          <input type="file" id="fileInput" accept=".xlsx, .xls" />
        </form>
        <button className="btn btn-intermediate" onClick={handleReload}>
          Reset
        </button>
        <NotificationIcon badgeContent={notiData} />
      </div>
      <div className="button-container">
        <button
          className="btn btn-intermediate"
          onClick={() =>
            handleScrapAndFileClick(
              "http://localhost:5000/rbi_scrape_and_update/paytm"
            )
          }
        >
          RBI
        </button>
        <button
          className="btn btn-intermediate"
          onClick={() =>
            handleScrapAndFileClick(
              "http://localhost:5000/sebi_scrape_and_update"
            )
          }
        >
          SEBI
        </button>
        <button
          className="btn btn-intermediate"
          onClick={() =>
            handleScrapAndFileClick("http://localhost:5000/statutory_practices")
          }
        >
          Statutory Practices
        </button>
        <button
          className="btn btn-intermediate"
          onClick={() => handleScrapAndFileClick("http://localhost:5000/nhb")}
        >
          NHB
        </button>
        <button
          className="btn btn-intermediate"
          onClick={() => handleScrapAndFileClick("http://localhost:5000/npci")}
        >
          NPCI
        </button>
        <label htmlFor="responsibleUnitFilter">Year:</label>
        <select
          id="responsibleUnitFilter"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">All</option>
          {yearOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

      </div>
      <div className="paytm-outer-div">
        <table className="paytm-register-table">
          <thead>
            <tr>
              <th>S No.</th>
              <th>Financial Year</th>
              <th>Internal SNo.</th>
              <th>Date of dissemenation</th>
              <th>Regulation date</th>
              <th>Regulator name</th>
              <th>Sub-Dept</th>
              <th>Regulatory reference number</th>
              <th>Circular title/Heading</th>
              <th>Applicable to our bank</th>
              <th>Reason for Not applicable</th>
              <th>Gist</th>
              <th>Whether policy to be made/updated</th>
              <th>To be placed to Board/Board committee</th>
              <th>If yes to above, which committee</th>
              <th>Regulatory timelines</th>
              <th>If yes - Regulatory timelines</th>
              <th>Action type</th>
              <th>Regulator website link</th>
              <th>Attachment</th>
              <th>Whether linked to earlier circular</th>
              <th>If yes, related sl no (as per 2)</th>
              <th>Save Circular</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter(
                (item) =>
                  item.financialYear.includes(filterYear)
              )
              .map((row, index) => (
                <tr key={index} className="paytm-register-tr">
                  <td>{index + 1}</td>
                  <td>{row.financialYear}</td>
                  <td>{row.internalSystemNumber}</td>
                  <td>
                    <input
                      type="date"
                      value={row.dateOfDissemenation}
                      onChange={(e) => {
                        handleChange(e, index, "dateOfDissemenation");
                      }}
                      className="date-input"
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row.regulationDate}
                      className="date-input"
                      onChange={(e) => {
                        handleChange(e, index, "regulationDate");
                      }}
                    />
                  </td>
                  <td>
                    <select
                      value={row.regulatorName}
                      className="select-input"
                      onChange={(e) => {
                        handleChange(e, index, "regulatorName");
                      }}
                    >
                      <option>Select</option>
                      <option value="RBI">RBI</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="select-input"
                      value={row.subDept}
                      onChange={(e) => {
                        handleChange(e, index, "subDept");
                      }}
                    >
                      <option>Select</option>
                      <option value="DoR">DoR</option>
                      <option value="DPSS">DPSS</option>
                      <option value="CSITE">CSITE</option>
                      <option value="UPI">UPI</option>
                      <option value="AePS">AePS</option>
                      <option value="NACH">NACH</option>
                    </select>
                  </td>
                  <td>{row.regulatoryReferenceNumber}</td>
                  <td>{row.circularTitle}</td>
                  <td>
                    <select
                      value={row.applicableToOurBank}
                      className="select-input"
                      onChange={(e) => {
                        handleChange(e, index, "applicableToOurBank");
                      }}
                    >
                      <option>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    {row.applicableToOurBank === "No" ? (
                      <textarea
                        value={row.reasonForNotApplicable}
                        onChange={(e) => {
                          handleChange(e, index, "reasonForNotApplicable");
                        }}
                        className="textarea-input"
                      />
                    ) : (
                      <textarea
                        value={row.reasonForNotApplicable}
                        disabled
                        className="textarea-input"
                      />
                    )}
                  </td>
                  <td>
                    <textarea
                      value={row.gist}
                      className="textarea-input"
                      onChange={(e) => {
                        handleChange(e, index, "gist");
                      }}
                    />
                  </td>
                  <td>
                    <select
                      value={row.whetherPolicyToBeMade}
                      className="select-input"
                      onChange={(e) => {
                        handleChange(e, index, "whetherPolicyToBeMade");
                      }}
                    >
                      <option>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={row.toBePlacedToBoard}
                      className="select-input"
                      onChange={(e) => {
                        handleChange(e, index, "toBePlacedToBoard");
                      }}
                    >
                      <option>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    {row.toBePlacedToBoard === "Yes" ? (
                      <select
                        value={row.whichCommitteeIfYesToAbove}
                        className="select-input"
                        onChange={(e) => {
                          handleChange(e, index, "whichCommitteeIfYesToAbove");
                        }}
                      >
                        <option>Select</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    ) : (
                      <select
                        value={row.whichCommitteeIfYesToAbove}
                        className="select-input"
                        disabled
                      >
                        <option>Select</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <select
                      value={row.regulatoryTimelines}
                      className="select-input"
                      onChange={(e) => {
                        handleChange(e, index, "regulatoryTimelines");
                      }}
                    >
                      <option>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    {row.regulatoryTimelines === "Yes" ? (
                      <input
                        type="date"
                        value={row.ifYesToRegulatoryTimelines}
                        className="date-input"
                        onChange={(e) => {
                          handleChange(e, index, "ifYesToRegulatoryTimelines");
                        }}
                      />
                    ) : (
                      <input type="date" disabled className="date-input" />
                    )}
                  </td>
                  <td>
                    <select
                      value={row.actionType}
                      className="select-input"
                      onChange={(e) => {
                        handleChange(e, index, "actionType");
                      }}
                    >
                      <option>Select</option>
                      <option value="action_x">Action type - X </option>
                      <option value="action_y">Action type - Z</option>
                    </select>
                  </td>
                  <td>
                    <a
                      href={row.regulatorWebsiteLink}
                      className="link"
                    >
                      {row.regulatorWebsiteLink}
                    </a>
                  </td>
                  <td>
                    {row.attachment}
                    <input
                      type="file"
                      className="paytm-file-input"
                      onChange={(e) => {
                        handleChange(e, index, "attachment");
                      }}
                    />
                  </td>
                  <td>
                    <select
                      value={row.whetherLinkedToEarlierCircular}
                      className="select-input"
                      onChange={(e) => {
                        handleChange(e, index, "whetherLinkedToEarlierCircular");
                      }}
                    >
                      <option>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    {row.whetherLinkedToEarlierCircular === "Yes" ? (
                      <input
                        type="text"
                        value={row.linkedWithOtherCircularNo}
                        className="text-input"
                        onChange={(e) => {
                          handleChange(e, index, "linkedWithOtherCircularNo");
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={row.linkedWithOtherCircularNo}
                        className="text-input"
                        disabled
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-intermediate"
                      onClick={() => handleSave(row)}
                    >
                      Save
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-intermediate"
                      onClick={() =>
                        handleNavigation("/compliance/paytm/edit", row)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaytmExcelTable;