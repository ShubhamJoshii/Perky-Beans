import React, {useEffect, useState} from "react";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import {Link} from "react-router-dom";
import {FaPlus} from "react-icons/fa";
import Switch from "react-switch";
import Pagination from "../components/Pagination";
import {Oval} from "react-loader-spinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import TableHOC from "../components/TableHOC";
const Products = () => {
  const pageLimit = 10;
  const [loading, setLoading] = useState(false);
  let arr = Array.from({length: pageLimit}, (curr, id) => {
    id: id + 1;
  });
  const [products, setProducts] = useState(arr);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    // setLoading(true);
    setProducts(arr);
    await axios
      .get(`/api/fetchProduct?page=${currentPage}&limit=${pageLimit}&Available=false`)
      .then((result) => {
        console.log(result.data.TotalproductsPages.length);
        setProducts(result.data.data);
        setTotalPages(result.data.TotalproductsPages);
      })
      .catch((err) => {
        console.log("Error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleChange = async (_id, isAvailable) => {
    await axios
      .post("/api/updateProductAvailability", {_id, isAvailable})
      .then((response) => {
        response.data.result && fetchProducts();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const sortinghandle = () => {
    let sortedData = products.sort((a, b) => {
      let x = a.Product_Name.toLowerCase();
      let y = b.Product_Name.toLowerCase();
      if (x > y) {
        return 1;
      }
      if (x < y) {
        return -1;
      }
      return 0;
    });
    setProducts(sortedData);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="dashboard-product-box">
        <h2 className="heading">Products</h2>
        <table className="table" role="table">
          <thead>
            <tr>
              <th>_id</th>
              <th>Photo</th>
              <th onClick={sortinghandle}>Name</th>
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
              {products?.map((curr, id) => {
                const isAvailable = curr?.Available;
                return (
                  <tr key={id}>
                    <td>{curr?._id || <Skeleton />}</td>
                    <td>{curr?.Product_Photo ? <img src={curr?.Product_Photo} style={{borderRadius: "20px"}} alt={curr?.Product_Name} /> : <Skeleton className="skeleton" />}</td>
                    <td>{curr?.Product_Name || <Skeleton />}</td>
                    <td>{curr?.Description ? <>{curr?.Description.slice(0, 60)}...</> : <Skeleton count={3} />}</td>
                    <td>{curr?.Price ? <>&#8377;{curr?.Price}</> : <Skeleton />}</td>
                    <td>{curr?.Rating || <Skeleton />}</td>
                    <td>{curr?.Category || <Skeleton />}</td>
                    <td>{curr?.type || <Skeleton />}</td>
                    <td>{curr?.Product_Name ? <Link to={`/admin/product/${curr?._id}`}>Manage</Link> : <Skeleton />}</td>
                    <td>{curr?.Product_Name ? <Switch onChange={() => handleChange(curr?._id, !isAvailable)} checked={isAvailable} className="react-switch" /> : <Skeleton />}</td>
                  </tr>
                );
              })}
              {!products && <p>No Product Found</p>}
            </tbody>
          )}
        </table>
        {!loading && products && <Pagination currentPage={currentPage} totalPages={totalPages?.length} onPageChange={handlePageChange} />}
      </div>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
