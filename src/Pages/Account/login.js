import axios from 'axios';
import 'antd/dist/reset.css';
import React from 'react';
import { Form, Input, Button, notification, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {CSSTransition} from "react-transition-group";
import { useNavigate } from 'react-router-dom';
import {useMutation} from "react-query";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const login = useMutation({
        mutationFn: (data) => {
            setLoading(true)
            return axios.post(`${process.env.REACT_APP_API_URL}/api/auth/`, {
                username: data.username,
                password: data.password
            })
                .then(res => res.data)
        },
        onSuccess: (data) => {
            if (data.groups?.some(group => group.name === 'AUTHOR')) {
                localStorage.setItem('title', 'Bem-vindo a Plataforma');
                localStorage.setItem('type', '1');
                sessionStorage.setItem('token', data.token)
                sessionStorage.setItem('user', JSON.stringify(data))
                navigate('/')
            } else {
                notification.error({
                    message: 'Erro',
                    description: 'Você não tem permissão para acessar esta plataforma'
                })
            }
        },
        onError: (error) => {
            notification.error({
                message: "Erro",
                description: 'Login Falhou',
            });
            setLoading(false);
        }
    })

    const handleLogin = async (e) => {
        login.mutate(e)
    }

    return (
        <CSSTransition in={true} appear={true} timeout={300} classNames="fade">
            <div className="flex h-screen bg-white sm:bg-gray-100">
                <div className="m-auto w-full sm:w-auto">
                    <Form
                        name="basic"
                        initialValues={{remember: true}}
                        className="bg-white sm:shadow-md px-8 pt-0 pb-8 sm:w-96"
                        style={{borderRadius: '15px'}}
                        onFinish={handleLogin}
                    >
                        <img src={require('../../assets/logo/ins2.png')} alt="logo"
                             className="mx-auto mb-2 w-40 sm:w-52 py-5"/>
                        <p
                            className="text-center text-lg sm:text-lg font-bold mb-1"
                        >
                            Plataforma de Gestão de Resumos
                        </p>
                        <p
                            className="text-center text-sm sm:text-sm"
                            style={{ color: "#000" }}
                        >
                            Jornadas Nacionais de Saúde
                        </p>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Introduza o seu email'}]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Email"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Introduza o seu senha'}]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Senha"
                            />
                        </Form.Item>
                        <Form.Item
                            className="my-2 p-0"
                        >
                            <Button
                                loading={loading}
                                style={{ background: '#00728a', margin: 0 }}
                                className="text-white"
                                htmlType="submit"
                                block
                            >
                                Entrar
                            </Button>
                        </Form.Item>
                        <p
                            className="flex flex-row justify-center gap-2 text-center w-full mt-5"
                        >
                            <a
                                className="text-sm sm:text-sm"
                                style={{ color: "#00728a" }}
                                onClick={() => {
                                    navigate('/account/resetpassword');
                                }}
                            >
                                Recuperar Senha
                            </a>
                            <Divider type='vertical' style={{ height: '25px', margin: 0 }}/>
                            <a
                                className="text-sm sm:text-sm"
                                style={{ color: "#00728a" }}
                                onClick={() => {
                                    navigate('/account/signup');
                                }}
                            >
                                Criar conta
                            </a>
                        </p>
                    </Form>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Login;