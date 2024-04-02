import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../../../layouts/admin/Footer';
import Sidebar from '../../../layouts/admin/Sidebar';
import Navbar from '../../../layouts/admin/Navbar';
import useAuthUser from '../../../routes/AuthUser';

function Order() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const { token } = useAuthUser();

    useEffect(() => {

        document.title = "Orders";
        axios.get(`http://localhost:8000/api/admin/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.status === 200) {
                setOrders(res.data.orders);
                setLoading(false);
            }
        });
    }, [token]);


    var display_orders = "";
    if (loading) {
        return <h4>Loading Orders...</h4>
    }
    else {
        display_orders = orders.map((item, index) => {

            return (
                <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.tracking_no}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>
                        <Link to={`view-order/${item.id}`} className="btn btn-success btn-sm">View</Link>
                    </td>
                </tr>
            )
        });
    }

    return (

        <div className="sb-nav-fixed">
            <Navbar />
            <div id="layoutSidenav">

                <div id="layoutSidenav_nav">
                    <Sidebar />
                </div>

                <div id="layoutSidenav_content">
                    <main>

                        <div className="container px-4 mt-3">
                            <div className="card">
                                <div className="card-header">
                                    <h4>Orders  </h4>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Tracking No.</th>
                                                    <th>Phone No.</th>
                                                    <th>Email</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {display_orders}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>

            </div>
        </div>


    )

}

export default Order;