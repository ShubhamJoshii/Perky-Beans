import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TableHOC from "../components/TableHOC";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

const ReserveTable = () => {
  const [ReserveTables, setReserveTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);


  const fetchReserveTable = async () => {
    await axios.get("/api/reserveTables").then((response) => {
      // console.log(response.data);
      setReserveTables(response.data);
    })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      })
  };

  const productsPerPage = 10;
  const totalPages = Math.ceil(ReserveTables?.length / productsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const displayedProducts = ReserveTables?.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  useEffect(() => {
    fetchReserveTable();
  }, []);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className='dashboard-product-box'>
        <h2 className="heading">Reserve Tables</h2>
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
                      <td>{curr?.TableNumber}</td>
                      <td>{curr.reservation_Date}, {curr.reservation_Timing}</td>
                      <td>{curr.Booking_DateTime.split('T')[0]} {curr.Booking_DateTime.split('T')[1]}</td>
                      {curr?.status === "Confirmed" ?
                        <td id="tableConfirmed">Confirmed</td>
                        : <td id="tableCancelled"> Cancelled</td>
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

export default ReserveTable;
