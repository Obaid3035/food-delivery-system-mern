import React from 'react';
import "./Footer.css";
import Logo from "../../../../assets/img/logo.png";
import { FaLinkedin, FaTwitterSquare, FaFacebookSquare } from 'react-icons/fa';
import { NavLink } from "react-router-dom";

const Footer = () => {

    return (
        <>
            <footer className="footer-section py-5 ">
                <div className="container ">
                    <div className="footer-top">
                        <div className="row ">
                            <div className="col-md-12 text-center">
                                <NavLink to="/" className="navbar-brand">
                                    <img src={Logo} className="logo_img" alt={'logo'} />
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-around">
                        <div className=" col-lg-3 col-md-4 ">
                            <div className="footer-sec-2 footer-same ">
                                <h3>COMPANY</h3>
                                <ul>
                                    <li>
                                        About Us
                                    </li>
                                    <li>
                                        Policies
                                    </li>
                                    <li>
                                        Login / Sign up
                                    </li>
                                    <li>
                                        Become a Seller
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4  tb-menu">
                            <div className="footer-sec-2 footer-same ">
                                <h3>Admin</h3>
                                <ul>
                                    <li>
                                        Teamsnakrs@gmail.com
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 tb-menu ">
                            <div className="footer-sec-2 footer-same ">
                                <h3>SOCIAL LINKS</h3>
                                <i className="fab "> <FaFacebookSquare /></i>
                                <i className="fab  "><FaTwitterSquare /></i>
                                <i className="fab  "><FaLinkedin /></i>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <section className="copyright-section text-center py-2">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 ">
                            <p className="mb-0 ">By continuing past this page, you agree to our Terms of Service, Cookie Policy,
                                Privacy Policy and Content Policies. All trademarks are properties of their respective owners.
                                2008- <br /> 2021 © Snakrs™ Ltd. All rights reserved. </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
export default Footer;
