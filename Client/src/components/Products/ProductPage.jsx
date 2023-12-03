import React from "react";
import { AiFillStar, AiFillHeart } from "react-icons/ai";
import { TiMinus, TiPlus } from "react-icons/ti";
import { LuVegan } from "react-icons/lu";
import Veg from "../../assets/veg.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Bags from "../Common/Bags";
import { Notification, UserData } from "../../routes/App";
import { useContext } from "react";
import { Oval } from "react-loader-spinner";
import CustomerReview from "../Landing/CustomerReview/CustomerReview";

const ProductPage = () => {
  const [counter0, setCounter0] = useState(0);
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [Products, setProducts] = useState({});
  const [loading, setLoading] = useState("Show");
  const [AddToBag, setAddToBag] = useState(false);

  let itemShow = useParams().productID;
  const { userData, setUserData } = useContext(UserData);
  const { checkUserAlreadyLogin, notification } = useContext(Notification);

  useEffect(() => {
    // console.log("reload");
    userData?.Bag.find((e) => {
      if (e.productID === Products._id) {
        setCounter0(e.SmallCount);
        setCounter1(e.MediumCount);
        setCounter2(e.LargeCount);
      }
    });
  }, [userData]);

  const fetchProductDetails = async () => {
    setLoading("Show");
    await axios.post("/api/fetchProductDetails", { _id: itemShow }).then((response) => {
      // console.log(response.data.data)
      setProducts(response.data.data)
      setLoading("Hide");
    }).catch((err) => {
      setLoading("LoadBtnShow");
      console.log(err);
    }).finally(() => {
      // setLoading(false);
    })
  }

  useEffect(() => {
    itemShow && fetchProductDetails();
  }, [itemShow]);

  const Sizes = [
    {
      id: 1,
      name: "regular",
      price: Products?.Price - 50,
      counter: counter0,
      setCounter: setCounter0,
    },
    {
      id: 2,
      name: "medium",
      price: Products?.Price,
      counter: counter1,
      setCounter: setCounter1,
    },
    {
      id: 3,
      name: "large",
      price: Products?.Price + 50,
      counter: counter2,
      setCounter: setCounter2,
    },
  ];

  const total = Sizes[0].price * Sizes[0].counter + Sizes[1].price * Sizes[1].counter + Sizes[2].price * Sizes[2].counter;

  const addToWishlist = async (_id) => {
    if (userData) {
      let b = userData.Wishlist.find((e) => e.productID === _id);
      if (b) {
        await axios.post("/api/removefromWishlist", { productID: _id }).then((result) => {
          checkUserAlreadyLogin();
        });
      } else {
        await axios
          .post("/api/addToWishlist", {
            productID: _id,
          })
          .then((result) => {
            checkUserAlreadyLogin();
          })
      }
    } else {
      notification("Please Login Before Adding to Wishlist", "Warning");
    }
  };

  const addToBag = async (_id) => {
    setAddToBag(true);
    if (userData) {
      let b = userData.Bag.find((e) => e.productID === _id);
      if (counter0 || counter1 || counter2 > 0) {
        if (b) {
          await axios.post("/api/updateBag", { productID: _id, SmallCount: counter0, MediumCount: counter1, LargeCount: counter2 }).then((result) => {
            checkUserAlreadyLogin();
          });
        } else {
          await axios
            .post("/api/addtoBag", {
              productID: _id,
              SmallCount: counter0,
              MediumCount: counter1,
              LargeCount: counter2,
            })
            .then((result) => {
              // checkUserAlreadyLogin();
            }).catch(()=>{
            })
            .finally(()=>{
              checkUserAlreadyLogin();
              setAddToBag(false);
            })
          }
        } else {
          notification("firstly, Select Size", "Warning");
        }
      } else {
        notification("Please Login Before Adding to Bag", "Warning");
      }
      setAddToBag(false);
  };

  return (
    <React.Fragment>
      <Bags />
      {
        loading === "Hide" ?
          <>
            <div className="products product-board">
              <div className="product-card" key={Products._id}>
                <div id="product-img-BTN1">
                  <div id="onhover-showBTN1">
                    <p id="wishlist-para">WISHLIST</p>
                    <AiFillHeart onClick={() => addToWishlist(Products._id)} className={userData?.Wishlist.find((e) => e.productID === Products._id) ? "active-Heart heart" : "heart"} />
                  </div>
                </div>
                <img className="product-image" src={Products.Product_Photo} alt={Products.Product_Photo} loading="lazy" />
                <div className="product-info">
                  <h5 className="product-name">{Products.Product_Name}</h5>
                  <p className="product-price">&#x20B9;{Products.Price}</p>
                  <div className="product-star">
                    <AiFillStar id="A" />
                    <p className="product-rating">{Number(Products.Rating)?.toFixed(1)}/5.0</p>
                  </div>
                </div>
              </div>
              <div className="product-board-desc">
                <h1>
                  {Products.Product_Name}
                  {Products.type === "Veg" ? <img id="veg" src={Veg} alt="Veg" /> : <LuVegan id="LuVegan" />}
                </h1>
                <p>{Products.Description}</p>
                <div className="product-board-sizes">
                  <h2>Select Sizes</h2>
                  <div className="sizes">
                    {Sizes.map((size) => {
                      return (
                        <div id={size.name} key={size.id}>
                          <img src={Products.Product_Photo} alt={Products.Product_Photo} />
                          <p>{size.name}</p>
                          <p className="product-price">&#x20B9;{size.price}</p>
                          <div className="counter">
                            <button
                              className="btn btn--minus"
                              onClick={() => {
                                size.counter > 0 ? size.setCounter(size.counter - 1) : size.setCounter(size.counter);
                                // addProductQuantity(Products._id);
                              }}>
                              <TiMinus />
                            </button>
                            <p>{size.name}</p>
                            <span>{size.counter}</span>
                            <button
                              className="btn btn--plus"
                              onClick={() => {
                                size.counter < 9 ? size.setCounter(size.counter + 1) : size.setCounter(size.counter);
                                // addProductQuantity(Products._id,size.counter + 1);
                              }}>
                              <TiPlus />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div id="totalorder">
                    <div className="total">
                      <h1>Total Amount &#x20B9; {total}</h1>
                    </div>
                    {AddToBag ?
                      <button className="order">
                        <Oval height="18" width="18" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={8} strokeWidthSecondary={8} />
                      </button>
                      :
                      <button className="order" style={counter0 || counter1 || counter2 > 0 ? {} : { background: "grey" }} onClick={() => addToBag(Products._id)}>
                        Add to Bag
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
            <CustomerReview />
            {/* <Footer /> */}
          </> :
          <>
            {
              loading === "Show" ?
                <Oval height="40" width="60" color="white" wrapperStyle={{}} wrapperClass="products loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={4} strokeWidthSecondary={4} />
                :
                <div className="products loadingBTN">
                  <p>Something went wrong</p>
                  <button onClick={fetchProductDetails}>Try again</button>
                </div>
            }
          </>
      }
    </React.Fragment>
  );
};

export default ProductPage;
