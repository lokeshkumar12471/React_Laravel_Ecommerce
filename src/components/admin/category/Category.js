import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Footer from '../../../layouts/admin/Footer';
import Sidebar from '../../../layouts/admin/Sidebar';
import Navbar from '../../../layouts/admin/Navbar';
import { useNavigate } from 'react-router-dom';
import useAuthUser from '../../../routes/AuthUser';

function Category() {
    const { token } = useAuthUser();
    const [categoryInput, setCategory] = useState({
        slug: '',
        name: '',
        descrip: '',
        status: '',
        meta_title: '',
        meta_keyword: '',
        meta_descrip: '',
        error_list: [],
    });

    const handleInput = (e) => {
        setCategory({ ...categoryInput, [e.target.name]: e.target.value })
    }
    const navigate = useNavigate();
    const submitCategory = async (e) => {
        e.preventDefault();
        const response = await axios.post(`http://127.0.0.1:8000/api/store-category`, categoryInput, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.data.status === 200) {
            e.target.reset();
            swal("Success", response.data.message, "success");
            navigate('/admin/view-category');
        }
        else if (response.data.status === 422) {
            setCategory({ ...categoryInput, error_list: response.data.errors });
        }

    }

    var display_errors = [];
    if (categoryInput.error_list) {
        display_errors = [
            categoryInput.error_list.slug,
            categoryInput.error_list.name,
            categoryInput.error_list.meta_title,
        ]
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
                        <div className="container-fluid px-4">

                            {
                                display_errors.map((item) => {
                                    return (<p className="mb-1" key={item}>{item}</p>)
                                })
                            }

                            <div className="card mt-4">
                                <div className="card-header">
                                    <h4>Add Category
                                        <Link to="/admin/view-category" className="btn btn-primary btn-sm float-end">View Category</Link>
                                    </h4>
                                </div>
                                <div className="card-body">

                                    <form onSubmit={submitCategory} id="CATEGORY_FORM">
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
                                                    <input type="text" name="slug" onChange={handleInput} className="form-control" />
                                                    <span className='text-danger'>{categoryInput.error_list.slug}</span>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Name</label>
                                                    <input type="text" name="name" onChange={handleInput} className="form-control" />
                                                    <span className='text-danger'>{categoryInput.error_list.name}</span>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Description</label>
                                                    <textarea name="description" onChange={handleInput} className="form-control"></textarea>

                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Status</label>
                                                    <input type="checkbox" name="status" onChange={handleInput} /> Status 0=shown/1=hidden
                                                </div>

                                            </div>
                                            <div className="tab-pane card-body border fade" id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab">

                                                <div className="form-group mb-3">
                                                    <label>Meta Title</label>
                                                    <input type="text" name="meta_title" onChange={handleInput} className="form-control" />
                                                    <span className='text-danger'>{categoryInput.error_list.meta_title}</span>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Meta Keywords</label>
                                                    <textarea name="meta_keyword" onChange={handleInput} className="form-control"></textarea>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Meta Description</label>
                                                    <textarea name="meta_descrip" onChange={handleInput} className="form-control"></textarea>
                                                </div>

                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary px-4 float-end">Submit</button>
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

export default Category;
