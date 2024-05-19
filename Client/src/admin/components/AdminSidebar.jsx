import { useEffect, useState } from "react";
import logo from "../assets/PerkyBeansLogoBlack12.png";
import { AiFillFileText } from "react-icons/ai";
import { FaChartBar, FaChartLine, FaChartPie, FaGamepad, FaStopwatch } from "react-icons/fa";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoIosPeople } from "react-icons/io";
import { RiCoupon3Fill, RiDashboardFill, RiShoppingBag3Fill } from "react-icons/ri";
import { Link, NavLink, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [phoneActive, setPhoneActive] = useState(window.innerWidth < 1100);

  const resizeHandler = () => {
    setPhoneActive(window.innerWidth < 1100);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
      {/* {phoneActive && (
        <button id="hamburger" onClick={() => setShowModal(true)}>
          <HiMenuAlt4 />
        </button>
      )} */}

      <aside
        className="SideBar"
        style={
          // phoneActive  ?
             {
              left: showModal ? "0" : "-20rem",
            }
            // : {}
        }
        >

        <h2 id="logo">
          <NavLink to="/">
            <img src={logo} alt="logo" />
          </NavLink>
          {/* {phoneActive && ( */}
            <button id="hamburger" onClick={() => setShowModal(!showModal)}>
              <HiMenuAlt4 />
            </button>
          {/* )} */}
        </h2>
        <DivOne location={location} />
        <DivTwo location={location} />
        <DivThree location={location} />

        {phoneActive && (
          <button id="close-sidebar" onClick={() => setShowModal(false)}>
            Close
          </button>
        )}
      </aside>
    </>
  );
};

const DivOne = ({ location }) => (
  <div>
    <h5>Dashboard</h5>
    <ul>
      <Li url="/admin/dashboard" text="Dashboard" Icon={RiDashboardFill} location={location} />
      <Li url="/admin/product" text="Products" Icon={RiShoppingBag3Fill} location={location} />
      <Li url="/admin/users" text="Users" Icon={IoIosPeople} location={location} />
      <Li url="/admin/Orders" text="Orders" Icon={AiFillFileText} location={location} />
      <Li url="/admin/reserve-table" text="Reserve Table" Icon={AiFillFileText} location={location} />
    </ul>
  </div>
);

const DivTwo = ({ location }) => (
  <div>
    <h5>Charts</h5>
    <ul>
      <Li url="/admin/chart/bar" text="Bar" Icon={FaChartBar} location={location} />
      <Li url="/admin/chart/pie" text="Pie" Icon={FaChartPie} location={location} />
      <Li url="/admin/chart/line" text="Line" Icon={FaChartLine} location={location} />
    </ul>
  </div>
);

const DivThree = ({ location }) => (
  <div>
    <h5>Apps</h5>
    <ul>
      {/* <Li url="/admin/app/stopwatch" text="Stopwatch" Icon={FaStopwatch} location={location} /> */}
      <Li url="/admin/app/coupon" text="Coupon" Icon={RiCoupon3Fill} location={location} />
      {/* <Li url="/admin/app/toss" text="Toss" Icon={FaGamepad} location={location} /> */}
    </ul>
  </div>
);

const Li = ({ url, text, location, Icon }) => (
  <li
    style={{
      backgroundColor: location.pathname.includes(url) ? "rgba(0,115,255,0.1)" : "white",
    }}>
    <Link
      to={url}
      style={{
        color: location.pathname.includes(url) ? "rgb(0,115,255)" : "black",
      }}>
      <Icon />
      {text}
    </Link>
  </li>
);

export default AdminSidebar;
