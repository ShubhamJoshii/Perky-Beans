import { useState, useEffect, useContext } from "react";
import SearchBar from "../Common/SearchBar";
import OrderCards from "./OrderCards";
import WishlistCards from "./WishlistCards";
import Bags from "../Common/Bags";
import Scooter from "../../assets/scooter.png";
import { UserData } from "../../routes/App";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const Orders = () => {
  const [orderShow, setOrderShow] = useState(true);
  const { userData, setUserData, fetchBag, fetchWishList, addToBag, addToWishlist, bagData, wishlistData } = useContext(UserData);
  const [Products, setProducts] = useState(null);
  const [loading, setLoading] = useState("Show");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const currRoute = useParams();

  const fetchProducts = async () => {
    setLoading("Show");
    await axios.post("/api/fetchProduct", { Available: false }).then((result) => {
      setProducts(result.data.data);
      setLoading("Hide");
      fetchWishList();
      fetchOrders();
    }).catch((err) => {
      console.log("Error")
      setLoading("LoadBtnShow");
    })
  }

  useEffect(() => {
    fetchProducts();
  }, [])

  useEffect(() => {
    if (currRoute.orders === "my-wishlist") {
      setOrderShow(false);
    } else {
      setOrderShow(true);
    }
  }, [currRoute]);


  const fetchOrders = async()=>{
    await axios.get("/api/fetchOrders").then((response)=>{
      // console.log(response.data.data);
      setOrders(response.data.data);
    })
  }

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
                            // const product = Products?.find((e) => e._id === curr.Orders[0].productID);
                            // console.log(product)
                            return <OrderCards product={Products} fetchProducts={fetchProducts} orderData={curr} key={curr + ids} ids={ids} userData={userData} setUserData={setUserData} />;
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
                              // console.log(curr);
                              const product = Products?.find((e) => e._id === curr.productID);
                              return <WishlistCards product={product} orderData={curr} key={curr + ids} userData={userData} setUserData={setUserData} />;
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
