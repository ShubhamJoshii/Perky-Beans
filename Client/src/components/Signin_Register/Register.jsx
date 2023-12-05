import React, { useState, useEffect, useContext } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaRegCircleCheck, FaRegCircle } from "react-icons/fa6";
import Header from "../Header/Header";
import { NavLink, useNavigate } from "react-router-dom";
import { Notification } from "../../routes/App";
import axios from "axios";
import EmailVerficationLogo from "../../assets/EmailVerficationLogo.png"
import { Oval } from "react-loader-spinner";
const Register = () => {
  const [registerData, setregisterInfo] = useState({
    Full_Name: "",
    Email: "",
    Password: "",
    Confirm_Password: "",
  });
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordConfirmShow, setPasswordConfirmShow] = useState(false);
  const [verified, setVerified] = useState(false);
  const [lowerValidation, setLowerValidation] = useState(false);
  const [upperValidation, setupperValidation] = useState(false);
  const [numberValidation, setnumberValidation] = useState(false);
  const [specialValidation, setspecialValidation] = useState(false);
  const [lengthValidation, setLengthValidation] = useState(false);
  const [loadingShow, setloadingShow] = useState(false);

  const { notification } = useContext(Notification);
  const navigate = useNavigate();

  useEffect(() => {
    passwordShow ? (document.getElementById("Password").type = "text") : (document.getElementById("Password").type = "password");
  }, [passwordShow]);

  useEffect(() => {
    passwordConfirmShow ? (document.getElementById("Confirm_Password").type = "text") : (document.getElementById("Confirm_Password").type = "password");
  }, [passwordConfirmShow]);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setregisterInfo({ ...registerData, [name]: value });
    handlePasswordValidation();
  };
  
  const handleInputEmail = (e) => {
    const { name, value } = e.target;
    const isValidInput = /^[A-Za-z\s]+$/.test(value[0]);
    if (isValidInput || value === "") {
      setregisterInfo({ ...registerData, [name]: value });
    }
  }
  
  const handleInputName = (e) => {
    const { name, value } = e.target;
    const isValidInput = /^[A-Za-z\s]+$/.test(value);
    if (isValidInput || value === "") {
      setregisterInfo({ ...registerData, [name]: value });
    }
  };

  const handlePasswordValidation = (e) => {
    const password = registerData.Password;
    const lower = new RegExp('(?=.*[a-z])');
    const upper = new RegExp('(?=.*[A-Z])');
    const number = new RegExp('(?=.*[0-9])');
    const special = new RegExp("(?=.*[!@#\$%\^&\*])");
    const length = new RegExp("(?=.{8,})")
    lower.test(password) ? setLowerValidation(true) : setLowerValidation(false);
    upper.test(password) ? setupperValidation(true) : setupperValidation(false);
    special.test(password) ? setspecialValidation(true) : setspecialValidation(false);
    number.test(password) ? setnumberValidation(true) : setnumberValidation(false);
    length.test(password) ? setLengthValidation(true) : setLengthValidation(false);
    // console.log(password?.includes(" "));
  }

  const registerUser = async (e) => {
    e.preventDefault();
    let a = document.getElementById("Password");
    let b = document.getElementById("Confirm_Password");


    if (registerData.Full_Name && registerData.Email && registerData.Password === registerData.Confirm_Password && lowerValidation && upperValidation && numberValidation && specialValidation && lengthValidation && !registerData.Password?.includes(" ")) {
      setloadingShow(true);
      await axios
        .post("/api/register", registerData)
        .then((result) => {
          notification(result.data, "Success");
          setloadingShow(false);
          if (result.data === "Verification  email sent") {
            setVerified(true);
          }
        })
        .catch((err) => {
          setloadingShow(false);
        });
    } else if (registerData.Password?.includes(" ")) {
      a.style.border = "3px solid red";
      b.style.border = "none";
      notification("Password does not include any white space", "Warning");
    }
    else if (lengthValidation) {
      a.style.border = "3px solid red";
      b.style.border = "none";
      notification("Password length should be greater than and equal to 8", "Warning");
    } else if (registerData.Password !== registerData.Confirm_Password) {
      a.style.border = "3px solid red";
      b.style.border = "3px solid red";
      notification("User Password and Confirm Password not Matched", "Warning");
    } else {
      a.style.border = "none";
      b.style.border = "none";
      notification("Please Fill Registration Form Properly", "Warning");
    }
  };

  return (
    <>
      <Header />
      <div id="Sign_Up">
        {
          !verified ?
            <form>
              <h1>Sign Up</h1>
              <label htmlFor="Full_Name">Full Name:</label>
              <br />
              <input type="text" id="Full_Name" name="Full_Name" placeholder="Enter your full name" value={registerData.Full_Name} required onChange={handleInputName} />
              <label htmlFor="Email">Email: </label>
              <br />
              <input type="email" id="Email" name="Email" placeholder="Enter your email" value={registerData.Email} required onChange={handleInputEmail} />
              <label htmlFor="password">Password:</label>
              <div id="passwordContainer">
                <input type="password" id="Password" name="Password" placeholder="Enter your Password" value={registerData.Password} required onChange={handleInput} />
                <div id="passwordEYE" onClick={() => setPasswordShow(!passwordShow)}>
                  {passwordShow ? <AiFillEye /> : <AiFillEyeInvisible />}
                </div>
              </div>
              <label htmlFor="Confirm_Password">Confirm Password:</label>
              <div id="passwordContainer">
                <input type="password" id="Confirm_Password" name="Confirm_Password" placeholder="Confirm your password" value={registerData.Confirm_Password} required onChange={handleInput} />
                <div id="passwordEYE" onClick={() => setPasswordConfirmShow(!passwordConfirmShow)}>
                  {passwordConfirmShow ? <AiFillEye /> : <AiFillEyeInvisible />}
                </div>
              </div>
              <div id="passwordValidation">
                <p>
                  {lowerValidation ? <FaRegCircleCheck id="validated" /> : <FaRegCircle id="no-validated" />}
                  At least one lowercase letter
                </p>
                <p>{upperValidation ? <FaRegCircleCheck id="validated" /> : <FaRegCircle id="no-validated" />} At least one uppercase letter</p>
                <p>{numberValidation ? <FaRegCircleCheck id="validated" /> : <FaRegCircle id="no-validated" />} At least one number</p>
                <p>{specialValidation ? <FaRegCircleCheck id="validated" /> : <FaRegCircle id="no-validated" />} At least one special character</p>
                <p>{lengthValidation ? <FaRegCircleCheck id="validated" /> : <FaRegCircle id="no-validated" />} At least 8 characters</p>
              </div>
              {loadingShow ? <Oval height="22" width="18" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={8} strokeWidthSecondary={8} /> :
                <input type="submit" value="SIGN UP" onClick={registerUser} id="registerBTN" />
              }
              <div className="already-account">
                <p>Already have an account?</p>
                <NavLink to="/auth/login" ClassName="active">
                  Sign In
                </NavLink>
              </div>
            </form> :

            <form id="verfication-email">
              <h2>Email Verification</h2>
              <p>Thank you for signing up for a Perky Bean account.</p>
              <h1>Verify your email address</h1>
              <img src={EmailVerficationLogo} />
              <p>Verfication email has been sent to:</p>
              <strong><p>{registerData.Email}</p></strong>
              <p>Click on the link in the email to activate your account.
                <p id="verified-login">Verified? <NavLink to="/auth/login">Login</NavLink></p>
              </p>
            </form>
        }
      </div>

    </>
  );
};
export default Register;
