import React, { useState, useContext, useEffect } from "react";
import MANWOMENDinning from "../../assets/ManWomenDining.png";
import { BsTelephoneFill } from "react-icons/bs";
import { BiCalendar, BiSolidTimeFive } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { Notification } from "../../routes/App";
const ReserveSeat = () => {
  const [loadingShow, setloadingShow] = useState(false);
  const [reserveData, setReserveData] = useState({
    Contact_Number: undefined,
    Person_Count: undefined,
    Date: undefined,
    Timing: undefined,
  });
  const { notification } = useContext(Notification);
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReserveData({ ...reserveData, [name]: value });
  };

  const submitReseveSeat = async (e) => {
    e.preventDefault();
    setloadingShow(true);
    reserveData.Contact_Number.length != 10 ?
      document.getElementsByClassName('input-Cover')[0].setAttribute('id', "input-Cover-Wrong")
      :
      document.getElementsByClassName('input-Cover')[0].setAttribute('id', "")

    reserveData.Person_Count > 8 ?
      document.getElementsByClassName('input-Cover')[1].setAttribute('id', "input-Cover-Wrong")
      :
      document.getElementsByClassName('input-Cover')[1].setAttribute('id', "")

    if (reserveData.Contact_Number.length === 10 && reserveData.Person_Count <= 8) {
      // console.log(new Date().toIOSString());
      let Booking_DateTime = new Date().toString();
      await axios
        .post("/api/reserveSeat", {...reserveData,Booking_DateTime})
        .then((result) => {
            notification(result.data.message,"Success");
            setloadingShow(false);
          })
        .catch(() => {
            setTimeout(() => setloadingShow(false), [1000]);
            notification("Please Login before Reserving Seat","Warning");
        });
    }
  };

  return (
    <React.Fragment>
      <div className="ReserveImage">
        <div className="ReserveSeatContainer">
          <div className="ReserveSeat">
            <div className="BlurBackground"></div>
            <div id="ReseverSeatForm">
              <form onSubmit={submitReseveSeat}>
                <div className="input-Cover">
                  <BsTelephoneFill />
                  <input type="number" placeholder="YOUR NUMBER" name="Contact_Number" value={reserveData.Contact_Number} onChange={handleInput} required />
                </div>
                <div className="input-Cover">
                  <FaUserAlt />
                  <input type="number" placeholder="NUMBER OF PERSONS" name="Person_Count" value={reserveData.Person_Count} onChange={handleInput} required />
                </div>
                <div className="input-Cover">
                  <BiCalendar />
                  <input type="date" min={new Date().toISOString().split('T')[0]} max="2024-01-29" placeholder="SELECT DATE" name="Date" value={reserveData.Date} onChange={handleInput} required />
                </div>
                <div className="input-Cover">
                  <BiSolidTimeFive />
                  <input type="time" placeholder="SELECT TIME" name="Timing" value={reserveData.Timing} onChange={handleInput} required />
                </div>
                {loadingShow ? (
                  <button>
                    <Oval height="28" width="28" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={8} strokeWidthSecondary={8} />
                  </button>
                ) : (
                  <button>BOOK NOW</button>
                )}
              </form>
              <div id="SecondHALF">
                <h2>
                  BOOK YOUR TABLE TO ENJOY <br />
                  THE AMBIENCE
                </h2>
                <img src={MANWOMENDinning} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReserveSeat;
