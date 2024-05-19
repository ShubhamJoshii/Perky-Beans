import { useState, useEffect, useContext } from "react";
import SearchBar from "../Common/SearchBar";
import OrderCards from "./OrderCards";
import WishlistCards from "./WishlistCards";
import Bags from "../Bag/Bags";
import Scooter from "../../assets/scooter.png";
import { UserData } from "../../routes/App";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const Orders = () => {
  const [orderShow, setOrderShow] = useState(true);
  const { userData, setUserData, fetchWishList, wishlistData } = useContext(UserData);
  const [loading, setLoading] = useState("Show");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const currRoute = useParams();

  const fetchFunction = async () => {
    setLoading("Show");
    await fetchWishList();
    await fetchOrders();
    setLoading("Hide");
  }
  
  const fetchOrders = async()=>{
    await axios.get("/api/fetchOrders").then((response)=>{
      setOrders(response.data.data);
    }).catch((err)=>{
      console.log(err)
    })
  }
  
  useEffect(() => {
    fetchFunction();
  }, [])

  useEffect(() => {
    if (currRoute.orders === "my-wishlist") {
      setOrderShow(false);
    } else {
      setOrderShow(true);
    }
  }, [currRoute]);

  return (
    <>
      <SearchBar bgColor="white" />
      <div id="Orders">
        <div id="order-wishlists">
          <h3
            onClick={() => {
              navigate("/orders/my-order");
            }}
            id={orderShow ? "active" : ""}>
            MY ORDERS
          </h3>
          <h3
            onClick={() => {
              navigate("/orders/my-wishlist");
            }}
            id={!orderShow ? "active" : ""}>
            MY WISHLIST
          </h3>
        </div>
        {
          loading === "Hide" ?
            <>
              {userData ? (
                <>
                  {orderShow ? (
                    <>
                      {orders?.length > 0 ? (
                        <div id="orderCardsContainer">
                          {orders?.toReversed().map((curr, ids) => {
                            return <OrderCards fetchOrders={fetchOrders} orderData={curr} key={curr + ids} ids={ids} userData={userData} setUserData={setUserData} />;
                          })}
                        </div>
                      ) : (
                        <div id="orderCardsContainer">No order is Placed till now</div>
                      )}
                    </>
                  ) : (
                    <>
                      {wishlistData?.length > 0 ? (
                        <div id="wishlist">
                          <div id="orderCardsContainer">
                            {wishlistData?.toReversed().map((curr, ids) => {
                              return <WishlistCards product={curr}  key={curr + ids} userData={userData} setUserData={setUserData} />;
                            })}
                          </div>
                        </div>
                      ) : (
                        <div id="orderCardsContainer">No Item Found</div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div id="orderCardsContainer" className="userNotLogin">
                  <p>
                    Sorry,the <strong>ORDER</strong> and <strong>WISHLIST</strong> is restricted to registered users only.
                  </p>
                  <p>
                    please
                    <NavLink to="/auth/register"> register</NavLink> or <NavLink to="/auth/login">login</NavLink> to continue.
                  </p>
                </div>
              )}
            </>
            :
            <>
              {
                loading === "Show" ?
                  <div id="orderCardsContainer">
                    <Oval height="40" width="60" color="black" wrapperStyle={{ marginTop: "100px" }} wrapperClass="orderProduct loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={4} strokeWidthSecondary={4} />
                  </div>
                  :
                  <div id="orderCardsContainer" >
                    <div className="loadingBTN">
                      <p>Something went wrong</p>
                      <button onClick={fetchProducts}>Try again</button>
                    </div>
                  </div>
              }
            </>
        }
      </div>
      <img src={Scooter} alt="Scooter" id="scooterIMG" />
      <Bags />
    </>
  );
};

export default Orders;
