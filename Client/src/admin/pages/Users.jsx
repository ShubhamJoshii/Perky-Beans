import React, {useContext, useEffect, useState} from "react";
import Switch from "react-switch";
import axios from "axios";
import {FaTrash} from "react-icons/fa";
import {Oval} from "react-loader-spinner";
import AdminSidebar from "../components/AdminSidebar";
import Pagination from "../components/Pagination";
import {Notification} from "../../routes/App";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Users = () => {
  const pageLimit = 12;
  let arr = Array.from({length: pageLimit}, (curr, id) => {
    id: id + 1;
  });
  const [usersData, setUsersData] = useState(arr);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(currentPage);
  const {notification} = useContext(Notification);

  const userRoleUpdate = async (_id, Role) => {
    setLoading(true);
    await axios
      .post("/api/updateUserRole", {_id, Role})
      .then((response) => {
        if (response.data.result) {
          fetchUsers();
          notification(response.data.message, "Success");
        } else {
          notification(response.data.message, "Un-Success");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUsers = async () => {
    setLoading(true);
    setUsersData(arr)
    await axios
      .get(`/api/fetchUsers?page=${currentPage}&limit=${pageLimit}`)
      .then((result) => {
        // console.log(result.data.data);
        if (result.data?.data) {
          setUsersData(result.data.data);
          setTotalPages(result.data.TotalPages);
        }
      })
      .catch((err) => {
        // console.log("Error")
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const deleteUser = async (_id) => {
    alert(_id);
    await axios
      .post("/api/deleteUser", {_id})
      .then((response) => {
        if (response.data.result) {
          notification(response.data, "Success");
          console.log(response.data);
          fetchUsers();
        } else {
          notification(response.data, "Un-Success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="dashboard-product-box">
        <h2 class="heading">Users</h2>
        <table class="table" role="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Email Verified</th>
              <th>Admins</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.map((curr, id) => {
              const isAdmin = curr?.Role === "Admin" || false;
              return (
                <tr key={id}>
                  <td>{curr?.Full_Name || <Skeleton />}</td>
                  <td>{curr?.Email || <Skeleton />}</td>
                  <td>{curr?.Role || <Skeleton />}</td>
                  <td>{curr?._id ? curr?.isVerified ? <p id="verified">Verified</p> : <p id="not-verified">Not-Verified</p> : <Skeleton />}</td>
                  <td>{curr?._id ? <Switch onChange={() => userRoleUpdate(curr?._id, curr?.Role)} checked={isAdmin} className="react-switch" /> : <Skeleton />}</td>
                  <td>
                    <button onClick={() => deleteUser(curr?._id)}>{curr?._id ? <FaTrash /> : <Skeleton />}</button>
                  </td>
                </tr>
              );
            })}
            {!usersData && <p>No User Found</p>}
          </tbody>
        </table>
        {!loading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
      </div>
    </div>
  );
};

export default Users;
