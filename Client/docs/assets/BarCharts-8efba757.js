import{r as u,j as a,b as g}from"./index-a958b4b2.js";import{A as x}from"./AdminSidebar-472f7a6b.js";import{C as O,a as f,L as j,B as y,p as C,b as S,c as R,d as B}from"./index-12339e7b.js";import"./index.esm-871905a8.js";import"./index.esm-1e03394f.js";import"./index.esm-bd03a2b8.js";import"./index.esm-8d092a6f.js";O.register(f,j,y,C,S,R);const $={indexAxis:"y",elements:{bar:{borderWidth:2}},responsive:!0,plugins:{legend:{position:"bottom"},title:{position:"top",display:!0,text:"Orders and Reservation throughout the Month Bar Chart"}}},K=()=>{const[s,p]=u.useState({Orders:"",keys:""}),[i,m]=u.useState({Reservation:""}),b=async()=>{let n={};await g.get("/api/fetchOrders").then(async l=>{let c={};l.data.data.filter(e=>{const r=new Date(e.orderedAt),t=`${r.toLocaleString("default",{month:"long"})} ${r.getFullYear()}`;n[t]=(n[t]||0)+1});let d=Object.keys(n).sort().reverse(),v=d.reduce((e,r)=>(e[r]=n[r],e),{});await g.get("/api/reserveSeats").then(e=>{e.data.filter(t=>{const o=new Date(`${t.reservation_Date} ${t.reservation_Timing}`),h=`${o.toLocaleString("default",{month:"long"})} ${o.getFullYear()}`;c[h]=(c[h]||0)+1});let r=d.reduce((t,o)=>(t[o]=c[o],t),{});m({Reservation:r})}).catch(e=>{console.log(e)}),p({Orders:v,keys:d})}).catch(l=>{console.log(l)})};return u.useEffect(()=>{b()},[]),a.jsxs("div",{className:"admin-container",children:[a.jsx(x,{}),a.jsxs("main",{className:"chart-container",children:[a.jsx("h2",{children:"Bar Charts Representative"}),a.jsx("section",{children:a.jsx(B,{options:$,data:{labels:Object.keys(s==null?void 0:s.Orders),datasets:[{label:"Total Orders",data:Object.values(s==null?void 0:s.Orders),borderColor:"hsl(180, 40%, 50%)",backgroundColor:"hsl(180, 40%, 50%)"},{label:"Total Reservation Seats",data:Object.values(i==null?void 0:i.Reservation),borderColor:"lightgreen",backgroundColor:"lightgreen"}]}})})]})]})};export{K as default};