import React, {useContext, useEffect, useState} from "react";
import {Oval} from "react-loader-spinner";
import SideIMG from "../../assets/Slider/Slider (1).png";
import {Notification, UserData} from "../../routes/App";
import axios from "axios";
const Contact = () => {
  const {userData, setUserData} = useContext(UserData);
  const {notification} = useContext(Notification);
  const [contactData, setContactData] = useState({
    Name: "",
    Email: "",
    type: "Feedback",
    Contact_Number: "",
    Description: "",
  });
  const [loadingShow, setloadingShow] = useState(false);

  const inputHandle = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setContactData({...contactData, [name]: value});
  };

  const submitData = async (e) => {
    e.preventDefault();
    if (contactData.Name && contactData.Email && contactData.type && contactData.Contact_Number && contactData.Description) {
      setloadingShow(true);
      await axios
        .post("/api/contact", {_id: userData?._id, ...contactData})
        .then((result) => {
          // console.log(result.data);
          notification(result.data.message);
          setContactData({
            Name: userData?.Full_Name || "",
            Email: userData?.Email || "",
            type: "Feedback",
            Contact_Number: "",
            Description: "",
          });
          setloadingShow(false);
        })
        .catch(() => {});
    } else if (!contactData.Name) {
      notification("Enter Name");
    } else if (!contactData.Email) {
      notification("Enter Email");
    } else if (!contactData.Contact_Number) {
      notification("Enter Contact Number");
    } else if (!contactData.Description) {
      notification("Enter Description");
    }
  };

  useEffect(() => {
    setContactData({...contactData, Name: userData?.Full_Name, Email: userData?.Email});
  }, [userData]);

  return (
    <React.Fragment>
      <div id="Contact">
        <img src={SideIMG} alt="SideIMG" />
        <div id="ContactForm">
          <div id="blur"></div>
          <div id="BlurFORM">
            <h2>We’d love to help</h2>
            <p>24/7 we will answer your questions and problems</p>
            <form onSubmit={submitData}>
              <div>
                <input type="text" placeholder="Enter Name" name="Name" value={contactData.Name} onChange={inputHandle} />
                <select name="type" id="select" defaultValue="Feedback" onChange={inputHandle}>
                  <option value="Feedback">Feedback</option>
                  <option value="Review">Review</option>
                  <option value="Issue">Issue</option>
                </select>
              </div>
              <div>
                <input type="text" placeholder="Enter E-mail" name="Email" value={contactData.Email} onChange={inputHandle} />
                <input type="number" placeholder="Enter Contact Number" name="Contact_Number" value={contactData.Contact_Number} onChange={inputHandle} />
              </div>
              <textarea name="Description" id="" cols="30" rows="10" placeholder="Describe your issue" value={contactData.Description} onChange={inputHandle}></textarea>

              <button>{loadingShow ? <Oval height="20" width="60" color="white" wrapperStyle={{}} wrapperClass="" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <>SUBMIT</>}</button>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Contact;
