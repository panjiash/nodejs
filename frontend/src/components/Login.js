import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { server } from '../server';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msgEmailTidakDiTemukan, setMsgEmailTidakDiTemukan] = useState('');
    const [msgPasswordSalah, setMsgPasswordSalah] = useState('');
    const [msgStatus, setMsgStatus] = useState('');
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        setIsActive(true);
        try {
            await axios.post(`${server}/login`, {
                email: email,
                password: password
            });
            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                setIsActive(false);
                setMsgEmailTidakDiTemukan(error.response.data.msgEmailTidakDiTemukan);
                setMsgPasswordSalah(error.response.data.msgPasswordSalah);
                setMsgStatus(error.response.data.msgStatus);
            }
        }
    }

    return (
        <div className="container">
            <div className='row justify-content-center'>
                <div className='col-md-4'>
                    <div className='card mt-5'>
                        <div className='card-body'>
                            {msgStatus ? <small className='text-danger'>{msgStatus}</small> : ''}
                            <form onSubmit={Auth}>
                                <div className="mb-3">
                                    <label className={msgEmailTidakDiTemukan ? 'form-label text-danger' : 'form-label'}>Email</label>
                                    <input type="text" className={msgEmailTidakDiTemukan ? 'form-control is-invalid' : 'form-control'} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    {msgEmailTidakDiTemukan ? <small className='text-danger'>{msgEmailTidakDiTemukan}</small> : ''}
                                </div>
                                <div className="mb-3">
                                    <label className={msgPasswordSalah ? 'form-label text-danger' : 'form-label'}>Password</label>
                                    <input type="password" className={msgPasswordSalah ? 'form-control is-invalid' : 'form-control'} placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    {msgPasswordSalah ? <small className='text-danger'>{msgPasswordSalah}</small> : ''}
                                </div>
                                <div className="mb-3 d-grid">
                                    <button className={isActive ? 'd-none' : 'btn btn-primary'}>Login</button>
                                    <button className={isActive ? 'btn btn-primary' : 'd-none'} type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </button>
                                </div>

                                <div className='mb-3'>
                                    <Link to='/register'>Daftar</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login