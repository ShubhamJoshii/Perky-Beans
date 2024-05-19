import React from "react";
import Tick from "../../assets/tick.gif";
import {FaCheck} from "react-icons/fa6";
import {NavLink, useNavigate} from "react-router-dom";
// <img src={Tick}/>
const OrderStatus = ({setShowBag}) => {
  const navigate = useNavigate();
  return (
    <div id="order-status">
      <div id="outer-tick-animation">
        <FaCheck id="tickGIF" />
      </div>
      <h3>Congratulations!!!</h3>
      <p>Your order have been taken and being attended to</p>
      <button onClick={() => {setShowBag(0);navigate("/orders/my-order")}} id="track-order">
        Track order
      </button>
      <button onClick={() => {setShowBag(0);navigate("/products")}} id="continue-ordering">
        Continue ordering food
      </button>
    </div>
  );
};

export default OrderStatus;
