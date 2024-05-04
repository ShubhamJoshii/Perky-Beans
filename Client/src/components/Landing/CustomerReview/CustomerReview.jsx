import { AiFillStar } from "react-icons/ai";
import { useEffect, useState } from "react";
import { Rate } from "antd";

const CustomerReview = ({ Review }) => {
  const [averageReview, setAverageReview] = useState(undefined)
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    let sum = 0;
    let arr = [];
    for (let i = 0; i < Review?.length; i++) {
      sum += Review[i]?.rating;
      arr.push(Review[i]?.rating);
    }
    let a = (sum / Review?.length);
    setRatings(arr);
    setAverageReview(a);
  }, [Review])


  return (
    <>
      <h2 id="reviewHeading">Customer Review</h2>
      {
        Review?.length > 0 ?
          <>
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
                        <div id="rating-count" key={curr}>
                          <div>
                            <p>{curr}</p>
                            <AiFillStar />
                          </div>
                          <div id="rating-line">
                            <div id="rating-line-main" style={{ width: countPerc + "%" }}></div>
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
                      <h2>{curr.Name || curr.name}</h2>
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
          </> : <>
            <p id="bethefirstone">Be the first Customer to Review on this food. <pre> Order Now</pre></p>
          </>
      }
    </>
  );
};

export default CustomerReview;
