import AdminSidebar from "../../components/AdminSidebar";
import { LineChart } from "../../components/Charts";


import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// const months = ["January","February","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      position: 'bottom',
      display: true,
      text: 'Revenue & Discount Chart',
    },
  },
};

const BarCharts = () => {
  const [orderDetails, setOrderDetails] = useState({ Discount: 0, TotalRevenue: 0 });
  const fetchOrders = async () => {
    let countsDiscount = {};
    let countsTotalRevenue = {};
    await axios.get('/api/fetchOrders').then((response) => {
      response.data.data.filter(e => {
        const { Discount, TotalAmountPayed } = e;
        const orderDate = new Date(e.orderedAt);
        const monthKey = `${(orderDate.toLocaleString('default', { month: 'long' }))} ${orderDate.getFullYear()}`;
        countsDiscount[monthKey] = (countsDiscount[monthKey] || 0) + Discount;
        countsTotalRevenue[monthKey] = (countsTotalRevenue[monthKey] || 0) + TotalAmountPayed;
      })
      let sortedKeys = Object.keys(countsDiscount).sort().reverse();
      let sortedObjectDiscount = sortedKeys.reduce((obj, key) => {
        obj[key] = countsDiscount[key];
        return obj;
      }, {});
      let sortedKeysRevenue = Object.keys(countsDiscount).sort().reverse();
      let sortedObjectRevenue = sortedKeysRevenue.reduce((obj, key) => {
        obj[key] = countsTotalRevenue[key];
        return obj;
      }, {});

      // months = Object.keys(sortedObject);
      // totalTransaction = Object.values(sortedObject)

      // console.log(sortedObjectDiscount, sortedObjectRevenue)
      setOrderDetails({ Discount: sortedObjectDiscount, TotalRevenue: sortedObjectRevenue })

    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    fetchOrders();
  }, [])

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h2>Line Charts</h2>
        {/* Total Prodcutn Total Revenu/ Discount Allot */}
        <section>

          <Line options={options} data={{
            labels: Object.keys(orderDetails?.TotalRevenue),
            datasets: [
              {
                fill: true,
                label: 'Discount Allot',
                data: Object.values(orderDetails?.Discount),
                borderColor: 'green',
                backgroundColor: 'lightgreen',
              },
              {
                fill: true,
                label: 'Total Revenue',
                data: Object.values(orderDetails?.TotalRevenue),
                borderColor: 'blue',
                backgroundColor: 'lightblue',
              },
            ],
          }} />
        </section>

        {/* 
        <section>
          <LineChart
            data={[
              200, 444, 444, 556, 778, 455, 990, 1444, 256, 447, 1000, 1200,
            ]}
            label="Users"
            borderColor="rgb(53, 162, 255)"
            backgroundColor="rgba(53, 162, 255,0.5)"
            labels={months}
          />
          <h2>Active Users</h2>
        </section>

        <section>
          <LineChart
            data={[40, 60, 244, 100, 143, 120, 41, 47, 50, 56, 32]}
            backgroundColor={"hsla(269,80%,40%,0.4)"}
            borderColor={"hsl(269,80%,40%)"}
            label="Products"
            labels={months}
          />
          <h2>Total Products (SKU)</h2>
        </section>

        <section>
          <LineChart
            data={[
              24000, 14400, 24100, 34300, 90000, 20000, 25600, 44700, 99000,
              144400, 100000, 120000,
            ]}
            backgroundColor={"hsla(129,80%,40%,0.4)"}
            borderColor={"hsl(129,80%,40%)"}
            label="Revenue"
            labels={months}
          />
          <h2>Total Revenue</h2>
        </section>

        <section>
          <LineChart
            data={[
              9000, 12000, 12000, 9000, 1000, 5000, 4000, 1200, 1100, 1500,
              2000, 5000,
            ]}
            backgroundColor={"hsla(29,80%,40%,0.4)"}
            borderColor={"hsl(29,80%,40%)"}
            label="Discount"
            labels={months}
          />
          <h2>Discount Allotted</h2>
        </section> */}
      </main>
    </div>
  );
};

export default BarCharts;
