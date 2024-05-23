import {Column} from "react-table";
import AdminSidebar from "../components/AdminSidebar";
import {ReactElement, useState, useCallback} from "react";
// import TableHOC from "../components/TableHOC";
import {Link} from "react-router-dom";
import {Oval} from "react-loader-spinner";
import axios from "axios";
import {useEffect} from "react";
import {Notification} from "../../routes/App";
import {useContext} from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Orders = () => {
  let arr = Array.from({length: 20}, (curr, id) => {
    id: id + 1;
  });

  const [OrdersData, setOrdersData] = useState(arr);
  const [loading, setLoading] = useState(false);
  const {notification} = useContext(Notification);

  const fetchAllOrders = async () => {
    await axios
      .get("/api/fetchAllOrders")
      .then((response) => {
        setOrdersData(response.data.data)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const changeStatus = async (status, _id) => {
    await axios
      .post("/api/changeStatus", {_id, status})
      .then((response) => {
        // console.log(response.data)
        if (response.data.result) {
          notification(response.data.message, "Success");
          fetchAllOrders();
        } else {
          notification(response.data.message, "Un-Success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      {/* <main>{Table()}</main> */}
      <div className="dashboard-product-box">
        <h2 className="heading">Orders</h2>
        <table className="table" role="table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Order At</th>
              <th>Order</th>
              <th>Delivery Address</th>
              <th>Amount</th>
              <th>Payment Status</th>
              {/* <th>Discount</th> */}
              <th>Status</th>
              <th>Manage</th>
            </tr>
          </thead>
          {loading ? (
            <td colSpan="10">
              <Oval height="40" width="60" color="black" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
            </td>
          ) : (
            <tbody>
              {OrdersData ? (
                <>
                  {OrdersData?.slice()
                    .reverse()
                    .map((curr,ids) => {
                      const arr = ["ORDER PLACED", "ORDER PREPARED", "READY FOR PICKUP", "ORDER RECEIVED", "Order Cancelled"];
                      const a = arr?.findIndex((e) => e === curr?.status);
                      return (
                        <tr id="orders-table" key={ids}>
                          <th>{curr?.Full_Name || <Skeleton />}</th>
                          <th>{curr?.orderedAt ?  <>{new Date(curr?.orderedAt).toLocaleString("en-IN", {timeZone: "Asia/Kolkata"})}</> : <Skeleton />}</th>
                          <th>
                            {curr?.Orders ? (
                              <ul>
                                {curr?.Orders.map((product,id) => {
                                  return (
                                    <li key={id}>
                                      {product.Product_Name} - {product.SmallCount > 0 && `${product.SmallCount}S`}
                                      {product.MediumCount > 0 && `${product.MediumCount}M`} {product.LargeCount > 0 && `${product.LargeCount}L`}
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <ul>
                                <Skeleton count={2}/>
                              </ul>
                            )}
                          </th>
                          <th>{curr?.Address || <Skeleton count={2}/>}</th>
                          <th>{curr?.TotalAmountPayed ? <>&#x20B9; {curr?.TotalAmountPayed} </> : <Skeleton />}</th>
                          <th>{curr?.paymentThrough || <Skeleton count={1}/>}</th>
                          <th> {curr?.status || <Skeleton />}</th>
                          {curr?.status ? (
                            <>
                              {a === 0 && (
                                <th>
                                  <button id="order-status-prepared" onClick={() => changeStatus(arr[1], curr?._id)}>{arr[1]}</button></th>)}
                                  {a === 1 && (<th><button id="order-status-pickup" onClick={() => changeStatus(arr[2], curr?._id)}>{arr[2]}</button></th>)}
                                  {a === 2 && (
                                <th>
                                  <button id="order-status-received" onClick={() => changeStatus(arr[3], curr?._id)}>
                                    {arr[3]}
                                  </button>
                                </th>
                              )}
                              {(a === -1 || a === 3) && (
                                <th>
                                  <button id="order-complete">ORDER COMPLETE </button>
                                </th>
                              )}
                              {a === 4 && <th>Order Cancelled</th>}
                            </>
                          ) : (
                            <th>
                              <Skeleton />
                            </th>
                          )}
                        </tr>
                      );
                    })}
                </>
              ) : (
                <td colSpan="10">
                  <Oval height="40" width="60" color="black" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
                </td>
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Orders;
