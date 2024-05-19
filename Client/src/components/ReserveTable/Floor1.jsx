import React, { useContext } from "react";
import table2 from "../../assets/Table2.png";
import table4 from "../../assets/Table4.png";
import table6 from "../../assets/Table6.png";
import table10 from "../../assets/Table10.png";
import {Notification} from "../../routes/App";

const Floor1 = ({bookedTable, reserveData, setReserveData}) => {
  let TableNumber = reserveData.TableNumber;
  const {notification} = useContext(Notification);

  const handleBtnClick = (Person_Count, TableNumber) => {
    let tempTebleNumber = `1${TableNumber.toString().padStart(2,0)}`;
    if(bookedTable.find(e => e === tempTebleNumber)){
      notification("Please Select Another Table This Table is already Booked","Warning")
    }else{
      setReserveData({...reserveData, Person_Count, TableNumber});
    }
  };
  return (
    <>
      <div id="row">
        <img src={table4} id={TableNumber === 1 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "101") ? "table table4 already-Booked" : "table table4"}  onClick={() => handleBtnClick(4,1)} />
        <img src={table6} id={TableNumber === 2 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "102") ? "table table6 already-Booked" : "table table6"}  onClick={() => handleBtnClick(6,2)} />
        <img src={table6} id={TableNumber === 3 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "103") ? "table table6 already-Booked" : "table table6"}  onClick={() => handleBtnClick(6,3)} />
        <img src={table4} id={TableNumber === 4 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "104") ? "table table4 already-Booked" : "table table4"}  onClick={() => handleBtnClick(4,4)} />
      </div>
      <div id="row">
        <img src={table2} id={TableNumber === 5 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "105") ? "table table2 already-Booked" : "table table2"}  onClick={() => handleBtnClick(2,5)} />
        <img src={table4} id={TableNumber === 6 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "106") ? "table table4 already-Booked" : "table table4"}  onClick={() => handleBtnClick(4,6)} />
        <img src={table4} id={TableNumber === 7 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "107") ? "table table4 already-Booked" : "table table4"}  onClick={() => handleBtnClick(4,7)} />
        <img src={table4} id={TableNumber === 8 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "108") ? "table table4 already-Booked" : "table table4"}  onClick={() => handleBtnClick(4,8)} />
        <img src={table2} id={TableNumber === 9 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "109") ? "table table2 already-Booked" : "table table2"}  onClick={() => handleBtnClick(2,9)} />
      </div>
      <div id="row">
        <img src={table10} id={TableNumber === 10 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "110") ? "table table10 already-Booked" : "table table10"}  onClick={() => handleBtnClick(10,10)} />
        <img src={table10} id={TableNumber === 11 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "111") ? "table table10 already-Booked" : "table table10"}  onClick={() => handleBtnClick(10,11)} />
        <img src={table10} id={TableNumber === 12 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "112") ? "table table10 already-Booked" : "table table10"}  onClick={() => handleBtnClick(10,12)} />
      </div>
    </>
  );
};

export default Floor1;
