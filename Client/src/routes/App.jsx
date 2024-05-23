import { useState, createContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("../admin/pages/Dashboard"));
const Products = lazy(() => import("../admin/pages/Products"));
const Orders = lazy(() => import("../admin/pages/Orders"));
const Users = lazy(() => import("../admin/pages/Users"));
const NewProduct = lazy(() => import("../admin/pages/management/NewProduct"));
const ProductManagement = lazy(() => import("../admin/pages/management/ProductManagement"));
const ReserveTable = lazy(() => import("../admin/pages/ReserveTable"));
const TransactionManagement = lazy(() => import("../admin/pages/management/TransactionManagement"));
const Coupon = lazy(() => import("../admin/pages/apps/Coupon"));

const BarCharts = lazy(() => import("../admin/pages/charts/BarCharts"));
const LineCharts = lazy(() => import("../admin/pages/charts/LineCharts"));
const PieCharts = lazy(() => import("../admin/pages/charts/PieCharts"));

const Stopwatch = lazy(() => import("../admin/pages/apps/Stopwatch"));
// const Toss = lazy(() => import("../admin/pages/apps/Toss"));

const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ReserveTablePage = lazy(() => import("./pages/ReserveTablePage"));
const Login = lazy(() => import("../components/Signin_Register/Login"));
const Register = lazy(() => import("../components/Signin_Register/Register"));
const Preloader = lazy(() => import("../components/Common/Preloader"));
const PageNotFound = lazy(() => import("../components/PageNotFound/PageNotFound"));
const ForgotPassword = lazy(() => import("../components/Signin_Register/ForgotPassword"));
const About_us = lazy(() => import("../components/About Us/About_us"));
const TermsConditions = lazy (()=>import ("../routes/pages/TermsAndConditionsPage"))
const PrivacyPolicy = lazy (()=>import ("../routes/pages/PrivacyAndPolicyPage"))
const Loading = createContext();
const UserData = createContext();
const Notification = createContext();



const App = () => {
  const [userData, setUserData] = useState(null);
  const checkUserAlreadyLogin = async () => {
    await axios
      .get("/api/home")
      .then((result) => {
        if (result.status) {
          setUserData(result.data.data);
        }
      })
      .catch(() => { });
  };
  const [bagData, setBagData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);

  useEffect(() => {
    checkUserAlreadyLogin();
  }, []);

  const notification = (notiText, type) => {
    if (type === "Success") {
      toast.success(notiText, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (type === "Un-Success") {
      toast.error(notiText, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (type === "Warning") {
      toast.warn(notiText, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (type === "Info") {
      toast.info(notiText, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };


  const fetchBag = async () => {
    await axios.get("/api/fetchBag").then((response) => {
      if(response.data.result){
        setBagData(response.data.data);
      }
    }).catch((err) => {
      // console.log("Error")
    })
  }


  const fetchWishList = async () => {
    await axios.get("/api/fetchWishlist").then((response) => {
      setWishlistData(response.data.data);
    }).catch((err) => {
      // console.log("Error")
    })
  }

  const addToWishlist = async (_id) => {
    if (userData) {
      let b = wishlistData.find((e) => e.productID === _id);
      if (b) {
        await axios.post("/api/removefromWishlist", { productID: _id }).then((result) => {
          fetchWishList();
        });
      } else {
        await axios
          .post("/api/addToWishlist", {
            productID: _id,
          })
          .then((result) => {
            fetchWishList();
          });
      }
    } else {
      notification("Please Login Before Adding to Wishlist", "Warning");
    }
  };

  return (
    <Notification.Provider value={{ notification: notification, checkUserAlreadyLogin }}>
      <UserData.Provider value={{ userData,
        setUserData, fetchBag, fetchWishList, addToWishlist, bagData, wishlistData, setBagData }}>
        <ToastContainer />
        <Router>
          <Suspense fallback={<Preloader />}>
            {/* {loadingScreen && <Preloader />} */}
            {/* <Admin /> */}
            <Routes>

              <Route exact path="/" element={<HomePage />} />
              <Route exact path="/Products" element={<ProductsPage />} />
              <Route exact path="/Products/:categoryID" element={<ProductsPage />} />
              <Route exact path="/Products/:categoryID/bag/:status" element={<ProductsPage />} />
              <Route exact path="/Products/bag/:status" element={<ProductsPage />} />

              <Route exact path="/PrivacyPolicy" element={<PrivacyPolicy />} />
              <Route exact path="/Terms&Conditions" element={<TermsConditions />} />
              <Route exact path="/AboutUs" element={<About_us />} />
              <Route exact path="/Products/:categoryID/:productID" element={<ProductDetailsPage />} />

              <Route exact path="/Products/:categoryID/:productID/bag/:status" element={<ProductDetailsPage />} />
              <Route exact path="/Orders/:orders" element={<OrdersPage />} />
              <Route exact path="/Products/:categoryID" element={<ProductsPage />} />
              <Route exact path="/Orders/:orders/bag/:status" element={<OrdersPage />} />
              <Route exact path="/ReserveTable" element={<ReserveTablePage />} />
              <Route exact path="/ReserveTable/status/:status" element={<ReserveTablePage />} />
              <Route exact path="/Contact" element={<ContactPage />} />
              <Route exact path="/auth/login" element={<Login />} />
              <Route exact path="/auth/Register" element={<Register />} />
              <Route exact path="/auth/login/forgetpassword" element={<ForgotPassword />} />

              {
                userData?.Role === "Admin" &&
                <>
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/product" element={<Products />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/admin/Orders" element={<Orders />} />
                  <Route path="/admin/reserve-table" element={<ReserveTable />} />
                  {/* Charts */}

                  <Route path="/admin/chart/bar" element={<BarCharts />} />
                  <Route path="/admin/chart/pie" element={<PieCharts />} />
                  <Route path="/admin/chart/line" element={<LineCharts />} />

                  {/* Apps */}

                  <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
                  <Route path="/admin/app/coupon" element={<Coupon />} />
                  {/* <Route path="/admin/app/toss" element={<Toss />} /> */}

                  {/* Management */}

                  <Route path="/admin/product/new" element={<NewProduct />} />
                  <Route path="/admin/product/:productId" element={<ProductManagement />} />
                  <Route path="/admin/transaction/:transactionId" element={<TransactionManagement />} />
                </>
              }
              <Route exact path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </UserData.Provider>
    </Notification.Provider>
  );
};
export default App;
export { Loading, UserData, Notification };
