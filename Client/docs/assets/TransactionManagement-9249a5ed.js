import{r as g,j as s,L as S}from"./index-8034329b.js";import{A as f}from"./AdminSidebar-ddd69618.js";import"./index.esm-525efdad.js";import"./index.esm-3007911d.js";import"./index.esm-4a30bd17.js";const b="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804",y=[{name:"Puma Shoes",photo:b,_id:"asdsaasdas",quantity:4,price:2e3}],v=()=>{const[t,r]=g.useState({name:"Abhishek Singh",address:"77 Black Street",city:"Neyword",state:"Nevada",country:"India",pinCode:2434341,status:"Processing",subtotal:4e3,discount:1200,shippingCharges:0,tax:200,total:3e3,orderItems:y,_id:"asdnasjdhbn"}),{name:n,address:a,city:i,country:c,state:o,pinCode:h,subtotal:p,shippingCharges:l,tax:x,discount:m,total:u,status:d}=t,j=()=>{r(e=>({...e,status:e.status==="Processing"?"Shipped":"Delivered"}))};return s.jsxs("div",{className:"admin-container",children:[s.jsx(f,{}),s.jsxs("main",{className:"product-management",children:[s.jsxs("section",{style:{padding:"2rem"},children:[s.jsx("h2",{children:"Order Items"}),t.orderItems.map(e=>s.jsx(N,{name:e.name,photo:e.photo,_id:e._id,quantity:e.quantity,price:e.price}))]}),s.jsxs("article",{className:"shipping-info-card",children:[s.jsx("h1",{children:"Order Info"}),s.jsx("h5",{children:"User Info"}),s.jsxs("p",{children:["Name: ",n]}),s.jsxs("p",{children:["Address: ",`${a}, ${i}, ${o}, ${c} ${h}`]}),s.jsx("h5",{children:"Amount Info"}),s.jsxs("p",{children:["Subtotal: ",p]}),s.jsxs("p",{children:["Shipping Charges: ",l]}),s.jsxs("p",{children:["Tax: ",x]}),s.jsxs("p",{children:["Discount: ",m]}),s.jsxs("p",{children:["Total: ",u]}),s.jsx("h5",{children:"Status Info"}),s.jsxs("p",{children:["Status: ",s.jsx("span",{className:d==="Delivered"?"purple":d==="Shipped"?"green":"red",children:d})]}),s.jsx("button",{onClick:j,children:"Process Status"})]})]})]})},N=({name:t,photo:r,price:n,quantity:a,_id:i})=>s.jsxs("div",{className:"transaction-product-card",children:[s.jsx("img",{src:r,alt:t}),s.jsx(S,{to:`/product/${i}`,children:t}),s.jsxs("span",{children:["$",n," X ",a," = $",n*a]})]});export{v as default};
