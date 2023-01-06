import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Navbars from "../Navbars";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import jwt_decode from "jwt-decode";
import { server } from "../../server";

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [msg, setMsg] = useState("");
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

    const getBlogs = async () => {
        const response = await axiosJWT.get(
            `${server}/blogs?search_query=${keyword}&page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        );
        setBlogs(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    const changePage = ({ selected }) => {
        setPage(selected);
        if (selected === 9) {
            setMsg(
                "Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!"
            );
        } else {
            setMsg("");
        }
    };

    const searchData = (e) => {
        e.preventDefault();
        setPage(0);
        setMsg("");
        setQuery(e.target.value)
        setKeyword(e.target.value);
    };

    useEffect(() => {
        getBlogs()
    }, [page, keyword])

    const deleteBlog = async (id, res) => {
        const willDelete = await swal({
            title: "Are you sure?",
            text: "Are you sure that you want to delete this file?",
            icon: "warning",
            dangerMode: true
        });

        if (willDelete) {
            try {
                await axios.delete(`${server}/blogs/${id}`);
                getBlogs();
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div>
            <Navbars />
            <div className="container mt-2">
                <div className="row">
                    <div className="col-md-4">
                        <input type="text" className="form-control" value={query} onChange={searchData} placeholder="Search" autoFocus="on" />
                    </div>
                    <div className="col-md-8 text-end">
                        <Link to="/blogs/add" className="btn btn-primary btn-sm">Tambah</Link>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-12">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map((blog, index) => (
                                    <tr key={blog.id}>
                                        <td>{index + 1}</td>
                                        <td>{blog.title}</td>
                                        <td>{blog.description}</td>
                                        <td>{blog.status}</td>
                                        <td>
                                            <Link
                                                to={`edit/${blog.id}`}
                                                className="btn btn-success btn-sm me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteBlog(blog.id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <label className="col-form-label">Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}</label>
                    </div>

                    <div className="col-md-6">
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            pageCount={Math.min(10, pages)}
                            onPageChange={changePage}
                            containerClassName={"pagination justify-content-end"}
                            pageLinkClassName={"page-item page-link"}
                            previousLinkClassName={"page-item page-link"}
                            nextLinkClassName={"page-item page-link"}
                            activeLinkClassName={"active"}
                            disabledLinkClassName={"disabled"}
                        />
                    </div>

                </div>
                <p className="text-danger text-center">{msg}</p>
            </div>
        </div >
    );
};

export default BlogList;