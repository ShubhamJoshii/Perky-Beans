import{r as a,U as v,N as g,e as u,j as e,R as p,a as s,b as C}from"./index-dbb2527e.js";import{O as N}from"./Blocks-0e59252c.js";import{G as l,d as f}from"./index.esm-d3697b5c.js";function w(i){return l({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"}},{tag:"path",attr:{d:"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"}}]})(i)}function T(i){return l({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"}},{tag:"path",attr:{d:"M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"}}]})(i)}function R(i){return l({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"}},{tag:"path",attr:{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}}]})(i)}function H(i){return l({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0V0z",opacity:".87"}},{tag:"path",attr:{d:"M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z"}}]})(i)}const E="/assets/RandomUser-27516275.png",M="/assets/PerkyBeansLogo-5c8ebd3a.png",k=()=>{const[i,n]=a.useState(!1),[x,c]=a.useState(!1),o=a.useRef(0),{userData:t,setUserData:j}=a.useContext(v),{notification:m}=a.useContext(g),r=u();a.useEffect(()=>{i?o.current.style.top="58px":o.current.style.top="-120vh"},[i]);const d=async()=>{c(!0),await C.get("/api/logout").then(h=>{h.data&&(m(h.data,"Success"),j(null))}),setTimeout(()=>{c(!1)},1e3)};return a.useEffect(()=>{window.scrollTo({top:0,left:0,behavior:"smooth"})},[r]),e.jsxs(p.Fragment,{children:[e.jsxs("div",{className:"Header",children:[e.jsx(s,{to:"/",children:e.jsx("img",{src:M,alt:"Logo"})}),e.jsxs("ol",{children:[e.jsx(s,{to:"/",ClassName:"active",children:e.jsx("li",{children:"HOME"})}),e.jsx(s,{to:"/products",ClassName:"active",children:e.jsx("li",{children:"PRODUCTS"})}),e.jsx(s,{to:"/orders/my-order",className:r.pathname.includes("/orders")?"active":"",children:e.jsx("li",{children:"ORDERS"})}),e.jsx(s,{to:"/contact",ClassName:"active",children:e.jsx("li",{children:"CONTACT"})}),e.jsx(s,{to:"/reserveseat",ClassName:"active",children:e.jsx("li",{children:"RESERVE SEAT"})}),(t==null?void 0:t.Role)==="Admin"&&e.jsx(s,{id:"Admin",to:"/admin",children:e.jsx("li",{children:"ADMIN"})}),e.jsx("div",{id:"LOGINRegister",children:t?e.jsx("a",{onClick:d,children:e.jsx("button",{id:"loginRegisterHeader",children:x?e.jsx(N,{height:"16",width:"16",color:"white",wrapperStyle:{},wrapperClass:"",visible:!0,ariaLabel:"oval-loading",secondaryColor:"white",strokeWidth:6,strokeWidthSecondary:6}):e.jsx(e.Fragment,{children:"LOGOUT"})})}):e.jsx(s,{to:"/auth/login",className:r.pathname.includes("/auth")?"active":"",children:e.jsx("button",{id:"loginRegisterHeader",children:"LOGIN / REGISTER"})})})]}),e.jsx("div",{id:"MenuIcons",children:i?e.jsx(R,{onClick:()=>n(!i)}):e.jsx(f,{onClick:()=>n(!i)})})]}),e.jsxs("div",{ref:o,id:"responiveSliderMenu",children:[t?e.jsxs("div",{id:"userLoginINFO",children:[e.jsx("img",{src:E,alt:"UserImg"}),e.jsxs("div",{children:[e.jsx("h2",{children:t==null?void 0:t.Full_Name}),e.jsx("p",{children:t==null?void 0:t.Email})]})]}):e.jsxs("div",{id:"loginRegisterBTNS",children:[e.jsx(s,{to:"/auth/login",ClassName:"active",onClick:()=>n(!1),children:e.jsx("button",{children:"LOGIN"})}),e.jsx(s,{to:"/auth/register",ClassName:"active",onClick:()=>n(!1),children:e.jsx("button",{children:"REGISTER"})})]}),e.jsxs("ol",{onClick:()=>n(!1),children:[e.jsx(s,{to:"/",ClassName:"active",children:e.jsx("li",{children:"HOME"})}),e.jsx(s,{to:"/products",ClassName:"active",children:e.jsx("li",{children:"PRODUCTS"})}),e.jsx(s,{to:"/orders/my-order",ClassName:"active",children:e.jsx("li",{children:"ORDERS"})}),e.jsx(s,{to:"/contact",ClassName:"active",children:e.jsx("li",{children:"CONTACT"})}),e.jsx(s,{to:"/reserveseat",ClassName:"active",children:e.jsx("li",{children:"RESERVE SEAT"})}),(t==null?void 0:t.Role)==="Admin"&&e.jsxs(s,{to:"/admin",ClassName:"active",children:[" ",e.jsx("li",{children:"Admin"})," "]})]}),t&&e.jsx("button",{id:"logoutBTN",onClick:()=>d(),children:"LOGOUT"})]})]})};export{k as H,T as M,R as a,H as b,w as c};
