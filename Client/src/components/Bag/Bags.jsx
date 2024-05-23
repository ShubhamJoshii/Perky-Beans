import {Fragment, useEffect, useRef, useState} from "react";
import {FaShoppingBag} from "react-icons/fa";
import {MdOutlineArrowBackIos} from "react-icons/md";
import {Oval} from "react-loader-spinner";
import {Notification, UserData} from "../../routes/App";
import {useContext} from "react";
import {MdArrowRight} from "react-icons/md";

import {NavLink, useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import BagProductCard from "./BagProductCard";
import SelectAddress from "./SelectAddress";
import AddNewAddress from "./AddNewAddress";
import PaymentOption from "./PaymentOption";
import OrderStatus from "./OrderStatus";
import {OrderSummary} from "./OrderSummary";
import {loadStripe} from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51PIBzKBApeRXee97n2UpjWtEqJfL0P2djHw6aEtmkrEBtRlRKAEWBpTLBTrjtopfQqjK08pNnqMbWuwX48Xy6fEi00FUChBPSg");

const Bags = () => {
  const [showBag, setShowBag] = useState(0);
  const [bagOption, setBagOption] = useState({
    address: null,
    paymentThrough: null,
  });
  const {userData, fetchBag, bagData, setBagData} = useContext(UserData);
  const {checkUserAlreadyLogin, notification} = useContext(Notification);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [Charges, setCharge] = useState({
    Delivery_Charge: 0,
    GST: 0,
  });
  const [showCoupon, setShowCoupon] = useState("Hide");
  const [GrandTotal, setGrandTotal] = useState(0);
  const [AllCoupon, setAllCoupon] = useState([]);
  const [Discount_Allot, setDiscount_Allot] = useState({
    Discount: 0,
    Coupon_ID: "",
  });

  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchGrandTotal = () => {
    let GST = 0,
      Delivery_Charge = 0;
    if (bagData.length > 0) {
      let total = bagData.reduce((accumulator, currentValue) => accumulator + currentValue.Total, 0);
      GST = Math.ceil((total * 18) / 100);
      total > 500 || total === 0 ? (Delivery_Charge = 0) : (Delivery_Charge = 40);
      setCharge({...Charges, GST, Delivery_Charge});
      setGrandTotal(total + Delivery_Charge);
    }
  };

  useEffect(() => {
    fetchGrandTotal();
  }, [bagData]);

  useEffect(() => {
    let URL = location.pathname.split("/bag")[0];
    if (location.pathname.split("/").slice(-1)[0] === "success") {
      setShowBag("success");
      navigate(`${URL}`);
    }
    if (location.pathname.split("/").slice(-1)[0] === "canceled") {
      navigate(`${URL}`);
    }
  }, []);

  const fun = async () => {
    setLoading(true);
    await fetchBag();
    await fetchCoupon();
    setLoading(false);
  };

  useEffect(() => {
    fun();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowBag(0);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [showBag]);

  const stripePayment = async () => {
    const stripe = await stripePromise;
    await axios.post("/api/create-food-order-session", {...Charges, TotalAmountPayed: GrandTotal, ...Discount_Allot, Address: bagOption.address, paymentThrough: bagOption.paymentThrough, URL: location.pathname.split("/bag")[0], userID: userData._id, Full_Name: userData.Full_Name, Email: userData.Email}).then(async (response) => {
      const sessionId = response.data.id;
      const {error} = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error("Stripe Checkout error:", error);
      }
    });
  };

  const orderNow = async (_id) => {
    // let address = ""
    if (bagData.length > 0) {
      if (bagOption.paymentThrough !== "Paid Online") {
        setLoadingBtn(true);
        await axios
          .post("/api/orderNow", {...Charges, TotalAmountPayed: GrandTotal, ...Discount_Allot, Address: bagOption.address, paymentThrough: bagOption.paymentThrough})
          .then((result) => {
            console.log(result.data);
            if (result.data === "Product Ordered") {
              // notification(result.data, "Success");
              // fetchBag();
              setBagData([]);
              setShowBag("success");
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoadingBtn(false);
          });
      } else {
        stripePayment();
      }
    }
  };

  const bagProcessess = () => {
    if (bagData?.length > 0) {
      if (showBag === 2 && !bagOption.address) {
        notification("Please Select Address First", "Warning");
      } else if (showBag === 3 && !bagOption.paymentThrough) {
        notification("Please Select Payment Option", "Warning");
      } else if (showBag < 3) {
        setShowBag(showBag + 1);
      }
      if (showBag === 3 && bagOption.paymentThrough) {
        console.log("Running");
        orderNow();
      }
    }
  };

  const fetchCoupon = async () => {
    await axios
      .get("/api/fetchCoupon")
      .then((response) => {
        // console.log(response.data.Data)
        setAllCoupon(response.data.Data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addCoupon = (curr) => {
    if (curr.Code === Discount_Allot.Coupon_ID) {
      setDiscount_Allot({Discount: "", Coupon_ID: ""});
    } else {
      setDiscount_Allot({...Discount_Allot, Discount: curr.Discount_Allot, Coupon_ID: curr.Code});
    }
    fetchGrandTotal();
  };

  useEffect(() => {
    setGrandTotal(GrandTotal - Discount_Allot.Discount);
  }, [Discount_Allot]);

  return (
    <>
      {showBag !== 0 ? (
        <div id="BagSliderContainer">
          <div id="BagSlider" ref={ref}>
            <div id="bag-back-btn">
              <MdOutlineArrowBackIos
                onClick={() => {
                  let a = showBag - 1;
                  if (showBag === "success") {
                    if (location.pathname.includes("/bag")) {
                      navigate(location.pathname.split("/bag")[0]);
                    }
                    setShowBag(0);
                    console.log(location.pathname);
                  } else {
                    showBag === "AddNewAddress" ? setShowBag(2) : setShowBag(a);
                  }
                }}
              />
              <h3>
                {showBag === 1 && "BAG"}
                {showBag === 2 && "Select address"}
                {showBag === "AddNewAddress" && "Enter complete adderess"}
                {showBag === 3 && "Select a payment method"}
              </h3>
            </div>
            {!userData && (
              <div id="RegiLogin">
                <p>100 Reward Points on new registration</p>
                <button id="Login-Register-BTN" onClick={() => navigate("/auth/login")}>
                  LOGIN/ REGISTER
                </button>
              </div>
            )}

            {userData ? (
              <>
                {!loading ? (
                  <div id="bagScroll">
                    {showBag === 1 && (
                      <>
                        {bagData?.length > 0 ? (
                          <>
                            <div id="orderProductDetails">
                              {bagData?.map((curr, ids) => {
                                let link = `/products/${curr?.Category}/${curr._id}`;
                                return (
                                  <Fragment key={ids}>
                                    <BagProductCard bag={curr} link={link} />
                                  </Fragment>
                                );
                              })}
                              <div id="Add-Coupon">
                                <button
                                  onClick={() => {
                                    if (showCoupon === "Hide") {
                                      setShowCoupon("Show");
                                      setShowDetail("bag-order-detail-hide");
                                    } else {
                                      setShowCoupon("Hide");
                                    }
                                  }}>
                                  Add Coupon
                                </button>
                                <div id="Add-Coupon-show" className={showCoupon}>
                                  <h5>Add Coupons: </h5>
                                  <table>
                                    <tbody>
                                      {AllCoupon.map((curr) => {
                                        // console.log()
                                        let used = false;
                                        used = userData.Coupon_Used.find((e) => e.Name === curr.Code);
                                        return (
                                          <tr id="coupons" className={used ? "used_Coupon" : ""}>
                                            <td>
                                              <button disabled={used} id={Discount_Allot.Coupon_ID === curr.Code ? "active" : ""} onClick={() => addCoupon(curr)}>
                                                {curr.Code}
                                              </button>
                                            </td>
                                            <td>
                                              <p>{curr.Description} </p>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            <OrderSummary bagData={bagData} Discount_Allot={Discount_Allot} Charges={Charges} GrandTotal={GrandTotal} />
                          </>
                        ) : (
                          <div id="productCart" style={{textAlign: "center", marginTop: "20px"}}>
                            No Item Found in Bag
                          </div>
                        )}
                      </>
                    )}
                    {showBag === 2 && <SelectAddress setShowBag={setShowBag} bagOption={bagOption} setBagOption={setBagOption} />}
                    {showBag === "AddNewAddress" && <AddNewAddress setShowBag={setShowBag} />}
                    {showBag === 3 && <PaymentOption bagOption={bagOption} setBagOption={setBagOption} />}
                    {showBag === "success" && <OrderStatus setShowBag={setShowBag} />}
                  </div>
                ) : (
                  <Oval height="40" width="60" color="black" wrapperStyle={{flex: 1, marginTop: "50px"}} wrapperClass="bagScroll loading" visible={true} ariaLabel="oval-loading" secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
                )}
              </>
            ) : (
              <div id="bagScroll" className="userNotLogin">
                <p>
                  Sorry,the <strong>ORDER</strong> and <strong>WISHLIST</strong> is restricted to registered users only.
                </p>
                <p>
                  please
                  <NavLink to="/auth/register"> register</NavLink> or <NavLink to="/auth/login">login</NavLink> to continue.
                </p>
              </div>
            )}

            {showBag !== "AddNewAddress" && userData && showBag !== "success" && bagData.length !== 0 && (
              <div id="Bag-Total-Price">
                <h4>Grand Total</h4>
                <h4>&#x20B9; {GrandTotal}</h4>
                <button style={bagData.length > 0 ? {} : {background: "grey"}} onClick={bagProcessess}>
                  {loadingBtn ? (
                    <Oval wrapperStyle={{flex: 1}} wrapperClass="bagScroll loading" visible={true} ariaLabel="oval-loading" height="30" color="white" secondaryColor="white" strokeWidth={4} strokeWidthSecondary={4} />
                  ) : (
                    <>
                      <p>NEXT</p>
                      <MdArrowRight />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div id="bagBTN">
          <FaShoppingBag onClick={() => setShowBag(showBag + 1)} />
          {bagData?.length > 0 && <p>{bagData?.length}</p>}
        </div>
      )}
    </>
  );
};

export default Bags;
