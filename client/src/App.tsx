import React from 'react';
import './App.css';
import {Slide, ToastContainer} from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//admin
import {adminRoutes, RoutesLink } from "./container/admin/Navbar/routes";
import AdminNavbar from "./container/admin/Navbar/Navbar";

//vendor
import { vendorRoutes} from "./container/vendor/Navbar/routes";
import VendorNavbar from "./container/vendor/Navbar/Navbar";

//Main
import { mainRoutes } from './container/customer/Navbar/routes';
import Header from './container/customer/Navbar/Header/Header';
import Footer from './container/customer/Navbar/Footer/Footer';

//Pages
import Register from "./container/auth/register/register";
import Login from "./container/auth/login/login";
import ForgetPassword from './container/auth/ForgetPassword/ForgetPassword';
import ResetPassword from './container/auth/ResetPassword/ResetPassword';
import Error404 from './components/404/404';
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ConnectAccount from "./container/vendor/Pages/Setting/ConnectAccount/ConnectAccount";

export enum USER_ROLE {
    CUSTOMER = "customer",
    VENDOR = "vendor",
    ADMIN = "admin"
}

export enum ORDER_STATUS {
    UNDER_APPROVAL = "under-approval",
    IN_PROGRESS = "in-progress",
    REJECTED = "rejected",
    COMPLETED = "completed"
}

export enum DELIVERY_TYPE {
    LOCAL_DELIVERY = "local-delivery",
    POSTAL_DELIVERY = "postal-delivery",
    PICKUP = "pickUp",
    BOTH = "both"
}

export function errorMessage(message: string) {
    return  <small className={"text-danger my-3"}>{message}</small>

}

function App() {

  const adminLayout = (
      adminRoutes.map((item: RoutesLink, index) => (
          <Route key={index} path={item.path} element={
            <React.Fragment>
              <AdminNavbar />
                <PrivateRoute role={USER_ROLE.ADMIN}>
                    { item.component }
                </PrivateRoute>
            </React.Fragment>
          } />
      ))
  )

  const vendorLayout = (
      vendorRoutes.map((item: RoutesLink, index) => (
            <Route key={index} path={item.path} element={
                <React.Fragment>
                    <VendorNavbar />
                    <PrivateRoute role={USER_ROLE.VENDOR}>
                        { item.component }
                    </PrivateRoute>
                </React.Fragment>
            } />
        ))
    )

  const mainLayout = (
    mainRoutes.map((item: RoutesLink, index) => (
        <Route key={index} path={item.path} element={
            <React.Fragment>
                <Header />
                { item.component }
                <Footer />
            </React.Fragment>
        } />
    ))
  )

  return (
      <div className="App">
          <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              transition={Slide}
              pauseOnFocusLoss
              draggable
              pauseOnHover
          />
          <Router>
              <Routes>
                  {adminLayout}
                  {vendorLayout}
                  {mainLayout}
                  <Route path={'/admin/login'} element={<Login />} />
                  <Route path={'/register'} element={<Register />}/>
                  <Route path={'/login'} element={<Login />}  />
                  <Route path={'/vendor/register'} element={<Register />}/>
                  <Route path={'/vendor/login'} element={<Login />} />
                  <Route path={'/resetPassword/:id'} element={<ResetPassword />}/>
                  <Route path={'/vendor/account'} element={<ConnectAccount/>}/>
                  <Route path={'/forgetPassword'} element={<ForgetPassword/>}/>
                  <Route path={'*'} element={<Error404 />}/>
              </Routes>
          </Router>
      </div>
  );
}
export default App;
