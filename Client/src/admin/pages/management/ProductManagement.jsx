import { useState, ChangeEvent, FormEvent, useEffect, useContext } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Notification } from "../../../routes/App";
const ProductManagement = () => {
  const productId = useParams().productId;
  const { notification } = useContext(Notification);
  // const [itemDetails, setItemDetails] = useState(null);
  const [productDetails, setProductDetails] = useState({ _id: "", Product_Photo: "", Product_Name: "", Description: "", Price: "", Rating: "", Category: "", type: "" });

  const navigate = useNavigate();
  const fetchProductDetails = async () => {
    await axios.get(`/api/fetchProductDetails?_id=${productId}`).then((result) => {
      // console.log(result.data.data);
      result.data.found && setProductDetails(result.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setProductDetails({ ...productDetails, [name]: value });
  }

  const updateProduct = async (e) => {
    e.preventDefault();
    await axios.post("/api/updateProduct", productDetails).then((result) => {
      // console.log(result.data.message); 
      notification(result.data.message, "Success")
    }).catch((err) => {
      console.log(err)
    })
  }

  const deleteProduct = async (e) => {
    e.preventDefault();
    await axios.post(`/api/deleteProduct`, { _id: productId })
      .then(response => {
        if (response.data.message === "Product Deleted") {
          notification(response.data.message, "Success")
          navigate("/admin/product");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section>
          <strong>ID - {productDetails._id}</strong>
          <img src={productDetails.Product_Photo} alt={productDetails.Product_Name ? productDetails.Product_Name : `Product`} />
          <div className="image-container">
            <p>{productDetails.Product_Name}</p>
            <h3>₹{productDetails.Price}</h3>
          </div>
        </section>
        
        <article>
          <Link to="/admin/product">
            <FaTimes />
          </Link>
          <form>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input required type="text" placeholder="Name" name="Product_Name" value={productDetails.Product_Name} onChange={handleInput} />
            </div>
            <div>
              <label>Price</label>
              <input required type="number" placeholder="Price" name="Price" value={productDetails.Price} onChange={handleInput} />
            </div>
            <div id="dropDowns">
              <div>
                <label htmlFor="type">Type</label><br />
                <select name="type" id="select" defaultValue={productDetails.type} onChange={handleInput}>
                  <option value="Veg">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div>
                <label htmlFor="Category">Category</label> <br />
                <select name="Category" id="select" defaultValue={productDetails.Category} onChange={handleInput}>
                  <option value="Muffins">Muffins</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Smoothie">Smoothie</option>
                  <option value="SnacksAndSides">Snacks and Sides</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="Description">Description</label>
              <textarea required name="Description" id="Description" cols={30} rows={5} value={productDetails.Description} onChange={handleInput} />
            </div>

            <div>
              <label htmlFor="Product_Photo">Photo</label>
              {/* <input type="file" name="Product_Photo"  onChange={handleInput}/> */}
              <input type="text" placeholder="Enter Image URL" name="Product_Photo" value={productDetails.Product_Photo} onChange={handleInput} />
            </div>
            <button onClick={updateProduct}>Update</button>
            <button className="delete" onClick={deleteProduct}>Delete</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default ProductManagement;
