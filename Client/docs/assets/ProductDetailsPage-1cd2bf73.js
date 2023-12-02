import{r as a,d as v,U as B,N as I,j as t,R as L,b as l}from"./index-dbb2527e.js";import{O as W}from"./Blocks-0e59252c.js";import{c as T,d as _}from"./index.esm-7735cdba.js";import{G as C}from"./index.esm-d3697b5c.js";import{V as k,L as A}from"./veg-fd9521f4.js";import{B as F}from"./Bags-d9fdcdc4.js";import{C as M}from"./CustomerReview-1ca704fa.js";import{F as V}from"./Footer-8e48a51a.js";import{H as E}from"./Header-15d56c07.js";import"./index.esm-0691a448.js";import"./index.esm-c62830c2.js";import"./index.esm-b62fc84f.js";import"./index.esm-a8bd4a32.js";function H(o){return C({tag:"svg",attr:{version:"1.2",baseProfile:"tiny",viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M18 11h-12c-1.104 0-2 .896-2 2s.896 2 2 2h12c1.104 0 2-.896 2-2s-.896-2-2-2z"}}]})(o)}function R(o){return C({tag:"svg",attr:{version:"1.2",baseProfile:"tiny",viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M18 10h-4v-4c0-1.104-.896-2-2-2s-2 .896-2 2l.071 4h-4.071c-1.104 0-2 .896-2 2s.896 2 2 2l4.071-.071-.071 4.071c0 1.104.896 2 2 2s2-.896 2-2v-4.071l4 .071c1.104 0 2-.896 2-2s-.896-2-2-2z"}}]})(o)}const U=()=>{var j;const[o,u]=a.useState(0),[i,h]=a.useState(0),[c,x]=a.useState(0),[s,N]=a.useState({}),[P,S]=a.useState(!0);let m=v().productID;const{userData:r,setUserData:G}=a.useContext(B),{checkUserAlreadyLogin:p,notification:g}=a.useContext(I);a.useEffect(()=>{r==null||r.Bag.find(e=>{e.productID===s._id&&(u(e.SmallCount),h(e.MediumCount),x(e.LargeCount))})},[r]);const b=async()=>{await l.post("/api/fetchProductDetails",{_id:m}).then(e=>{console.log(e.data.data),N(e.data.data)}).catch(e=>{console.log(e)}).finally(()=>{S(!1)})};a.useEffect(()=>{m&&b()},[m]);const n=[{id:1,name:"regular",price:(s==null?void 0:s.Price)-50,counter:o,setCounter:u},{id:2,name:"medium",price:s==null?void 0:s.Price,counter:i,setCounter:h},{id:3,name:"large",price:(s==null?void 0:s.Price)+50,counter:c,setCounter:x}],w=n[0].price*n[0].counter+n[1].price*n[1].counter+n[2].price*n[2].counter,D=async e=>{r?r.Wishlist.find(d=>d.productID===e)?await l.post("/api/removefromWishlist",{productID:e}).then(d=>{p()}):await l.post("/api/addToWishlist",{productID:e}).then(d=>{p()}):g("Please Login Before Adding to Wishlist","Warning")},y=async e=>{if(r){let f=r.Bag.find(d=>d.productID===e);o||i||c>0?f?await l.post("/api/updateBag",{productID:e,SmallCount:o,MediumCount:i,LargeCount:c}).then(d=>{p()}):await l.post("/api/addtoBag",{productID:e,SmallCount:o,MediumCount:i,LargeCount:c}).then(d=>{p()}):g("firstly, Select Size","Warning")}else g("Please Login Before Adding to Bag","Warning")};return t.jsxs(L.Fragment,{children:[t.jsx(F,{}),P?t.jsx(W,{height:"40",width:"60",color:"white",wrapperStyle:{},wrapperClass:"products loading",visible:!0,ariaLabel:"oval-loading",secondaryColor:"white",strokeWidth:4,strokeWidthSecondary:4}):t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:"products product-board",children:[t.jsxs("div",{className:"product-card",children:[t.jsx("div",{id:"product-img-BTN1",children:t.jsxs("div",{id:"onhover-showBTN1",children:[t.jsx("p",{id:"wishlist-para",children:"WISHLIST"}),t.jsx(T,{onClick:()=>D(s._id),className:r!=null&&r.Wishlist.find(e=>e.productID===s._id)?"active-Heart heart":"heart"})]})}),t.jsx("img",{className:"product-image",src:s.Product_Photo,alt:s.Product_Photo,loading:"lazy"}),t.jsxs("div",{className:"product-info",children:[t.jsx("h5",{className:"product-name",children:s.Product_Name}),t.jsxs("p",{className:"product-price",children:["₹",s.Price]}),t.jsxs("div",{className:"product-star",children:[t.jsx(_,{id:"A"}),t.jsxs("p",{className:"product-rating",children:[(j=Number(s.Rating))==null?void 0:j.toFixed(1),"/5.0"]})]})]})]},s._id),t.jsxs("div",{className:"product-board-desc",children:[t.jsxs("h1",{children:[s.Product_Name,s.type==="Veg"?t.jsx("img",{id:"veg",src:k,alt:"Veg"}):t.jsx(A,{id:"LuVegan"})]}),t.jsx("p",{children:s.Description}),t.jsxs("div",{className:"product-board-sizes",children:[t.jsx("h2",{children:"Select Sizes"}),t.jsx("div",{className:"sizes",children:n.map(e=>t.jsxs("div",{id:e.name,children:[t.jsx("img",{src:s.Product_Photo,alt:s.Product_Photo}),t.jsx("p",{children:e.name}),t.jsxs("p",{className:"product-price",children:["₹",e.price]}),t.jsxs("div",{className:"counter",children:[t.jsx("button",{className:"btn btn--minus",onClick:()=>{e.counter>0?e.setCounter(e.counter-1):e.setCounter(e.counter)},children:t.jsx(H,{})}),t.jsx("p",{children:e.name}),t.jsx("span",{children:e.counter}),t.jsx("button",{className:"btn btn--plus",onClick:()=>{e.counter<9?e.setCounter(e.counter+1):e.setCounter(e.counter)},children:t.jsx(R,{})})]})]},e.id))}),t.jsxs("div",{id:"totalorder",children:[t.jsx("div",{className:"total",children:t.jsxs("h1",{children:["Total Amount ₹ ",w]})}),t.jsx("button",{className:"order",style:o||i||c>0?{}:{background:"grey"},onClick:()=>y(s._id),children:"Add to Bag"})]})]})]})]}),t.jsx(M,{})]})]})},rt=()=>{const[o,u]=a.useState({});let i=v().productID;const h=async()=>{await l.post("/api/fetchProductDetails",{_id:i}).then(c=>{u(c.data.data)}).catch(c=>{console.log(c)})};return a.useEffect(()=>{i&&h()},[i]),t.jsxs(t.Fragment,{children:[t.jsx(E,{}),t.jsx(U,{}),t.jsx(V,{})]})};export{rt as default};
