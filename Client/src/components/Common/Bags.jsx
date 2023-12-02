import {useEffect, useRef, useState} from "react";
import {FaShoppingBag} from "react-icons/fa";
import {IoIosClose} from "react-icons/io";
import {MdOutlineArrowBackIos} from "react-icons/md";
import {RiArrowDropUpLine, RiArrowDropDownLine} from "react-icons/ri";
import {Oval} from "react-loader-spinner";
import {Notification, UserData} from "../../routes/App";
import {useContext} from "react";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
const Bags = () => {
  const [showBag, setShowBag] = useState(false);
  const [showAmountDetails, setShowAmountDetail] = useState(null);
  const {userData, setUserData} = useContext(UserData);
  const [category, setCategory] = useState(useParams());
  const {checkUserAlreadyLogin, notification} = useContext(Notification);
  const [loadingShow, setloadingShow] = useState(false);
  let GrandTotal = 0;
  const ref = useRef(null);
  const navigate = useNavigate();

  const [productsData, setProductsData] = useState([]);
  const fetchProducts = async () => {
    await axios.get("/api/fetchProduct").then((result) => {
      // console.log(result.data.data);
      setProductsData(result.data.data);
    }).catch((err) => {
      console.log("Error")
    })
  }

  useEffect(() => {
    fetchProducts();
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
    await axios.post("/api/removeFromBag", {productID: _id}).then((result) => {
      checkUserAlreadyLogin();
    });
  };

  const orderNow = async (_id) => {
    if (userData?.Bag?.length > 0) {
      setloadingShow(true);
      await axios.post("/api/orderNow").then((result) => {
        if (result.data === "Product Ordered") {
          notification(result.data);
          checkUserAlreadyLogin();
        }
        setloadingShow(false);
      });
    }
  };

  useEffect(() => {
    let a;
    Object.keys(category).length > 0 ? (a = userData?.Bag?.filter((e) => e.Category === category.categoryID || e._id === category.categoryID)) : (a = userData?.Bag);
    // setProducts(a);
  }, [category]);


  return (
    <>
      {showBag ? (
        <div id="BagSliderContainer">
          <div id="BagSlider" ref={ref}>
            <div id="bag-back-btn">
              <MdOutlineArrowBackIos onClick={() => setShowBag(!showBag)} />
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
              <div id="bagScroll">
                {userData?.Bag?.length > 0 ? (
                  <>
                    {userData?.Bag?.map((curr, ids) => {
                      const a = productsData.find((e) => e._id === curr.productID);
                      const smallPrice = (a.Price - 50) * curr.SmallCount;
                      const mediumPrice = a.Price * curr.MediumCount;
                      const largePrice = (a.Price + 50) * curr.LargeCount;
                      const Total = smallPrice + mediumPrice + largePrice;
                      GrandTotal += Total;
                      
                      // console.log(a);
                      let b = `/products/${a.Category}/${a._id}`;
                      
                      return (
                        <div id="productCart" key={ids} onClick={() => navigate(b)}>
                          <div id="productCartFront">
                            <img src={a.Product_Photo} alt="CardImage" />
                            <div id="productDetail">
                              <div id="productName">
                                <h3>{a.Product_Name}</h3>
                                <h4>
                                  Quantity: {curr.SmallCount > 0 && curr.SmallCount + "S,"} {curr.MediumCount > 0 && curr.MediumCount + "M,"} {curr.LargeCount > 0 && curr.LargeCount + "L,"}{" "}
                                </h4>
                              </div>
                              <h4>&#x20B9;{Total}</h4>
                              <div id="Icons">
                                <IoIosClose onClick={() => removeFromBag(curr.productID)} />
                                {showAmountDetails === ids ? <RiArrowDropUpLine onClick={() => setShowAmountDetail(null)} /> : <RiArrowDropDownLine onClick={() => setShowAmountDetail(ids)} />}
                              </div>
                            </div>
                          </div>
                          <div id="Amount_Info_Show" style={showAmountDetails === ids ? {height: "100%"} : {height: "0"}}>
                            <div id="Amount_INFO">
                              <h4>TOTAL :</h4>
                              <div>
                                <p>Regular {curr.SmallCount && "*" + curr.SmallCount}</p>
                                <p>Medium {curr.MediumCount && "*" + curr.MediumCount}</p>
                                <p>Large {curr.LargeCount && "*" + curr.LargeCount}</p>
                              </div>
                              <div>
                                <p>&#x20B9;{smallPrice}</p>
                                <p>&#x20B9;{mediumPrice}</p>
                                <p>&#x20B9;{largePrice}</p>
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
                  </>
                ) : (
                  <div id="productCart" style={{textAlign: "center"}}>
                    No Item Found in Bag
                  </div>
                )}
              </div>
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
            <div id="Bag-Total-Price">
              <h4>Grand Total : </h4>
              <h4>&#x20B9; {GrandTotal}</h4>
              <button style={userData?.Bag.length > 0 ? {} : {background: "grey"}} onClick={orderNow}>
                {loadingShow ? <Oval height="14" width="14" color="white" wrapperStyle={{}} wrapperClass="" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <>ORDER NOW</>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div id="bagBTN">
          <FaShoppingBag onClick={() => setShowBag(!showBag)} />
          {userData?.Bag.length > 0 && <p>{userData?.Bag.length}</p>}
        </div>
      )}
    </>
  );
};

export default Bags;
