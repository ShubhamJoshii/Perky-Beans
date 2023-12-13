import { FaRegBell } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import { BsSearch } from "react-icons/bs";
import userImg from "../assets/userpic.png";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
// import data from "../assets/data.json";
import { BarChart } from "../components/Charts";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Notification } from "../../routes/App";
import { Oval } from "react-loader-spinner";
// import { BarChart, DoughnutChart } from "../components/Charts";
// import { BiMaleFemale } from "react-icons/bi";
// import Table from "../components/DashboardTable";

const dashboard = () => {
  const [dropDownShow, setdropDownShow] = useState(false);
  const { notification } = useContext(Notification);
  const [count, setCount] = useState({
    Totalproducts: 0,
    totalUsers: 0,
    TotalAvailableproducts: 0,
    TotalAvailableUsers: 0,
    TotalTransaction: 0,
    totalTodayTransaction: 0,
    totalRevenue: 0,
    totalTodayRevenue: 0
  });
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const logoutBTN = async () => {
    // setLoadingShow(true);
    await axios.get("/api/logout").then((result) => {
      if (result.data) {
        navigate("/");
        notification(result.data, "Success");
        setUserData(null);
        setdropDownShow(false);
      }
    });
    setTimeout(() => {
      setLoadingShow(false);
    }, 1000);
  };

  const fetchUsersProductsCount = async () => {
    setLoading(true);
    await axios.get("/api/fetchUsersProductsCount").then((response) => {
      // console.log(response.data)
      console.log(response.data)
      setCount(response.data);
    }).finally(() => {
      setLoading(false);
    })
  };

  useEffect(() => {
    fetchUsersProductsCount();
  }, []);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for data, users, docs" />
          <FaRegBell />
          <img src={userImg} alt="User" onClick={() => setdropDownShow(!dropDownShow)} />
        </div>
        {dropDownShow && (
          <div id="logoutBUTTON">
            <p>
              <NavLink to="/">HOME</NavLink>
            </p>
            <p>
              <button onClick={logoutBTN}>LOGOUT</button>
            </p>
          </div>
        )}
        {
          loading ?
            <Oval height="40" width="60" color="black" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
            :
            <>
              <section className="widget-container">
                <WidgetItem percent={count.percentage_revenue} amount={true} value={count.totalRevenue} heading="Revenue" color="rgb(0,115,255)" />
                <WidgetItem percent={count.percentage_users} value={count.totalUsers} heading="Users" color="rgb(0 198 202)" />
                <WidgetItem percent={count.percentage_transaction} value={count.TotalTransaction} heading="Transactions" color="rgb(255 196 0)" />
                <WidgetItem percent={count.percentage_products} value={count.Totalproducts} heading="Products" color="rgb(76 0 255)" />

                {/* <WidgetItem percent={((count.totalRevenue - count.totalTodayRevenue ) / count.totalTodayRevenue * 100).toFixed(1)} amount={true} value={count.totalRevenue} heading="Revenue" color="rgb(0,115,255)" />
                <WidgetItem percent={((count.totalUsers - count.TotalAvailableUsers) / count.TotalAvailableUsers * 100).toFixed(1)} value={count.totalUsers} heading="Users" color="rgb(0 198 202)" />
                <WidgetItem percent={((count.TotalTransaction - count.totalTodayTransaction) / count.totalTodayTransaction * 100).toFixed(1)} value={count.TotalTransaction} heading="Transactions" color="rgb(255 196 0)" />
                <WidgetItem percent={(count.TotalAvailableproducts / count.Totalproducts * 100).toFixed(1)} value={count.Totalproducts} heading="Products" color="rgb(76 0 255)" /> */}
              </section>

              {/* <section className="graph-container">
                  <div className="revenue-chart">
                    <h2>Revenue & Transaction</h2>
                    Grapph here
                    <BarChart data_2={[300, 144, 433, 655, 237, 755, 190]} data_1={[200, 444, 343, 556, 778, 455, 990]} title_1="Revenue" title_2="Transaction" bgColor_1="rgb(0,115,255)" bgColor_2="rgba(53,162,235,0.8)" />
                    </div>
                  </section> */}
            </>
        }
      </main>
    </div>
  );
};

const WidgetItem = ({ heading, value, percent, color, amount = false }) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `$${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(0, 0, 0) 0
        )`,
      }}>
      <span
        style={{
          color,
        }}>
        {percent}%
      </span>
    </div>
  </article>
);

const CategoryItem = ({ color, value, heading }) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default dashboard;
