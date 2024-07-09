import { useEffect } from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { MdEditDocument, MdList } from 'react-icons/md';


const Menu = () => {
    useEffect(() => {
        localStorage.setItem('title', 'Bem-vindo a Plataforma');
        localStorage.setItem('type', '1');
    },[]);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3  gap-4 p-2 sm:p-8">
            <Link to="/resumo/novo">
              <Card
                bordered={false}
                hoverable
                cover={<MdEditDocument style={{ fontSize: '100px', color: '#00728a' }} />}
              >
                <div className="text-sm sm:text-lg text-center">Submeter Resumo</div>
              </Card>
            </Link>
            <Link to="/resumos">
                <Card
                    bordered={false}
                    hoverable
                    cover={<MdList style={{ fontSize: '100px', color: '#00728a' }} />}
                >
                    <div className="text-sm sm:text-lg text-center">Meus Resumos</div>
                </Card>
            </Link>
        </div>
    );
}

export default Menu;