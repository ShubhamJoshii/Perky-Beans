import React, {useState, useEffect, useContext} from "react";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import Header from "../Header/Header";
import {NavLink, useNavigate} from "react-router-dom";
import {Notification} from "../../routes/App";
import axios from "axios";

const Register = () => {
  const [registerData, setregisterInfo] = useState({
    Full_Name: "",
    Email: "",
    Password: "",
    Confirm_Password: "",
  });
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordConfirmShow, setPasswordConfirmShow] = useState(false);
  const {notification} = useContext(Notification);
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
    setregisterInfo({...registerData, [name]: value});
  };

  const registerUser = async (e) => {
    e.preventDefault();
    let a = document.getElementById("Password");
    let b = document.getElementById("Confirm_Password");
    if (registerData.Full_Name && registerData.Email && registerData.Password === registerData.Confirm_Password && registerData.Password.length >= 8) {
      await axios
        .post("/api/register", registerData)
        .then((result) => {
          notification(result.data,"Success");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        })
        .catch((err) => {
          // console.log(err);
        });
    } else if (registerData.Password.length < 8) {
      a.style.border = "3px solid red";
      b.style.border = "none";
      notification("Password length should be greater than and equal to 8","Warning");
    } else if (registerData.Password !== registerData.Confirm_Password) {
      a.style.border = "3px solid red";
      b.style.border = "3px solid red";
      notification("User Password and Confirm Password not Matched","Warning");
    } else {
      a.style.border = "none";
      b.style.border = "none";
    }
  };

  return (
    <>
      <Header />

      <div id="Sign_Up">
        <form>
          <h1>Sign Up</h1>
          <label htmlFor="Full_Name">Full Name:</label>
          <br />
          <input type="text" id="Full_Name" name="Full_Name" placeholder="Enter your full name" value={registerData.Full_Name} required onChange={handleInput} />
          <label htmlFor="Email">Email:</label>
          <br />
          <input type="email" id="Email" name="Email" placeholder="Enter your email" value={registerData.Email} required onChange={handleInput} />
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
          <input type="submit" value="SIGN UP" onClick={registerUser} id="registerBTN" />
          <div className="already-account">
            <p>Already have an account?</p>
            <NavLink to="/auth/login" ClassName="active">
              Sign In
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
};
export default Register;
