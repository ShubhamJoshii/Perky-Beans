import { FaRegBell } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import { BsSearch } from "react-icons/bs";
import userImg from "../assets/userpic.png";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
// import data from "../assets/data.json";
import { BarChart, DoughnutChart } from "../components/Charts";
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
    totalRevenue: 0,
    percentage_revenue: 0,
    totalUsers: 0,
    percentage_users: 0,
    TotalTransaction: 0,
    percentage_transaction: 0,
    Totalproducts: 0,
    percentage_products: 0
  });
  const [revenue, setRevenue] = useState({
    months: [],
    totalRevenue: []
  });
  const [Transaction, setTransaction] = useState({
    months: [], totalTransaction: []
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
      setCount(response.data);
    }).finally(() => {
      setTimeout(() => {
        setLoading(false);
      }, 5000)
    })
  };

  const fetchRevenueTransaction = async () => {
    setLoading(true);
    await axios.get("/api/fetchRevenueTransaction").then((response) => {
      let acc = {}
      let calRevenue = []
      let months = []
      let totalTransaction = []
      let totalRevenue = []
      response.data.orders.filter((e) => {
        const orderDate = new Date(e.orderedAt);
        const monthKey = `${(orderDate.toLocaleString('default', { month: 'long' }))} ${orderDate.getFullYear()}`;
        acc[monthKey] = (acc[monthKey] || 0) + 1;
        calRevenue[monthKey] = (calRevenue[monthKey] || 0) + e.TotalAmountPayed;
      })
      let sortedKeys = Object.keys(acc).sort().reverse();
      let sortedObject = sortedKeys.reduce((obj, key) => {
        obj[key] = acc[key];
        return obj;
      }, {});
      months = Object.keys(sortedObject);
      totalRevenue = Object.values(sortedObject)

      let sortedObject2 = sortedKeys.reduce((obj, key) => {
        obj[key] = calRevenue[key];
        return obj;
      }, {});
      totalTransaction = Object.values(sortedObject2)

      setTransaction({
        months: months, totalTransaction: totalTransaction
      })

      setRevenue({
        months: months, totalRevenue: totalRevenue
      })

      // console.log(sortedKeys.reverse())
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      // setLoading(false);
      setTimeout(() => {
        setLoading(false);
      }, 1000)
    })
  }

  useEffect(() => {
    fetchUsersProductsCount();
    fetchRevenueTransaction();
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
                <WidgetItem percent={count.percentage_revenue} amount={true} value={count.totalRevenue} heading="Revenue" color="rgb(0,115,255)" labels={["Today Revenue"]} />
                <WidgetItem percent={count.percentage_users} value={count.totalUsers} heading="Users" color="rgb(0 198 202)" labels={["New Users","Not New Users"]}/>
                <WidgetItem percent={count.percentage_transaction} value={count.TotalTransaction} heading="Transactions" color="rgb(255 196 0)" labels={["TodayTransaction"]}/>
                <WidgetItem percent={count.percentage_products} value={count.Totalproducts} heading="Products" color="rgb(76 0 255)" labels={["Available","Non-Available"]}/>
              </section>

              <section className="graph-container">
                <div className="revenue-chart">
                  <h2>Revenue & Transaction</h2>
                  {/* Grapph here */}
                  <BarChart data_1={revenue.totalRevenue} data_2={Transaction.totalTransaction} title_1="Revenue" title_2="Transaction" bgColor_1="rgb(0,115,255)" bgColor_2="rgba(53,162,235,0.8)" labels={Transaction.months} />
                </div>
              </section>
            </>
        }
      </main>
    </div>
  );
};

const WidgetItem = ({ heading, value, percent, color, amount = false ,labels = ["Sunday", "Monday"]}) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent >= 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{" "}
        </span>
      )}
    </div>

    {/* <div
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
    </div> */}
    <div
      className="widget-circle"
    >
      <DoughnutChart
        labels={labels}
        data={[percent, 100 - percent]}
        backgroundColor={[color, "#80808070"]}
        legends={false}
        offset={[0, 0, 0, 80]}
        cutout={"70%"}
      />
      <span
        style={{
          color,
        }}>
        {percent}%
      </span>
    </div>
  </article >
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
