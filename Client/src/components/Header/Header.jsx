import React, { useState, useRef, useEffect, useContext } from "react";
import RandomUser from "../../assets/RandomUser.png";
import Logo from "../../assets/PerkyBeansLogo.png";
import { Oval } from "react-loader-spinner";
import { IoMdMenu } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { Notification, UserData } from "../../routes/App";

const Header = () => {
  const [menuShown, setMenuShow] = useState(false);
  const [loadingShow, setLoadingShow] = useState(false);
  const menuRef = useRef(0);
  const { userData, setUserData } = useContext(UserData);
  const { notification } = useContext(Notification);
  const location = useLocation();
  useEffect(() => {
    menuShown ? (menuRef.current.style.top = "58px") : (menuRef.current.style.top = "-120vh");
  }, [menuShown]);

  const logoutBTN = async () => {
    setLoadingShow(true);
    await axios.get("/api/logout").then((result) => {
      if (result.data) {
        notification(result.data, "Success");
        setUserData(null);
      }
    });
    setTimeout(() => {
      setLoadingShow(false);
    }, 1000);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location])

  return (
    <React.Fragment>
      <div className="Header">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>
        <ol>
          <NavLink to="/" ClassName="active">
            <li>HOME</li>
          </NavLink>
          <NavLink to="/products" ClassName="active">
            <li>PRODUCTS</li>
          </NavLink>
          <NavLink to="/orders/my-order" className={location.pathname.includes("/orders") ? "active" : ""}>
            <li>ORDERS</li>
          </NavLink>
          <NavLink to="/contact" ClassName="active">
            <li>CONTACT</li>
          </NavLink>
          <NavLink to="/ReserveTable" ClassName="active">
            <li>RESERVE TABLE</li>
          </NavLink>
          {
            userData?.Role === "Admin" &&
          <NavLink id="Admin" to="/admin" >
            <li>ADMIN</li>
          </NavLink>
          }
          <div id="LOGINRegister">
            {userData ? (
              <a onClick={logoutBTN}>
                <button id="loginRegisterHeader">{loadingShow ? <Oval height="16" width="16" color="white" wrapperStyle={{}} wrapperClass="" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <>LOGOUT</>}</button>
              </a>
            ) : (
              <NavLink to="/auth/login" className={location.pathname.includes("/auth") ? "active" : ""}>
                <button id="loginRegisterHeader">LOGIN / REGISTER</button>
              </NavLink>
            )}
          </div>

        </ol>

        <div id="MenuIcons">{menuShown ? <MdClose onClick={() => setMenuShow(!menuShown)} /> : <IoMdMenu onClick={() => setMenuShow(!menuShown)} />}</div>
      </div>
      <div ref={menuRef} id="responiveSliderMenu">
        {userData ? (
          <div id="userLoginINFO">
            <img src={RandomUser} alt="UserImg" />
            <div>
              <h2>{userData?.Full_Name}</h2>
              <p>{userData?.Email}</p>
            </div>
          </div>
        ) : (
          <div id="loginRegisterBTNS">
            <NavLink to="/auth/login" ClassName="active" onClick={() => setMenuShow(false)}>
              <button>LOGIN</button>
            </NavLink>
            <NavLink to="/auth/register" ClassName="active" onClick={() => setMenuShow(false)}>
              <button>REGISTER</button>
            </NavLink>
          </div>
        )}
        <ol onClick={() => setMenuShow(false)}>
          <NavLink to="/" ClassName="active">
            <li>HOME</li>
          </NavLink>
          <NavLink to="/products" ClassName="active">
            <li>PRODUCTS</li>
          </NavLink>
          <NavLink to="/orders/my-order" ClassName="active">
            <li>ORDERS</li>
          </NavLink>
          <NavLink to="/contact" ClassName="active">
            <li>CONTACT</li>
          </NavLink>
          <NavLink to="/ReserveTable" ClassName="active">
            <li>RESERVE TABLE</li>
          </NavLink>
          {
            userData?.Role === "Admin" &&
            <NavLink to="/admin" ClassName="active"> <li>ADMIN</li> </NavLink>
          }
        </ol>
        {userData && (
          <button id="logoutBTN" onClick={() => logoutBTN()}>
            LOGOUT
          </button>
        )}
      </div>
    </React.Fragment>
  );
};

export default Header;
