import { React, useState, useEffect } from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import { Layout } from "antd";

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

    return (<>
        {visible && (
            <Layout className='mx-auto' style={{ minHeight: '100vh', backgroundColor: '#fff', maxWidth: '1400px' }}>
                <Layout style={{ backgroundColor: 'white' }}>
                    <div style={{ position: 'sticky', top: 0, zIndex: 999, backgroundColor: '#fff' }}>
                        <p>Hello world!</p>
                    </div>
                </Layout>
            </Layout>
        )}
    </>);
};

export default MainLayout;