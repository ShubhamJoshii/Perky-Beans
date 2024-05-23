import React, {useState, useContext, useEffect} from "react";
import MANWOMENDinning from "../../assets/ManWomenDining.png";
import {BsTelephoneFill} from "react-icons/bs";
import {BiCalendar, BiSolidTimeFive} from "react-icons/bi";
import {FaUserAlt} from "react-icons/fa";
import axios from "axios";
import {Oval} from "react-loader-spinner";
import {Notification, UserData} from "../../routes/App";
import {TbCircleCheck, TbCircle} from "react-icons/tb";
import GroundFloor from "./groundFloor";
import Floor1 from "./Floor1";

import {loadStripe} from "@stripe/stripe-js";
import {useLocation, useNavigate} from "react-router-dom";

const stripePromise = loadStripe("pk_test_51PIBzKBApeRXee97n2UpjWtEqJfL0P2djHw6aEtmkrEBtRlRKAEWBpTLBTrjtopfQqjK08pNnqMbWuwX48Xy6fEi00FUChBPSg");

const ReserveTable = () => {
  const [loadingShow, setloadingShow] = useState(false);
  const [showSelectTable, setShowSelectTable] = useState(false);
  const [bookedTable, setBookedTable] = useState(null);
  const [reserveData, setReserveData] = useState({
    Contact_Number: undefined,
    Person_Count: undefined,
    Floor: "Ground",
    TableNumber: undefined,
    Date: undefined,
    Timing: undefined,
  });

  const {userData} = useContext(UserData);
  
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const {notification} = useContext(Notification);
  const location = useLocation();
  const navigate = useNavigate();
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReserveData({...reserveData, [name]: value});
  };

  const handleDateTimeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReserveData({...reserveData, [name]: value});
    // fetchTableAvailable();
    if (name === "Date") {
      setDate(e.target.value);
    }
    if (name === "Timing") {
      setTime(e.target.value);
    }
  };

  const fetchTableAvailable = async () => {
    await axios.post("/api/tableAvailable", {time: reserveData.Timing, date: reserveData.Date}).then((response) => {
      setBookedTable(response.data.tableBooked);
    });
  };

  useEffect(() => {
    if (time && date) {
      fetchTableAvailable();
    }
  }, [time, date]);

  useEffect(() => {
    if (reserveData.Date && reserveData.Timing) {
      setShowSelectTable(true);
    } else {
      setShowSelectTable(false);
    }
    // console.log(reserveData);
  }, [reserveData]);

  useEffect(() => {
    if (location.pathname.split("/").slice(-1)[0] === "success") {
      notification("Table Reserved. Check Mail!", "Success");
      navigate("/ReserveTable")
    }
    if (location.pathname.split("/").slice(-1)[0] === "canceled") {
      notification("Table Reserved Error", "Un-Success");
      navigate("/ReserveTable")
    }
  }, []);

  const submitReseveTable = async (e) => {
    e.preventDefault();
    // console.log(reserveData);
    if (bookedTable.length <= 26) {
      setloadingShow(true);
      reserveData.Contact_Number.length != 10 ? document.getElementsByClassName("input-Cover")[0].setAttribute("id", "input-Cover-Wrong") : document.getElementsByClassName("input-Cover")[0].setAttribute("id", "");

      reserveData.Person_Count > 8 ? document.getElementsByClassName("input-Cover")[1].setAttribute("id", "input-Cover-Wrong") : document.getElementsByClassName("input-Cover")[1].setAttribute("id", "");

      if (reserveData.Contact_Number.length === 10 && reserveData.Floor && reserveData.TableNumber) {
        let temp = `${reserveData.Floor.slice(0, 1)}${reserveData.TableNumber.toString().padStart(2, 0)}`;
        var currentdate = new Date();
        var Booking_DateTime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + ", " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        // await axios
        //   .post("/api/ReserveTables", {...reserveData, Booking_DateTime, TableNumber: temp})
        //   .then((result) => {
        //     console.log(result);
        //     notification(result.data.message, "Success");
        //     setloadingShow(false);
        //     fetchTableAvailable();
        //   })
        //   .catch(() => {
        //     setTimeout(() => setloadingShow(false), [1000]);
        //     notification("Please Login before Reserving Table", "Warning");
        //   });

        const stripe = await stripePromise;
        await axios.post("/api/create-seat-reservation-session", {...reserveData, Booking_DateTime, TableNumber: temp, URL: location.pathname.split("/status")[0], userID: userData._id, Full_Name: userData.Full_Name, Email: userData.Email}).then(async (response) => {
          const sessionId = response.data.id;
          const {error} = await stripe.redirectToCheckout({
            sessionId: sessionId,
          });

          if (error) {
            console.error("Stripe Checkout error:", error);
          }
        });
      } else if (!reserveData.TableNumber) {
        notification("Please Select Table", "Warning");
      } else if (!reserveData.Floor) {
        notification("Please Select Floor", "Warning");
      } else if (reserveData.Contact_Number !== 10) {
        notification("Please Enter a Valid Contact Number", "Warning");
      }
    } else {
      notification("Table Not Avalable Change your Time", "Un-Success");
    }
    setloadingShow(false);
  };

  const getFutureDate = (monthsToAdd) => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.setMonth(currentDate.getMonth() + monthsToAdd));
    const date = futureDate.getDate().toString().padStart(2, "0");
    const month = (futureDate.getMonth() + 1).toString().padStart(2, "0"); // getMonth() returns month index starting from 0
    const year = futureDate.getFullYear();
    let combineDate = `${year}-${month}-${date}`;
    return combineDate;
  };

  const combineDate = getFutureDate(2);
  return (
    <React.Fragment>
      <div className="ReserveTable">
        <form onSubmit={submitReseveTable}>
          <div className="input-Cover">
            <BsTelephoneFill />
            <input type="number" placeholder="YOUR NUMBER" name="Contact_Number" value={reserveData.Contact_Number} onChange={handleInput} required />
          </div>
          <div className="input-Cover">
            <BiCalendar />
            <input type="date" min={new Date().toISOString().split("T")[0]} max={combineDate} placeholder="SELECT DATE" name="Date" value={reserveData.Date} onChange={handleDateTimeInput} required />
          </div>
          <div>
            <div className="input-Cover">
              <BiSolidTimeFive />
              <input type="time" placeholder="SELECT TIME" name="Timing" value={reserveData.Timing} onChange={handleDateTimeInput} required min={new Date().toISOString().split("T")[0] === reserveData?.Date ? new Date().getHours() + 1 + ":" + new Date().getMinutes() : "11:00"} max="23:00" step="1800" />
            </div>
            {bookedTable?.length <= 26 && (
              <span id="tableAvailable">
                <TbCircleCheck /> Table Available
              </span>
            )}
            {bookedTable?.length > 26 && (
              <span id="tableNotAvailable">
                <TbCircle /> Table Not Available
              </span>
            )}

            {/* <p>Next available time: {formattedNextValidTime}</p> */}
          </div>
          {loadingShow ? (
            <button>
              <Oval height="28" width="28" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={8} strokeWidthSecondary={8} />
            </button>
          ) : (
            <button>BOOK NOW @ &#8377; 500 </button>
          )}
        </form>
        <div id="SecondHALF">
          {showSelectTable ? (
            <>
              <div id="selectTable">
                <h2>Select Table</h2>
                <select name="selecttable" id="selecttable" onChange={(e) => setReserveData({...reserveData, Floor: e.target.value, TableNumber: undefined})}>
                  <option value="Ground">Ground</option>
                  <option value="1Floor">Floor 1</option>
                </select>
              </div>

              <div id="tableSelection">
                {reserveData.Floor === "Ground" && <GroundFloor bookedTable={bookedTable} reserveData={reserveData} setReserveData={setReserveData} />}
                {reserveData.Floor === "1Floor" && <Floor1 bookedTable={bookedTable} reserveData={reserveData} setReserveData={setReserveData} />}
              </div>
            </>
          ) : (
            <>
              <h2>
                BOOK YOUR TABLE TO ENJOY <br />
                THE AMBIENCE
              </h2>
              <img src={MANWOMENDinning} id="img" onClick={() => setReserveData({...reserveData, Person_Count: 4})} />
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReserveTable;
