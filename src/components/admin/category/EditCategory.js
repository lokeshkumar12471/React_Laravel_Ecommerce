import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import useAuthUser from '../../../routes/AuthUser';
import swal from 'sweetalert';
import Footer from '../../../layouts/admin/Footer';
import Sidebar from '../../../layouts/admin/Sidebar';
import Navbar from '../../../layouts/admin/Navbar';


const EditCategory = () => {
    const [categoryInput, setCategoryInput] = useState([]);
    const [errors, setError] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuthUser();
    useEffect(() => {
        const fetchEditData = async () => {
            const response = await axios.get(`http://localhost:8000/api/edit-category/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === 200) {
                setCategoryInput(response.data.category);
            } else if (response.data.status === 404) {
                swal('Error', response.data.message, 'error');
                navigate('/admin/view-category');
            }
        }
        fetchEditData();
    }, [id, navigate, token]);
    const handleInput = (e) => {
        setCategoryInput({ ...categoryInput, [e.target.name]: e.target.value });
    }
    const updateCategory = async (e) => {
        e.preventDefault();
        const updateres = await axios.post(`http://localhost:8000/api/update-category/${id}`, categoryInput, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (updateres.data.status === 200) {
            swal("Success", updateres.data.message, "success");
            setError([]);
            navigate('/admin/view-category');
        } else if (updateres.data.status === 422) {
            swal('All fields are mandatory', "", "error");
            setError(updateres.data.errors);
        } else if (updateres.data.status === 404) {
            swal('Error', updateres.data.message, 'error');
            navigate('admin/view-category');
        }
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
                            <div className="card mt-4">
                                <div className="card-header">
                                    <h4>Edit Category
                                        <Link to="/admin/view-category" className="btn btn-primary btn-sm float-end">BACK</Link>
                                    </h4>
                                </div>
                                <div className="card-body">

                                    <form onSubmit={updateCategory}>
                                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="seo-tags-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO Tags</button>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="myTabContent">
                                            <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

                                                <div className="form-group mb-3">
                                                    <label>Slug</label>
                                                    <input type="text" name="slug" onChange={handleInput} value={categoryInput.slug} className="form-control" />
                                                    <small className='text-danger'>{errors.slug}</small>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Name</label>
                                                    <input type="text" name="name" onChange={handleInput} value={categoryInput.name} className="form-control" />
                                                    <small className='text-danger'>{errors.name}</small>

                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Description</label>
                                                    <textarea name="description" onChange={handleInput} value={categoryInput.description} className="form-control"></textarea>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Status</label>
                                                    <input type="checkbox" name="status" onChange={handleInput} value={categoryInput.status} /> Status 0=shown/1=hidden
                                                </div>

                                            </div>
                                            <div className="tab-pane card-body border fade" id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab">

                                                <div className="form-group mb-3">
                                                    <label>Meta Title</label>
                                                    <input type="text" name="meta_title" onChange={handleInput} value={categoryInput.meta_title} className="form-control" />
                                                    <small className='text-danger'>{errors.meta_title}</small>

                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Meta Keywords</label>
                                                    <textarea name="meta_keyword" onChange={handleInput} value={categoryInput.meta_keyword} className="form-control"></textarea>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Meta Description</label>
                                                    <textarea name="meta_descrip" onChange={handleInput} value={categoryInput.meta_descrip} className="form-control"></textarea>
                                                </div>

                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary px-4 float-end">Update</button>
                                    </form>

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


export default EditCategory;
