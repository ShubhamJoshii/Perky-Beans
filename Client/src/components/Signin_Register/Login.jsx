import React, { useState, useEffect } from "react";
import google from "../../assets/google.png";
import { NavLink } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Header from "../Header/Header";
import { UserData, Notification } from "../../routes/App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import axios from "axios";
const Login = () => {
  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
  });
  const [passwordShow, setPasswordShow] = useState(false);
  const { notification, checkUserAlreadyLogin } = useContext(Notification);
  const [loadingShow, setloadingShow] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    passwordShow ? (document.getElementById("Password").type = "text") : (document.getElementById("Password").type = "password");
  }, [passwordShow]);

  const handleInputPassword = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginData({ ...loginData, [name]: value });
  };
  
  
  const handleInputEmail = (e) => {
    const { name, value } = e.target;
    const isValidInput = /^[A-Za-z\s]+$/.test(value[0]);
    if (isValidInput || value === "") {
      setLoginData({ ...loginData, [name]: value });
    }
  }

  const submitLogin = async (e) => {
    e.preventDefault();
    if (loginData.Email && loginData.Password.length >= 8 && !loginData.Password.includes(" ")) {
      setloadingShow(true);
      await axios
        .post("/api/login", loginData)
        .then((result) => {
          if (result.data === "User logged in") {
            notification(result.data, "Success");
            setTimeout(() => {
              checkUserAlreadyLogin();
              navigate("/");
            }, 1000);
          } else {
            notification(result.data, "Un-Success");
          }
          setTimeout(() => {
            setloadingShow(false);
          }, 1000);
        })
        .catch((err) => {
          setloadingShow(false);
        });
    } else if (loginData.Password.includes(" ")) {
      notification("User Password is does not Include any white space", "Warning");
    }
    else if (loginData.Password.length < 8) {
      notification("User Password is Not Matched", "Warning");
    }
  };

  return (
    <>
      <Header />
      <div id="Login">
        <form onSubmit={submitLogin}>
          <h1>LOGIN</h1>
          <label htmlFor="Email">Email:</label>
          <br />
          <input type="Email" id="Email" name="Email" placeholder="Enter your Email" value={loginData.Email} onChange={handleInputEmail} required />
          <label htmlFor="Password">Password:</label> <br />
          <div id="passwordContainer">
            <input type="Password" minLength={8} maxLength={18} id="Password" name="Password" placeholder="Enter your Password" value={loginData.Password} onChange={handleInputPassword} required />
            <div
              id="passwordEYE"
              onClick={() => {
                setPasswordShow(!passwordShow);
              }}>
              {passwordShow ? <AiFillEye /> : <AiFillEyeInvisible />}
            </div>
          </div>
          <div className="forgot-password">
            <NavLink to="./forgetpassword">Forgot Password?</NavLink>
          </div>
          {loadingShow ? <Oval height="22" width="18" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={8} strokeWidthSecondary={8} /> :
            <input type="submit" value="LOGIN" />
          }
          <div className="no-account">
            <p>Don't have an account?</p>
            <NavLink to="/auth/Register" ClassName="active">
              Sign Up
            </NavLink>
          </div>
        </form>
        {/* <div className="social-login">
          <p>Or log in with:</p>
          <button className="google-login">
            <img src={google} alt="google" />
            <span>Log in with Google</span>
          </button>
        </div> */}
      </div>
    </>
  );
};

export default Login;
