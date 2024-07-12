import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaDatabase, FaChartLine, FaFileAlt, FaCog, FaSignOutAlt, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, selectShowSidebar } from "../../features/sidebarSlice";
import * as AiIcons from "react-icons/ai";
import "../../css/sidebar.css"; // Import CSS file

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false); // Added state for Compliance dropdown
  const navigate = useNavigate();
  const [selectedNavItem, setSelectedNavItem] = useState(null);
  const dispatch = useDispatch();
  const showSidebar = useSelector(selectShowSidebar);
  const CurrentUser = JSON.parse(localStorage.getItem("user"));
  console.log(typeof(CurrentUser))
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const navItems = [
    { id: "SUM", name: "Summary" },
    { id: "DASH", name: "Compliance Dashboard" },
    { id: "COS", name: "Compliance Organization" },
    { id: "CF", name: "Compliance Framework" },
    { id: "PAP", name: "Policy and Procedure" },
    { id: "SAM", name: "Skill and Manpower" },
    { id: "TAS", name: "Technology and System" },
  ];
  const complianceItems = [
    { id: "/compliance", name: "Compliance Home" },
    { id: "/compliance/uploadExistingFile", name: "Upload Existing File" },
    { id: "/compliance/paytm", name: "Creation Field" }
  ];
  const qualityAssuranceItems = [
    { id: "/qualityAssurance/index", name: "Index" },
    { id: "/qualityAssurance/bcbs", name: "BCBS" },
    { id: "/qualityAssurance/rbi", name: "RBI" }
  ];


  const navReturnsItems = [
    { id: "/returns", name: "Returns Home" },
    { id: "/returns/dashboard", name: "Returns Dashboard" },
  ];

  const handleToggle = () => {
    setIsReturnOpen(false);
    setIsComplianceOpen(false);
    setIsOpen(!isOpen);
  };

  const handleReturnToggle = () => {
    setIsOpen(false);
    setIsComplianceOpen(false);
    setIsReturnOpen(!isReturnOpen);
  };

  const handleComplianceToggle = () => {
    setIsOpen(false);
    setIsReturnOpen(false)
    setIsComplianceOpen(!isComplianceOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // localStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An unexpected error occurred during logout:", error);
    }
  };

  const handleNavigation = (type) => {
    switch (type) {
      case "SUM":
        navigate("/complianceassessment/summary");
        break;
      case "DASH":
        navigate("/complianceassessment/dashboard");
        break;
      case "TAS":
        navigate("/complianceassessment/TAStable");
        break;
      case "CF":
        navigate("/complianceassessment/CFtable");
        break;
      case "PAP":
        navigate("/complianceassessment/PAPtable");
        break;
      case "SAM":
        navigate("/complianceassessment/SAMtable");
        break;
      case "COS":
        navigate("/complianceassessment/COStable");
        break;
      default:
        break;
    }
  };

  const handleNavigate = (url) => {
    navigate(url);
  };
  const [isQualityAssuranceOpen, setIsQualityAssuranceOpen] = useState(false);

  const handleQualityAssuranceToggle = () => {
    setIsOpen(false);
    setIsReturnOpen(false);
    setIsComplianceOpen(false);
    setIsQualityAssuranceOpen(!isQualityAssuranceOpen);
  };


  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <ul className="nav-list" style={{ paddingTop: "16px" }}>
          <li className="sidebar-toggle" onClick={handleToggleSidebar}>
            <Link to="#" className="nav-link">
              <AiIcons.AiOutlineClose style={{ width: "16%", height: "30px" }} />
            </Link>
          </li>
          <li className="nav-item" onClick={handleToggleSidebar}>
            <button className="nav-button" onClick={() => { handleNavigate("/dashboard") }}>
              <FaHome className="nav-icon" />
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-button ${isComplianceOpen ? "open" : ""}`}
              onClick={handleComplianceToggle}
            >
              <FaChartLine className="nav-icon" />
              <span className="nav-text">Compliance Repository</span>
              {isComplianceOpen ? (
                <FaAngleUp className="nav-icon ml-auto" />
              ) : (
                <FaAngleDown className="nav-icon ml-auto" />
              )}
            </button>
            {isComplianceOpen && (
              <ul className="sub-nav-list">
                {complianceItems.map((item) => (
                  <li key={item.name} className="sub-nav-item" onClick={handleToggleSidebar}>
                    <button
                      className="sub-nav-button"
                      onClick={() => handleNavigate(item.id)}
                    >
                      - {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="nav-item" onClick={handleToggleSidebar}>
            <button className="nav-button" onClick={() => { handleNavigate("/getTableData") }} >
              <FaDatabase className="nav-icon" />
              View Data
            </button>
          </li>
          {CurrentUser['position'] === "Compliance Checker"? (
            <li className="nav-item" onClick={handleToggleSidebar}>
              <button className="nav-button" onClick={() => { handleNavigate("/checkerData") }} >
                <FaDatabase className="nav-icon" />
                Checker Data
              </button>
            </li>
            ): (
              <></>
            ) }
          
          {CurrentUser['position'] === "Compliance Maker"? (
            <li className="nav-item" onClick={handleToggleSidebar}>
              <button className="nav-button" onClick={() => { handleNavigate("/makerData") }} >
                <FaDatabase className="nav-icon" />
                Maker Data
              </button>
            </li>
            ): (
              <></>
            ) }

          <li className="nav-item">
            <button
              className={`nav-button ${isOpen ? "open" : ""}`}
              onClick={handleToggle}
            >
              <FaCog className="nav-icon" />
              <span className="nav-text">Compliance Maturity Assessment</span>
              {isOpen ? (
                <FaAngleUp className="nav-icon ml-auto" />
              ) : (
                <FaAngleDown className="nav-icon ml-auto" />
              )}
            </button>
            {isOpen && (
              <ul className="sub-nav-list">
                {navItems.map((item) => (
                  <li key={item.id} className="sub-nav-item" onClick={handleToggleSidebar}>
                    <button
                      className="sub-nav-button"
                      onClick={() => handleNavigation(item.id)}
                    >
                      -  {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="nav-item">
            <button
              className={`nav-button ${isReturnOpen ? "open" : ""}`}
              onClick={handleReturnToggle}
            >
              <FaFileAlt className="nav-icon" />
              <span className="nav-text">Returns</span>
              {isReturnOpen ? (
                <FaAngleUp className="nav-icon ml-auto" />
              ) : (
                <FaAngleDown className="nav-icon ml-auto" />
              )}
            </button>
            {isReturnOpen && (
              <ul className="sub-nav-list">
                {navReturnsItems.map((item) => (
                  <li key={item.name} className="sub-nav-item" onClick={handleToggleSidebar}>
                    <button
                      className="sub-nav-button"
                      onClick={() => handleNavigate(item.id)}
                    >
                      -  {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="nav-item">
            <button
              className={`nav-button ${isQualityAssuranceOpen ? "open" : ""}`}
              onClick={handleQualityAssuranceToggle}
            >
              <FaChartLine className="nav-icon" />
              <span className="nav-text">Compliance Quality Assurance</span>
              {isQualityAssuranceOpen ? (
                <FaAngleUp className="nav-icon ml-auto" />
              ) : (
                <FaAngleDown className="nav-icon ml-auto" />
              )}
            </button>
            {isQualityAssuranceOpen && (
              <ul className="sub-nav-list">
                {qualityAssuranceItems.map((item) => (
                  <li key={item.name} className="sub-nav-item" onClick={handleToggleSidebar}>
                    <button
                      className="sub-nav-button"
                      onClick={() => handleNavigate(item.id)}
                    >
                      - {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="nav-item" onClick={handleLogout}>
            <button className="nav-button">
              <FaSignOutAlt className="nav-icon" />
              <span className="nav-text">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
