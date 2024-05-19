import React, { useContext } from "react";
import table2 from "../../assets/Table2.png";
import table4 from "../../assets/Table4.png";
import table6 from "../../assets/Table6.png";
import table8 from "../../assets/Table8.png";
import table10 from "../../assets/Table10.png";
import { Notification } from "../../routes/App";

const GroundFloor = ({bookedTable, reserveData, setReserveData, floor = "Ground"}) => {
  let TableNumber = reserveData.TableNumber;
  const {notification} = useContext(Notification);

  const handleBtnClick = (Person_Count, TableNumber) => {
    let tempTebleNumber = `G${TableNumber.toString().padStart(2,0)}`;
    if(bookedTable.find(e => e === tempTebleNumber)){
      notification("Please Select Another Table This Table is already Booked","Warning")
    }else{
      setReserveData({...reserveData, Person_Count, TableNumber});
    }
  };
  return (
    <>
      <div id="row">
        <img src={table4} id={TableNumber === 1 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G01") ? "table table4 already-Booked" : "table table4"} onClick={() => handleBtnClick(4, 1)} />
        <img src={table4} id={TableNumber === 2 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G02") ? "table table4 already-Booked" : "table table4"} onClick={() => handleBtnClick(4, 2)} />
        <img src={table4} id={TableNumber === 3 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G03") ? "table table4 already-Booked" : "table table4"} onClick={() => handleBtnClick(4, 3)} />
      </div>
      <div id="row">
        <img src={table4} id={TableNumber === 4 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G04") ? "table table4 already-Booked" : "table table4"} onClick={() => handleBtnClick(4, 4)} />
        <img src={table6} id={TableNumber === 5 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G05") ? "table table6 already-Booked" : "table table6"} onClick={() => handleBtnClick(6, 5)} />
        <img src={table6} id={TableNumber === 6 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G06") ? "table table6 already-Booked" : "table table6"} onClick={() => handleBtnClick(6, 6)} />
        <img src={table4} id={TableNumber === 7 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G07") ? "table table4 already-Booked" : "table table4"} onClick={() => handleBtnClick(4, 7)} />
      </div>
      <div id="row">
        <div>
          <img src={table2} id={TableNumber === 8 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G08") ? "table table2 already-Booked" : "table table2"} onClick={() => handleBtnClick(2, 8)} />
          <img src={table2} id={TableNumber === 9 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G09") ? "table table2 already-Booked" : "table table2"} onClick={() => handleBtnClick(2, 9)} />
          <img src={table2} id={TableNumber === 10 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G10") ? "table table2 already-Booked" : "table table2"} onClick={() => handleBtnClick(2, 10)} />
          <img src={table2} id={TableNumber === 11 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G11") ? "table table2 already-Booked" : "table table2"} onClick={() => handleBtnClick(2, 11)} />
        </div>
        <img src={table10} id={TableNumber === 12 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G12") ? "table table10 already-Booked" : "table table10"} onClick={() => handleBtnClick(10, 12)} />

        <div>
          <img src={table4} id={TableNumber === 13 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G13") ? "table table4 already-Booked" : "table table4"} onClick={() => handleBtnClick(4, 13)} />
          <img src={table6} id={TableNumber === 14 ? "selected" : ""} alt="tableImage" className={bookedTable?.find((e) => e === "G14") ? "table table6 already-Booked" : "table table6"} onClick={() => handleBtnClick(6, 14)} />
        </div>
      </div>
    </>
  );
};

export default GroundFloor;
