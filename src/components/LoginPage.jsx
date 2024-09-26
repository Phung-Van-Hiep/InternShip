import React, { useEffect, useState } from 'react';
import Header from '../block/Header';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import Footer from '../block/Footer';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate(); // Hook để chuyển hướng

    const handleLogin = () => {

        let hasError = false;

        if (!username) {
            setUsernameError('Tài khoản không được để trống.');
            hasError = true;
        } else {
            setUsernameError('');
        }

        if (!password) {
            setPasswordError('Mật khẩu không được để trống.');
            hasError = true;
        } else {
            setPasswordError('');
        }

        if (!hasError) {
            console.log('Tài khoản:', username);
            console.log('Mật khẩu:', password);
            if (username === 'PAI001' && password === '123456') {
                localStorage.clear();
                localStorage.setItem('username', username);
                navigate(`/homepage`);
                message.success ('Đăng nhập thành công. ')
            } else {
                message.error('Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.'); // Hiển thị thông báo lỗi
            }
        }
    };
    return (
        <>
            <Header />
            <div className='content-wrapper w-full h-[50rem]'>
                <div className='content-header w-full flex'>
                    <div className='content-left w-1/2 flex flex-col my-[16rem] font-bold'>
                        <p className='text-center text-4xl text-cyan-300'>CÔNG NGHỆ THÔNG TIN</p>
                        <p className='text-center text-6xl text-blue-900'>PHÁT TRIỂN ỨNG DỤNG</p>
                    </div>
                    <div className='content-right w-1/2 flex flex-col my-[6rem] font-bold'>
                        <div className='title-login text-center text-5xl text-blue-800'>Đăng nhập</div>
                        <div className='title-account mt-10 ml-[4rem] text-left text-3xl text-blue-500'>
                            <UserOutlined /> Tài khoản:
                        </div>
                        <Input
                            className='mt-3 ml-[4rem] mr-[4rem] h-[3rem] border-2 border-blue-500 rounded focus:outline-none focus:border-blue-500'
                            placeholder='Nhập tài khoản'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={() => {
                                if (!username) setUsernameError();
                            }}
                            style={{ width: 'calc(100% - 12rem)' }}
                        />
                        {usernameError && (
                            <div className='text-red-500 ml-[4rem] mr-[4rem] mt-1'>{usernameError}</div>
                        )}
                        <div className='title-account mt-10 ml-[4rem] text-left text-3xl text-blue-500'>
                            <LockOutlined /> Mật khẩu:
                        </div>
                        <Input.Password
                            className='my-4 ml-[4rem] mr-[4rem] h-[3rem] border-2 border-blue-500 rounded focus:outline-none focus:border-blue-500'
                            placeholder='Nhập mật khẩu'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => {
                                if (!password) setPasswordError();
                            }}
                            iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                            style={{ width: 'calc(100% - 12rem)' }}
                        />
                        {passwordError && (
                            <div className='text-red-500 ml-[4rem] mr-[4rem] mt-1'>{passwordError}</div>
                        )}
                        <button className='text-right mr-[8rem] text-xl'>Quên mật khẩu?</button>
                        <div className='btn-Login text-center mt-6'>
                            <Button type="primary" onClick={handleLogin}>Đăng nhập</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default LoginPage;
