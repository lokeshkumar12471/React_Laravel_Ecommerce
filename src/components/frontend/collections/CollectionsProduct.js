import React, { useState, useEffect } from 'react';
import Navbar from '../../../layouts/frontend/Navbar';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

const CollectionsProduct = () => {
    const product_slug = useParams();
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();
    const productCount = product.length;

    useEffect(() => {
        const fetchproducts = async () => {
            const response = await axios.get(`http://localhost:8000/api/fetchproducts/${product_slug.slug}`);
            console.log(response.data.product_data.category);
            if (response.data.status === 200) {
                setProduct(response.data.product_data.product);
                setCategory(response.data.product_data.category);
                setLoading(false);

            } else if (response.data.status === 400) {
                swal('Error', response.data.message, '');
                navigate('/collections');

            }

            else if (response.data.status === 404) {
                swal('Error', response.data.message, 'error');
                navigate('/collections');

            }
        }
        fetchproducts();
    }, [navigate, product_slug]);

    if (loading) {
        return <h4>Loading Products...</h4>
    } else {
        var showProductList = "";
        if (productCount) {
            showProductList = product.map((item, index) => {
                return (
                    <div className="col-md-3" key={index}>
                        <div className="card">
                            <Link to={`${item.slug}`}>
                                <img src={`http://localhost:8000/product/uploads/${item.image}`} className="w-100" alt={item.name} />
                            </Link>
                            <div className="card-body">
                                <Link to={`${item.slug}`}>
                                    <h5>{item.name}</h5>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })
        } else {
            showProductList =
                <div className="col-md-12">
                    <h4>No Product Available for {category.length > 0 ? category[0].name : 'Loading...'}</h4>
                </div>
        }
    }
    return (
        <div>
            <Navbar />
            <div>
                <div className="py-3 bg-warning">
                    <div className="container">
                        <h6>Collections / {category.length > 0 ? category[0].name : 'Loading...'}</h6>
                    </div>
                </div>

                <div className="py-3">
                    <div className="container">
                        <div className="row">
                            {showProductList}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CollectionsProduct;
