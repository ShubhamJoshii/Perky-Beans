import React, {useState, useEffect} from "react"
import axios from "axios"
import AdminSidebar from "../../components/AdminSidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import { BarChart } from "../../components/Charts";
// const months = ["January","February","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      position: 'bottom',
      display: true,
      text: 'Orders throughout the year Bar Chart',
    },
  },
};

const BarCharts = () => {
  const [OrderDetails,setOrderDetails] = useState({Orders:""});
  const fetchOrders = async () => {
    let countsOrders = {};
    await axios.get('/api/fetchOrders').then((response) => {
      response.data.data.filter(e => {
        const orderDate = new Date(e.orderedAt);
        const monthKey = `${(orderDate.toLocaleString('default', { month: 'long' }))} ${orderDate.getFullYear()}`;
        countsOrders[monthKey] = (countsOrders[monthKey] || 0) + 1;
      })
      let sortedKeys = Object.keys(countsOrders).sort().reverse();
      let sortedObjectDiscount = sortedKeys.reduce((obj, key) => {
        obj[key] = countsOrders[key];
        return obj;
      }, {});
      // console.log(sortedObjectDiscount)
      setOrderDetails({Orders:sortedObjectDiscount})
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(()=>{
    fetchOrders();
  },[])

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h2>Bar Charts Representative</h2>
        {/* <section>
          <BarChart
            data_1={[200, 444, 343, 556, 778, 455, 990]}
            data_2={[300, 144, 433, 655, 237, 755, 190]}
            title_1="Products"
            title_2="Users"
            bgColor_1={`hsl(260,50%,30%)`}
            bgColor_2={`hsl(360,90%,90%)`}
          />
          <h2>Top Selling Products & Top Customers</h2>
        </section> */}
        <section>
            <Bar options={options} data={{
              labels:Object.keys(OrderDetails?.Orders),
              datasets: [
                {
                  label: 'Products',
                  data: Object.values(OrderDetails?.Orders),
                  borderColor: 'rgb(53, 162, 235)',
                  backgroundColor: 'hsl(180, 40%, 50%)',
                },
              ],
            }} />
            {/* <h2>Orders throughout the year</h2> */}
        </section>
      </main>
    </div>
  );
};

export default BarCharts;
