import{r as l,N as S,j as e,b as x}from"./index-a958b4b2.js";import{A as U}from"./AdminSidebar-472f7a6b.js";import{b as N}from"./index.esm-bd03a2b8.js";import{a as P}from"./index.prod-f6806036.js";import{P as y}from"./Pagination-fc273cc2.js";import{$ as C}from"./module-a3a79733.js";import"./index.esm-871905a8.js";import"./index.esm-1e03394f.js";import"./index.esm-8d092a6f.js";const L=()=>{const[s,m]=l.useState();l.useState(!1);const[j,d]=l.useState(!0),[o,f]=l.useState(1),{notification:n}=l.useContext(S),g=async(t,a)=>{d(!0),await x.post("/api/updateUserRole",{_id:t,Role:a}).then(i=>{i.data.result?(c(),n(i.data.message,"Success")):n(i.data.message,"Un-Success")}).catch(i=>{console.log(i)}).finally(()=>{d(!1)})},c=async()=>{d(!0),await x.get("/api/fetchUsers").then(t=>{var a;(a=t.data)!=null&&a.data&&m(t.data.data)}).catch(t=>{console.log("Error")}).finally(()=>{d(!1)})};l.useEffect(()=>{c()},[]);const p=async t=>{alert(t),await x.post("/api/deleteUser",{_id:t}).then(a=>{a.data.result?(n(a.data,"Success"),console.log(a.data),c()):n(a.data,"Un-Success")}).catch(a=>{console.log(a)})},r=8,b=Math.ceil((s==null?void 0:s.length)/r),u=t=>{f(t)},h=s==null?void 0:s.slice((o-1)*r,o*r);return e.jsxs("div",{className:"admin-container",children:[e.jsx(U,{}),e.jsxs("div",{className:"dashboard-product-box",children:[e.jsx("h2",{class:"heading",children:"Users"}),e.jsxs("table",{class:"table",role:"table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"Role"}),e.jsx("th",{children:"Email Verified"}),e.jsx("th",{children:"Admins"}),e.jsx("th",{children:"Delete"})]})}),j?e.jsx("td",{colSpan:"6",children:e.jsx(C,{height:"40",width:"60",color:"black",wrapperStyle:{},wrapperClass:"loading",visible:!0,ariaLabel:"oval-loading",secondaryColor:"black",strokeWidth:4,strokeWidthSecondary:4})}):e.jsxs("tbody",{children:[h==null?void 0:h.map((t,a)=>{const i=t.Role==="Admin";return e.jsxs("tr",{children:[e.jsx("td",{children:t.Full_Name}),e.jsx("td",{children:t.Email}),e.jsx("td",{children:t.Role}),e.jsx("td",{children:t.isVerified?e.jsx("p",{id:"verified",children:"Verified"}):e.jsx("p",{id:"not-verified",children:"Not-Verified"})}),e.jsx("td",{children:e.jsx(P,{onChange:()=>g(t._id,t.Role),checked:i,className:"react-switch"})}),e.jsx("td",{children:e.jsx("button",{onClick:()=>p(t._id),children:e.jsx(N,{})})})]},a)}),!s&&e.jsx("p",{children:"No User Found"})]})]}),!j&&e.jsx(y,{currentPage:o,totalPages:b,onPageChange:u})]})]})};export{L as default};