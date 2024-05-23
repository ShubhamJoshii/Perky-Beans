import React from "react";

const PaymentOption = ({bagOption, setBagOption}) => {
  return (
    <div id="PaymentOption">
      <h4>RECOMMENDED</h4>
      <label htmlFor="deliveryOption1" id="Payment-Options">
        <input type="radio" name="paymentThrough" id="deliveryOption1" onChange={(e)=>setBagOption({...bagOption, paymentThrough:e.target.value})} value={"Cash on Delivery/Pay on Delivery"} />
        <div>
          <p>Cash on Delivery/Pay on Delivery</p>
          <span>Cash, UPI and Cards accepted.</span>
        </div>
      </label>
      <h4>RECOMMENDED</h4>
      <label htmlFor="deliveryOption2" id="Payment-Options">
        <input type="radio" name="paymentThrough" id="deliveryOption2" onChange={(e)=>setBagOption({...bagOption, paymentThrough:e.target.value})} value={"Paid Online"} />
        <div>
          <p>Pay online by UPI, Credit or Debit Cards</p>
          <span>UPI and Cards accepted online</span>
        </div>
      </label>
    </div>
  );
};

export default PaymentOption;
