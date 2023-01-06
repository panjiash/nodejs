import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbars from "../Navbars";
import jwt_decode from "jwt-decode";
import { server } from "../../server";


const AddProduct = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(1);
    const [dsu, setDsu] = useState("");
    const [msgErr, setMsgErr] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();

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

    const saveBlog = async (e) => {
        e.preventDefault();
        try {
            setIsActive(true)
            await axiosJWT.post(`${server}/blogs`, {
                title,
                description,
                status,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate("/blogs");
        } catch (error) {
            console.log(error);
            setDsu(error.response.data.dsu)
            setMsgErr(error.response.data.msgErr)
            setIsActive(false)
        }
    };

    return (
        <div>
            <Navbars />
            <div className="container mt-2">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Tambah Blog</h4>
                            </div>
                            <div className="card-body">
                                {msgErr ? <small className="text-danger">{msgErr}</small> : ''}
                                <form onSubmit={saveBlog}>
                                    <div className="mb-3">
                                        <label className={dsu ? 'form-label text-danger' : 'form-label'}>Title</label>
                                        <input
                                            type="text"
                                            className={dsu ? 'form-control is-invalid' : 'form-control'}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Title"
                                        />
                                        {dsu ? <small className="text-danger">{dsu}</small> : ''}
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Description</label>
                                        {/* <CurrencyFormat */}
                                        <input
                                            type="text"
                                            className='form-control'
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Description"
                                        // thousandSeparator={true}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="1">Aktif</option>
                                            <option value="0">Tidak Aktif</option>
                                        </select>
                                    </div>

                                    <div className="mb-3 d-grid">
                                        <button className={isActive ? 'd-none' : 'btn btn-primary'}>Simpan</button>
                                        <button className={isActive ? 'btn btn-primary' : 'd-none'} type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default AddProduct;