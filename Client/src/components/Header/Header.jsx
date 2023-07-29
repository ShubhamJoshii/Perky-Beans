import React, {useState, useRef, useEffect, useContext} from "react";
import RandomUser from "../../assets/RandomUser.png";
import Logo from "../../assets/PerkyBeansLogo.png";

import {IoMdMenu} from "react-icons/io";
import {MdClose} from "react-icons/md";
import {NavLink} from "react-router-dom";
import axios from "axios";

import {Notification, UserData} from "../../routes/App";
const Header = () => {
  const [menuShown, setMenuShow] = useState(false);
  const menuRef = useRef(0);
  const {userData, setUserData} = useContext(UserData);
  const {notification} = useContext(Notification);
  useEffect(() => {
    menuShown ? (menuRef.current.style.top = "58px") : (menuRef.current.style.top = "-120vh");
  }, [menuShown]);

  const logoutBTN = async () => {
    await axios.get("/api/logout").then((result) => {
      notification(result.data);
      setUserData(null);
    });
  };

  return (
    <React.Fragment>
      <div className="Header">
        <img src={Logo} alt="Logo" />
        <ol>
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
          <NavLink to="/reserveseat" ClassName="active">
            <li>RESERVE SEAT</li>
          </NavLink>
          <div id="LOGINRegister">
            {userData ? (
              <a onClick={logoutBTN}>
                <button id="loginRegisterHeader">LOGOUT</button>
              </a>
            ) : (
              <NavLink to="/login" ClassName="active">
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
            <NavLink to="/login" ClassName="active" onClick={() => setMenuShow(false)}>
              <button>LOGIN</button>
            </NavLink>
            <NavLink to="/register" ClassName="active" onClick={() => setMenuShow(false)}>
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
          <NavLink to="/reserveseat" ClassName="active">
            <li>RESERVE SEAT</li>
          </NavLink>
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
