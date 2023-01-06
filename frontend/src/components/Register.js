import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from '../server';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nomorHp, setNomorHp] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [tipe, setTipe] = useState('');
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    const Register = async (e) => {
        e.preventDefault();
        setIsActive(true);
        try {
            await axios.post(`${server}/users`, {
                name: name,
                email: email,
                nomorHp: nomorHp,
                password: password,
                confPassword: confPassword
            });
            navigate('/')
        } catch (error) {
            if (error.response) {
                setIsActive(false);
                setTipe(error.response.data.tipe);
            }
        }
    }

    const handleKeyup = ((e) => {
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            setNomorHp(e.target.value)
        } else {
            return setNomorHp("")
        }
    })

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className='card mt-5'>
                        <div className='card-header'>
                            <h4 className='card-title'>Register</h4>
                        </div>
                        <div className='card-body'>
                            {
                                tipe === 2 ?
                                    <center>
                                        <span className='text-danger'>Data belum lengkap!</span>
                                    </center>
                                    : ''
                            }
                            <form onSubmit={Register}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className={tipe === 6 ? 'form-label text-danger' : 'form-label'}>Nomor Hp</label>
                                    <input type="text" className={tipe === 6 ? 'form-control is-invalid' : 'form-control'} placeholder="Nomor HP" value={nomorHp} onChange={(e) => setNomorHp(e.target.value)} onKeyUp={handleKeyup} />
                                    {tipe === 6 ? <small className='text-danger'>Nomor HP mengandung huruf!</small> : ''}
                                </div>
                                <div className="mb-3">
                                    <label className={tipe === 3 ? 'form-label text-danger' : 'form-label'}>Email</label>
                                    <input type="text" className={tipe === 3 ? 'form-control is-invalid' : 'form-control'} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    {tipe === 3 ? <small className='text-danger'>Email sudah terdaftar!</small> : ''}
                                </div>
                                <div className="mb-3">
                                    <label className={tipe === 1 ? 'form-label text-danger' : 'form-label'}>Password</label>
                                    <input type="password" className={tipe === 1 ? 'form-control is-invalid' : 'form-control'} placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    {tipe === 1 ? <small className="text-danger">Password tidak sama!</small> : ''}
                                </div>
                                <div className="mb-3">
                                    <label className={tipe === 1 ? 'form-label text-danger' : 'form-label'}>Confirm Password</label>
                                    <input type="password" className={tipe === 1 ? 'form-control is-invalid' : 'form-control'} placeholder="******" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                                    {tipe === 1 ? <small className="text-danger">Confirm password tidak sama!</small> : ''}
                                </div>
                                <div className="mb-3 d-grid">
                                    <button className={isActive ? 'd-none' : 'btn btn-primary'}>Daftar</button>
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
        </div>
    )
}

export default Register