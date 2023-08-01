import React, {useState, useContext, useEffect} from "react";
import {NavLink} from "react-router-dom";
import Header from "../Header/Header";
import {MdEmail} from "react-icons/md";
import {Notification, UserData} from "../../routes/App";
import {useNavigate} from "react-router-dom";
import {Oval} from "react-loader-spinner";

import axios from "axios";
const ForgotPassword = () => {
  const [forgetData, setforgetData] = useState({
    Email: "",
    OTP: "",
    Password: "",
    Confirm_Password: "",
  });
  const [loadingShow, setlodingshow] = useState(false);
  const [forgetBTN, setforgetBTN] = useState(0);
  const {notification} = useContext(Notification);
  const navigate = useNavigate();
  const sendOTP = async (e) => {
    setlodingshow(true);
    await axios
      .post("/api/forgetPassword/sendOTP", {Email: forgetData.Email})
      .then((result) => {
        notification(result.data?.message);
        if (result.data?.status) {
          setforgetBTN(1);
        }
        setTimeout(() => setlodingshow(false), 1000);
      })
      .catch(() => {
        setlodingshow(false);
      });
  };

  const otpVerify = async () => {
    setlodingshow(true);
    await axios
      .post("/api/forgetPassword/otpVerify", {Email: forgetData.Email, OTP: forgetData.OTP})
      .then((result) => {
        // console.log(result.data.status);
        notification(result.data?.message);
        if (result.data.status) {
          setforgetBTN(2);
        }
        setTimeout(() => {
          setlodingshow(false);
        }, 1000);
      })
      .catch(() => setlodingshow(false));
  };

  const updatePassword = async () => {
    if (forgetData.Password === forgetData.Confirm_Password && forgetData.Confirm_Password.length >= 8) {
      setlodingshow(true);
      await axios
        .post("/api/forgetPassword/updatePassword", {Email: forgetData.Email, OTP: forgetData.OTP, Password: forgetData.Password, Confirm_Password: forgetData.Confirm_Password})
        .then((result) => {
          notification(result.data.message);
          if (result.data?.status) {
            navigate("/login");
          }
          setTimeout(() => setlodingshow(false), 1000);
        })
        .catch(() => setlodingshow(false));
    } else if (forgetData.Password !== forgetData.Confirm_Password) {
      notification("User Password and Confirm Password not Matched");
    } else if (forgetData.Password.length < 8) {
      notification("Password length should be greater than and equal to 8");
    }
  };

  useEffect(() => {
    setlodingshow(false);
  }, [forgetBTN]);

  return (
    <>
      <Header />
      <form className="forgot-password-form">
        <h1>Forgot Password</h1>
        <div className="instructions-box">
          <p className="instructions">Enter your email address that you used to register. We'll send you an email with a link to reset your password. If you don’t see the email, check other places it might be, like your junk, spam, social, or other folders.</p>
        </div>
        {forgetBTN === 0 && (
          <>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" onChange={(e) => setforgetData({Email: e.target.value})} />
            </div>
            {loadingShow ? <Oval height="24" width="24" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <input type="button" value="SEND OTP" className="otp-link" onClick={sendOTP} />}
          </>
        )}
        {forgetBTN === 1 && (
          <>
            <span>
              <MdEmail /> {forgetData.Email} <pre onClick={() => setforgetBTN(0)}>(edit)</pre>
            </span>
            <div>
              <label htmlFor="email">OTP:</label>
              <input type="number" id="otp" name="otp" placeholder="Enter OTP" onChange={(e) => setforgetData({...forgetData, OTP: e.target.value})} />
              <p id="resendOTP" onClick={sendOTP}>
                RESEND OTP
              </p>
            </div>
            {loadingShow ? <Oval height="24" width="24" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <input type="button" value="VERIFY OTP" className="otp-link" onClick={otpVerify} />}
          </>
        )}
        {forgetBTN === 2 && (
          <>
            <span>
              <MdEmail /> {forgetData.Email} <pre onClick={() => setforgetBTN(0)}>(edit)</pre>
            </span>
            <div>
              <label htmlFor="email">Enter New Password:</label>
              <input type="text" id="password" name="Password" placeholder="Enter Password" onChange={(e) => setforgetData({...forgetData, Password: e.target.value})} />
            </div>
            <div>
              <label htmlFor="email">Enter Confirm Password:</label>
              <input type="text" id="Confirm_password" name="Confirm_Password" placeholder="Enter Confirm Password" onChange={(e) => setforgetData({...forgetData, Confirm_Password: e.target.value})} />
            </div>
            {loadingShow ? <Oval height="24" width="24" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <input type="button" value="UPDATE PASSWORD" className="otp-link" onClick={updatePassword} />}
          </>
        )}
      </form>
    </>
  );
};

export default ForgotPassword;
