import React from "react";
import Navbar from "../../layouts/admin/Navbar";
import Sidebar from "../../layouts/admin/Sidebar";
import Footer from "../../layouts/admin/Footer";
import '../../assets/admin/css/styles.css';
import '../../assets/admin/js/scripts';

const Profile = () => {
    return (
        <div className="sb-nav-fixed">
            <Navbar />
            <div id="layoutSidenav">

                <div id="layoutSidenav_nav">
                    <Sidebar />
                </div>

                <div id="layoutSidenav_content">
                    <main>

                        Iam Profile
                    </main>
                    <Footer />
                </div>

            </div>
        </div>
    );
}

export default Profile;
