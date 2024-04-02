import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Footer from '../../../layouts/admin/Footer';
import Sidebar from '../../../layouts/admin/Sidebar';
import Navbar from '../../../layouts/admin/Navbar';
import axios from 'axios';
import useAuthUser from '../../../routes/AuthUser';

const ViewCategory = () => {
    const [categorylist, setCategoryList] = useState([]);
    const { role, token } = useAuthUser();

    useEffect(() => {
        if (role === "admin") {
            const fetchcategory = async () => {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/view-category', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setCategoryList(response.data.category);
                    }
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            }
            fetchcategory();
        }
    }, [token, role]);

    const deleteCategory = async (e, id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Deleting";

        try {
            const delresponse = await axios.delete(`http://127.0.0.1:8000/api/delete-category/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (delresponse.data.status === 200) {
                swal('Success', delresponse.data.message, 'success');
                thisClicked.closest('tr').remove();
            } else if (delresponse.data.status === 404) {
                swal('Success', delresponse.data.message, 'success');
                thisClicked.innerText = "Delete";
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }
    var viewcategory = '';
    if (categorylist.length > 0) {
        viewcategory = <div className="card mt-4">
            <div className="card-header">
                <h4>Category List
                    <Link to="/admin/add-category" className="btn btn-primary btn-sm float-end">Add Category</Link>
                </h4>
            </div>
            <div className="card-body">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorylist && categorylist.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.slug}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <Link to={`/admin/edit-category/${item.id}`} className="btn btn-success btn-sm">Edit</Link>
                                    </td>
                                    <td>
                                        <button type="button" onClick={(e) => deleteCategory(e, item.id)} className="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    } else {
        viewcategory = <div>
            <div className="card card-body py-5 text-center shadow-sm mt-5">
                <h4>Your View Category is Empty</h4>
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
                        <div className="container px-4">
                            {role !== "admin" ? (
                                <div className="alert alert-danger mt-4" role="alert">
                                    You don't have access to this page.
                                </div>
                            ) : (
                                viewcategory
                            )}
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default ViewCategory;
