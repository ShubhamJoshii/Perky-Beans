import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import {Products} from "../../Data/ProductsJSON";
import Bags from "../../components/Bag/Bags";
import ProductPage from "../../components/Products/ProductPage";
import CustomerReview from "../../components/Landing/CustomerReview/CustomerReview";
import Footer from "../../components/Footer/Footer";
import PageNotFound from "../../components/PageNotFound/PageNotFound";
import Header from "../../components/Header/Header";
import axios from "axios";

const ProductDetailsPage = () => {
  const [itemDetails, setItemDetails] = useState({});

  let itemShow = useParams().productID;

  const fetchProductDetails = async () => {
    await axios.get(`/api/fetchProductDetails?_id=${itemShow}`).then((response) => {
      setItemDetails(response.data.data)
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    itemShow && fetchProductDetails();
  }, [itemShow]);

  return (
    <>
      <Header />
      {/* <Bags />
      {itemDetails && <ProductPage /> ? (
        <> */}
      <ProductPage />
      {/* <CustomerReview />
        </>
      ) : (
        <PageNotFound />
      )} */}
      <Footer />
    </>
  );
};

export default ProductDetailsPage;
