import {FrontJSON} from "../../../Data/FrontJSON.jsx";
import {NavLink, useNavigate} from "react-router-dom";
const Frontproducts = () => {
  const navigate = useNavigate();
  return (
    <div id="Frontproducts">
      {FrontJSON.map((curr, ids1) => {
        return (
          <div key={ids1}>
            <h2>{curr.Title}</h2>
            <div className="ProductContainer">
              <div className="ProductInnerContainer">
                {curr.Products.map((products, ids2) => {
                  // console.log(products)
                  let a;
                  // navigate("/products", {state: {Category:products.Category}});
                  let state = null;
                  products.type === "Product" ? (a = `./Products/${products.Category}/${products._id}`) : (a = `./Products/${products.Category}`);
                  products.type !== "Product" && (state = {Category:[products.Category],Ingredients:[],PriceRange:599,RatingUP:1});
                  return (
                    <div className="FrontProduct" key={ids2}>
                      <button onClick={() => {window.scrollTo({top: 0, left: 0, behavior: "smooth"}); navigate(a,{state})}}>
                        <img src={products.Image} />
                        <p>{products.Name}</p>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Frontproducts;
