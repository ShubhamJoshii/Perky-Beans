import { FormEvent, useContext, useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { Notification } from "../../../routes/App"
const Coupon = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { notification } = useContext(Notification)
  const [couponData, setCouponData] = useState({
    Code: "", Discount_Allot: "", Description: ""
  })
  const [allCoupon, setAllCoupon] = useState([]);

  const fetchCoupon = async () => {
    await axios.get("/api/fetchCoupon").then((response) => {
      // console.log(response.data.Data)
      setAllCoupon(response.data.Data)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchCoupon();
  }, [])

  const inputHandle = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCouponData({ ...couponData, [name]: value })
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (couponData.Code.length > 4 && couponData.Discount_Allot < 50) {
      await axios.post("/api/newCouponAdd", couponData).then((response) => {
        response.data.result ?
          notification(response.data.message, "Success") : notification(response.data.message, "Un-Success")
        setCouponData({ Code: "", Discount_Allot: "", Description:""})
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        fetchCoupon();
      })
    } else if (couponData.Code.length < 4) {
      notification("Coupon Length Should be greater than 4", "Info")
    }
  };

  useEffect(() => {
    setIsCopied(false);
  }, [couponData]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Coupon</h1>
        <section>
          <form className="coupon-form" onSubmit={submitHandler}>
            <div>
              <input
                type="text"
                placeholder="Coupon Code"
                name="Code"
                value={couponData.Code}
                onChange={inputHandle}
                min="4"
                maxLength={18}
              />

              <input
                type="number"
                placeholder="Discount Allot"
                name="Discount_Allot"
                value={couponData.Discount_Allot}
                onChange={inputHandle}
                max={50}
              />
            </div>

            <textarea
              type="text"
              placeholder="Enter Coupon Description"
              name="Description"
              value={couponData.Description}
              onChange={inputHandle}
              required
              min="15"
              maxLength={300}
            />

            {/* <fieldset>
              <legend>Include</legend>

              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers((prev) => !prev)}
              />
              <span>Numbers</span>

              <input
                type="checkbox"
                checked={includeCharacters}
                onChange={() => setIncludeCharacters((prev) => !prev)}
              />
              <span>Characters</span>

              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols((prev) => !prev)}
              />
              <span>Symbols</span>
            </fieldset> */}
            <button type="submit">Generate</button>
          </form>
          <table class="table" role="table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount Alloted</th>
                <th>Description</th>
                <th>Expired At</th>
              </tr>
            </thead>
            <tbody>
              {
                allCoupon.slice(0).reverse().map((curr) => {
                  return (
                    <tr>
                      <td>{curr.Code}</td>
                      <td>{curr.Discount_Allot}</td>
                      <td>{curr.Description}</td>
                      <td>{curr.ExpiredAt}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Coupon;
