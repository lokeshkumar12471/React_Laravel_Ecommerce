import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../layouts/frontend/Navbar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

const ProductDetail = () => {
    const [product, setProduct] = useState([]);
    const [Quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const productData = product.length > 0 ? product[0] : {};
    const navigate = useNavigate();
    const category_slug = useParams();
    const product_slug = useParams();
    const DecrementCount = () => {
        if (Quantity > 1) {
            setQuantity(Quantity - 1);
        }
    }
    const IncrementCount = () => {
        if (Quantity < 10) {
            setQuantity(Quantity + 1);
        }
    }
    useEffect(() => {
        const fetchproductdetail = async () => {
            try {
                const productdetail = await axios.get(`http://localhost:8000/api/viewproductdetail/${category_slug.category}/${product_slug.product}`);
                if (productdetail.data.status === 200) {
                    setProduct(productdetail.data.product);
                    setLoading(false);
                }
                else if (productdetail.data.status === 404) {
                    navigate('/collections');
                    swal("Warning", productdetail.data.message, "error");
                }
            }
            catch (error) {
                console.error("Error fetching product detail:", error);
            }
        }
        fetchproductdetail();
    }, [navigate, product_slug, category_slug]);

    const submitAddtocart = async (e) => {
        e.preventDefault();
        const data = {
            product_id: productData.id,
            product_qty: Quantity,
        }
        const responseCart = await axios.post(`http://localhost:8000/api/add-to-cart`, data);
        if (responseCart.data.status === 201) {
            swal("Success!", responseCart.data.message, "success");
        } else if (responseCart.data.status === 409) {
            swal('Success', responseCart.data.message, 'success');
        } else if (responseCart.data.status === 401) {
            swal('Error', responseCart.data.message, 'error');
        } else if (responseCart.data.status === 404) {
            swal('Warning', responseCart.data.message, 'warning');
        }
    }
    if (loading) {
        return <h4>Loading Product Detail...</h4>
    }
    else {

        var avail_stock = '';
        if (productData.qty > 0) {
            avail_stock = <div>
                <label className="btn-sm btn btn-success px-4 mt-2">In stock</label>
                <div className="row">
                    <div className="col-md-3 mt-3">
                        <div className="input-group">
                            <button type="button" onClick={DecrementCount} className="input-group-text">-</button>
                            <div className="form-control text-center">{Quantity}</div>
                            <button type="button" onClick={IncrementCount} className="input-group-text">+</button>
                        </div>
                    </div>
                    <div className="col-md-3 mt-3">
                        <button type="button" className="btn btn-primary w-100" onClick={submitAddtocart}>Add to Cart</button>
                    </div>
                </div>
            </div>
        }
        else {
            avail_stock = <div>
                <label className="btn-sm btn btn-danger px-4 mt-2">Out of stock</label>
            </div>
        }
    }


    return (
        <div>
            <Navbar />
            <div>
                <div className="py-3 bg-warning">
                    <div className="container">
                        <h6>Collections / {productData.category && productData.category.name} / {productData.name}</h6>
                    </div>
                </div>
                <div className="py-3">
                    <div className="container">
                        <div className="row">

                            <div className="col-md-4 border-end">
                                <img src={`http://localhost:8000/product/uploads/${productData.image}`} alt={productData.name} className="w-100" />
                            </div>

                            <div className="col-md-8">
                                <h4>
                                    {productData.name}
                                    <span className="btn btn-danger btn-sm float-end badge badge-pil">{productData.brand}</span>
                                </h4>
                                <p> {productData.description} </p>
                                <h4 className="mb-1">
                                    Rs: {productData.selling_price}
                                    <s className="ms-2">  Rs: {productData.original_price} </s>
                                </h4>
                                <div>
                                    {avail_stock}
                                </div>
                                <button type="button" className="btn btn-danger mt-3">Add to Wishlist</button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductDetail;
