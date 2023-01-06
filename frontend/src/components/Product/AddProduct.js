import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbars from "../Navbars";
import { server } from "../../server";
import jwt_decode from "jwt-decode";

const AddProduct = () => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");
    const [dsu, setDsu] = useState("");
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

    const loadImage = (e) => {
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        try {
            await axiosJWT.post(`${server}/products`, formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });
            navigate("/products");
        } catch (error) {
            console.log(error);
            setDsu(error.response.data.dsu)
        }
    };

    return (
        <div>
            <Navbars />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={saveProduct}>
                                    <div className="mb-3">
                                        <label className={dsu ? 'form-label text-danger' : 'form-label'}>Product Name</label>
                                        <input
                                            type="text"
                                            className={dsu ? 'form-control is-invalid' : 'form-control'}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Product Name"
                                        />
                                        {dsu ? <small className="text-danger">{dsu}</small> : ''}
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
                                        <input type="image" className="w-100" style={{ cursor: "default" }} onClick={(e) => e.preventDefault()} src={preview} alt="Photo" />
                                        // <img className="w-100" src={preview} alt="Preview Image" />
                                    ) : (
                                        ""
                                    )}

                                    <div className="mb-3 d-grid">
                                        <button type="submit" className="btn btn-primary">
                                            Save
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

export default AddProduct;