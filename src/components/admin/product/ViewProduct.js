import React, { useEffect, useState } from "react";
import '../../../assets/admin/css/styles.css';
import '../../../assets/admin/js/scripts';
import Sidebar from "../../../layouts/admin/Sidebar";
import Navbar from "../../../layouts/admin/Navbar";
import Footer from "../../../layouts/admin/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import useAuthUser from "../../../routes/AuthUser";
const ViewProduct = () => {
    const { role, token } = useAuthUser();
    const [viewproduct, setViewproduct] = useState([]);
    useEffect(() => {
        if (role === 'admin') {
            document.title = "View Product";
            const fetchproduct = async () => {
                const response = await axios.get('http://localhost:8000/api/view-product', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.status === 200) {
                    setViewproduct(response.data.product);
                }
            }
            fetchproduct();
        }
    }, [role, token])

    let viewprod = '';
    if (viewproduct.length > 0) {
        viewprod = <div className="container px-4 mt-3">
            <div className="card">
                <div className="card-header">
                    <h4>View Product
                        <Link to="/admin/add-product" className="btn btn-primary btn-sm float-end">Add Product</Link>
                    </h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Category Name</th>
                                    <th>Product Name</th>
                                    <th>Selling Price</th>
                                    <th>Image</th>
                                    <th>Edit</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>

                                {viewproduct.map((item, index) => {
                                    let ProductStatus = "";
                                    if (item.status == '0') {
                                        ProductStatus = <span className='badge bg-warning'>Active</span>
                                    } else if (item.status == '1') {
                                        ProductStatus = <span className='badge bg-danger'>Hidden</span>
                                    }
                                    return (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{item.category.name}</td>
                                            <td>{item.name}</td>
                                            <td>{item.selling_price}</td>
                                            <td><img src={`http://localhost:8000/product/uploads/${item.image}`} width="50px" alt={item.name} /></td>
                                            <td><Link to={`/admin/edit-product/${item.id}`} className="btn btn-success btn-sm">Edit</Link></td>
                                            <td>{ProductStatus}</td>
                                        </tr>
                                    );
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    } else {
        viewprod = <div>
            <div className="card card-body py-5 text-center shadow-sm mt-5">
                <h4>Your View Product is Empty</h4>
            </div>
        </div>
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
                        {role !== 'admin' ? (
                            <div className="alert alert-danger mt-4" role="alert">
                                You don't have access to this page.
                            </div>
                        ) : (
                            viewprod
                        )}

                    </main>
                    <Footer />
                </div>

            </div>
        </div>
    );
}

export default ViewProduct;
