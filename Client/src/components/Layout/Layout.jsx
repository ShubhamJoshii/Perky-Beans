import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
const Layout = ({children}) => {
  return (
    <React.Fragment>
      <Header />
      {children}
      <Footer />
    </React.Fragment>
  );
};

export default Layout;
