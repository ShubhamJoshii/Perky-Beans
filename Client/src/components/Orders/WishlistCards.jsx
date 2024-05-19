import {Notification} from "../../routes/App";
import {IoMdClose} from "react-icons/io";
import {useContext, useEffect, useState} from "react";
import {Oval} from "react-loader-spinner";
import axios from "axios";
import { UserData } from "../../routes/App";
const WishlistCards = ({product, userData, setUserData}) => {
  const [loadingShow, setloadingShow] = useState(false);
  const {checkUserAlreadyLogin} = useContext(Notification);
  const {fetchWishList,wishlistData,fetchBag} = useContext(UserData);
  
  const removeFromWishlist = async (_id) => {
    let b = wishlistData.find((e) => e.productID === _id);
    if (b) {
      await axios.post("/api/removefromWishlist", {productID: _id}).then((result) => {
        fetchWishList();
      });
    }
  };

  const addToBag = async (_id) => {
    setloadingShow(true);
    let b = userData.Bag.find((e) => e.productID === _id);
    if (!b) {
      await axios
        .post("/api/updateBag", {
          productID: _id,
          SmallCount: 0,
          MediumCount: 1,
          LargeCount: 0,
        })
        .then((result) => {
          // checkUserAlreadyLogin();
          setloadingShow(false);
          removeFromWishlist(_id);
          fetchBag();
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
      <IoMdClose id="IconClose" onClick={() => removeFromWishlist(product.productID)} />
      <button onClick={() => addToBag(product.productID)}>
        {loadingShow ? <Oval height="14" width="14" color="white" wrapperStyle={{}} wrapperClass="" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={6} strokeWidthSecondary={6} /> : <>{userData?.Bag.find((e) => e.productID === product.productID) ? <> Added </> : <>Add to Bag </>}</>}
      </button>
    </div>
  );
};

export default WishlistCards;
