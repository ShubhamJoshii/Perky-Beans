import { Column } from "react-table";
import AdminSidebar from "../components/AdminSidebar";
import { ReactElement, useState, useCallback } from "react";
import TableHOC from "../components/TableHOC";
import { Link } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import { useEffect } from "react";
import {Notification} from "../../routes/App"
import { useContext } from "react";

const Orders = () => {
  const [OrdersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState();
  const [UsersData, setUsersData] = useState();
  const [loading, setLoading] = useState(false);
  const {notification} = useContext(Notification);

  const fetchAllOrders = async () => {
    await axios.get("/api/fetchAllOrders").then((response) => {
      console.log(response.data.data)
      setOrdersData(response.data.data)
      fetchProducts();
      fetchUsers();
    }).catch((err) => {
      console.log(err)
    })
  }

  const fetchProducts = async () => {
    await axios.post("/api/fetchProduct", { Available: false }).then((result) => {
      // console.log(result.data.data);
      setProductsData(result.data.data);
    }).catch((err) => {
      console.log("Error")
    }).finally(() => {
      setLoading(false);
    })
  }

  const fetchUsers = async () => {
    setLoading(true);
    await axios.get("/api/fetchUsers").then((result) => {
      // console.log(result.data.data);
      if (result.data?.data) {
        setUsersData(result.data.data);
      }
    }).catch((err) => {
      console.log("Error")
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  const changeStatus = async(status,_id)=>{
    await axios.post("/api/changeStatus",{_id,status}).then((response)=>{
      // console.log(response.data)
      if(response.data.result) {
        notification(response.data.message,"Success");
        fetchAllOrders();
      }else{
        notification(response.data.message,"Un-Success");
      }
    }).catch((err)=>{
      console.log(err)
    })
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      {/* <main>{Table()}</main> */}
      <div className='dashboard-product-box'>
        <h2 className="heading">Orders</h2>
        <table className="table" role="table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Order At</th>
              <th>Order</th>
              <th>Amount</th>
              <th>Discount</th>
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
              {
                OrdersData && UsersData && productsData ?
                  <>
                    {
                      OrdersData?.slice().reverse().map((curr) => {
                        const userName = UsersData?.find(e => e._id === curr.user_id)
                        const arr =  ["CONFIRMED","SHIPPED","DELIVERY","DELIVERED"];
                        // console.log(curr)
                        const a = arr?.findIndex(e=> e === curr.status);
                        return (
                          <tr id="orders-table">
                            <th>{userName.Full_Name}</th>
                            <th>{new Date(curr.orderedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</th>
                            <th>
                              <ul>
                                {curr.Orders.map((product) => {
                                  const currProduct = productsData.find(e => e._id === product.productID);
                                  // console.log(product)
                                  return (
                                    <li>{currProduct.Product_Name} - {product.SmallCount > 0 && `${product.SmallCount}S`}{product.MediumCount > 0 && `${product.MediumCount}M`} {product.LargeCount > 0 && `${product.LargeCount}L`}</li>
                                  )
                                })}
                              </ul>
                            </th>
                            <th>&#x20B9; {curr.TotalAmountPayed}</th>
                            <th> &#8377; {curr.Discount}</th>
                            <th> {curr.status}</th>
                              { a === 0 && <th><button onClick={() => changeStatus(arr[1],curr._id)}>{arr[1]}</button></th> }
                              { a === 1 && <th><button onClick={() => changeStatus(arr[2],curr._id)}>{arr[2]}</button></th> }
                              { a === 2 && <th><button onClick={() => changeStatus(arr[3],curr._id)}>{arr[3]}</button></th> }
                              { a === 3 && <th>Order Delivery</th> }
                          </tr>
                        )
                      })
                    }
                  </> : <td colSpan="10">
                    <Oval height="40" width="60" color="black" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
                  </td>
              }

            </tbody>
          )}</table>
      </div>
    </div>
  );
};

export default Orders;
