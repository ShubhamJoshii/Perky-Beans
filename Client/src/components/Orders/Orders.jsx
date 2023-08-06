import SearchBar from "../Common/SearchBar";
import {useState} from "react";
import OrderCards from "./OrderCards";
import WishlistCards from "./WishlistCards";
import Bags from "../Common/Bags";
import Scooter from "../../assets/scooter.png";
import {useContext} from "react";
import {UserData} from "../../routes/App";
import {useEffect} from "react";
import {Products} from "../../Data/ProductsJSON";
import {NavLink, useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
const Orders = () => {
  const [orderShow, setOrderShow] = useState(true);
  const {userData, setUserData} = useContext(UserData);
  const navigate = useNavigate();
  const currRoute = useParams();

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
        {userData ? (
          <>
            {orderShow ? (
              <>
                {userData?.Orders.length > 0 ? (
                  <div id="orderCardsContainer">
                    {userData?.Orders?.toReversed().map((curr, ids) => {
                      const product = Products.find((e) => e._id === curr.productID);
                      return <OrderCards product={product} orderData={curr} key={curr + ids} ids={ids} userData={userData} setUserData={setUserData} />;
                    })}
                  </div>
                ) : (
                  <div id="orderCardsContainer">No order is Placed till now</div>
                )}
              </>
            ) : (
              <>
                {userData?.Wishlist.length > 0 ? (
                  <div id="wishlist">
                    <div id="orderCardsContainer">
                      {userData?.Wishlist?.toReversed().map((curr, ids) => {
                        // console.log(curr);
                        const product = Products.find((e) => e._id === curr.productID);
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
            {/* <br /> */}
            <p>
              please
              <NavLink to="/auth/register"> register</NavLink> or <NavLink to="/auth/login">login</NavLink> to continue.
            </p>
          </div>
        )}
      </div>
      <img src={Scooter} alt="Scooter" id="scooterIMG" />
      <Bags />
    </>
  );
};

export default Orders;
