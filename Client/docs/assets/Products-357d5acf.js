import{r as d,j as t,L as i,b as c}from"./index-8034329b.js";import{A as n}from"./AdminSidebar-ddd69618.js";import{a as o}from"./index.esm-e4be5a7f.js";import"./index.esm-525efdad.js";import"./index.esm-3007911d.js";import"./index.esm-4a30bd17.js";const P=()=>{const[e,a]=d.useState(),r=async()=>{await c.get("/api/fetchProduct").then(s=>{console.log(s.data.data),a(s.data.data)}).catch(s=>{console.log("Error")})};return d.useEffect(()=>{r()},[]),t.jsxs("div",{className:"admin-container",children:[t.jsx(n,{}),t.jsxs("div",{className:"dashboard-product-box",children:[t.jsx("h2",{class:"heading",children:"Products"}),t.jsxs("table",{class:"table",role:"table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:"_id"}),t.jsx("th",{children:"Photo"}),t.jsx("th",{children:"Name"}),t.jsx("th",{children:"Description"}),t.jsx("th",{children:"Price"}),t.jsx("th",{children:"Rating"}),t.jsx("th",{children:"Category"}),t.jsx("th",{children:"Type"}),t.jsx("th",{children:"Action"})]})}),t.jsxs("tbody",{children:[e==null?void 0:e.map(s=>(console.log(s),t.jsxs("tr",{children:[t.jsx("td",{children:s._id}),t.jsx("td",{children:t.jsx("img",{src:s.Product_Photo,style:{borderRadius:"20px"},alt:s.Product_Name})}),t.jsx("td",{children:s.Product_Name}),t.jsxs("td",{children:[s.Description.slice(0,50),"..."]}),t.jsx("td",{children:s.Price}),t.jsx("td",{children:s.Rating}),t.jsx("td",{children:s.Category}),t.jsx("td",{children:s.type}),t.jsx("td",{children:t.jsx(i,{to:`/admin/product/${s._id}`,children:"Manage"})})]}))),!e&&t.jsx("p",{children:"No Product Found"})]})]})]}),t.jsx(i,{to:"/admin/product/new",className:"create-product-btn",children:t.jsx(o,{})})]})};export{P as default};
