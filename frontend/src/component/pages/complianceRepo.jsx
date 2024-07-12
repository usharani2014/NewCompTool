import '../../css/complianceRepo.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import LoadingOverlay from "../loading/loader";
import Cookies from 'js-cookie';
import NotificationIcon from './notificationIcon.jsx';
import { setTableState } from '../../features/tableActions'; // Import the action creator
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, selectShowSidebar } from '../../features/sidebarSlice';

const ExcelTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const isLoggedIn = Cookies.get('accessToken') || localStorage.getItem('token');
  const [notiData, setNotiData] = useState({
    count: 0,
    responsibleOwners: null
  });
  const showSidebar = useSelector(selectShowSidebar);
  const notifi = `${process.env.REACT_APP_BACKEND_URL}/api/user/getAlertNoti`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isLoggedIn) {
          navigate("/login");
        } else {
          const savedState = localStorage.getItem("excelTableState");
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
                "excelTableState",
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
        const response = await fetch(
          notifi,
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
          // localStorage.clear();
          localStorage.removeItem("user");
          navigate('/login');
        }

        const result = await response.json();
        if (result.success) {
          setNotiData(result.Data);
        } else {
          setNotiData({
            count: 0,
            responsibleOwners: null
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

  const handleUploadExistingNavigation = async (pathname) => {
    try {
      setShowLoader(true);
      navigate(pathname);
    } finally {
      setShowLoader(false);
    }
  };

  const handleReload = () => {
    localStorage.removeItem("excelTableState");
    setData([]);
  };

  const handleScrapAndFileClick = async (url) => {
    try {
      setShowLoader(true);
      const output = await fetch(url, { method: 'POST' });
      const response = await output.json();
      setData(response.data);
      localStorage.setItem("excelTableState", JSON.stringify(response.data));
    } catch (error) {
      alert(error.message);
      console.error('Error scraping and updating:', error);
    } finally {
      setShowLoader(false);
    }
  };

  const handleToggleSidebar = () => {
    if (showSidebar) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <div className='fullBody' onClick={handleToggleSidebar}>
      {showLoader && <LoadingOverlay />}
      <div className="button-container">
        <form>
          <label htmlFor="fileInput">Upload file: </label>
          <input type="file" id="fileInput" accept=".xlsx, .xls" />
        </form>
        <button className="btn btn-intermediate" onClick={handleReload}>Reset</button>
        <NotificationIcon badgeContent={notiData} />
      </div>
      <div className="button-container">
        <button className="btn btn-intermediate" onClick={() => handleScrapAndFileClick('http://localhost:5000/rbi_scrape_and_update')}>RBI</button>
        <button className="btn btn-intermediate" onClick={() => handleScrapAndFileClick('http://localhost:5000/sebi_scrape_and_update')}>SEBI</button>
        <button className="btn btn-intermediate" onClick={() => handleScrapAndFileClick('http://localhost:5000/statutory_practices')}>Statutory Practices</button>
        <button className="btn btn-intermediate" onClick={() => handleScrapAndFileClick('http://localhost:5000/nhb')}>NHB</button>
        <button className="btn btn-intermediate" onClick={() => handleScrapAndFileClick('http://localhost:5000/npci')}>NPCI</button>
      </div>
      <table className="register-table">
        <thead>
          <tr>
            <th>S No.</th>
            <th>Circulars</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} class="register-tr">
              <td>{index + 1}</td>
              <td>{row[0]}</td>
              <td>{row[2]}</td>
              <td>
                <button class="btn btn-intermediate" onClick={() => handleNavigation("/NewProductTable", row)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelTable;