import {Notification} from "../../routes/App";
import {IoMdClose} from "react-icons/io";
import {useContext, useEffect, useState} from "react";
import {Oval} from "react-loader-spinner";
import axios from "axios";

const WishlistCards = ({product, orderData, userData, setUserData}) => {
  const [loadingShow, setloadingShow] = useState(false);
  const {checkUserAlreadyLogin} = useContext(Notification);

  // useEffect(()=>{
  //   console.log(product);
  // },[product])

  const removeFromWishlist = async (_id) => {
    let b = userData.Wishlist.find((e) => e.productID === _id);
    if (b) {
      await axios.post("/api/removefromWishlist", {productID: _id}).then((result) => {
        checkUserAlreadyLogin();
      });
    }
  };

  const addToBag = async (_id) => {
    setloadingShow(true);
    let b = userData.Bag.find((e) => e.productID === _id);
    if (!b) {
      await axios
        .post("/api/addtoBag", {
          productID: _id,
          SmallCount: 0,
          MediumCount: 1,
          LargeCount: 0,
        })
        .then((result) => {
          checkUserAlreadyLogin();
          setloadingShow(false);
        });
    }
    setTimeout(() => setloadingShow(false), 1000);
  };

  return (
    <div id="WishList-Card">
      <img src={product?.Product_Photo} alt="ImageProduct" />
      <div id="productDesc">
        <h2>{product?.Product_Name}</h2>
        <p>{product?.Description.slice(0, 180)}...</p>
      </div>
      <h1>₹{product?.Price}</h1>
      <IoMdClose id="IconClose" onClick={() => removeFromWishlist(orderData.productID)} />
      <button onClick={() => addToBag(orderData.productID)}>
        {loadingShow ? <Oval height="14" width="14" color="white" wrapperStyle={{}} wrapperClass="" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <>{userData?.Bag.find((e) => e.productID === orderData.productID) ? <> Added </> : <>Add to Bag </>}</>}
      </button>
    </div>
  );
};

export default WishlistCards;
