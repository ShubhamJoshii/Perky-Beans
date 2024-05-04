import React, {useState, useContext, useEffect} from "react";
import {NavLink} from "react-router-dom";
import Header from "../Header/Header";
import {MdEmail} from "react-icons/md";
import {Notification, UserData} from "../../routes/App";
import {useNavigate} from "react-router-dom";
import {Oval} from "react-loader-spinner";
import {FaRegCircleCheck, FaRegCircle} from "react-icons/fa6";

import axios from "axios";
const ForgotPassword = () => {
  const [forgetData, setforgetData] = useState({
    Email: "",
    OTP: new Array(5).fill(""),
    Password: "",
    Confirm_Password: "",
  });
  const [lowerValidation, setLowerValidation] = useState(false);
  const [upperValidation, setupperValidation] = useState(false);
  const [numberValidation, setnumberValidation] = useState(false);
  const [specialValidation, setspecialValidation] = useState(false);
  const [lengthValidation, setLengthValidation] = useState(false);

  const [loadingShow, setlodingshow] = useState(false);
  const [forgetBTN, setforgetBTN] = useState(0);
  const {notification} = useContext(Notification);
  const navigate = useNavigate();

  const sendOTP = async (e) => {
    e.preventDefault();
    setlodingshow(true);
    await axios
      .post("/api/forgetPassword/sendOTP", {Email: forgetData.Email})
      .then((result) => {
        notification(result.data?.message, "Success");
        if (result.data?.status) {
          setforgetBTN(1);
        }
        setTimeout(() => setlodingshow(false), 1000);
      })
      .catch(() => {
        setlodingshow(false);
      });
  };

  const otpVerify = async (e) => {
    e.preventDefault();
    setlodingshow(true);
    await axios
      .post("/api/forgetPassword/otpVerify", {Email: forgetData.Email, OTP: forgetData.OTP.join("")})
      .then((result) => {
        // console.log(result.data.status);
        notification(result.data?.message, "Success");
        if (result.data.status) {
          setforgetBTN(2);
        }
        setTimeout(() => {
          setlodingshow(false);
        }, 1000);
      })
      .catch(() => setlodingshow(false));
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (forgetData.Password === forgetData.Confirm_Password && lowerValidation && upperValidation && numberValidation && specialValidation && lengthValidation && !forgetData.Password.includes(" ")) {
      setlodingshow(true);
      await axios
        .post("/api/forgetPassword/updatePassword", {Email: forgetData.Email, OTP: forgetData.OTP, Password: forgetData.Password, Confirm_Password: forgetData.Confirm_Password})
        .then((result) => {
          notification(result.data.message, "Success");
          if (result.data?.status) {
            navigate("/auth/login");
          }
          setTimeout(() => setlodingshow(false), 1000);
        })
        .catch(() => setlodingshow(false));
    } else if (forgetData.Password.includes(" ")) {
      notification("User Password is does not Include any white space", "Warning");
    } else if (forgetData.Password !== forgetData.Confirm_Password) {
      notification("User Password and Confirm Password not Matched", "Warning");
    } else if (forgetData.Password.length < 8) {
      notification("Password length should be greater than and equal to 8", "Warning");
    }
  };

  const handlePasswordValidation = (e) => {
    const password = forgetData.Password;
    const lower = new RegExp("(?=.*[a-z])");
    const upper = new RegExp("(?=.*[A-Z])");
    const number = new RegExp("(?=.*[0-9])");
    const special = new RegExp("(?=.*[!@#$%^&*])");
    const length = new RegExp("(?=.{8,})");
    lower.test(password) ? setLowerValidation(true) : setLowerValidation(false);
    upper.test(password) ? setupperValidation(true) : setupperValidation(false);
    special.test(password) ? setspecialValidation(true) : setspecialValidation(false);
    number.test(password) ? setnumberValidation(true) : setnumberValidation(false);
    length.test(password) ? setLengthValidation(true) : setLengthValidation(false);
  };

  const handlePasswordInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setforgetData({...forgetData, [name]: value});
    handlePasswordValidation();
  };

  useEffect(() => {
    setlodingshow(false);
  }, [forgetBTN]);

  const handleInputEmail = (e) => {
    const {name, value} = e.target;
    const isValidInput = /^[A-Za-z\s]+$/.test(value[0]);
    if (isValidInput || value === "") {
      // setLoginData({ ...loginData, [name]: value });
      setforgetData({...forgetData,Email: e.target.value});
    }
  };

  const handelOTP = (e, index) => {
    if (isNaN(e.target.value)) return false;
    setforgetData({...forgetData, OTP: [...forgetData.OTP.map((data, idx) => (idx === index ? e.target.value : data))]});
    if (e.target.value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleOTPBackspace = (e, index) => {
    const {key} = e;
    if (key === "Backspace" && (forgetData.OTP[index] === null || forgetData.OTP[index] === "")  && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };
  return (
    <>
      <Header />
      <div className="forgot-password-form">
        <h1>Forgot Password</h1>
        <div className="instructions-box">
          <p className="instructions">Enter your email address that you used to register. We'll send you an email with a link to reset your password. If you don’t see the email, check other places it might be, like your junk, spam, social, or other folders.</p>
        </div>
        {forgetBTN === 0 && (
          <form onSubmit={sendOTP}>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={forgetData.Email} placeholder="Enter your email" onChange={handleInputEmail} />
            </div>
            {loadingShow ? <Oval height="24" width="24" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <input type="submit" value="SEND OTP" className="otp-link" />}
          </form>
        )}
        {forgetBTN === 1 && (
          <form onSubmit={otpVerify}>
            <span>
              <MdEmail /> {forgetData.Email} <pre onClick={() => setforgetBTN(0)}>(edit)</pre>
            </span>
            <div>
              <label htmlFor="email">OTP:</label>
              <div id="Enter-OTP">
                {forgetData.OTP.map((curr, id) => {
                  return <input type="text" key={id} id="otp" name="otp" value={curr} maxLength={1} placeholder="_" onChange={(e) => handelOTP(e, id)} onKeyDown={(e) => handleOTPBackspace(e, id)} />;
                })}
              </div>
              <p id="resendOTP" onClick={sendOTP}>
                RESEND OTP
              </p>
            </div>
            {loadingShow ? <Oval height="24" width="24" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <input type="submit" value="VERIFY OTP" className="otp-link" />}
          </form>
        )}
        {forgetBTN === 2 && (
          <form onSubmit={updatePassword}>
            <span>
              <MdEmail /> {forgetData.Email} <pre onClick={() => setforgetBTN(0)}>(edit)</pre>
            </span>
            <div>
              <label htmlFor="email">Enter New Password:</label>
              <input type="text" id="password" name="Password" placeholder="Enter Password" onChange={handlePasswordInput} />
            </div>
            <div>
              <label htmlFor="email">Enter Confirm Password:</label>
              <input type="text" id="Confirm_password" name="Confirm_Password" placeholder="Enter Confirm Password" onChange={handlePasswordInput} />
            </div>
            <div id="passwordValidation">
              <p>
                {lowerValidation ? <FaRegCircleCheck id="validated" /> : <FaRegCircle id="no-validated" />}
                At least one lowercase letter
              </p>
              <p>{numberValidation ? <FaRegCircleCheck id="validated" /> : <FaRegCircle id="no-validated" />} At least one number</p>
              <p>{upperValidation ? <FaRegCircleCheck id="validated" /> : <FaRegCircle id="no-validated" />} At least one uppercase letter</p>
              <p>{lengthValidation ? <FaRegCircleCheck id="validated" /> : <FaRegCircle id="no-validated" />} At least 8 characters</p>
              <p>{specialValidation ? <FaRegCircleCheck id="validated" /> : <FaRegCircle id="no-validated" />} At least one special character</p>
            </div>

            {loadingShow ? <Oval height="24" width="24" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <input type="submit" value="UPDATE PASSWORD" className="otp-link" />}
          </form>
        )}
      </div>
    </>
  );
};

export default ForgotPassword;
