import{r as c,j as o,b}from"./index-0f8cf5bd.js";import{A as h}from"./AdminSidebar-6e748e34.js";import"./Charts-2d57b6bb.js";import{C as v,a as f,L as j,P as x,e as R,p as y,b as C,c as O,f as T}from"./index-c6452acb.js";import"./index.esm-bd982d43.js";import"./index.esm-cb6a9f8e.js";import"./index.esm-6e31662f.js";import"./index.esm-a27cb57a.js";v.register(f,j,x,R,y,C,O);const D={responsive:!0,plugins:{legend:{position:"top"},title:{position:"bottom",display:!0,text:"Revenue & Discount Chart"}}},$=()=>{const[e,u]=c.useState({Discount:0,TotalRevenue:0}),d=async()=>{let n={},a={};await b.get("/api/fetchOrders").then(l=>{l.data.data.filter(t=>{const{Discount:s,TotalAmountPayed:g}=t,i=new Date(t.orderedAt),r=`${i.toLocaleString("default",{month:"long"})} ${i.getFullYear()}`;n[r]=(n[r]||0)+s,a[r]=(a[r]||0)+g});let p=Object.keys(n).sort().reverse().reduce((t,s)=>(t[s]=n[s],t),{}),m=Object.keys(n).sort().reverse().reduce((t,s)=>(t[s]=a[s],t),{});u({Discount:p,TotalRevenue:m})}).catch(l=>{console.log(l)})};return c.useEffect(()=>{d()},[]),o.jsxs("div",{className:"admin-container",children:[o.jsx(h,{}),o.jsxs("main",{className:"chart-container",children:[o.jsx("h2",{children:"Line Charts"}),o.jsx("section",{children:o.jsx(T,{options:D,data:{labels:Object.keys(e==null?void 0:e.TotalRevenue),datasets:[{fill:!0,label:"Discount Allot",data:Object.values(e==null?void 0:e.Discount),borderColor:"green",backgroundColor:"lightgreen"},{fill:!0,label:"Total Revenue",data:Object.values(e==null?void 0:e.TotalRevenue),borderColor:"blue",backgroundColor:"lightblue"}]}})})]})]})};export{$ as default,D as options};