import React, {useContext, useEffect} from "react";
import {AiFillStar, AiFillHeart} from "react-icons/ai";
import {BsFillBagFill} from "react-icons/bs";
import {NavLink} from "react-router-dom";
import {LuVegan} from "react-icons/lu";
import Veg from "../../assets/veg.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {Notification, UserData} from "../../routes/App";
import axios from "axios";
const ProductCard = ({product, category}) => {
  const {fetchBag, addToWishlist, bagData, wishlistData} = useContext(UserData);
  const {notification} = useContext(Notification);

  let link;
  if (category?.categoryID) {
    link = `./${product?._id}`;
  } else {
    link = `./${product?.Category}/${product?._id}`;
  }

  const addToBag = async (_id, SmallCount = 0, MediumCount = 1, LargeCount = 0) => {
    let a = bagData.find((temp) => temp.productID === _id);
    if (a) {
      await axios.post("/api/removeFromBag", {productID:_id}).then((result) => {
        notification(result.data, "Success");
        fetchBag();
      });
    } else {
      await axios
        .post("/api/updateBag", {
          productID: _id,
          SmallCount,
          MediumCount,
          LargeCount,
        })
        .then((result) => {
          notification(result.data, "Success");
          fetchBag();
        })
        .catch((err) => {
          notification(err.response.data.msg2, "Warning");
        });
    }
  };

  return (
    <div className="product-card">
      <div id="product-type">{product?.type ? <>{product?.type === "Veg" ? <img id="veg" src={Veg} alt="Veg" /> : <LuVegan id="LuVegan" />}</> : <Skeleton />}</div>
      <div id="product-img-BTN1">
        <div id="onhover-showBTN1">
          {product?.Product_Name ? (
            <>
              <p id="wishlist-para">WISHLIST</p>
              <AiFillHeart onClick={() => addToWishlist(product?._id)} className={wishlistData.find((e) => e.productID === product?._id) ? "active-Heart heart" : " heart"} />
            </>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      <div id="product-img-BTN2">
        <div id="onhover-showBTN2">
          {product?.Product_Name ? (
            <>
              <p id="bag-para">BAG</p>
              <BsFillBagFill onClick={() => addToBag(product?._id)} className={bagData.find((e) => e.productID === product?._id) ? "active-Bags bag" : "bag"} />
            </>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>

      <NavLink to={link} id="Product-Image-Link" onClick={() => window.scrollTo({top: 0, left: 0, behavior: "smooth"})}>
        {product?.Product_Photo ? <img src={product?.Product_Photo} alt={product?.Product_Name} className="product-image" /> : <Skeleton className="skeleton" />}
        <div className="product-info">
          <h5 className="product-name">{product?.Product_Name || <Skeleton />}</h5>

          <p className="product-desc">{product?.Description ? <>{product?.Description.slice(0, 60)}...</> : <Skeleton count={3} />}</p>
          <p className="product-price">{product?.Price ? <>&#8377;{product?.Price}</> : <Skeleton />}</p>
          <div id="rating">
            {product?.Rating ? (
              <>
                <AiFillStar id="A" />
                <p className="product-rating">{Number(product?.Rating).toFixed(1)}/5.0</p>
              </>
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default ProductCard;
