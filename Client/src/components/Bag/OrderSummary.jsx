import React from "react";

export const OrderSummary = ({bagData, Charges, Discount_Allot, GrandTotal}) => {
  return (
    <div id={"bag-order-detail"}>
      <h4>Order Summary</h4>
      <table>
        {bagData?.map((curr, ids) => {
          const Total = Math.ceil((curr.Total * (100 - 18)) / 100);
          return (
            <tr key={ids}>
              <td>{curr.Product_Name}</td>
              <td>&#x20B9; {Total}</td>
            </tr>
          );
        })}
        <tr>
          <td>GST: </td>
          <td>&#x20B9; {Charges.GST}</td>
        </tr>
        <tr>
          <td>Discount: </td>
          <td>
            &#x20B9; {Charges.Discount > 0 && "-"} {Discount_Allot.Discount}
          </td>
        </tr>
        <tr>
          <td>Delivery Charges: </td>
          <td>
            &#x20B9; {Charges.Delivery_Charge < 0 && "-"} {Charges.Delivery_Charge}
          </td>
        </tr>
        <tr>
          <td>Grand Total:</td>
          <td>&#x20B9; {GrandTotal}</td>
        </tr>
      </table>
    </div>
  );
};
