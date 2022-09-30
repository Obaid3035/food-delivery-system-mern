import React from 'react';
import { adminSideBarItems } from "./routes";
import Sidebar from "../../../components/Sidebar/Sidebar";

const NavBar = () => {
    return (
        <>
            <Sidebar sideBarItems={adminSideBarItems} />
        </>
    );
};

export default NavBar;
