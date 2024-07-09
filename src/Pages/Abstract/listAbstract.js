import React, { useState, useEffect, useRef } from 'react';
import {Menu} from 'antd';
import ListAbstractType1 from "./listAbstractType1";
import ListAbstractType2 from "./listAbstractType2";
import ListAbstractType3 from "./listAbstractType3";

const ListAbstract = () => {
    useEffect(() => {
        localStorage.setItem('title', 'Meus Resumos');
        localStorage.setItem('type', '2');
    }, [])

    const [selectedKey, setSelectedKey] = useState('1');

    const handleMenuClick = (e) => {
        setSelectedKey(e.key)
    }


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
                    <ListAbstractType1/>
                }
                {selectedKey === '2' &&
                    <ListAbstractType2/>
                }
                {selectedKey === '3' &&
                    <ListAbstractType3/>
                }
            </div>
        </div>
    );
}

export default ListAbstract;