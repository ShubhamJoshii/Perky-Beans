import AdminSidebar from "../../components/AdminSidebar";
import { DoughnutChart, PieChart } from "../../components/Charts";
import { categories } from "../../assets/data.json";
import axios from "axios";
import { useEffect, useState } from "react";

const PieCharts = () => {
  const [ordersPie, setOrderPie] = useState({});
  const [categoryPie, setCategoryPie] = useState({});
  const [usersRolePie, setusersRolePie] = useState({});
  const [productAvailabilityPie, setProductAvailabilityPie] = useState({});

  const fetchOrders = async () => {
    let counts = {};
    await axios.get('/api/fetchOrders').then((response) => {
      response.data.data.filter(e => {
        const { status } = e;
        counts[status] = (counts[status] || 0) + 1;
      })
      setOrderPie(counts);
    }).catch((err) => {
      console.log(err);
    })
  }
  const fetchProduct = async () => {
    let counts = {};
    let countsAvailable = {};
    await axios.get('/api/fetchProduct').then((response) => {
      response.data.data.filter(e => {
        const { Category, Available } = e;
        counts[Category] = (counts[Category] || 0) + 1;
        countsAvailable[Available ? "Available" : "Non-Available"] = (countsAvailable[Available ? "Available" : "Non-Available"] || 0) + 1;
      })
      // console.log(countsAvailable);
      setCategoryPie(counts);
      setProductAvailabilityPie(countsAvailable);
    }).catch((err) => {
      console.log(err);
    })
  }

  const fetchUsers = async () => {
    let counts = {};
    await axios.get("/api/fetchUsers").then((response) => {
      response.data.data.filter(e => {
        const { Role } = e;
        counts[Role] = (counts[Role] || 0) + 1;
      })
      setusersRolePie(counts);
    }).catch((err) => {
      console.log("Error")
    })
  }


  useEffect(() => {
    fetchOrders();
    fetchProduct();
    fetchUsers();
  }, [])
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h2>Pie Representative</h2>
        <section>
          <div>
            <h2>Order Fulfillment Ratio</h2>
            <DoughnutChart
              labels={Object.keys(ordersPie)}
              data={Object.values(ordersPie)}
              backgroundColor={[
                `teal`,
                `red`,
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ]}
              legends={false}
              offset={[0, 0, 50]}
            />
          </div>

          <div>
            <h2>Product Categories Ratio</h2>
            <DoughnutChart
              labels={Object.keys(categoryPie)}
              data={Object.values(categoryPie)}
              backgroundColor={[
                'rgb(255, 205, 86)',
                `teal`,
                'rgb(255, 99, 132)',
                `red`,
                'rgb(54, 162, 235)',
              ]}
              legends={false}
              offset={[0, 0, 0, 80]}
            />
          </div>

          <div>
            <h2>Products Availability</h2>
            <DoughnutChart
              labels={Object.keys(productAvailabilityPie)}
              data={Object.values(productAvailabilityPie)}
              backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
              legends={false}
              offset={[0, 80]}
              cutout={"60%"}
            />
          </div>

          {/* 
          <div>
            <DoughnutChart
              labels={[
                "Marketing Cost",
                "Discount",
                "Burnt",
                "Production Cost",
                "Net Margin",
              ]}
              data={[32, 18, 5, 20, 25]}
              backgroundColor={[
                "hsl(110,80%,40%)",
                "hsl(19,80%,40%)",
                "hsl(69,80%,40%)",
                "hsl(300,80%,40%)",
                "rgb(53, 162, 255)",
              ]}
              legends={false}
              offset={[20, 30, 20, 30, 80]}
            />
            <h2>Revenue Distribution</h2>
          </div>
         */}
          {/* 
          <div>
            <PieChart
              labels={[
                "Teenager(Below 20)",
                "Adult (20-40)",
                "Older (above 40)",
              ]}
              data={[30, 250, 70]}
              backgroundColor={[
                `hsl(10, ${80}%, 80%)`,
                `hsl(10, ${80}%, 50%)`,
                `hsl(10, ${40}%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
            <h2>Users Age Group</h2>
          </div>
          */}

          <div>
            <h2>User-Admin Ratio</h2>
            <DoughnutChart
              labels={Object.keys(usersRolePie)}
              data={Object.values(usersRolePie)}
              backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
              offset={[0, 20]}
              legends={false}
            />
          </div>

        </section>
      </main>
    </div>
  );
};

export default PieCharts;
