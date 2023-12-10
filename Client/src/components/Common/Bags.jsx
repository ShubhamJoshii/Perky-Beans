import { useEffect, useRef, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { RiArrowDropUpLine, RiArrowDropDownLine } from "react-icons/ri";
import { Oval } from "react-loader-spinner";
import { Notification, UserData } from "../../routes/App";
import { useContext } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Bags = () => {
  const [showBag, setShowBag] = useState(false);
  const [showAmountDetails, setShowAmountDetail] = useState(null);
  const { userData, fetchBag, bagData, } = useContext(UserData);
  const [category, setCategory] = useState(useParams());
  const { checkUserAlreadyLogin, notification } = useContext(Notification);
  const [loading, setLoading] = useState(true);
  const [loadingShow, setloadingShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [Charges, setCharge] = useState({
    Delivery_Charge: 0,
    GST: 0
  })
  const [showCoupon,setShowCoupon] = useState("Hide");
  const [GrandTotal, setGrandTotal] = useState(0);
  const [AllCoupon, setAllCoupon] = useState([]);
  const [Discount_Allot, setDiscount_Allot] = useState({
    Discount:0,
    Coupon_ID:""
  });

  const ref = useRef(null);
  const navigate = useNavigate();

  const [productsData, setProductsData] = useState([]);

  const fetchGrandTotal = () => {
    let Total = 0;
    let Delivery_Charge = 0;
    let GST = 0;
    // let Discount = Charges.Discount;
    bagData?.map((curr, ids) => {
      const a = productsData?.find((e) => e._id === curr.productID);
      const smallPrice = (a?.Price - 50) * curr.SmallCount;
      const mediumPrice = a?.Price * curr.MediumCount;
      const largePrice = (a?.Price + 50) * curr.LargeCount;
      Total += smallPrice + mediumPrice + largePrice;
    })
    GST = Total * 18 / 100;
    Total > 500 || Total === 0 ? Delivery_Charge = 0 : Delivery_Charge = 40;
    setCharge({...Charges, GST, Delivery_Charge });
    setGrandTotal(Total + Delivery_Charge);
  }

  const fetchProducts = async () => {
    setLoading(true);
    await axios.post("/api/fetchProduct", { Available: true }).then((result) => {
      setProductsData(result.data.data);
      fetchBag();
    }).catch((err) => {
      console.log("Error")
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchGrandTotal();
  }, [productsData, bagData])

  useEffect(() => {
    fetchProducts();
    fetchCoupon();
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowBag(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [showBag]);

  const removeFromBag = async (_id) => {
    await axios.post("/api/removeFromBag", { productID: _id }).then((result) => {
      fetchBag();
    });
  };

  const orderNow = async (_id) => {
    if (bagData.length > 0) {
      setloadingShow(true);
      await axios.post("/api/orderNow", { ...Charges, TotalAmountPayed: GrandTotal, ...Discount_Allot }).then((result) => {
        if (result.data === "Product Ordered") {
          notification(result.data, "Success");
          fetchBag();
        }
      }).finally(() => {
        setloadingShow(false);
      })
    }
  };

  const fetchCoupon = async () => {
    await axios.get("/api/fetchCoupon").then((response) => {
      // console.log(response.data.Data)
      setAllCoupon(response.data.Data)
    }).catch((err) => {
      console.log(err)
    })
  }


  useEffect(() => {
    let a;
    Object.keys(category).length > 0 ? (a = userData?.Bag?.filter((e) => e.Category === category.categoryID || e._id === category.categoryID)) : (a = userData?.Bag);
    // setProducts(a);
  }, [category]);

  const addCoupon = (curr) => {
    if(curr.Code === Discount_Allot.Coupon_ID){
      setDiscount_Allot({Discount:"",Coupon_ID:""})
    }else{
      setDiscount_Allot({...Discount_Allot,Discount:curr.Discount_Allot,Coupon_ID:curr.Code})
    }
    fetchGrandTotal();
  }

  useEffect(()=>{
    // console.log(Discount_Allot)
    setGrandTotal(GrandTotal - Discount_Allot.Discount)
  },[Discount_Allot])

  return (
    <>
      {showBag ? (
        <div id="BagSliderContainer">
          <div id="BagSlider" ref={ref}>
            <div id="bag-back-btn">
              <MdOutlineArrowBackIos onClick={() => { setShowBag(!showBag) }} />
              <h3>BAG</h3>
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
                {
                  !loading ?
                    <div id="bagScroll">
                      {bagData?.length > 0 ? (
                        <>
                          {bagData?.map((curr, ids) => {
                            const a = productsData?.find((e) => e._id === curr.productID);
                            const smallPrice = (a?.Price - 50) * curr.SmallCount;
                            const mediumPrice = a?.Price * curr.MediumCount;
                            const largePrice = (a?.Price + 50) * curr.LargeCount;
                            const Total = smallPrice + mediumPrice + largePrice;
                            // GrandTotal += Total;
                            // setGrandTotal((prev) => prev + Total);

                            // console.log(a);
                            let b = `/products/${a?.Category}/${a._id}`;

                            return (
                              <div id="productCart" key={ids} onClick={() => navigate(b)}>
                                <div id="productCartFront">
                                  <img src={a.Product_Photo} alt="CardImage" />
                                  <div id="productDetail">
                                    <div id="productName">
                                      <h3>{a.Product_Name}</h3>
                                      <h4>
                                        Quantity: {curr.SmallCount > 0 && curr.SmallCount + "S "} {curr.MediumCount > 0 && curr.MediumCount + "M "} {curr.LargeCount > 0 && curr.LargeCount + "L"}{" "}
                                      </h4>
                                    </div>
                                    <h4>&#x20B9;{Total}</h4>
                                    <div id="Icons">
                                      <IoIosClose onClick={() => removeFromBag(curr.productID)} />
                                      {showAmountDetails === ids ? <RiArrowDropUpLine onClick={() => setShowAmountDetail(null)} /> : <RiArrowDropDownLine onClick={() => setShowAmountDetail(ids)} />}
                                    </div>
                                  </div>
                                </div>
                                <div id="Amount_Info_Show" style={showAmountDetails === ids ? { height: "100%" } : { height: "0" }}>
                                  <div id="Amount_INFO">
                                    <h4>TOTAL :</h4>
                                    <div>
                                      {curr.SmallCount > 0 && <p>Regular  x  {curr.SmallCount} </p>}
                                      {curr.MediumCount > 0 && <p>Medium  x  {curr.MediumCount} </p>}
                                      {curr.LargeCount > 0 && <p>Large  x  {curr.LargeCount} </p>}
                                    </div>
                                    <div>
                                      {curr.SmallCount > 0 && <p>&#x20B9;{smallPrice}</p>}
                                      {curr.MediumCount > 0 && <p>&#x20B9;{mediumPrice}</p>}
                                      {curr.LargeCount > 0 && <p>&#x20B9;{largePrice}</p>}
                                    </div>
                                  </div>
                                  <div id="TotalAmt">
                                    <p>You Pay :</p>
                                    <p>&#x20B9;{Total}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div id="Add-Coupon">
                            <button onClick={() => {
                              if(showCoupon === "Hide"){
                                setShowCoupon("Show");
                                setShowDetail("bag-order-detail-hide");
                              }else{
                                setShowCoupon("Hide");
                              }
                            }}>Add Coupon</button>
                            <div id="Add-Coupon-show"  className={showCoupon}>
                              <h5>Add Coupons: </h5>
                              <table>
                                <tbody>
                                  {
                                    AllCoupon.map((curr) => {
                                      // console.log()
                                      let used = false;
                                      used =userData.Coupon_Used.find(e => e.Name === curr.Code)
                                      return (
                                        <tr id="coupons" className={used ? "used_Coupon" : ""} >
                                          <td><button disabled={used}  id={Discount_Allot.Coupon_ID === curr.Code ? "active" : ""} onClick={() => addCoupon(curr)}>{curr.Code}</button></td>
                                          <td><p>{curr.Description}  </p></td>
                                        </tr>
                                      )
                                    })
                                  }
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div id="productCart" style={{ textAlign: "center" }}>
                          No Item Found in Bag
                        </div>
                      )}

                    </div>
                    :
                    <Oval height="40" width="60" color="black" wrapperStyle={{ flex: 1, marginTop: "50px" }} wrapperClass="bagScroll loading" visible={true} ariaLabel="oval-loading" secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
                }

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
            <div id={"bag-order-detail"} className={showDetail}>
              <h4>Order Summary</h4>
              <table>
                {bagData?.map((curr, ids) => {
                  const a = productsData?.find((e) => e._id === curr.productID);
                  const smallPrice = (a?.Price - 50) * curr.SmallCount;
                  const mediumPrice = a?.Price * curr.MediumCount;
                  const largePrice = (a?.Price + 50) * curr.LargeCount;
                  const Total = (smallPrice + mediumPrice + largePrice) * (100 - 18) / 100;
                  // GrandTotal += Total;

                  return (
                    <tr>
                      <td>{a.Product_Name}</td>
                      <td>&#x20B9; {Total}</td>
                    </tr>
                  )
                })}
                <tr>
                  <td>Delivery Charges: </td>
                  <td>&#x20B9; {Charges.Delivery_Charge < 0 && "-" } {Charges.Delivery_Charge}</td>
                </tr>
                <tr>
                  <td>GST: </td>
                  <td>&#x20B9; {Charges.GST}</td>
                </tr>
                <tr>
                  <td>Discount: </td>
                  <td>&#x20B9; {Charges.Discount > 0 && "-" } {Discount_Allot.Discount}</td>
                </tr>
                <tr>
                  <td>Order Total:</td>
                  <td>&#x20B9; {GrandTotal}</td>
                </tr>
              </table>
            </div>

            <div id="Bag-Total-Price">
              <h4>Grand Total
                {
                  bagData.length > 0 &&
                  <span onClick={() => {
                    if(showDetail === "bag-order-detail-show"){
                      setShowDetail("bag-order-detail-hide");
                    }else{
                      setShowDetail("bag-order-detail-show")
                      setShowCoupon("Hide")
                    }
                    }}> (Details)</span>
                }
              </h4>
              <h4>&#x20B9; {GrandTotal}</h4>
              <button style={bagData.length > 0 ? {} : { background: "grey" }} onClick={orderNow}>
                {loadingShow ? <Oval height="14" width="14" color="white" wrapperStyle={{}} wrapperClass="" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <>ORDER NOW</>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div id="bagBTN">
          <FaShoppingBag onClick={() => setShowBag(!showBag)} />
          {bagData?.length > 0 && <p>{bagData?.length}</p>}
        </div>
      )}
    </>
  );
};

export default Bags;
