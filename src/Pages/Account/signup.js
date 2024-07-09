import axios from 'axios';
import 'antd/dist/reset.css';
import { React, useState } from 'react';
import { Form, Input, Button, notification, Divider, Steps, Result } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Select } from 'antd';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import dayJS from 'dayjs';

const { Option} = Select;

const Signup = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm();

    const handleSubmit = async (e) => {
        setLoading(true)
        axios.post(`${process.env.REACT_APP_API_URL}/api/auth/code/`, {
            name: form.getFieldValue('nome'),
            email: e.email
        })
            .then(res => res.data)
            .then(data => {
                setCurrentStep(1)
            }).catch(error => {
                notification.error({
                    message: 'Erro',
                    description: 'Email Inválido'
                })
            }
        ).finally(() => setLoading(false))
    };

    const handleConfirmEmail = async (e) => {
        console.log(form.getFieldValue('nome'))
        setLoading(true)
        axios.post(`${process.env.REACT_APP_API_URL}/api/auth/code/validate/`, {
            email: form.getFieldValue('email'),
            code: e.confirmationCode
        })
            // .then(res => res.data)
            .then(data => {
                handleCreateAccount(e)
            }).catch(error => {
                notification.error({
                    message: 'Erro',
                    description: 'Código Inválido'
                })
            }
        ).finally(() => setLoading(false))
    };

    const handleCreateAccount = async (data) => {
        setLoading(true)
        axios.post(`${process.env.REACT_APP_API_URL}/api/user/`, {
            email: form.getFieldValue('email'),
            password: form.getFieldValue('password'),
            first_user_name: form.getFieldValue('nome').split(' ').shift(),
            last_user_name: form.getFieldValue('nome').split(' ').pop(),
            gender: form.getFieldValue('genero'),
            nationality: form.getFieldValue('nacionalidade'),
            province: form.getFieldValue('provincia'),
            district: form.getFieldValue('distrito'),
            city: form.getFieldValue('cidade'),
            profession: form.getFieldValue('profissao'),
            provenance: form.getFieldValue('instituicao'),
            contact: form.getFieldValue('contacto'),
            birthday: dayJS(form.getFieldValue('dataNascimento')).format('YYYY-MM-DD')
        }, {

        })
            .then(res => {
                setCurrentStep(2)
            })
            .catch(err => {
                console.log(err.response.data);
                notification.error({
                    message: 'Erro',
                    description: 'Erro ao criar o usuário.\nPor favor veririfique se introduziu correctamente os dados.'
                })
            }).finally(() => {
            setLoading(false)
        });
    }

    return (
        <CSSTransition in={true} appear={true} timeout={300} classNames="fade">
            <div className="flex h-full bg-white sm:bg-gray-100">
                <div className="m-auto w-full py-5 sm:w-auto">
                    <div className='mx-auto sm:shadow-md rounded-md' style={{ minHeight: '100vh', backgroundColor: 'white', maxWidth: '800px' }}>
                        <div style={{backgroundColor: 'white'}}>
                            <div className='flex flex-col w-full'>
                                <div
                                    className='p-2 sm:px-4 md:px-10 mb-1 py-3 flex gap-1 items-center bg-white flex-row'>
                                    <img src={require('../../assets/logo/ins2.png')} className="mb-2 w-40 sm:w-45 py-5"
                                         style={{marginTop: 5}}/>
                                    <Divider type="vertical"
                                             style={{height: '85px', borderWidth: '1.5px', borderColor: '#00728a'}}/>
                                    <div className="flex flex-col w-full md:w-auto">
                                        <div className="text-lg md:text-xl lg:text-2xl font-bold "
                                             style={{color: '#00728a'}}>Plataforma de Gestão de Resumos
                                        </div>
                                        <div
                                            className="text-sm md:text-base lg:text-lg font-semibold text-gray-500">Instituto
                                            Nacional de Saúde
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full px-4 sm:px-10'>
                                <div className="flex flex-row w-full px-4 py-1 border-b-2 border-gray-500 border-t-2">
                                    <div className="flex flex-row w-full justify-left items-center gap-3">
                                        {localStorage.getItem('type') == '2' && (
                                            <FaArrowLeft size={20} color="black"/>
                                        )}
                                        <div className='text-base sm:text-lg font-bold' style={{color: 'black'}}>Criar
                                            Conta
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full px-4 py-4 sm:px-10">
                            <div className='px-4 sm:px-10 py-5 w-full mb-10'
                                 style={{border: '1px solid #f0f0f0', overflow: 'hidden'}}>
                                <div className='hidden sm:block'>
                                    <Steps
                                        size="small"
                                        current={currentStep}
                                        direction='horizontal'
                                        items={[
                                            {
                                                title:
                                                    <span
                                                        className="hidden sm:inline cursor-pointer"
                                                        onClick={() => setCurrentStep(0)}
                                                    >
                                                        Dados Pessoais
                                                    </span>,
                                            },
                                            {
                                                title:
                                                    <span
                                                        className="hidden sm:inline"
                                                    >
                                                        Confirmação de Email
                                                    </span>,
                                            },
                                            {
                                                title:
                                                    <span
                                                        className="hidden sm:inline"
                                                    >
                                                        Terminado
                                                    </span>,
                                            },
                                        ]}
                                    />
                                </div>
                                <div className="sm:hidden">
                                    <h2 className="text-center text-lg font-bold mb-3">
                                        {currentStep === 0 && 'Dados Pessoais'}
                                        {currentStep === 1 && 'Confirmação de Email'}
                                        {currentStep === 2 && 'Confirmação de Senha'}
                                    </h2>
                                </div>
                                {currentStep === 0 && (
                                    <Form
                                        form={form}
                                        name="basic"
                                        initialValues={{ remember: true }}
                                        onFinish={handleSubmit}
                                        className="pt-0 pb-0 w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3"
                                        style={{ borderRadius: '15px' }}
                                    >
                                        <Form.Item
                                            name="nome"
                                            label="Nome"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[{ required: true, message: 'Por favor insira o nome' }]}
                                        >
                                            <Input placeholder='Insira o Nome' />
                                        </Form.Item>
                                        <Form.Item
                                            name="genero"
                                            label="Genéro"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[{ required: true, message: 'Por favor seleccione o genéro' }]}
                                        >
                                            <Select placeholder="Seleccione o Genéro">
                                                <Option value="masculino">Masculino</Option>
                                                <Option value="feminino">Feminino</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name="dataNascimento"
                                            label="Data de Nascimento"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[{ required: true, message: 'Por favor insira a data de nascimento' }]}
                                        >
                                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                                        </Form.Item>
                                        <Form.Item
                                            name="nacionalidade"
                                            label="Nacionalidade"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[{ required: true, message: 'Por favor insira a nacionalidade' }]}
                                        >
                                            <Input placeholder='Insira a Nacionalidade' />
                                        </Form.Item>
                                        <Form.Item
                                            name="provincia"
                                            label="Província"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[{ required: true, message: 'Por favor insira a província' }]}
                                        >
                                            <Input placeholder='Insira a Província'/>
                                        </Form.Item>
                                        <Form.Item
                                            name="distrito"
                                            label="Distrito"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[{ required: true, message: 'Por favor insira o distrito' }]}
                                        >
                                            <Input placeholder='Insira o Distrito'/>
                                        </Form.Item>
                                        <Form.Item
                                            name="cidade"
                                            label="Cidade"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[{ required: true, message: 'Por favor insira a cidade' }]}
                                        >
                                            <Input placeholder='Insira a Cidade'/>
                                        </Form.Item>
                                        <Form.Item
                                            name="instituicao"
                                            label="Insituição"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[{ required: true, message: 'Por favor insira a instituição' }]}
                                        >
                                            <Input placeholder='Insira a Instituição'/>
                                        </Form.Item>
                                        <Form.Item
                                            name="profissao"
                                            label="Profissão"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[{ required: true, message: 'Por favor insira a profissão' }]}
                                        >
                                            <Input placeholder='Insira a Profissão' />
                                        </Form.Item>
                                        <Form.Item
                                            name="contacto"
                                            label="Contacto"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[
                                                { len: 9, message: 'O contacto Inválido' },
                                                { required: true, message: 'Por favor insira o contacto' }
                                            ]}
                                        >
                                            <Input
                                                addonBefore="+258"
                                                placeholder='Insira o Contacto'
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[
                                                { type: 'email', message: 'O email Inválido' },
                                                { required: true, message: 'Por favor insira o email' }
                                            ]}
                                        >
                                            <Input placeholder='Insira o Email' />
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            label="Senha"
                                            labelCol={{ span: 24 }}
                                            style={{ margin: 0, padding: 0 }}
                                            rules={[{ required: true, message: 'Introduza a sua senha!' }]}
                                        >
                                            <Input.Password
                                                prefix={<LockOutlined className="site-form-item-icon" />}
                                                placeholder="Senha"
                                            />
                                        </Form.Item>
                                        <div></div>
                                        <Form.Item
                                            style={{ width: '100%' }}
                                            labelAlign='right'
                                            labelCol={24}
                                            className="flex justify-end"
                                        >
                                            <Button htmlType="submit" loading={loading} className='bg-blue-600 text-white font-bold'>
                                                Continuar
                                            </Button>
                                        </Form.Item>
                                    </Form>

                                )}
                                {currentStep === 1 && (
                                    <div className='w-full'>
                                        <p className="text-center text-sm sm:text-sm font-semibold mb-4 mt-4 sm:px-28" style={{ color: 'black' }}>Enviamos um código de confirmação para o seu email. Por favor insira o código para confirmar o seu email</p>
                                        <Form
                                            form={form}
                                            name="basic"
                                            initialValues={{ remember: true }}
                                            onFinish={handleConfirmEmail}
                                            className="pt-0 pb-0 w-full h-full grid grid-cols-1 sm:grid-cols-1 gap-3 mt-3"
                                            style={{ borderRadius: '15px' }}

                                        >
                                            <Form.Item
                                                name="confirmationCode"
                                                className='w-full sm:w-1/2 mx-auto mb-4'
                                                rules={[{ required: true, message: 'Por favor insira o código de confirmação' }]}
                                            >
                                                <Input placeholder='Insira o Código de Confirmação' />
                                            </Form.Item>
                                            <Form.Item
                                                className="flex justify-center mb-4 w-full sm:w-1/4 mx-auto"
                                            >
                                                <Button
                                                    htmlType="submit"
                                                    loading={loading}
                                                    className='bg-blue-600 w-full text-white font-bold m-0 flex-row items-center flex justify-center gap-2 px-5'
                                                >
                                                    Verificar
                                                    <FaArrowRight size={18} color="white" />
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                        <p className='flex flex-row justify-center cursor-pointer gap-2 text-center w-full mt-0'>
                                            <a className="text-sm sm:text-sm text-blue-600">Reenviar Código</a>
                                        </p>
                                    </div>
                                )}
                                {currentStep === 2 && (
                                    <Result
                                        className='p-0 mt-4'
                                        status="success"
                                        title="Conta Criada Com Sucesso!"
                                        subTitle="Agora pode fazer login na plataforma"
                                        extra={[
                                            <Button className='bg-blue-500 text-white' key="console" onClick={() => navigate('/account/login')}>
                                                Login
                                            </Button>
                                        ]}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default Signup;
