import { Fragment, useContext, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import { Notification } from "../../routes/App";
import { Rate } from "antd";
import { useNavigate } from "react-router-dom";
const OrderCards = ({ product, orderData, ids, userData, setUserData, fetchOrders }) => {
  const [trackShow, setTrackShow] = useState(null);
  const [trackCount, setTrackCount] = useState(20);
  const [FeedBackShow, setFeedBackShow] = useState(null);
  const [loading, setloading] = useState(false);
  const [totalOrder, setTotalOrder] = useState([])
  const [feedbackData, setFeedBackData] = useState({
    Description: "",
    rating: ""
  })
  const { checkUserAlreadyLogin, notification } = useContext(Notification);
  const navigate = useNavigate();
  const removeMyOrder = async (_id) => {
    // console.log(_id);
    setloading(true);
    await axios
      .post("/api/cancelOrder", { _id })
      .then((result) => {
        if (result.data === "Product Order Cancelled") {
          // checkUserAlreadyLogin();
          notification(result.data, "Success")
          fetchOrders();
        }
      })
      .catch((err) => { console.log(err) })
      .finally(() => { setloading(false); })
      ;
  };

  const handleInputFeedback = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFeedBackData({ ...feedbackData, [name]: value })
  }

  const feedbackSubmit = async (e, curr) => {
    e.preventDefault();
    console.log(curr);
    if (feedbackData.Description.length > 0 && feedbackData.rating) {
      // console.log(feedbackData);
      await axios.post("/api/productReview", { ...feedbackData, _id: curr.productID }).then((response) => {
        // console.log(response.data);
        if (response.data.result) {
          notification(response.data.message, "Success")
          fetchOrders();
        } else {
          notification(response.data.message, "Un-Success")
        }

      }).catch((err) => {
        console.log(err)
      })

    } else if (feedbackData.Description.length <= 0) {
      notification("Write Feedback", "Un-Success")
    } else if (!feedbackData.rating) {
      notification("Provide Rating", "Un-Success")
    }
  }

  const styles = {
    line: {
      background: `linear-gradient(to right, red ${trackCount}%, black ${trackCount}%)`,
      background: `-webkit-linear-gradient(360deg, red ${trackCount}%, black ${trackCount}%)`
    }
  }

  useEffect(() => {
    orderData.status === "ORDER PLACED" && setTrackCount(20);
    orderData.status === "ORDER PREPARED" && setTrackCount(40);
    orderData.status === "READY FOR PICKUP" && setTrackCount(60);
    orderData.status === "ORDER RECEIVED" && setTrackCount(100);
    orderData.status === "Order Cancelled" && setTrackCount(100);
  }, [orderData])

  return (
    <div id="order-details">
      <div id="order-details-inner">
        <div>
          <span id="order-id">Order ID: {orderData._id.slice(0, 8)} </span>
          <span id="order-status"> {orderData.status}</span>
        </div>
        <span id="order-date">{new Date(orderData.orderedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
      </div>
      <div id="orders-Collection">
        {
          orderData.Orders.map((curr,id) => {
            // console.log(curr)
            // const curr = product.find(e => e._id === curr.productID);
            // const curr = {};
            const Total = curr.Price * curr.LargeCount + curr.Price * curr.MediumCount + curr.Price * curr.SmallCount
            return (
              <Fragment key={id}>
                <div id="orderCards">
                  <img src={curr.Product_Photo} alt={curr.Product_Name} onClick={()=>navigate(`/products/${curr.Category}/${curr._id}`)}/>
                  <div>
                    <div id="product-name-pay">
                      <h3>{curr.Product_Name}</h3>
                      <p>You Pay: &#x20B9;{Total} </p>
                    </div>
                    <p>{curr.Description.slice(0, 200)}...</p>
                  </div>
                  {
                    (orderData.status === "ORDER RECEIVED" && !curr?.Reviews.find(e => e.user_id === userData._id)) &&
                    <button
                      onClick={() => {
                        curr._id === FeedBackShow ? setFeedBackShow(null) : setFeedBackShow(curr._id);
                      }}
                      id="write-feedback"
                    >
                      WRITE YOUR FEEDBACK
                    </button>
                  }
                </div >
                {(FeedBackShow === curr._id) && (
                  <form className="write-feedback" onSubmit={(e) => feedbackSubmit(e, curr)}>
                    <textarea placeholder="Write your Feedback" id="feedback" name="Description" value={feedbackData.Description} onChange={handleInputFeedback} />
                    <div id="second-write-feedback">
                      <button type="submit">Submit Review</button>
                      <div>
                        <p>Overall Rating*</p>
                        <Rate className="order-rate-antd" allowClear={false} tooltips={["Very Bad", "Bad", "Good", "Excellent", "Awesome"]} onChange={(value) => { setFeedBackData({ ...feedbackData, rating: value }) }} />
                      </div>
                    </div>
                    {/* <Rate className="overall-rate-antd" allowHalf allowClear={false} tooltips={["Very Bad", "Bad", "Good", "Excellent", "Awesome"]} /> */}
                  </form>
                )}
              </Fragment>
            )
          })
        }
      </div>
      {
        orderData.status !== "Order Cancelled" &&
        <div id="order-summary">
          <h4>Order Summary</h4>
          <table>
          <thead>
            {
              orderData.Orders.map((curr,id) => {
                // const curr = product.find(e => e._id === curr.productID);
                const Total = curr.Price * curr.LargeCount + curr.Price * curr.MediumCount + curr.Price * curr.SmallCount
                return (
                  <tr key={id}>
                    <td>{curr.Product_Name}:</td>
                    <td>&#x20B9; {Total * (100 - 18) / 100}</td>
                  </tr>
                )
              }
              )}
            <tr>
              <td>Delivery Charges: </td>
              <td>&#x20B9; {orderData.Delivery_Charge}</td>
            </tr>
            <tr>
              <td>GST: </td>
              <td>&#x20B9; {orderData.GST}</td>
            </tr>
            {
              orderData.Discount > 0 &&
              <tr>
                <td>Discount: {orderData?.Coupon_Used && <span>({orderData?.Coupon_Used})</span>} </td>
                <td>&#x20B9; {orderData.Discount}</td>
              </tr>
            }
            <tr>
              <td>Order Total:</td>
              <td>&#x20B9; {orderData.TotalAmountPayed}</td>
            </tr>
            </thead>
          
          </table>
        </div>
      }

      <div id="btns">
        {
          orderData.status !== "ORDER RECEIVED" ?
            <>
              {
                orderData.status !== "Order Cancelled" &&
                <button onClick={() => removeMyOrder(orderData._id)}>{loading ? <Oval height="14" width="14" color="white" wrapperStyle={{}} wrapperClass="" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <>CANCEL</>}</button>
              }
              <button
                onClick={() => {
                  orderData.productID === trackShow ? setTrackShow(null) : setTrackShow(orderData.productID);
                }}>
                TRACK YOUR ORDER
              </button>
            </>
            :
            <></>
        }
      </div>

      {trackShow === orderData.productID && (
        <div className="track-order">
          <div>
            <div id="Line" style={styles.line}></div>
            {
              orderData.status !== "Order Cancelled" ?
                <div id="track-collection">
                  <div id="timeStamp-Order">
                    <div id="currStage-Order"
                      className={trackCount >= 20 ? "trackDone" : ""}>1</div>
                    <h5>ORDER PLACED </h5>
                  </div>
                  <div id="timeStamp-Order">
                    <div id="currStage-Order" className={trackCount >= 40 ? "trackDone" : ""}>2</div>
                    <h5>ORDER PREPARED</h5>
                  </div>
                  <div id="timeStamp-Order">
                    <div id="currStage-Order" className={trackCount >= 60 ? "trackDone" : ""}>3</div>
                    <h5>READY FOR PICKUP</h5>
                  </div>
                  <div id="timeStamp-Order">
                    <div id="currStage-Order" className={trackCount >= 100 ? "trackDone" : ""}>4</div>
                    <h5>ORDER RECEIVED</h5>
                  </div>
                  {
                    orderData.status === "Order Cancelled" &&
                    <div id="timeStamp-Order">
                      <div id="currStage-Order" className={trackCount >= 100 ? "trackDone" : ""}>5</div>
                      <h5>ORDER CANCELLED</h5>
                    </div>
                  }
                </div>
                :
                <div id="track-collection">
                  <div id="timeStamp-Order">
                    <div id="currStage-Order"
                      className={trackCount >= 20 ? "trackDone" : ""}></div>
                    <h5>ORDER PLACED </h5>
                  </div>
                  <div id="timeStamp-Order">
                    <div id="currStage-Order" className={trackCount >= 20 ? "trackDone" : ""}>5</div>
                    <h5 style={{ color: "red" }}>ORDER CANCELLED</h5>
                  </div>
                </div>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCards;
