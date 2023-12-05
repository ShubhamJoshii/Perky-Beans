import React, { useState, useContext, useEffect } from "react";
import MANWOMENDinning from "../../assets/ManWomenDining.png";
import { BsTelephoneFill } from "react-icons/bs";
import { BiCalendar, BiSolidTimeFive } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { Notification } from "../../routes/App";
import { TbCircleCheck, TbCircle } from "react-icons/tb";

const ReserveSeat = () => {
  const [loadingShow, setloadingShow] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(null);
  const [reserveData, setReserveData] = useState({
    Contact_Number: undefined,
    Person_Count: undefined,
    Date: undefined,
    Timing: undefined,
  });

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);



  const { notification } = useContext(Notification);
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReserveData({ ...reserveData, [name]: value });
  };

  useEffect(() => {

  })

  const handleDateTimeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReserveData({ ...reserveData, [name]: value });
    // fetchSeatAvailable();
    if (name === "Date") {
      setDate(e.target.value)
    }
    if (name === "Timing") {
      setTime(e.target.value)
    }
  };

  useEffect(() => {
    if (time && date) {
      fetchSeatAvailable();
    }
  }, [time, date]);

  const submitReseveSeat = async (e) => {
    e.preventDefault();
    if (availableSeats === "Seat Available") {
      setloadingShow(true);
      reserveData.Contact_Number.length != 10 ? document.getElementsByClassName("input-Cover")[0].setAttribute("id", "input-Cover-Wrong") : document.getElementsByClassName("input-Cover")[0].setAttribute("id", "");

      reserveData.Person_Count > 8 ? document.getElementsByClassName("input-Cover")[1].setAttribute("id", "input-Cover-Wrong") : document.getElementsByClassName("input-Cover")[1].setAttribute("id", "");

      if (reserveData.Contact_Number.length === 10 && reserveData.Person_Count <= 8) {
        var currentdate = new Date();
        var Booking_DateTime = currentdate.getDate() + "/"
          + (currentdate.getMonth() + 1) + "/"
          + currentdate.getFullYear() + ", "
          + currentdate.getHours() + ":"
          + currentdate.getMinutes() + ":"
          + currentdate.getSeconds();

        await axios
          .post("/api/reserveSeat", { ...reserveData, Booking_DateTime })
          .then((result) => {
            console.log(result);
            notification(result.data.message, "Success");
            setloadingShow(false);
            fetchSeatAvailable();
          })
          .catch(() => {
            setTimeout(() => setloadingShow(false), [1000]);
            notification("Please Login before Reserving Seat", "Warning");
          })
      }
    }else{
      notification("Seat Not Avalable Change your Time","Un-Success")
    }
  };

  const fetchSeatAvailable = async () => {
    // "2023-12-06" "16:28"
    await axios.post("/api/seatAvailable", { time: reserveData.Timing, date: reserveData.Date }).then((response) => {
      setAvailableSeats(response.data.message);
      // console.log();
      // response.data.result ?
      //   notification(response.data.message, "Success") :
      //   notification(response.data.message, "Un-Success");
    })
  }

  // Get the current time
  // const currentTime = new Date();
  // const currentHours = currentTime.getHours();
  // const currentMinutes = currentTime.getMinutes();
  // const currentSeconds = currentTime.getSeconds();

  // // Calculate the next valid time slot (30-minute intervals)
  // const nextValidTime = new Date(currentTime);
  // nextValidTime.setMinutes(currentMinutes + (30 - (currentMinutes % 30)));


  // // Format the next valid time as "HH:mm"
  // if (Number(currentHours.toString() + currentMinutes.toString() + currentSeconds.toString()) < 110000) {
  //   var formattedNextValidTime = 11 + ":" + 0 + 0;
  // } else if (Number(currentHours.toString() + currentMinutes.toString() + currentSeconds.toString()) > 230000) {
  //   formattedNextValidTime = 11 + ":" + 0 + 0;
  // } else {
  //   formattedNextValidTime = `${nextValidTime.getHours()}:${(nextValidTime.getMinutes() < 10 ? "0" : "") + nextValidTime.getMinutes()}`;
  // }


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
                  <input type="date" min={new Date().toISOString().split("T")[0]} max="2024-01-29" placeholder="SELECT DATE" name="Date" value={reserveData.Date} onChange={handleDateTimeInput} required />

                </div>
                <div>
                  <div className="input-Cover">
                    <BiSolidTimeFive />
                    <input type="time" placeholder="SELECT TIME" name="Timing" value={reserveData.Timing} onChange={handleDateTimeInput} required min={new Date().toISOString().split("T")[0] === reserveData?.Date ? new Date().getHours()+1 + ":" + new Date().getMinutes() : "11:00" } max="23:00" step="1800" />
                  </div>
                  {availableSeats === "Seat Available" && <span id="seatAvailable"><TbCircleCheck /> Seat Available</span>}
                  {availableSeats === "Seat Not Available" && <span id="seatNotAvailable"><TbCircle /> Seat Not Available</span>}

                  {/* <p>Next available time: {formattedNextValidTime}</p> */}
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
