import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Navbars from "../../components/Navbars"
import swal from "sweetalert";
import { server } from "../../server";
import jwt_decode from "jwt-decode";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [limit, setLimit] = useState(10);
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

    const getProducts = async () => {
        const response = await axiosJWT.get(
            `${server}/products?search_query=${keyword}&page=${page}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        setProducts(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    useEffect(() => {
        getProducts();
    }, [page, keyword, limit]);

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
        setQuery(e.target.value);
        setKeyword(e.target.value);
    };

    const changeLimit = (e) => {
        e.preventDefault();
        setLimit(e.target.value);
    }

    const deleteProduct = async (productId) => {
        const willDelete = await swal({
            title: "Are you sure?",
            text: "Are you sure that you want to delete this file?",
            icon: "warning",
            buttons: true,
            dangerMode: true
        });

        if (willDelete) {
            try {
                await axiosJWT.delete(`${server}/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                swal("Ok! Data sudah terhapus secara permanen!", { icon: "success", });
                getProducts();
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
                    <h3 className="d-inline col-md-2">Product</h3>
                    <div className="col-md-10 text-end">
                        <Link to="/products/add" className="btn btn-primary">
                            Tambah
                        </Link>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-3 text-start">
                        <input type="text" className="form-control" value={query} onChange={searchData} placeholder="Search" autoFocus="on" />
                    </div>
                    <div className="col-md-8">

                    </div>
                    <div className="col-md-1 text-end">
                        <select className="form-select" onChange={changeLimit}>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-md-12">
                        <table className="table table-striped table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>No</th>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td><img src={product.url} style={{ width: '100px' }} alt={"Product " + index} /></td>
                                        <td>{product.name}</td>
                                        <td>
                                            <Link to={`edit/${product.id}`} className="btn btn-success btn-sm">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="btn btn-danger btn-sm ms-2"
                                                href=""
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

export default ProductList;