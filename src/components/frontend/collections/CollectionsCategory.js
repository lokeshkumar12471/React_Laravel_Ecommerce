import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../../layouts/frontend/Navbar';
import { Link } from 'react-router-dom';

const Collections = () => {
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState([]);
    useEffect(() => {
        const fetchCategory = async () => {
            const fetchdata = await axios.get(`http://localhost:8000/api/get-collection`);

            if (fetchdata.status === 200) {
                setCategory(fetchdata.data.category);
                setLoading(false);
            }
        }
        fetchCategory();

    }, []);

    if (loading) {
        return <h4>Loading Categories...</h4>
    } else {
        var showCategoryList = '';
        showCategoryList = category.map((item, index) => {
            return (
                <div className="col-md-4" key={index}>
                    <div className="card">
                        <Link to={`${item.slug}`}>
                            <img src="" className="w-100" alt={item.name} />
                        </Link>
                        <div className="card-body">
                            <Link to={`${item.slug}`}>
                                <h5>{item.name}</h5>
                            </Link>
                        </div>
                    </div>
                </div>
            )
        })

    }
    if (showCategoryList.length > 0) {
        return (
            <div>
                <Navbar />
                <div className="py-3 bg-warning">
                    <div className="container">
                        <h6>Category Page</h6>
                    </div>
                </div>

                <div className="py-3">
                    <div className="container">
                        <div className="row">
                            {showCategoryList}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    else {
        return (
            <div>
                <div className="py-3 bg-warning">
                    <div className="container">
                        <h6>Category Page</h6>
                    </div>
                </div>

                <div className="py-3">
                    <div className="container">
                        <h4>No Collections</h4>
                    </div>
                </div>

            </div>
        )
    }
}

export default Collections;
