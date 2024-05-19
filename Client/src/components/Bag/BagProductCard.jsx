import axios from "axios";
import React, { useContext, useState } from "react";

import {IoIosClose} from "react-icons/io";
import {RiArrowDropUpLine, RiArrowDropDownLine} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../routes/App";

const BagProductCard = ({bag,link}) => {
  const [showAmountDetails, setShowAmountDetail] = useState(false);
  const navigate = useNavigate();
  const {fetchBag} = useContext(UserData);

  const removeFromBag = async (_id) => {
    await axios.post("/api/removeFromBag", {productID: _id}).then((result) => {
      fetchBag();
    });
  };

  return (
    <>
      <div id="productCart" onClick={() => navigate(link)}>
        <div id="productCartFront">
          <img src={bag.Product_Photo} alt="CardImage" />
          <div id="productDetail">
            <div id="productName">
              <h3>{bag.Product_Name}</h3>
              <h4>
                Quantity: {bag.SmallCount > 0 && bag.SmallCount + "S "} {bag.MediumCount > 0 && bag.MediumCount + "M "} {bag.LargeCount > 0 && bag.LargeCount + "L"}{" "}
              </h4>
            </div>
            <h4>&#x20B9;{bag.Total}</h4>
            <div id="Icons">
              <IoIosClose onClick={() => removeFromBag(bag.productID)} />
              {showAmountDetails ? <RiArrowDropUpLine onClick={() => setShowAmountDetail(null)} /> : <RiArrowDropDownLine onClick={() => setShowAmountDetail(true)} />}
            </div>
          </div>
        </div>
        <div id="Amount_Info_Show" style={showAmountDetails ? {height: "100%"} : {height: "0"}}>
          <div id="Amount_INFO">
            <h4>TOTAL :</h4>
            <div>
              {bag.SmallCount > 0 && <p>Regular x {bag.SmallCount} </p>}
              {bag.MediumCount > 0 && <p>Medium x {bag.MediumCount} </p>}
              {bag.LargeCount > 0 && <p>Large x {bag.LargeCount} </p>}
            </div>
            <div>
              {bag.SmallCount > 0 && <p>&#x20B9;{bag.smallPrice}</p>}
              {bag.MediumCount > 0 && <p>&#x20B9;{bag.mediumPrice}</p>}
              {bag.LargeCount > 0 && <p>&#x20B9;{bag.largePrice}</p>}
            </div>
          </div>
          <div id="TotalAmt">
            <p>You Pay :</p>
            <p>&#x20B9;{bag.Total}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BagProductCard;
