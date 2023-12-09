import React, { useContext, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import SideIMG from "../../assets/Slider/Slider (1).png";
import { Notification, UserData } from "../../routes/App";
import axios from "axios";
import { Rate } from "antd";
const Contact = () => {
  const { userData, setUserData } = useContext(UserData);
  const { notification } = useContext(Notification);
  const [contactData, setContactData] = useState({
    Name: undefined,
    Email: undefined,
    type: "Feedback",
    Contact_Number: undefined,
    Description: "",
    rating: null
  });
  const [loadingShow, setloadingShow] = useState(false);

  const inputHandle = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setContactData({ ...contactData, [name]: value });
  };

  const submitData = async (e) => {
    e.preventDefault();
    if (contactData.type && contactData.Contact_Number.length === 10 && contactData.Description) {
      setloadingShow(true);
      await axios
        .post("/api/contact", { _id: userData?._id, ...contactData })
        .then((result) => {
          (result.data.Success) ? notification(result.data.message, "Success") : notification(result.data.message, "Un-Success");
          setContactData({
            Name: userData?.Full_Name || "",
            Email: userData?.Email || "",
            type: contactData.type,
            Contact_Number: "",
            Description: "",
            rating:null
          });
          setloadingShow(false);
        })
        .catch(() => { });
    } else if (contactData.Contact_Number.length != 10) {
      notification("Enter Correct Contact Number", "Info");
    } else if (!contactData.Description) {
      notification("Enter Description", "Info");
    } else {
      notification("Please Login First !", "Un-Success");
    }
  };

  useEffect(() => {
    if (userData) {
      setContactData({ ...contactData, Name: userData?.Full_Name, Email: userData?.Email });
    }
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
                <input type="text" disabled placeholder="Enter Name" name="Name" value={contactData.Name} onChange={inputHandle} />
                <select name="type" id="select" defaultValue="Feedback" onChange={inputHandle}>
                  <option value="Feedback">Feedback</option>
                  <option value="Review">Review</option>
                  <option value="Issue">Issue</option>
                </select>
              </div>
              {
                contactData.type === "Review" &&
                <Rate defaultValue={contactData?.rating} className="overall-rate-antd" allowClear={false} tooltips={["Very Bad", "Bad", "Good", "Excellent", "Awesome"]} onChange={(value) => { setContactData({...contactData,rating:value}) }} />
              }
              <div>
                <input type="text" disabled placeholder="Enter E-mail" name="Email" value={contactData.Email} onChange={inputHandle} />
                <input type="number" required placeholder="Enter Contact Number" name="Contact_Number" value={contactData.Contact_Number} onChange={inputHandle} />
              </div>
              <div id="textArea">
                <textarea name="Description" required id="" cols="30" rows="10" minLength={10} maxLength={300} placeholder="Describe your issue" value={contactData.Description} onChange={inputHandle}></textarea>
                <p>{contactData?.Description?.length} / 300</p>
              </div>
              <button>{loadingShow ? <Oval height="20" width="60" color="white" wrapperStyle={{}} wrapperClass="" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <>SUBMIT</>}</button>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Contact;
