import{r as l,d as w,N as S,U as D,e as T,j as t,R as F,a as L,b as m}from"./index-8034329b.js";import{B as k}from"./Bags-1127a5c3.js";import{P as c,F as A}from"./Footer-50ddd481.js";import{H as W}from"./Header-f9b55ae4.js";import{c as R,d as U,e as V,f as H}from"./index.esm-525efdad.js";import{a as E}from"./index.esm-f19b925b.js";import{V as _,L as O}from"./veg-c6a25b47.js";import{S as $}from"./SearchBar-2431855b.js";import"./index.esm-e4be5a7f.js";import"./index.esm-3007911d.js";import"./index.esm-4a30bd17.js";import"./index.esm-daad8c6f.js";const M=()=>{const[p,u]=l.useState([]),[n,h]=l.useState(1),[x,G]=l.useState(24),[d,q]=l.useState(w()),[v,j]=l.useState(0),{notification:N,checkUserAlreadyLogin:f}=l.useContext(S),{userData:o,setUserData:z}=l.useContext(D);let I=n*x,C=I-x;const P=T();l.useEffect(()=>{var a;let e=[];if(P.state!==null){let s=P.state;if(e.length<=0&&((a=c)==null||a.filter(i=>{s.Category.filter(r=>{r.apiName===i.Category&&e.push(i)})})),e.length<=0&&c.filter(i=>{s.Ingredients.filter(r=>{r.apiName===i.type&&e.push(i)})}),e.length>0&&s.Ingredients.length>0){let i=[];e.filter((r,J)=>{s.Ingredients.filter(y=>{y.apiName===r.type&&i.push(r)})}),e=i}if(e.length<=0&&c.filter(i=>{i.Price<=parseInt(s.PriceRange)&&e.push(i)}),e.length>0){let i=[];e.filter(r=>{r.Price<=parseInt(s.PriceRange)&&i.push(r)}),e=i}if(e.length<=0&&c.filter(i=>{i.Star>=s.RatingUP&&e.push(i)}),e.length>0){let i=[];e.filter(r=>{r.Star>=s.RatingUP&&i.push(r)}),e=i}u(e),h(1)}else u(p)},[P]),l.useEffect(()=>{let e;Object.keys(d).length>0?e=c.filter(a=>a.Category===d.categoryID||a._id===d.categoryID):e=c,u(e)},[d]);let g=[];for(let e=1;e<=Math.ceil(p.length/x);e++)g.push(e);const B=async e=>{o?o.Wishlist.find(s=>s.productID===e)?await m.post("/api/removefromWishlist",{productID:e}).then(s=>{f()}):await m.post("/api/addToWishlist",{productID:e}).then(s=>{f()}):N("Please Login Before Adding to Wishlist","Warning")},b=async e=>{o?o.Bag.find(s=>s.productID===e)?await m.post("/api/removeFromBag",{productID:e}).then(s=>{f()}):await m.post("/api/addtoBag",{productID:e,SmallCount:0,MediumCount:1,LargeCount:0}).then(s=>{f()}):N("Please Login Before Adding to Bag","Warning")};return t.jsxs(F.Fragment,{children:[t.jsx("div",{className:"products",children:p.slice(C,I).map(e=>{let a;return d.categoryID?a=`./${e._id}`:a=`./${e.Category}/${e._id}`,t.jsxs("div",{className:"product-card",children:[e.type==="Veg"?t.jsx("img",{id:"veg",src:_,alt:"Veg"}):t.jsx(O,{id:"LuVegan"}),t.jsx("div",{id:"product-img-BTN1",children:t.jsxs("div",{id:"onhover-showBTN1",children:[t.jsx("p",{id:"wishlist-para",children:"WISHLIST"}),t.jsx(R,{onClick:()=>B(e._id),className:o!=null&&o.Wishlist.find(s=>s.productID===e._id)?"active-Heart heart":" heart"})]})}),t.jsx("div",{id:"product-img-BTN2",children:t.jsxs("div",{id:"onhover-showBTN2",children:[t.jsx("p",{id:"bag-para",children:"BAG"}),t.jsx(E,{onClick:()=>b(e._id),className:o!=null&&o.Bag.find(s=>s.productID===e._id)?"active-Bags bag":"bag"})]})}),t.jsxs(L,{to:a,onClick:()=>window.scrollTo({top:0,left:0,behavior:"smooth"}),children:[t.jsx("img",{src:e.Image,alt:e.Name,className:"product-image skeleton"}),t.jsxs("div",{className:"product-info",children:[t.jsx("h5",{className:"product-name",children:e.Name}),t.jsxs("p",{className:"product-desc",children:[e.Desc.slice(0,60),"..."]}),t.jsxs("p",{className:"product-price",children:["₹",e.Price]}),t.jsxs("div",{id:"rating",children:[t.jsx(U,{id:"A"}),t.jsxs("p",{className:"product-rating",children:[e.Star.toFixed(1),"/5.0"]})]})]})]})]},e._id)})}),t.jsx("div",{id:"pagination",children:g.length>1&&t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"Pages",id:n===1?"non-active-side-btn":"",onClick:()=>{window.scrollTo({top:0,left:0,behavior:"smooth"}),n!==1&&(j(v-18),h(n-1))},children:t.jsx(V,{})}),g.map((e,a)=>t.jsx("div",{onClick:()=>{window.scrollTo({top:0,left:0,behavior:"smooth"}),j(e),h(a+1)},className:a+1===n?"activePage Pages":"Pages",children:a+1},a)),t.jsx("div",{className:"Pages",id:n===g.length?"non-active-side-btn":"",onClick:()=>{window.scrollTo({top:0,left:0,behavior:"smooth"}),n!==g.length&&(j(v+18),h(n+1))},children:t.jsx(H,{})})]})})]})},le=()=>t.jsxs(t.Fragment,{children:[t.jsx(W,{}),t.jsx(k,{}),t.jsx($,{position:"100",currPlace:"ProductPage"}),t.jsx(M,{}),t.jsx(A,{})]});export{le as default};
