import{r as o,U as p,N as h,j as e,R as x,b as j}from"./index-8034329b.js";import{O as v,H as b}from"./Header-f9b55ae4.js";import{I as C}from"./Slider (1)-562329a8.js";import"./index.esm-3007911d.js";const g=()=>{const{userData:t,setUserData:f}=o.useContext(p),{notification:n}=o.useContext(h),[a,c]=o.useState({Name:void 0,Email:void 0,type:"Feedback",Contact_Number:void 0,Description:void 0}),[d,l]=o.useState(!1),i=r=>{const s=r.target.name,u=r.target.value;c({...a,[s]:u})},m=async r=>{r.preventDefault(),a.type&&a.Contact_Number.length===10&&a.Description?(l(!0),await j.post("/api/contact",{_id:t==null?void 0:t._id,...a}).then(s=>{s.data.Success?n(s.data.message,"Success"):n(s.data.message,"Un-Success"),c({Name:(t==null?void 0:t.Full_Name)||"",Email:(t==null?void 0:t.Email)||"",type:"Feedback",Contact_Number:"",Description:""}),l(!1)}).catch(()=>{})):a.Contact_Number.length!=10?n("Enter Correct Contact Number","Info"):a.Description?n("Please Login First !","Un-Success"):n("Enter Description","Info")};return o.useEffect(()=>{t&&c({...a,Name:t==null?void 0:t.Full_Name,Email:t==null?void 0:t.Email})},[t]),e.jsx(x.Fragment,{children:e.jsxs("div",{id:"Contact",children:[e.jsx("img",{src:C,alt:"SideIMG"}),e.jsxs("div",{id:"ContactForm",children:[e.jsx("div",{id:"blur"}),e.jsxs("div",{id:"BlurFORM",children:[e.jsx("h2",{children:"We’d love to help"}),e.jsx("p",{children:"24/7 we will answer your questions and problems"}),e.jsxs("form",{onSubmit:m,children:[e.jsxs("div",{children:[e.jsx("input",{type:"text",disabled:!0,placeholder:"Enter Name",name:"Name",value:a.Name,onChange:i}),e.jsxs("select",{name:"type",id:"select",defaultValue:"Feedback",onChange:i,children:[e.jsx("option",{value:"Feedback",children:"Feedback"}),e.jsx("option",{value:"Review",children:"Review"}),e.jsx("option",{value:"Issue",children:"Issue"})]})]}),e.jsxs("div",{children:[e.jsx("input",{type:"text",disabled:!0,placeholder:"Enter E-mail",name:"Email",value:a.Email,onChange:i}),e.jsx("input",{type:"number",required:!0,placeholder:"Enter Contact Number",name:"Contact_Number",value:a.Contact_Number,onChange:i})]}),e.jsx("textarea",{name:"Description",required:!0,id:"",cols:"30",rows:"10",placeholder:"Describe your issue",value:a.Description,onChange:i}),e.jsx("button",{children:d?e.jsx(v,{height:"20",width:"60",color:"white",wrapperStyle:{},wrapperClass:"",visible:!0,ariaLabel:"oval-loading",secondaryColor:"white",strokeWidth:6,strokeWidthSecondary:6}):e.jsx(e.Fragment,{children:"SUBMIT"})})]})]})]})]})})},F=()=>e.jsxs(e.Fragment,{children:[e.jsx(b,{}),e.jsx(g,{})]});export{F as default};