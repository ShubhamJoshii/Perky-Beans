import{r as l,j as e,b as i}from"./index-a958b4b2.js";import{A as P}from"./AdminSidebar-472f7a6b.js";import{D as o}from"./Charts-29e37d9e.js";import"./index.esm-871905a8.js";import"./index.esm-1e03394f.js";import"./index.esm-bd03a2b8.js";import"./index.esm-8d092a6f.js";import"./index-12339e7b.js";const N=()=>{const[c,f]=l.useState({}),[n,j]=l.useState({}),[d,g]=l.useState({}),[h,x]=l.useState({}),m=async()=>{let t={};await i.get("/api/fetchOrders").then(s=>{s.data.data.filter(a=>{const{status:r}=a;t[r]=(t[r]||0)+1}),f(t)}).catch(s=>{console.log(s)})},v=async()=>{let t={},s={};await i.get("/api/fetchProduct").then(a=>{a.data.data.filter(r=>{const{Category:b,Available:u}=r;t[b]=(t[b]||0)+1,s[u?"Available":"Non-Available"]=(s[u?"Available":"Non-Available"]||0)+1}),j(t),x(s)}).catch(a=>{console.log(a)})},p=async()=>{let t={};await i.get("/api/fetchUsers").then(s=>{s.data.data.filter(a=>{const{Role:r}=a;t[r]=(t[r]||0)+1}),g(t)}).catch(s=>{console.log("Error")})};return l.useEffect(()=>{m(),v(),p()},[]),e.jsxs("div",{className:"admin-container",children:[e.jsx(P,{}),e.jsxs("main",{className:"chart-container",children:[e.jsx("h2",{children:"Pie Representative"}),e.jsxs("section",{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"Order Fulfillment Ratio"}),e.jsx(o,{labels:Object.keys(c),data:Object.values(c),backgroundColor:["teal","red","rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"],legends:!1,offset:[0,0,50]})]}),e.jsxs("div",{children:[e.jsx("h2",{children:"Product Categories Ratio"}),e.jsx(o,{labels:Object.keys(n),data:Object.values(n),backgroundColor:["rgb(255, 205, 86)","teal","rgb(255, 99, 132)","red","rgb(54, 162, 235)"],legends:!1,offset:[0,0,0,80]})]}),e.jsxs("div",{children:[e.jsx("h2",{children:"Products Availability"}),e.jsx(o,{labels:Object.keys(h),data:Object.values(h),backgroundColor:["hsl(269,80%,40%)","rgb(53, 162, 255)"],legends:!1,offset:[0,80],cutout:"60%"})]}),e.jsxs("div",{children:[e.jsx("h2",{children:"User-Admin Ratio"}),e.jsx(o,{labels:Object.keys(d),data:Object.values(d),backgroundColor:["hsl(335, 100%, 38%)","hsl(44, 98%, 50%)"],offset:[0,20],legends:!1})]})]})]})]})};export{N as default};