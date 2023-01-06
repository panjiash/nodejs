import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbars from "../Navbars";
import { server } from "../../server";

const EditBlog = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [dbl, setDbl] = useState();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getBlogById();
    }, []);


    const updateBlog = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${server}/blogs/${id}`, {
                title,
                description,
                status,
            });
            navigate("/blogs");
        } catch (error) {
            console.log(error);
            setDbl(error.response.data.dbl);
        }
    };

    const getBlogById = async () => {
        const response = await axios.get(`${server}/blogs/${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setStatus(response.data.status);
    };

    return (
        <div>
            <Navbars />
            <div className="container mt-2">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Edit Blog</h4>
                            </div>
                            <div className="card-body">
                                {dbl ? <small className="text-danger">{dbl}</small> : ''}
                                <form onSubmit={updateBlog}>
                                    <div className="mb-3">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Title"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Description"
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
                                    <div className="mb-3">
                                        <button type="submit" className="btn btn-primary">
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

export default EditBlog;