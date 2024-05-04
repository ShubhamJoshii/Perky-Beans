import React, { useContext, useEffect, useState } from 'react'
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Switch from "react-switch"
import Pagination from '../components/Pagination';
import { Oval } from "react-loader-spinner"
import { Notification } from '../../routes/App';
const Users = () => {
  const [usersData, setUsersData] = useState();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const {notification} = useContext(Notification);


  
  const userRoleUpdate = async (_id, Role) => {
    setLoading(true);
    await axios.post("/api/updateUserRole", { _id, Role }).then((response) => {
      // console.log(response.data.message);
      if(response.data.result){
        fetchUsers();
        notification(response.data.message,"Success")
      }else{
        notification(response.data.message,"Un-Success")
      }
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    })
  };

  const fetchUsers = async () => {
    setLoading(true);
    await axios.get("/api/fetchUsers").then((result) => {
      // console.log(result.data.data);
      if (result.data?.data) {
        setUsersData(result.data.data);
      }
    }).catch((err) => {
      console.log("Error")
    }).finally(() => {
      setLoading(false);
    })
  }
  useEffect(() => {
    fetchUsers();
  }, [])

  const deleteUser = async (_id) => {
    alert(_id);
    await axios.post("/api/deleteUser",{_id}).then((response)=>{
      if(response.data.result){
        notification(response.data,"Success")
        console.log(response.data);
        fetchUsers();
      }else{
        notification(response.data,"Un-Success")
      }
    }).catch((err)=>{
      console.log(err);
    })
  }

  const usersPerPage = 8;
  const totalPages = Math.ceil(usersData?.length / usersPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayedUsers = usersData?.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);


  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className='dashboard-product-box'>
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
          {loading ? (
            <td colSpan="6">
              <Oval height="40" width="60" color="black" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
            </td>
          ) : (
            <tbody>
              {
                displayedUsers?.map((curr,id) => {
                  const isAdmin = curr.Role === "Admin"
                  return (
                    <tr key={id}>
                      <td>{curr.Full_Name}</td>
                      <td>{curr.Email}</td>
                      <td>{curr.Role}</td>
                      <td>{curr.isVerified ? <p id='verified'>Verified</p> : <p id='not-verified'>Not-Verified</p>}</td>
                      <td>
                        <Switch
                          onChange={() => userRoleUpdate(curr._id, curr.Role)}
                          checked={isAdmin}
                          className="react-switch"
                        />
                      </td>
                      <td>
                        <button onClick={() => deleteUser(curr._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
              {!usersData && <p>No User Found</p>}
            </tbody>
          )}
        </table>
        {!loading &&
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        }
      </div>
    </div>
  )
}

export default Users
