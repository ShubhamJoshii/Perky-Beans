import React from "react";

const PaymentOption = ({bagOption, setBagOption}) => {
  return (
    <div id="PaymentOption">
      <h4>RECOMMENDED</h4>
      <label htmlFor="deliveryOption1" id="Payment-Options">
        <input type="radio" name="cashOnDelivery" id="deliveryOption1" onChange={(e)=>setBagOption({...bagOption, paymentThrough:e.target.value})} value={"Cash on Delivery/Pay on Delivery"} />
        <div>
          <p>Cash on Delivery/Pay on Delivery</p>
          <span>Cash, UPI and Cards accepted.</span>
        </div>
      </label>
    </div>
  );
};

export default PaymentOption;
