import 'antd/dist/reset.css';
import React from 'react';
import { useState } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom'
import AbstractType1 from "./abstractType1";
import AbstractType2 from "./abstractType2";
import AbstractType3 from "./abstractType3";


const NewAbstract = () => {
    const [selectedKey, setSelectedKey] = useState('1');

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    return (
        <div className='flex flex-col gap-4'>
            <Menu
                mode="horizontal"
                className="rounded-lg pb-1"
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
            >
                <Menu.Item
                    key="1"
                    className="hover:bg-blue-500"
                >
                    Pesquisa Científica
                </Menu.Item>
                <Menu.Item
                    key="2"
                    className="hover:bg-blue-500"
                >
                    Caso Clínico
                </Menu.Item>
                <Menu.Item
                    key="3"
                    className="hover:bg-blue-500"
                >
                    Avaliação programática
                </Menu.Item>
            </Menu>
            <div className="flex flex-col gap-2 bg-white rounded-lg p-4">
                {selectedKey === '1' &&
                    <AbstractType1 />
                }
                {selectedKey === '2' &&
                    <AbstractType2 />
                }
                {selectedKey === '3' &&
                    <AbstractType3 />
                }
            </div>
        </div>
    );
};

export default NewAbstract;