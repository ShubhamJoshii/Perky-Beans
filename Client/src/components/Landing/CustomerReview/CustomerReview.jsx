import { Reviews } from "../../../Data/FrontJSON";
import { AiFillStar } from "react-icons/ai";
import { TiStarFullOutline, TiStarHalfOutline } from "react-icons/ti";
import axios from "axios";
import { useEffect, useState } from "react";
import { Rate } from "antd";
const CustomerReview = () => {
  const [Review, setReview] = useState([]);
  const [averageReview, setAverageReview] = useState(1.0)
  const [ratings, setRatings] = useState([]);
  const fetchReview = async () => {
    await axios.get("/api/fetchReview").then((response) => {
      // console.log(response.data);
      setReview(response.data);
    })
  }
  useEffect(() => {
    let sum = 0;
    let arr = [];
    for (let i = 0; i < Review?.length; i++) {
      sum += Review[i].rating;
      arr.push(Review[i].rating);
    }
    let a = (sum / Review?.length);
    setRatings(arr);
    setAverageReview(a);
  }, [Review])

  useEffect(() => {
    fetchReview();
  }, [])
  return (
    <>
      <h2 id="reviewHeading">Customer Review</h2>
      <div className="CustomerReview">
        {
          averageReview &&
          <div className="overallRating">
            <p id="overall-rating-text">Overall rating</p>
            <div id="overall-rating-star">
              <h2>{averageReview.toFixed(1)}</h2>
              <Rate defaultValue={averageReview} className="overall-rate-antd" disabled allowHalf allowClear={false} tooltips={["Very Bad", "Bad", "Good", "Excellent", "Awesome"]} />
            </div>
            {
              [5, 4, 3, 2, 1].map((curr) => {
                let count = ratings.filter((e) => e === curr).length;
                let countPerc = count / ratings.length * 100;
                return (
                  <div id="rating-count">
                    <div>
                      <p>{curr}</p>
                      <AiFillStar />
                    </div>
                    <div id="rating-line">
                      <div id="rating-line-main" style={{ width: countPerc  + "%" }}></div>
                      <div id="rating-line-background"></div>
                    </div>
                    <p id="review-count">{count}</p>
                  </div>
                )
              })
            }
          </div>
        }
        {Review.map((curr, ids) => {
            return (
              <div className="reviewCard" key={ids}>
                <div id="userINFO">
                  {/* <img src={curr?.CustomerImage} alt="customerIMG" /> */}
                  <h2>{curr.Name}</h2>
                </div>
                <p>{curr.Description.length > 180 ? `${curr.Description.slice(0, 180)}...` : curr.Description}</p>
                <span id="customerDate">{curr.Date}</span>
                <div id="stars">
                  <AiFillStar id="starLOGO" />
                  <span>{curr?.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default CustomerReview;
