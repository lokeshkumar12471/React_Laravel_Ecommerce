
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "./components/admin/Profile";
import Dashboard from "./components/admin/Dashboard";
import Home from "./components/frontend/Home";
import Login from "./components/frontend/auth/Login";
import Register from "./components/frontend/auth/Register";

import Category from "./components/admin/category/Category";
import ViewCategory from "./components/admin/category/ViewCategory";
import Collections from "./components/frontend/collections/CollectionsCategory";
import EditCategory from "./components/admin/category/EditCategory";
import AddProduct from "./components/admin/product/AddProduct";
import ViewProduct from "./components/admin/product/ViewProduct";
import EditProduct from "./components/admin/product/EditProduct";
import Contact from "./components/frontend/Contact";
import About from "./components/frontend/About";
import CollectionsProduct from "./components/frontend/collections/CollectionsProduct";
import ProductDetail from "./components/frontend/collections/ProductDetail";
import Cart from './components/frontend/Cart';
import Checkout from "./components/frontend/Checkout";
import Order from "./components/admin/order/Order";
import Thankyou from "./components/frontend/Thankyou";




function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/collections" element={<Collections />} />
        <Route exact path="/collections/:slug" element={<CollectionsProduct />} />
        <Route exact path="/collections/:category/:product" element={<ProductDetail />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/checkout" element={<Checkout />} />
        <Route exact path="/thank-you" element={<Thankyou />} />


        <Route exact path="/login" element={sessionStorage.getItem('token') ? <Navigate to='/' /> : <Login />} />
        <Route exact path="/register" element={sessionStorage.getItem('token') ? <Navigate to='/' /> : <Register />} />


        <Route exact path="/admin/dashboard" element={<Dashboard />} />
        <Route exact path="/admin/add-category" element={<Category />} />
        <Route exact path="/admin/view-category" element={<ViewCategory />} />
        <Route exact path="/admin/edit-category/:id" element={<EditCategory />} />
        <Route exact path="/admin/add-product" element={<AddProduct />} />
        <Route exact path="/admin/view-product" element={<ViewProduct />} />
        <Route exact path="/admin/edit-product/:id" element={<EditProduct />} />
        <Route exact path="/admin/profile" element={<Profile />} />
        <Route exact path="/admin/orders" element={<Order />} />

      </Routes>
    </div>
  );
}

export default App;
