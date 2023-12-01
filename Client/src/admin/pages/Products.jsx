import React, { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
const Products = () => {
  const [productsData, setProductsData] = useState();
  const fetchProducts = async () => {
    await axios.get("/api/fetchProduct").then((result) => {
      console.log(result.data.data);
      setProductsData(result.data.data);
    }).catch((err) => {
      console.log("Error")
    })
  }
  useEffect(() => {
    fetchProducts();
  }, [])

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className='dashboard-product-box'>
        <h2 class="heading">Products</h2>
        <table class="table" role="table">
          <thead>
            <tr>
              <th>_id</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Category</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {
            productsData?.map((curr) => {
              console.log(curr);
              return (
                <tr>
                  <td>{curr._id}</td>
                  <td><img src={curr.Product_Photo} style={{borderRadius:"20px"}} alt={curr.Product_Name} /></td>
                  <td>{curr.Product_Name}</td>
                  <td>{curr.Description.slice(0,50)}...</td>
                  <td>{curr.Price}</td>
                  <td>{curr.Rating}</td>
                  <td>{curr.Category}</td>
                  <td>{curr.type}</td>
                  <td>
                    <Link to={`/admin/product/${curr._id}`}>Manage</Link>
                  </td>

                </tr>
              )
            })
          }
          {!productsData && <p>No Product Found</p>}
          </tbody>


        </table>
      </div>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  )
}

export default Products