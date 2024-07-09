import { React, useState, useEffect } from 'react';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Layout, Divider, Dropdown, Menu, Modal} from "antd";
import {FaArrowLeft, FaUser} from "react-icons/fa";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {Content} from "antd/es/layout/layout";

const MainLayout = () => {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTitle(localStorage.getItem('title'));
        if (sessionStorage.getItem('token') === null) {
            navigate('/account/login');
        } else {
            setVisible(true);
        }
    }, [location.pathname]);

    const goBack = () => {
        navigate(-1);
    }

    const menu = (
        <Menu>
            <Menu.Item disabled>
                <div className="flex flex-col items-center gap-2">
                    <FaUser color='#00728a' size={20} />
                    <span className='text-black'>{JSON.parse(sessionStorage.getItem('user'))?.username}</span>
                </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item disabled icon={<UserOutlined />}>
                <a onClick={() => navigate('/perfil')}>
                    Meu Perfil
                </a>
            </Menu.Item>
            <Menu.Item icon={<LogoutOutlined />}>
                <a onClick={() => setModalVisible(true)}>
                    Terminar sessão
                </a>
            </Menu.Item>
        </Menu>
    );

    const logout = () => {
        sessionStorage.clear();
        navigate('/account/login');
    }

    return (<>
        {visible && (
            <Layout className='mx-auto' style={{ minHeight: '100vh', backgroundColor: '#fff', maxWidth: '1400px' }}>
                <Layout style={{backgroundColor: 'white'}}>
                    <div style={{position: 'sticky', top: 0, zIndex: 999, backgroundColor: '#fff'}}>
                        <div className='flex flex-col w-full'>
                            <div className='p-2 sm:px-4 md:px-10 mb-1 py-3 flex gap-1 items-center bg-white flex-row'>
                                <img
                                    src={require('../assets/logo/ins2.png')}
                                    className="mb-2 w-40 sm:w-45 py-5"
                                    style={{marginTop: 5}}
                                />
                                <Divider
                                    type="vertical"
                                    style={{height: '85px', borderWidth: '1.5px', borderColor: '#00728a'}}
                                />
                                <div
                                    className="flex flex-col w-full md:w-auto"
                                >
                                    <div
                                        className="text-lg md:text-xl lg:text-2xl font-bold "
                                        style={{color: '#00728a'}}
                                    >
                                        Plataforma de Gestão de Resumos
                                    </div>
                                    <div
                                        className="text-sm md:text-base lg:text-lg font-semibold text-gray-500">
                                        Instituto Nacional de Saúde
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className='w-full px-4 sm:px-10'
                        >
                            <div
                                className="flex flex-row w-full justify-between px-4 py-1 border-b-2 border-gray-500 border-t-2"
                            >
                                <div
                                    className="flex flex-row justify-left items-center gap-3"
                                >
                                    {localStorage.getItem('type') == '2' && (
                                        <FaArrowLeft size={20} color="black" onClick={goBack}/>
                                    )}
                                    <div
                                        className='text-base sm:text-lg font-bold'
                                        style={{color: 'black'}}>
                                        {title}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between ml-auto">
                                    <Dropdown overlay={menu}>
                                        <div
                                            className="flex flex-row items-center p-1 gap-2 rounded-md cursor-pointer border-2 border-gray-500">
                                            <FaUser size={13} color="black"/>
                                            <div
                                                className="text-sm font-bold hidden sm:block"
                                                style={{color: 'black'}}
                                            >
                                                {JSON.parse(sessionStorage.getItem('user')).username}
                                            </div>
                                        </div>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                        <Modal
                            title="Sair do sistema"
                            centered
                            visible={modalVisible}
                            onOk={() => logout()}
                            onCancel={() => setModalVisible(false)}
                            okButtonProps={{danger: true}}
                        >
                            <p>Deseja sair do sistema?</p>
                        </Modal>
                    </div>
                    <div className="flex w-full px-4 py-4 sm:px-10">
                        <Content
                            className="p-2 rounded-md"
                            style={{border: '1px solid #f0f0f0', minHeight: '60vh', overflow: 'hidden'}}
                        >
                            <Outlet/>
                        </Content>
                    </div>
                    <div className='w-full px-4 sm:px-10'>
                        <div className="flex flex-row w-full px-4 py-2 border-b-2 border-gray-500 border-t-2 mb-4">
                            <div className="flex flex-row justify-between">
                                <div className='text-xs sm:text-xs font-bold' style={{color: 'black'}}>Copyright © 2024
                                    INS - Todos Direitos Reservados
                                </div>
                            </div>
                            <div className="flex flex-row justify-between ml-auto">
                                <div className="text-xs font-bold mr-2 hidden sm:block" style={{color: 'black'}}>Email:
                                    secretariado.jns@ins.gov.mz
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </Layout>
        )}
        </>
    );
};

export default MainLayout;