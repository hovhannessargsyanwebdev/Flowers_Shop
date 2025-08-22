import React from 'react';
import { Outlet, useLocation } from "react-router-dom";

const HeaderHeightContext = React.createContext();

function Layout({ headerHeight }) {
  return (
    <HeaderHeightContext.Provider value={headerHeight}>
      <div className="layout-container" style={{ paddingTop: `${headerHeight}px` }}>
        <Outlet />
      </div>
    </HeaderHeightContext.Provider>
  );
}

export { HeaderHeightContext };
export default Layout;
