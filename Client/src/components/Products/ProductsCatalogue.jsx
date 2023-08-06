import React, { useEffect, useState } from "react";
import { Products } from "../../Data/ProductsJSON";
import { AiFillStar, AiFillHeart, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { BsFillBagFill } from "react-icons/bs";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { LuVegan } from "react-icons/lu";
import { useContext } from "react";
import { Notification, UserData } from "../../routes/App";
import axios from "axios";
import Veg from "../../assets/veg.png";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const ProductsCatalogue = () => {
  const [products, setProducts] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [cardPerPage, setCardPerPage] = useState(24);
  const [category, setCategory] = useState(useParams());
  const [count, setCount] = useState(0);
  const { checkUserAlreadyLogin } = useContext(Notification);
  const { userData, setUserData } = useContext(UserData);
  let lastIndex = currPage * cardPerPage;
  let firstIndex = lastIndex - cardPerPage;
  const location = useLocation();

  useEffect(() => {
    let a = [];
    if (location.state !== null) {
      let filterData = location.state;
      if (a.length <= 0) {
        Products?.filter((e) => {
          filterData.Category.filter((find) => {
            if (find.apiName === e.Category) {
              a.push(e);
            }
          });
        });
      }
      if (a.length <= 0) {
        Products.filter((e) => {
          filterData.Ingredients.filter((find) => {
            if (find.apiName === e.type) {
              a.push(e);
            }
          });
        });
      }
      if (a.length > 0 && filterData.Ingredients.length > 0) {
        let b = [];
        a.filter((e, id) => {
          filterData.Ingredients.filter((find) => {
            if (find.apiName === e.type) {
              b.push(e);
            }
          });
        });
        a = b;
      }
      if (a.length <= 0) {
        Products.filter((e) => {
          // console.log();
          if (e.Price <= parseInt(filterData.PriceRange)) {
            a.push(e);
          }
        });
      }
      if (a.length > 0) {
        let b = [];
        a.filter((e) => {
          if (e.Price <= parseInt(filterData.PriceRange)) {
            b.push(e);
          }
        });
        a = b;
      }
      if (a.length <= 0) {
        Products.filter((e) => {
          if (e.Star >= filterData.RatingUP) {
            a.push(e);
          }
        });
      }
      if (a.length > 0) {
        let b = [];
        a.filter((e) => {
          if (e.Star >= filterData.RatingUP) {
            b.push(e);
          }
        });
        a = b;
      }
      setProducts(a);
      setCurrPage(1);
    }else{
      setProducts(products);
    }
  }, [location]);

  useEffect(() => {
    let a;
    Object.keys(category).length > 0 ? (a = Products.filter((e) => e.Category === category.categoryID || e._id === category.categoryID)) : (a = Products);
    setProducts(a);
    // shuffleArray(Products);
  }, [category]);

  let pages = [];
  for (let i = 1; i <= Math.ceil(products.length / cardPerPage); i++) {
    pages.push(i);
  }

  const addToWishlist = async (_id) => {
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
        });
    }
  };

  const addToBag = async (_id) => {
    let b = userData.Bag.find((e) => e.productID === _id);
    if (b) {
      await axios.post("/api/removeFromBag", { productID: _id }).then((result) => {
        checkUserAlreadyLogin();
      });
    } else {
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
    <React.Fragment>
      <div className="products">
        {products.slice(firstIndex, lastIndex).map((product) => {
          let a;
          if (category.categoryID) {
            a = `./${product._id}`;
          } else {
            a = `./${product.Category}/${product._id}`;
          }
          return (
            <div className="product-card" key={product._id}>
              {product.type === "Veg" ? <img id="veg" src={Veg} alt="Veg" /> : <LuVegan id="LuVegan" />}
              <div id="product-img-BTN1">
                <div id="onhover-showBTN1">
                  <p id="wishlist-para">WISHLIST</p>
                  <AiFillHeart onClick={() => addToWishlist(product._id)} className={userData?.Wishlist.find((e) => e.productID === product._id) ? "active-Heart heart" : " heart"} />
                </div>
              </div>
              <div id="product-img-BTN2">
                <div id="onhover-showBTN2">
                  <p id="bag-para">BAG</p>
                  <BsFillBagFill onClick={() => addToBag(product._id)} className={userData?.Bag.find((e) => e.productID === product._id) ? "active-Bags bag" : "bag"} />
                </div>
              </div>
              <NavLink to={a} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}>
                {/* <div  className="product-image skeleton" ></div> */}
                <img src={product.Image} alt={product.Name} className="product-image skeleton" />
                <div className="product-info">
                  <h5 className="product-name">{product.Name}</h5>
                  <p className="product-desc">{product.Desc.slice(0, 60)}...</p>
                  <p className="product-price">&#x20B9;{product.Price}</p>
                  <div id="rating">
                    <AiFillStar id="A" />
                    <p className="product-rating">{product.Star.toFixed(1)}/5.0</p>
                  </div>
                </div>
              </NavLink>
            </div>
          );
        })}
      </div>
      <div id="pagination">
        {pages.length > 1 && (
          <>
            <div
              className="Pages"
              id={currPage === 1 ? "non-active-side-btn" : ""}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                if (currPage !== 1) {
                  setCount(count - 18);
                  setCurrPage(currPage - 1);
                }
              }}>
              <AiOutlineLeft />
            </div>
            {pages.map((curr, ids) => {
              // console.log(pages);
              return (
                <div
                  key={ids}
                  onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                    setCount(curr);
                    setCurrPage(ids + 1);
                  }}
                  className={ids + 1 === currPage ? "activePage Pages" : "Pages"}>
                  {ids + 1}
                </div>
              );
            })}
            <div
              className="Pages"
              id={currPage === pages.length ? "non-active-side-btn" : ""}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                if (currPage !== pages.length) {
                  setCount(count + 18);
                  setCurrPage(currPage + 1);
                }
              }}>
              <AiOutlineRight />
            </div>
          </>
        )}
      </div>
      {/* <Footer /> */}
    </React.Fragment>
  );
};

export default ProductsCatalogue;
