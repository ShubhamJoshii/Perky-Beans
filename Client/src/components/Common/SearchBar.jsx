import {useEffect, useState, useRef} from "react";
import {BiSearch} from "react-icons/bi";
import {RiArrowDropDownLine} from "react-icons/ri";
import {MdClose, MdFilterList} from "react-icons/md";
import {NavLink, useNavigate} from "react-router-dom";
import Filter from "./Filter";
import axios from "axios";
import {Oval} from "react-loader-spinner";

const SearchBar = ({position, currPlace, bgColor}) => {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(null);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [Products, setProducts] = useState(null);
  const [focusIndex, setFocusIndex] = useState(-1);

  const navigate = useNavigate();
  const resultContainer = useRef(null);

  useEffect(() => {
    if (!resultContainer.current) return;
    resultContainer.current.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [focusIndex]);

  const handleInput = (input) => {
    let value = input.target.value.toLowerCase();
    setSearchText(value);
  };

  useEffect(() => {
    setStatus(null);
    const getData = setTimeout(() => {
      if (searchText) {
        setStatus("Loading");
        fetchProducts(searchText);
      } else {
        setProducts(null);
      }
    }, 1000);

    return () => clearTimeout(getData);
  }, [searchText]);

  const fetchProducts = async (text) => {
    await axios
      .get(`/api/searchProducts?searchText=${text}`)
      .then((result) => {
        if (result.data.status) {
          setProducts(result.data.products);
          setStatus("Loaded");
        } else {
          setProducts(null);
          setStatus("Not-Found");
        }
      })
      .catch((err) => {
        console.log("Error");
      });
  };

  const handleKeyDown = (e) => {
    const {key} = e;
    let nextIndexCount = 0;
    let length = Products.length;
    if (key === "ArrowDown") {
      nextIndexCount = (focusIndex + 1) % length;
    }
    if (key === "ArrowUp") {
      nextIndexCount = (focusIndex + length - 1) % length;
    }
    if (key === "Enter") {
      let curr = Products[focusIndex];
      let link = `/products/${curr.Category}/${curr._id}`;
      navigate(link);
    }
    setFocusIndex(nextIndexCount);
  };
  return (
    <div id="SearchBarContainer" tabIndex={1} onKeyDown={handleKeyDown}>
      <div id="SearchBar" style={{marginTop: `${-position}px`, backgroundColor: `${bgColor}`, borderColor: "black"}}>
        <BiSearch id="SearchICON" />
        <input type="text" placeholder="SEARCH PRODUCT HERE....." onChange={handleInput} />
        <div id="Filter">
          <div id="fliterTEXT" onClick={() => setShowFilterBox(!showFilterBox)}>
            <p>FILTER</p>
            <RiArrowDropDownLine />
          </div>
          <div>
            <MdFilterList id="fliterTEXT" />
          </div>
        </div>
      </div>
      <Filter showFilterBox={showFilterBox} setShowFilterBox={setShowFilterBox} />
      
        {status === "Loading" && (
          <div id="SearchProductsContainer" style={{overflowY:"auto"}}>
            <Oval height="30" width="50" color="black" wrapperStyle={{justifyContent: "center", padding: "10px"}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
          </div>
        )}

        {status === "Not-Found" && 
        <div id="SearchProductsContainer" style={{overflowY:"auto"}}><p style={{padding:"5px",textAlign:"center"}}>Product Not found</p></div>}

        {status === "Loaded" && (
          <div id="SearchProductsContainer">
            {Products?.map((curr, id) => {
              let a = `/products/${curr.Category}/${curr._id}`;
              return (
                <div id="SearchProducts" key={curr.Category + id} className={focusIndex === id ? "activeIndex" : null} ref={focusIndex === id ? resultContainer : null}>
                  <NavLink to={a}>
                    <div onClick={() => window.scrollTo({top: 0, left: 0, behavior: "smooth"})}>
                      <img src={curr.Product_Photo} alt={curr.Product_Name} />
                      <p>{curr.Product_Name}</p>
                    </div>
                  </NavLink>
                  <MdClose />
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default SearchBar;
