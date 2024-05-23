import React from "react";
import {AiFillStar, AiFillHeart} from "react-icons/ai";
import {TiMinus, TiPlus} from "react-icons/ti";
import {LuVegan} from "react-icons/lu";
import Veg from "../../assets/veg.png";
import axios from "axios";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {useState} from "react";
import Bags from "../Bag/Bags";
import {Notification, UserData} from "../../routes/App";
import {useContext} from "react";
import {Oval} from "react-loader-spinner";
import CustomerReview from "../Landing/CustomerReview/CustomerReview";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductPage = () => {
  const [Products, setProducts] = useState({Sizes: ["", "", ""]});
  const [loading, setLoading] = useState("Show");
  const [AddToBag, setAddToBag] = useState(false);
  const [Review, setReview] = useState(null);

  let itemShow = useParams().productID;
  const {userData, fetchBag, fetchWishList, addToWishlist, wishlistData} = useContext(UserData);
  const {notification} = useContext(Notification);

  const fetchProductDetails = async () => {
    setLoading("Show");
    let user_id = userData?._id;
    await axios
      .get(`/api/fetchProductDetails?_id=${itemShow}&user_id=${user_id}`)
      .then((response) => {
        setProducts({...response.data.data, Sizes: response.data.Sizes, total: response.data.total});
        setLoading("Hide");
        setReview(response.data.data.Reviews);
        fetchWishList();
      })
      .catch((err) => {
        setLoading("LoadBtnShow");
        console.log(err);
      });
  };

  const addProductQuantity = (name, count) => {
    if (count >= 0 && count <= 20) {
      let Sizes = Products.Sizes.map((item) => {
        if (item.name === name) {
          item.counter = count;
          return item;
        }
        return item;
      });
      let total = Sizes[0].price * Sizes[0].counter + Sizes[1].price * Sizes[1].counter + Sizes[2].price * Sizes[2].counter;
      setProducts({...Products, Sizes, total});
    }
  };

  const updateBag = async () => {
    if (Products.total > 0) {
      setAddToBag(true);
      await axios
        .post("/api/updateBag", {
          productID: Products._id,
          SmallCount: Products.Sizes[0].counter,
          MediumCount: Products.Sizes[1].counter,
          LargeCount: Products.Sizes[2].counter,
        })
        .then((result) => {
          console.log(result.data);
          notification(result.data, "Success");
          fetchBag();
        })
        .catch((err) => {
          notification(err.response.data.msg2, "Warning");
        })
        .finally(() => {
          setAddToBag(false);
        });
    }
  };

  useEffect(() => {
    itemShow && fetchProductDetails();
  }, [itemShow, userData]);

  // {loading === "Hide" ? (
  return (
    <React.Fragment>
      <Bags />
      <>
        <div className="products product-board">
          <div className="product-card" key={Products._id}>
            <div id="product-img-BTN1">
              <div id="onhover-showBTN1">
                <p id="wishlist-para">WISHLIST</p>
                <AiFillHeart onClick={() => addToWishlist(Products._id)} className={wishlistData?.find((e) => e.productID === Products._id) ? "active-Heart heart" : "heart"} />
              </div>
            </div>
            {Products?.Product_Photo ? <img className="product-image" src={Products.Product_Photo} alt={Products.Product_Photo} /> : <Skeleton  className="Skeleton" />}
            <div className="product-info">
              <h5 className="product-name">{Products?.Product_Name || <Skeleton />}</h5>
              <p className="product-price">{Products?.Price ? <>&#x20B9; {Products?.Price}</> : <Skeleton />}</p>
              <div className="product-star">
                {Products.Rating ? (
                  <>
                    <AiFillStar id="A" />
                    <p className="product-rating">{Number(Products.Rating)?.toFixed(1)}/5.0</p>
                  </>
                ) : (
                  <Skeleton />
                )}
              </div>
            </div>
          </div>
          <div className="product-board-desc">
            <h1>
              {Products.Product_Name ? (
                <>
                  {Products.Product_Name}
                  {Products.type === "Veg" ? <img id="veg" src={Veg} alt="Veg" /> : <LuVegan id="LuVegan" />}
                </>
              ) : (
                <Skeleton />
              )}
            </h1>
            <p>{Products.Description || <Skeleton count={8} />}</p>
            <div className="product-board-sizes">
              <h2>Select Sizes</h2>
              <div className="sizes">
                {Products.Sizes?.map((size, id) => {
                  return (
                    <div id={size.name} key={id}>
                      {Products.Product_Photo ? <img src={Products.Product_Photo} alt={Products.Product_Photo} /> : <Skeleton className="SkeltonSizes" />}
                      <p>{size.name || <Skeleton count={1} />}</p>
                      <p className="product-price">{size?.price ? <>&#x20B9; {size?.price}</> : <Skeleton />}</p>
                      <div className="counter">
                        <button
                          className="btn btn--minus"
                          onClick={() => {
                            addProductQuantity(size.name, size.counter - 1);
                          }}>
                          <TiMinus />
                        </button>
                        <p>{size.name}</p>
                        <span>{size.counter}</span>
                        <button
                          className="btn btn--plus"
                          onClick={() => {
                            addProductQuantity(size.name, size.counter + 1);
                          }}>
                          <TiPlus />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div id="totalorder">
                {Products.Product_Name ? (
                  <>
                    <div className="total">
                      <h1>Total Amount &#x20B9; {Products.total}</h1>
                    </div>
                    {AddToBag ? (
                      <button className="order">
                        <Oval height="18" width="18" color="white" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={8} strokeWidthSecondary={8} />
                      </button>
                    ) : (
                      <button className="order" style={Products.total > 0 ? {} : {background: "grey"}} onClick={updateBag}>
                        Add to Bag
                      </button>
                    )}
                  </>
                ) : (
                  <Skeleton />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* {Review.length > 0 && */}
        <CustomerReview Review={Review} />
      </>
    </React.Fragment>
  );
};
// ) : (
//   <>
//     {loading === "Show" ? (
//       <Oval height="40" width="60" color="white" wrapperStyle={{}} wrapperClass="products loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={4} strokeWidthSecondary={4} />
//     ) : (
//       <div className="products loadingBTN">
//         <p>Something went wrong</p>
//         <button onClick={fetchProductDetails}>Try again</button>
//       </div>
//     )}
//   </>
// )}

export default ProductPage;
