import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TableHOC from "../components/TableHOC";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

const ReserveSeat = () => {
  const [ReserveSeats, setReserveSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);


  const fetchReserveSeats = async () => {
    await axios.get("/api/reserveSeats").then((response) => {
      console.log(response.data);
      setReserveSeats(response.data);
    })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      })
  };

  const productsPerPage = 10;
  const totalPages = Math.ceil(ReserveSeats?.length / productsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const displayedProducts = ReserveSeats?.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  useEffect(() => {
    fetchReserveSeats();
  }, []);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className='dashboard-product-box'>
        <h2 className="heading">Reserve Seats</h2>
        <table className="table" role="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Persons</th>
              <th>Table Allot</th>
              <th>Date & Time</th>
              <th>Booking Date</th>
              <th>Status</th>
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
                  return (
                    <tr key={id}>
                      <td>{curr.User_Name}</td>
                      <td>{curr.User_Email}</td>
                      <td>{curr.Person_Count}</td>
                      <td>10</td>
                      <td>{curr.reservation_Date}, {curr.reservation_Timing}</td>
                      <td>{curr.Booking_DateTime.split('T')[0]} {curr.Booking_DateTime.split('T')[1]}</td>
                      {curr?.status === "Confirmed" ?
                        <td id="seatConfirmed">Confirmed</td>
                        : <td id="seatCancelled"> Cancelled</td>
                      }
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
    </div>
  );
};

export default ReserveSeat;
