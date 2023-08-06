import React, {useState, useContext} from "react";
import MANWOMENDinning from "../../assets/ManWomenDining.png";
import {BsTelephoneFill} from "react-icons/bs";
import {BiCalendar, BiSolidTimeFive} from "react-icons/bi";
import {FaUserAlt} from "react-icons/fa";
import axios from "axios";
import {Oval} from "react-loader-spinner";
import {Notification} from "../../routes/App";
const ReserveSeat = () => {
  const [loadingShow, setloadingShow] = useState(false);
  const [reserveData, setReserveData] = useState({
    Contact_Number: null,
    Person_Count: null,
    Date: null,
    Timing: null,
  });
  const {notification} = useContext(Notification);
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReserveData({...reserveData, [name]: value});
  };

  const submitReseveSeat = async (e) => {
    e.preventDefault();
    setloadingShow(true);
    await axios
      .post("/api/reserveSeat", reserveData)
      .then((result) => {
        notification(result.data.message,"Success");
        setloadingShow(false);
      })
      .catch(() => {
        setTimeout(() => setloadingShow(false), [1000]);
        notification("Please Login before Reserving Seat","Warning");
      });
  };

  return (
    <React.Fragment>
      <div className="ReserveImage">
        <div className="ReserveSeatContainer">
          <div className="ReserveSeat">
            <div className="BlurBackground"></div>
            <div id="ReseverSeatForm">
              <form onSubmit={submitReseveSeat}>
                <div>
                  <BsTelephoneFill />
                  <input type="number" placeholder="YOUR NUMBER" name="Contact_Number" value={reserveData.Contact_Number} onChange={handleInput} />
                </div>
                <div>
                  <FaUserAlt />
                  <input type="text" placeholder="PERSONS" name="Person_Count" value={reserveData.Person_Count} onChange={handleInput} />
                </div>
                <div>
                  <BiCalendar />
                  {/* <input type='text' placeholder='SELECT DATE'/> */}
                  <input type="date" placeholder="SELECT DATE" name="Date" value={reserveData.Date} onChange={handleInput} />
                </div>
                <div>
                  <BiSolidTimeFive />
                  {/* <input type='text' placeholder='SELECT TIME'/> */}
                  <input type="time" placeholder="SELECT TIME" name="Timing" value={reserveData.Timing} onChange={handleInput} />
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
