import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import '../../../assets/admin/css/styles.css';
import '../../../assets/admin/js/scripts';
import Sidebar from "../../../layouts/admin/Sidebar";
import Navbar from "../../../layouts/admin/Navbar";
import Footer from "../../../layouts/admin/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';


const EditProduct = () => {
    const [categorylist, setCategoryList] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const [errorlist, setError] = useState([]);
    const [allcheckbox, setCheckboxes] = useState([]);


    const [productInput, setProduct] = useState({
        category_id: '',
        slug: '',
        name: '',
        description: '',

        meta_title: '',
        meta_keyword: '',
        meta_descrip: '',

        selling_price: '',
        original_price: '',
        qty: '',
        brand: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            const categoryResponse = await axios.get(`http://localhost:8000/api/all-category`);

            if (categoryResponse.data.status === 200) {
                setCategoryList(categoryResponse.data.category);
            }

            const productResponse = await axios.get(`http://localhost:8000/api/edit-product/${id}`);
            if (productResponse.data.status === 200) {
                setProduct(productResponse.data.product);
                setCheckboxes(productResponse.data.product);
                console.log(productResponse.data.product);
            } else if (productResponse.data.status === 404) {
                swal('Error', productResponse.data.message, 'error');
                navigate('/admin/view-product');
            }
        };

        fetchData();
    }, [id, navigate]);


    const handleInput = (e) => {
        if (e.target.name === 'image') {
            setProduct({ ...productInput, [e.target.name]: e.target.files[0] });
        } else {
            setProduct({ ...productInput, [e.target.name]: e.target.value });
        }
    }

    const handleCheckbox = (e) => {
        setCheckboxes({ ...allcheckbox, [e.target.name]: e.target.checked });
    }


    const updateProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/api/update-product/${id}`, {
                ...productInput,
                featured: allcheckbox.featured ? '1' : '0',
                popular: allcheckbox.popular ? '1' : '0',
                status: allcheckbox.status ? '1' : '0',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.status === 200) {
                swal('Success', response.data.message, 'success');
                navigate('/admin/view-product');
                setError([]);
            } else if (response.data.status === 422) {
                swal('All fields are mandateory', '', 'error');
                setError(response.data.errors);
            } else if (response.data.status === 404) {
                swal('Error', response.data.message, 'error');
                navigate('/admin/view-product');
            }
        } catch (error) {
            console.error('Error submitting product:', error);
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
                        <div className="container-fluid px-4">
                            <div className="card mt-4">
                                <div className="card-header">
                                    <h4>Edit Product
                                        <Link to="/admin/view-product" className="btn btn-primary btn-sm float-end">View Product</Link>
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={updateProduct} encType="multipart/form-data">

                                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="seotags-tab" data-bs-toggle="tab" data-bs-target="#seotags" type="button" role="tab" aria-controls="seotags" aria-selected="false">SEO Tags</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="otherdetails-tab" data-bs-toggle="tab" data-bs-target="#otherdetails" type="button" role="tab" aria-controls="otherdetails" aria-selected="false">Other Details</button>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="myTabContent">
                                            <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

                                                <div className="form-group mb-3">
                                                    <label>Select Category</label>
                                                    <select name="category_id" onChange={handleInput} value={productInput.category_id} className="form-control">
                                                        <option>Select Category</option>
                                                        {
                                                            categorylist.map((item) => (
                                                                <option key={item.id} value={item.id}>{item.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <small className="text-danger">{errorlist.category_id}</small>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Slug</label>
                                                    <input type="text" name="slug" onChange={handleInput} value={productInput.slug} className="form-control" />
                                                    <small className="text-danger">{errorlist.slug}</small>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Name</label>
                                                    <input type="text" name="name" onChange={handleInput} value={productInput.name} className="form-control" />
                                                    <small className="text-danger">{errorlist.name}</small>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Description</label>
                                                    <textarea name="description" onChange={handleInput} value={productInput.description} className="form-control"></textarea>
                                                </div>

                                            </div>
                                            <div className="tab-pane card-body border fade" id="seotags" role="tabpanel" aria-labelledby="seotags-tab">

                                                <div className="form-group mb-3">
                                                    <label>Meta Title</label>
                                                    <input type="text" name="meta_title" onChange={handleInput} value={productInput.meta_title} className="form-control" />
                                                    <small className="text-danger">{errorlist.meta_title}</small>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Meta Keyword</label>
                                                    <textarea name="meta_keyword" onChange={handleInput} value={productInput.meta_keyword} className="form-control"></textarea>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Meta Description</label>
                                                    <textarea name="meta_descrip" onChange={handleInput} value={productInput.meta_descrip} className="form-control"></textarea>
                                                </div>

                                            </div>
                                            <div className="tab-pane card-body border fade" id="otherdetails" role="tabpanel" aria-labelledby="otherdetails-tab">

                                                <div className="row">

                                                    <div className="col-md-4 form-group mb-3">
                                                        <label>Selling Price</label>
                                                        <input type="text" name="selling_price" onChange={handleInput} value={productInput.selling_price} className="form-control" />
                                                        <small className="text-danger">{errorlist.selling_price}</small>
                                                    </div>
                                                    <div className="col-md-4 form-group mb-3">
                                                        <label>Original Price</label>
                                                        <input type="text" name="original_price" onChange={handleInput} value={productInput.original_price} className="form-control" />
                                                        <small className="text-danger">{errorlist.original_price}</small>
                                                    </div>
                                                    <div className="col-md-4 form-group mb-3">
                                                        <label>Quantity</label>
                                                        <input type="text" name="qty" onChange={handleInput} value={productInput.qty} className="form-control" />
                                                        <small className="text-danger">{errorlist.qty}</small>
                                                    </div>
                                                    <div className="col-md-4 form-group mb-3">
                                                        <label>Brand</label>
                                                        <input type="text" name="brand" onChange={handleInput} value={productInput.brand} className="form-control" />
                                                        <small className="text-danger">{errorlist.brand}</small>
                                                    </div>
                                                    <div className="col-md-8 form-group mb-3">
                                                        <label>Image</label>
                                                        <img src={`http://localhost:8000/product/uploads/${productInput.image}`} alt="productimage" width={50} height={50} />
                                                        <input type="file" name="image" onChange={handleInput} className="form-control" />
                                                        <small className="text-danger">{errorlist.image}</small>
                                                    </div>
                                                    <div className="col-md-4 form-group mb-3">
                                                        <label>Featured (checked=shown)</label>
                                                        <input
                                                            type="checkbox"
                                                            name="featured"
                                                            onChange={handleCheckbox}
                                                            checked={allcheckbox.featured}
                                                            className="w-50 h-50"
                                                        />
                                                    </div>
                                                    <div className="col-md-4 form-group mb-3">
                                                        <label>Popular (checked=shown)</label>
                                                        <input
                                                            type="checkbox"
                                                            name="popular"
                                                            onChange={handleCheckbox}
                                                            checked={allcheckbox.popular}
                                                            className="w-50 h-50"
                                                        />
                                                    </div>
                                                    <div className="col-md-4 form-group mb-3">
                                                        <label>Status (checked=Hidden)</label>
                                                        <input
                                                            type="checkbox"
                                                            name="status"
                                                            onChange={handleCheckbox}
                                                            checked={allcheckbox.status}
                                                            className="w-50 h-50"
                                                        />
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary px-4 mt-2">Submit</button>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>

            </div>
        </div>
    );
}

export default EditProduct;
