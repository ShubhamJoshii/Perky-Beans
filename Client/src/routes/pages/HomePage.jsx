import Slider from "../../components/Landing/SliderImage/Slider";
import SearchBar from "../../components/Common/SearchBar";
import Frontproducts from "../../components/Landing/HomeProducts/HomeProducts";
import CustomerReview from "../../components/Landing/CustomerReview/CustomerReview";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import axios from "axios";
import { useEffect, useState } from "react";
const HomePage = () => {
  const [Review, setReview] = useState(null);
  const fetchReview = async () => {
    await axios.get("/api/fetchReview").then((response) => {
      // console.log(response.data);
      setReview(response.data);
    })
  }
  useEffect(() => {
    fetchReview();
  }, [])
  return (
    <>
      <Header />
      <Slider />
      <SearchBar position="-59" currPlace="home" />
      <Frontproducts />
      <CustomerReview Review={Review}/>
      <Footer />
    </>
  );
};

export default HomePage;
