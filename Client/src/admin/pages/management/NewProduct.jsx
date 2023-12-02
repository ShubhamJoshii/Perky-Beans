import {useState, ChangeEvent, useEffect, useContext} from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import {UserData, Notification} from "../../../routes/App";
import noPhoto from "../../../assets/noPhoto.png";

const NewProduct = () => {
  const [productData, setProductData] = useState({
    Product_Name: undefined,
    Description: undefined,
    Price: undefined,
    Category: "Muffins",
    Product_Photo: undefined,
    Rating: undefined,
    type: "Veg",
  });
  const {notification, checkUserAlreadyLogin} = useContext(Notification);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setProductData({...productData, [name]: value});
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/saveProduct", {...productData})
      .then((result) => {
        if (result.data.result) {
          console.log(result.data.message);
          notification(result.data.message, "Success");
          setProductData({
            Product_Name: "",
            Description: "",
            Price: "",
            Category: "",
            Product_Photo: "",
            Rating: "",
            type: "",
          });
        } else {
          notification(result.data.message, "Un-Success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section>
          {productData._id && <strong>ID - {productData._id}</strong>}
          <img src={productData.Product_Photo ? productData.Product_Photo : noPhoto} alt="Product" />
          {(productData.Product_Name || productData.Price) && (
            <div className="image-container">
              <p>{productData.Product_Name}</p>
              <h3>₹{productData.Price ? productData.Price : `N/A`}</h3>
            </div>
          )}
        </section>
        <article>
          <form onSubmit={saveProduct}>
            <h2>New Product</h2>
            <div>
              <label htmlFor="Name">Name</label>
              <input required type="text" placeholder="Name" id="Name" name="Product_Name" value={productData.Product_Name} onChange={handleInput} />
            </div>
            <div>
              <label htmlFor="Description">Description</label>
              <textarea required name="Description" id="Description" cols={30} rows={5} placeholder="Describe your issue" spellCheck="false" value={productData.Description} onChange={handleInput} />
            </div>

            <div>
              <label htmlFor="Rating">Food Rating</label>
              <input required type="number" placeholder="Rating" name="Rating" id="Rating" value={productData.Rating} onChange={handleInput} />
            </div>

            <div>
              <label htmlFor="Price">Price</label>
              <input required type="number" placeholder="Price" id="Price" name="Price" value={productData.Price} onChange={handleInput} />
            </div>
            <div id="dropDowns">
              <div>
                <label htmlFor="type">Type</label>
                <br />
                <select name="type" id="select" defaultValue={productData.type} onChange={handleInput}>
                  <option value="Vegan">Vegan</option>
                  <option value="Veg">Vegetarian</option>
                </select>
              </div>

              <div>
                <label htmlFor="Category">Category</label> <br />
                <select name="Category" id="select" defaultValue={productData.Category} onChange={handleInput}>
                  <option value="Muffins">Muffins</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Smoothie">Smoothie</option>
                  <option value="SnacksAndSides">Snacks and Sides</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="Product_Photo">Image URL</label>
              <input required type="text" placeholder="Name" name="Product_Photo" id="Product_Photo" value={productData.Product_Photo} onChange={handleInput} />
            </div>

            {/* <div>
              <label htmlFor="Product_Photo">Photo</label>
              <input required type="file" name="Product_Photo" id="Product_Photo" onChange={handleInput} />
            </div> */}

            {/* {productData.Product_Photo && <img src={productData.Product_Photo} alt="New Image" />} */}

            <input type="submit" value="CREATE" />
            {/* Create</input> */}
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
