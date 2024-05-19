import React, {useEffect, useState} from "react";
import {FiChevronRight} from "react-icons/fi";
import {MdAdd} from "react-icons/md";
import Home from "../../assets/Home.png";
import Hotel from "../../assets/Hotel.png";
import Building from "../../assets/Building.png";
import Other from "../../assets/Other.png";

import axios from "axios";
import Skeleton from "react-loading-skeleton";
const SelectAddress = ({setShowBag,bagOption, setBagOption}) => {
  const [address, setAddress] = useState([{}]);
  const fetchAddress = async () => {
    await axios.get("/api/fetchAddress").then((response) => {
      setAddress(response.data.userSavedAddress);
    });
  };
  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div id="Select_Address">
      <div id="Add-New-Address-Btn" onClick={() => setShowBag("AddNewAddress")}>
        <MdAdd />
        <p>Add new address</p>
        <FiChevronRight />
      </div>
      <h5>Your saved addresses</h5>
      {address.map((curr) => {
        // console.log(curr._id)
        return (
          <div id="saved-Address" className={curr.combineText === bagOption.address ? "selected-Address" : ""} onClick={()=>setBagOption({...bagOption,address:curr.combineText})}>
            {curr.AddressAs ? (
              <>
                {curr.AddressAs === "Home" && <img src={Home} alt="HomeLogo" />}
                {curr.AddressAs === "Work" && <img src={Building} alt="HomeLogo" />}
                {curr.AddressAs === "Hotel" && <img src={Hotel} alt="HomeLogo" />}
                {curr.AddressAs === "Other" && <img src={Other} alt="HomeLogo" />}
              </>
            ) : (
              <Skeleton style={{width: "50px", height: "50px"}} />
            )}
            <div>
              <h4>{curr.AddressAs || <Skeleton />}</h4>
              <p>{curr.combineText || <Skeleton count={2} />}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectAddress;
