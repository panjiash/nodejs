import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbars from "../Navbars";
import { server } from "../../server";
import jwt_decode from "jwt-decode";

const EditProduct = () => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');

    const axiosJWT = axios.create();
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get(`${server}/token`);
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    useEffect(() => {
        getProductById();
    }, []);

    const getProductById = async () => {
        const response = await axios.get(`${server}/products/${id}`);
        setTitle(response.data.name);
        setFile(response.data.image);
        setPreview(response.data.url);
    };

    const loadImage = (e) => {
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        try {
            await axiosJWT.patch(`${server}/products/${id}`, formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });
            navigate("/products");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Navbars />
            <div className="container mt-2">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={updateProduct}>
                                    <div className="mb-3">
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Product Name"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={loadImage}
                                            accept="image/*"
                                        />
                                    </div>

                                    {preview ? (
                                        <input type="image" className="w-100" style={{ cursor: 'default' }} onClick={(e) => e.preventDefault()} src={preview} alt="Photo" />
                                        // <img src={preview} alt="Preview Image" className="w-100" />
                                    ) : (
                                        ""
                                    )}

                                    <div className="my-3 d-grid">
                                        <button type="submit" className="btn btn-success">
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;