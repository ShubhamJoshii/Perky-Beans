import React, {useState, useEffect} from "react";
import google from "../../assets/google.png";
import {NavLink} from "react-router-dom";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import Header from "../Header/Header";
import {UserData, Notification} from "../../routes/App";
import {useContext} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
  });
  const [passwordShow, setPasswordShow] = useState(false);
  const {userData, setUserData} = useContext(UserData);
  const {notification, checkUserAlreadyLogin} = useContext(Notification);
  const navigate = useNavigate();
  useEffect(() => {
    passwordShow ? (document.getElementById("Password").type = "text") : (document.getElementById("Password").type = "password");
  }, [passwordShow]);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginData({...loginData, [name]: value});
  };

  const submitLogin = async (e) => {
    e.perventDefault;
    if (loginData.Email && loginData.Password.length >= 8) {
      await axios
        .post("/api/login", loginData)
        .then((result) => {
          notification(result.data);
          if (result.data === "User Logined") {
            setTimeout(() => {
              checkUserAlreadyLogin();
              navigate("/");
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (loginData.Password.length < 8) {
      notification("User Password is Not Matched");
    }
  };

  return (
    <>
      <Header />
      <div id="Login">
        <form>
          <h1>LOGIN</h1>
          <label htmlFor="Email">Email:</label>
          <br />
          <input type="Email" id="Email" name="Email" placeholder="Enter your Email" value={loginData.Email} onChange={handleInput} />
          <label htmlFor="Password">Password:</label> <br />
          <div id="passwordContainer">
            <input type="Password" id="Password" name="Password" placeholder="Enter your Password" value={loginData.Password} onChange={handleInput} />
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
            {/* <a href="#" className="forgot-password">Forgot Password?</a> */}
          </div>
          <input type="button" value="LOGIN" onClick={submitLogin} />
          <div className="no-account">
            <p>Don't have an account?</p>
            <NavLink to="/Register" ClassName="active">
              Sign Up
            </NavLink>
          </div>
        </form>
        <div className="social-login">
          <p>Or log in with:</p>
          <button className="google-login">
            <img src={google} alt="google" />
            <span>Log in with Google</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
