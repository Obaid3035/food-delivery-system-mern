import React, {useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as FiIcons from "react-icons/fi";
import {useNavigate} from "react-router-dom";
import DashboardLogo from "../../assets/img/dashboard-logo.png";
import "./Sidebar.css"

export interface SideBarRoutes {
    icon: JSX.Element,
    path?: string,
    title: string,
    isSubNav?: boolean,
}

const SideBar = (props: any) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sideBar, setSideBar] = useState(false)
    const showSideBar = () => setSideBar(!sideBar);

    const onLogOutHandler = () => {
        localStorage.clear();
        navigate('/')
    }

    const classes = (path: string) => {
        if (path === location.pathname) {
            return 'nav_active'
        }
        return ''
    }

    return (
        <div className={sideBar ? 'sidebar active' : 'sidebar'}>
            <div className={'logo_content'}>
                <div className={'profile'}>
                    <img alt={'profile'} src={DashboardLogo} />
                    <p className={'mb-0'}>Snakrs</p>
                </div>
                <FaIcons.FaBars className={'fa-bars'} onClick={showSideBar} />
            </div>
            <ul className="nav_list p-0">
                {
                    props.sideBarItems.map((item: SideBarRoutes , index: React.Key | null | undefined) =>{
                        if (item.path) {
                            return  (
                                <li key={index} className={`${classes(item.path)}`}>
                                    <div>
                                        <Link to={item.path}>
                                            { item.icon }
                                            <span>{ item.title }</span>
                                        </Link>
                                    </div>
                                </li>
                            )
                        }
                    })
                }
                <li className="logout_btn" onClick={onLogOutHandler}>
                    <Link to={'#'}>
                        <FiIcons.FiLogOut />
                        <span>Logout</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
