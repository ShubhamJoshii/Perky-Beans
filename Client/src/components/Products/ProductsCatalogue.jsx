import React, {useEffect, useState} from "react";
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";
import {useLocation, useParams} from "react-router-dom";
import {useContext} from "react";
import {Notification, UserData} from "../../routes/App";
import axios from "axios";
import {Oval} from "react-loader-spinner";
import ProductCard from "./ProductCard";

const ProductsCatalogue = () => {
  const pageLimit = 24;
  let arr = Array.from({length:pageLimit}, (curr,id) => {_id:id+1})
  const [products, setProducts] = useState(arr);
  const [currPage, setCurrPage] = useState(1);
  const [category, setCategory] = useState(useParams());
  const {fetchBag, fetchWishList, addToWishlist, bagData, wishlistData} = useContext(UserData);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState("Hide");
  const [pages, setPages] = useState(1);

  const location = useLocation();

  const fetchProducts = async () => {
    setProducts(arr);
    let filterData = location.state;
    if (location.state !== null && (filterData?.Category || filterData?.Ingredients || filterData?.PriceRange || filterData?.RatingUP)) {
      let Category = filterData?.Category?.toLocaleString();
      let Ingredients = filterData?.Ingredients?.toLocaleString();
      let PriceRange = filterData?.PriceRange;
      let RatingUP = filterData?.RatingUP;
      await axios
        .get(`/api/fetchProduct?page=${currPage}&limit=${pageLimit}&Category=${Category}&Ingredients=${Ingredients}&PriceRange=${PriceRange}&RatingUP=${RatingUP}&Available=true`)
        .then((response) => {
          setProducts(response.data.data);
          setPages(response.data.TotalproductsPages);
          if(response.data.TotalproductsPages < pageLimit*currPage){
            setCurrPage(1)
          }
          setLoading("Hide");
          fetchBag();
          fetchWishList();
        })
        .catch((err) => {
          setLoading("LoadBtnShow");
          console.log("Error");
        });
    } else {
      await axios
        .get(`/api/fetchProduct?page=${currPage}&limit=${pageLimit}&Available=true`)
        .then((response) => {
          setProducts(response.data.data);
          setPages(response.data.TotalproductsPages);
          setLoading("Hide");
          fetchBag();
          fetchWishList();
        })
        .catch((err) => {
          setLoading("LoadBtnShow");
          console.log("Error");
        });
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [location, productsData, currPage]);

  return (
    <>
      {loading === "Hide" ? (
        <>
          <div className="products">
            {products.map((product,id) => {
              return (
                <React.Fragment key={id}>
                  <ProductCard product={product} category={category}/>
                </React.Fragment>
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
                    window.scrollTo({top: 0, left: 0, behavior: "smooth"});
                    if (currPage !== 1) {
                      // setCount(count - 18);
                      setCurrPage(currPage - 1);
                    }
                  }}>
                  <AiOutlineLeft />
                </div>
                {pages.map((curr, ids) => {
                  return (
                    <div
                      key={ids}
                      onClick={() => {
                        window.scrollTo({top: 0, left: 0, behavior: "smooth"});
                        // setCount(curr);
                        setCurrPage(curr);
                      }}
                      className={ids + 1 === currPage ? "activePage Pages" : "Pages"}>
                      {curr}
                    </div>
                  );
                })}
                <div
                  className="Pages"
                  id={currPage === pages.length ? "non-active-side-btn" : ""}
                  onClick={() => {
                    window.scrollTo({top: 0, left: 0, behavior: "smooth"});
                    if (currPage !== pages.length) {
                      // setCount(count + 18);
                      setCurrPage(currPage + 1);
                    }
                  }}>
                  <AiOutlineRight />
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {loading === "Show" ? (
            <Oval height="40" width="60" color="white" wrapperStyle={{}} wrapperClass="products loading" visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={4} strokeWidthSecondary={4} />
          ) : (
            <div className="products loadingBTN">
              <p>Something went wrong</p>
              <button onClick={fetchProducts}>Try again</button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductsCatalogue;
