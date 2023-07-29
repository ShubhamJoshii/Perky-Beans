import Image1 from "../../assets/Beverages/image (1).png";
import {IoMdClose} from "react-icons/io";
// import { UserData } from "../../routes/App";
import axios from "axios";
import {useContext} from "react";
import {Notification} from "../../routes/App";
const WishlistCards = ({product, orderData, userData, setUserData}) => {
  const {checkUserAlreadyLogin} = useContext(Notification);

  const removeFromWishlist = async (_id) => {
    let b = userData.Wishlist.find((e) => e.productID === _id);
    if (b) {
      await axios.post("/api/removefromWishlist", {productID: _id}).then((result) => {
        checkUserAlreadyLogin();
      });
    }
  };

  const addToBag = async (_id) => {
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
        });
    }
  };

  return (
    <div id="WishList-Card">
      <img src={product?.Image} alt="ImageProduct" />
      <div id="productDesc">
        <h2>{product?.Name}</h2>
        <p>{product?.Desc.slice(0, 180)}...</p>
      </div>
      <h1>₹{product?.Price}</h1>
      <IoMdClose id="IconClose" onClick={() => removeFromWishlist(orderData.productID)} />
      <button onClick={() => addToBag(orderData.productID)}>Add to Bag</button>
    </div>
  );
};

export default WishlistCards;
