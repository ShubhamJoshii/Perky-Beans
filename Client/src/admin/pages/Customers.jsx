import React, { useEffect, useState } from 'react'
import AdminSidebar from "../components/AdminSidebar";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { Link } from 'react-router-dom';
import Switch from "react-switch"
const Customers = () => {
  const [usersData, setUsersData] = useState();
  const [checked, setChecked] = useState(false);
  const handleChange = async(_id,Role) => {
    await axios.post("/api/updateUserRole",{_id,Role}).then((response)=>{
      // console.log(response.data.message);
      response.data.result && fetchUsers();
    }).catch((err)=>{
      console.log(err);
    })
  };

  const fetchUsers = async () => {
    await axios.get("/api/fetchUsers").then((result) => {
      // console.log(result.data.data);
      if (result.data?.data) {
        setUsersData(result.data.data);
      }
    }).catch((err) => {
      console.log("Error")
    })
  }
  useEffect(() => {
    fetchUsers();
  }, [])

  useEffect(() => {
    // usersData.map((curr)=>{
    //   console.log(curr);
    // })
    console.log(usersData);
  }, [usersData])


  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className='dashboard-product-box'>
        <h2 class="heading">Products</h2>
        <table class="table" role="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Email Verified</th>
              <th>Admins</th>

            </tr>
          </thead>
          <tbody>
            {
              usersData?.map((curr) => {
                const isAdmin = curr.Role === "Admin"
                return (
                  <tr>
                    <td>{curr.Full_Name}</td>
                    <td>{curr.Email}</td>
                    <td>{curr.Role}</td>
                    <td>{curr.isVerified ? <p id='verified'>Verified</p> : <p id='not-verified'>Not-Verified</p>}</td>
                    <td>
                      <Switch
                        onChange={()=>handleChange(curr._id,curr.Role)}
                        checked={isAdmin}
                        className="react-switch"
                      />
                    </td>
                  </tr>
                )
              })
            }
            {!usersData && <p>No User Found</p>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Customers
