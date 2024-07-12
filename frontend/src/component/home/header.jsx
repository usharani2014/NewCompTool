import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import GT_Outline_White from "../../images/GT_Outline_White.png";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import LoadingOverlay from "../loading/loader";
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, selectShowSidebar } from '../../features/sidebarSlice';
import "../../css/header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";
  const currentPage = location.pathname;
  const isLoggedIn =
    Cookies.get("accessToken") || localStorage.getItem("token");
  const headerHeight = "70px";
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const showSidebar = useSelector(selectShowSidebar);
  const logout = `${process.env.REACT_APP_BACKEND_URL}` + "/api/auth/logout";

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log(logout);
      const response = await fetch(logout, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // localStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Logout failed");
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An unexpected error occurred during logout:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}

      <nav className="bg-customPurple p-6" style={{ height: headerHeight, marginBottom: "10px" }}>
        <div
          className="flex justify-between items-center"
          style={{ height: "100%" }}
        >
          {isLoggedIn ? (
                <div className="mr-4 cursor-pointer" onClick={handleToggleSidebar}>
                  <FaBars className="text-white text-2xl" />
                </div>
          ):<></>}
          <Link to="/">
            <img
              src={GT_Outline_White}
              alt="GT BHARAT"
              style={{ height: "60%", maxWidth: "60%" }}
            />
          </Link>
          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                <button className=" btn btn-intermediate text-white" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <div>
                {isLoginPage ? (
                  <Link
                    to="/register"
                    className="text-white hover:text-gray-300 mr-4 btn-3d"
                  >
                    Register
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="text-white hover:text-gray-300 btn-3d"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      {isLoggedIn ? <>{showSidebar && <Sidebar />}</> : <></>}
    </>
  );
}

export default Header;
