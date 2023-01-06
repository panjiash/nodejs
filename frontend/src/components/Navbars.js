import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import jwt_decode from "jwt-decode";
import { server } from '../server';


const Navbars = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    useEffect(() => {
        refreshToken();
        getUsers();
    }, []);
    const refreshToken = async () => {
        try {
            const response = await axios.get(`${server}/token`);
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }
    const axiosJWT = axios.create();
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get(`${server}/token`);
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    const getUsers = async () => {
        await axiosJWT.get(`${server}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    const Logout = async () => {
        try {
            await axios.delete(`${server}/logout`);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">React JS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {/* <li className="nav-item">
                            <Link to='/dashboard' className='nav-link'>Home</Link>
                        </li> */}
                        <NavDropdown title="Menu" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.2">
                                {name}
                            </NavDropdown.Item>
                            <li className="nav-item">
                                <Link to='/dashboard' className='dropdown-item'>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/products' className='dropdown-item'>Product</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/blogs' className='dropdown-item'>Blog</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/usergraph' className='dropdown-item'>User Graph</Link>
                            </li>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="" onClick={Logout}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navbars