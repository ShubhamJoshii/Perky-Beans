import{r,U as h,N as x,j as e,R as g,b as j}from"./index-5c2fc0ab.js";import{H as v}from"./Header-f26ec214.js";import{O as C}from"./Blocks-c51b83d5.js";import{I as b}from"./Slider (1)-562329a8.js";import{R as f}from"./index-457bcd0d.js";import"./index.esm-96b25de3.js";const N=()=>{var d;const{userData:a,setUserData:w}=r.useContext(h),{notification:n}=r.useContext(x),[t,l]=r.useState({Name:void 0,Email:void 0,type:"Feedback",Contact_Number:void 0,Description:"",rating:null}),[m,c]=r.useState(!1),s=i=>{const o=i.target.name,p=i.target.value;l({...t,[o]:p})},u=async i=>{i.preventDefault(),t.type&&t.Contact_Number.length===10&&t.Description?(c(!0),await j.post("/api/contact",{_id:a==null?void 0:a._id,...t}).then(o=>{o.data.Success?n(o.data.message,"Success"):n(o.data.message,"Un-Success"),l({Name:(a==null?void 0:a.Full_Name)||"",Email:(a==null?void 0:a.Email)||"",type:t.type,Contact_Number:"",Description:"",rating:null}),c(!1)}).catch(()=>{})):t.Contact_Number.length!=10?n("Enter Correct Contact Number","Info"):t.Description?n("Please Login First !","Un-Success"):n("Enter Description","Info")};return r.useEffect(()=>{a&&l({...t,Name:a==null?void 0:a.Full_Name,Email:a==null?void 0:a.Email})},[a]),e.jsx(g.Fragment,{children:e.jsxs("div",{id:"Contact",children:[e.jsx("img",{src:b,alt:"SideIMG"}),e.jsxs("div",{id:"ContactForm",children:[e.jsx("div",{id:"blur"}),e.jsxs("div",{id:"BlurFORM",children:[e.jsx("h2",{children:"We’d love to help"}),e.jsx("p",{children:"24/7 we will answer your questions and problems"}),e.jsxs("form",{onSubmit:u,children:[e.jsxs("div",{children:[e.jsx("input",{type:"text",disabled:!0,placeholder:"Enter Name",name:"Name",value:t.Name,onChange:s}),e.jsxs("select",{name:"type",id:"select",defaultValue:"Feedback",onChange:s,children:[e.jsx("option",{value:"Feedback",children:"Feedback"}),e.jsx("option",{value:"Review",children:"Review"}),e.jsx("option",{value:"Issue",children:"Issue"})]})]}),t.type==="Review"&&e.jsx(f,{defaultValue:t==null?void 0:t.rating,className:"overall-rate-antd",allowClear:!1,tooltips:["Very Bad","Bad","Good","Excellent","Awesome"],onChange:i=>{l({...t,rating:i})}}),e.jsxs("div",{children:[e.jsx("input",{type:"text",disabled:!0,placeholder:"Enter E-mail",name:"Email",value:t.Email,onChange:s}),e.jsx("input",{type:"number",required:!0,placeholder:"Enter Contact Number",name:"Contact_Number",value:t.Contact_Number,onChange:s})]}),e.jsxs("div",{id:"textArea",children:[e.jsx("textarea",{name:"Description",required:!0,id:"",cols:"30",rows:"10",minLength:10,maxLength:300,placeholder:"Describe your issue",value:t.Description,onChange:s}),e.jsxs("p",{children:[(d=t==null?void 0:t.Description)==null?void 0:d.length," / 300"]})]}),e.jsx("button",{children:m?e.jsx(C,{height:"20",width:"60",color:"white",wrapperStyle:{},wrapperClass:"",visible:!0,ariaLabel:"oval-loading",secondaryColor:"white",strokeWidth:6,strokeWidthSecondary:6}):e.jsx(e.Fragment,{children:"SUBMIT"})})]})]})]})]})})},I=()=>e.jsxs(e.Fragment,{children:[e.jsx(v,{}),e.jsx(N,{})]});export{I as default};
