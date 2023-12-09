import { useContext, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import { Notification } from "../../routes/App";
const OrderCards = ({ product, orderData, ids, userData, setUserData }) => {
  const [trackShow, setTrackShow] = useState(null);
  const [trackCount, setTrackCount] = useState(20);
  const [loading, setloading] = useState(false);
  const [totalOrder, setTotalOrder] = useState([])
  const { checkUserAlreadyLogin, notification } = useContext(Notification);
  const removeMyOrder = async (_id) => {
    setloading(true);
    await axios
      .post("/api/cancelOrder", { productID: _id })
      .then((result) => {
        if (result.data === "Product Ordered Cancelled") {
          checkUserAlreadyLogin();
        }
      })
      .catch((err) => { console.log(err) })
      .finally(() => { setloading(false); })
      ;
  };

  const styles = {
    line: {
      background: `linear-gradient(to right, red ${trackCount}%, black ${100 - trackCount}%)`,
      background: `-webkit-linear-gradient(360deg, red ${trackCount}%, black ${100 - trackCount}%)`
    }
  }

  useEffect(() => {
    // orderData.status
    orderData.status === "CONFIRMED" && setTrackCount(20);
    orderData.status === "SHIPPED" && setTrackCount(40);
    orderData.status === "DELIVERY" && setTrackCount(60);
    orderData.status === "DELIVERED" && setTrackCount(100);

    

    // console.log(orderData.status)
  }, [orderData])
  // console.log(orderData)

  return (
    <div id="order-details">
      <div id="order-details-inner">
        <div>
          <span id="order-id">Order ID: {orderData._id.slice(0, 7)}</span>
          <span id="order-status">.{orderData.status}</span>
        </div>
        <span id="order-date">{new Date(orderData.orderedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
      </div>
      <div id="orders-Collection">
        {
          orderData.Orders.map((curr) => {
            const prd = product.find(e => e._id === curr.productID);
            const Total = prd.Price * curr.LargeCount + prd.Price * curr.MediumCount + prd.Price * curr.SmallCount
            // setTotalOrder([
            //   `${orderData._id}` : {
                
            //   }
            //   ])
            return (
              <div id="orderCards">
                <img src={prd.Product_Photo} />
                <div>
                  <div id="product-name-pay">
                    <h3>{prd.Product_Name}</h3>
                    <p>You Pay: &#x20B9;{Total} </p>
                  </div>
                  <p>{prd.Description.slice(0, 200)}...</p>
                </div>
              </div >
            )
          })
        }
      </div>
      <div id="order-summary">
        <h4>Order Summary</h4>
        <table>
          {
            orderData.Orders.map((curr) => {
              const prd = product.find(e => e._id === curr.productID);
              const Total = prd.Price * curr.LargeCount + prd.Price * curr.MediumCount + prd.Price * curr.SmallCount
              return (
                <tr>
                  <td>{prd.Product_Name}:</td>
                  <td>&#x20B9;{Total * (100 - 18)/100}</td>
                </tr>
              )
            }
          )}
          <tr>
                <td>Delivery Charges: </td>
                <td>{orderData.Delivery_Charge}</td>
              </tr>
              <tr>
                <td>GST: </td>
                <td>{orderData.GST}</td>
              </tr>
              <tr>
                <td>Discount: </td>
                <td>{orderData.Discount}</td>
              </tr>
              <tr>
                <td>Order Total:</td>
                <td>{orderData.TotalAmountPayed}</td>
              </tr>
        </table>
      </div>

      <div id="btns">
        <button onClick={() => removeMyOrder(orderData.productID)}>{loading ? <Oval height="14" width="14" color="white" wrapperStyle={{}} wrapperClass="" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <>CANCEL</>}</button>
        <button
          onClick={() => {
            orderData.productID === trackShow ? setTrackShow(null) : setTrackShow(orderData.productID);
          }}>
          TRACK YOUR ORDER
        </button>
      </div>

      {trackShow === orderData.productID && (
        <div className="track-order">
          {/* <IoMdClose id="closeICON" onClick={() => setTrackShow(null)} /> */}
          {/* <h3>TRACK YOUR ORDER</h3> */}
          <div>
            <div id="Line" style={styles.line}></div>
            <div id="track-collection">
              <div id="timeStamp-Order">
                <div id="currStage-Order"
                  className={trackCount >= 20 ? "trackDone" : ""}>1</div>
                <h5>ORDER CONFIRMED </h5>
              </div>
              <div id="timeStamp-Order">
                <div id="currStage-Order" className={trackCount >= 40 ? "trackDone" : ""}>2</div>
                <h5>ORDER SHIPPED</h5>
              </div>
              <div id="timeStamp-Order">
                <div id="currStage-Order" className={trackCount >= 60 ? "trackDone" : ""}>3</div>
                <h5>OUT FOR DELIVERY</h5>
              </div>
              <div id="timeStamp-Order">
                <div id="currStage-Order" className={trackCount >= 100 ? "trackDone" : ""}>4</div>
                <h5>DELIVERED</h5>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderCards;
