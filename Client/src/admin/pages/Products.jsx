import React, { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
import Switch from "react-switch";
import Pagination from "../components/Pagination";
import {Oval} from "react-loader-spinner"
import TableHOC from "../components/TableHOC"
const Products = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [productsData, setProductsData] = useState();
  const fetchProducts = async () => {
    await axios.post("/api/fetchProduct",{Available:false}).then((result) => {
      // console.log(result.data.data);
      setProductsData(result.data.data);
    }).catch((err) => {
      console.log("Error")
    }).finally(() => {
      setLoading(false);
    })
  }
  useEffect(() => {
    fetchProducts();
  }, [])

  const handleChange = async (_id, isAvailable) => {
    await axios.post("/api/updateProductAvailability", { _id, isAvailable }).then((response) => {
      // console.log(response.data.message);
      response.data.result && fetchProducts();
    }).catch((err) => {
      console.log(err);
    })
  };


  const productsPerPage = 10;
  const totalPages = Math.ceil(productsData?.length / productsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayedProducts = productsData?.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="admin-container">
      <AdminSidebar />
      {/* <TableHOC heading={["_id","Photo","Name","Description","Price","Rating","Category","Type","Action","Available"]} loading={loading}/> */}
      <div className='dashboard-product-box'>
        <h2 className="heading">Products</h2>
        <table className="table" role="table">
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
              <th>Available</th>
            </tr>
          </thead>
          {loading ? (
            <td colSpan="10">
              <Oval height="40" width="60" color="black" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
            </td>
          ) : (
            <tbody>
              {
                displayedProducts?.map((curr, id) => {
                  const isAvailable = curr.Available;
                  // console.log(curr);
                  return (
                    <tr key={id}>
                      <td>{curr._id}</td>
                      <td><img src={curr.Product_Photo} style={{ borderRadius: "20px" }} alt={curr.Product_Name} /></td>
                      <td>{curr.Product_Name}</td>
                      <td>{curr.Description.slice(0, 50)}...</td>
                      <td>&#x20B9;{curr.Price}</td>
                      <td>{curr.Rating}</td>
                      <td>{curr.Category}</td>
                      <td>{curr.type}</td>
                      <td>
                        <Link to={`/admin/product/${curr._id}`}>Manage</Link>
                      </td>
                      <td>
                        <Switch
                          onChange={() => handleChange(curr._id, !isAvailable)}
                          checked={isAvailable}
                          className="react-switch"
                        />
                      </td>
                    </tr>
                  )
                })
              }
              {!displayedProducts && <p>No Product Found</p>}
            </tbody>
          )}
        </table>
        {!loading &&
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        }
      </div>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  )
}

export default Products