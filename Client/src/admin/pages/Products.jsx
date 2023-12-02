import {useEffect, useState} from "react";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import {Link} from "react-router-dom";
import {FaPlus} from "react-icons/fa";
import Pagination from "../components/Pagination";

const Products = () => {
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const result = await axios.get("/api/fetchProduct");
      setProductsData(result.data.data);
    } catch (err) {
      console.error("Error fetching product data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 80;
  const totalPages = Math.ceil(productsData?.length / productsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayedProducts = productsData?.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

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
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Category</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          {loading ? (
            <p>LOADING...</p>
          ) : (
            <tbody>
              {displayedProducts?.map((curr, id) => {
                return (
                  <tr key={id}>
                    <td>{curr._id}</td>
                    <td>
                      <img src={curr.Product_Photo} style={{borderRadius: "20px"}} alt={curr.Product_Name} />
                    </td>
                    <td>{curr.Product_Name}</td>
                    <td>{curr.Description.slice(0, 50)}...</td>
                    <td>₹{curr.Price}</td>
                    <td>{curr.Rating}</td>
                    <td>{curr.Category}</td>
                    <td>{curr.type}</td>
                    <td>
                      <Link to={`/admin/product/${curr._id}`}>Manage</Link>
                    </td>
                  </tr>
                );
              })}
              {!displayedProducts && <p>No Product Found</p>}
            </tbody>
          )}
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
