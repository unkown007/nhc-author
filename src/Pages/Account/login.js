import 'antd/dist/reset.css';
import React from 'react';
import { Form, Input, Button, notification, Divider } from 'antd';
import {CSSTransition} from "react-transition-group";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    return (
        <CSSTransition in={true} appear={true} timeout={300} classNames="fade">
            <div className="flex h-screen bg-white sm:bg-gray-100">
                <div className="m-auto w-full sm:w-auto">
                    <Form
                        name="basic"
                        initialValues={{remember: true}}
                        className="bg-white sm:shadow-md px-8 pt-0 pb-8 sm:w-96"
                        style={{borderRadius: '15px'}}
                    >
                        <img src={require('../../assets/logo/ins2.png')} alt="logo"
                             className="mx-auto mb-2 w-40 sm:w-52 py-5"/>

                    </Form>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Login;