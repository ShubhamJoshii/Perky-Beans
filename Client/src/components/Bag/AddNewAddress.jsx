import React, { useState } from 'react'
import axios from "axios"
import Home from "../../assets/Home.png"
import Hotel from "../../assets/Hotel.png"
import Building from "../../assets/Building.png"
import Other from "../../assets/Other.png"
const AddNewAddress = ({setShowBag}) => {
  const [AddressData, setAddressData] = useState({
    FlatNumber:null,
    Floor:null,
    Locality:null,
    landmark:null,
    Name:null,
    Contact_Number:null,
    AddressAs:"Home",
    State:null
  });

  const handleInput= (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setAddressData({...AddressData,[name]:value})
  }
  
  const handleSaveAddressAs = (text) => {
    setAddressData({...AddressData,AddressAs:text})
  }

  const submitForm = async(e) => {
    e.preventDefault();
    await axios.post("/api/addAddress",AddressData).then((response)=>{
      if(response.data.result){
        setShowBag(2);
      }
    }).catch((err)=>{
      console.log(err);
    })
  }

  return (
    <div id='Add-New-Address'>
        <p>Save address as *</p>
        <div id="SaveAddressAs">
          <button className='save-Address-As' id={AddressData.AddressAs === "Home" ? "active" : null} onClick={()=>handleSaveAddressAs("Home")}><img src={Home} alt='HomeLogo' /><span>Home</span></button>
          <button className='save-Address-As' id={AddressData.AddressAs === "Work" ? "active" : null} onClick={()=>handleSaveAddressAs("Work")}><img src={Building} alt='HomeLogo' /><span>Work</span></button>
          <button className='save-Address-As' id={AddressData.AddressAs === "Hotel" ? "active" : null} onClick={()=>handleSaveAddressAs("Hotel")}><img src={Hotel} alt='HomeLogo' /><span>Hotel</span></button>
          <button className='save-Address-As' id={AddressData.AddressAs === "Other" ? "active" : null} onClick={()=>handleSaveAddressAs("Other")}><img src={Other} alt='HomeLogo' /><span>Other</span></button>
        </div>
        <form onSubmit={submitForm}>
          <label htmlFor='FlatNumber'>Flat / House no / Building name *</label>
          <input type='text' name='FlatNumber' id='FlatNumber' value={AddressData.FlatNumber} onChange={handleInput} placeholder='Enter Flat / House no / Building name *' required/>
          <label htmlFor='Floor'>Floor (optional)</label>
          <input type='text' name='Floor' id='Floor' value={AddressData.Floor} onChange={handleInput} placeholder='Floor (optional)' />
          <label htmlFor='Locality'>Area / Sector / Locality *</label>
          <input type='text' name='Locality' id='Locality' value={AddressData.Locality} onChange={handleInput} placeholder='Enter Area / Sector / Locality *'  required/>
          <label htmlFor='landmark'>Nearby landmark (optional)</label>
          <input type='text' name='landmark' id='landmark' value={AddressData.landmark} onChange={handleInput} placeholder='Enter Nearby landmark (optional)' />
          <label htmlFor='State'>State</label>
          <input type='text' name='State' id='State' value={AddressData.State} onChange={handleInput} placeholder='Enter State' />
          <label htmlFor='Name'>Enter your details for seamless delivery experience</label>
          <input type='text' name='Name' id='Name' value={AddressData.Name} onChange={handleInput} placeholder='Your name *'  required/>
          
          <label htmlFor='Contact_Number'>Your phone number (optional)</label>
          <input type='number' name='Contact_Number' id='Contact_Number' value={AddressData.Contact_Number} min={"1111111111"}  max={"9999999999"} onChange={handleInput} placeholder='Enter Contact Number'  required/>
          <input type='submit' value='Save address'/>
          
        </form>
    </div>
  )
}

export default AddNewAddress