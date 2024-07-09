import axios from 'axios';
import 'antd/dist/reset.css';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import {Form, Input, Button, notification, Divider, Steps, Result, Row, Col, Table, Radio, Menu, Tag} from 'antd';
import { useNavigate } from 'react-router-dom'
import { Select } from 'antd';
import { FaArrowLeft, FaArrowRight, FaDownload } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { ComponentToPrint } from '../../Components/Form/print';
import ReactToPrint from 'react-to-print';
import Modelo2 from "../../Components/Form/modelo2";
const { Option } = Select;

const AbstractType3 = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm();
    const [formCoAuthor] = Form.useForm();
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const printRef = useRef();
    const [abstract, setAbstract] = useState([]);

    const [ethic, setEthic] = useState(false);

    const onChange = (e) => {
        setEthic(e.target.value)
    }

    useEffect(() => {
        localStorage.setItem('title', 'Submeter Resumo');
        localStorage.setItem('type', '2');
        Promise.all([getCategory(), getSubCategory()]);
    }, [])

    const handleSubmit = async (e) => {
        navigate('/')
    };

    const getCategory = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/category/`, {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            setCategory(response.data);
        } catch (error) {
            setLoading(false);
        }
    }

    const getSubCategory = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/category/subcategory/`, {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }
            });
            setSubCategory(response.data);
        } catch (error) {
            setLoading(false);
        }
    }

    //body
    const [body, setBody] = useState({
        titulo: '',
        introducao: '',
        intervencao: '',
        metodos: '',
        resultados: '',
        licoes: '',
        palavrasChave: ''
    });

    // Title Count
    const [titleCount, setTitleCount] = useState(0);
    const handleInputChange = (e) => {
        setBody({ ...body, titulo: e.target.value });
        form.setFieldsValue({ titulo: e.target.value });
        const words = e.target.value.split(' ').filter(word => word);
        setTitleCount(words.length);
    };

    const countWords = (text) => {
        return text?.split(' ').filter(word => word).length;
    }

    // Co-Authors
    const [coAuthors, setCoAuthors] = useState([]);
    const [coAuthor, setCoAuthor] = useState({ name: '', institution: '' });
    const handleAddCoAuthor = () => {
        setCoAuthors([...coAuthors, coAuthor]);
        formCoAuthor.resetFields();
        setCoAuthor({ name: '', institution: '' });
    };
    const handleRemoveCoAuthor = (index) => {
        const newCoAuthors = [...coAuthors];
        newCoAuthors.splice(index, 1);
        setCoAuthors(newCoAuthors);
    };
    //Operations
    const handleConfirmInfo = () => {
        if (titleCount > 15) {
            notification.error({
                message: 'Erro',
                description: 'O título deve ter no máximo 15 palavras.'
            })
        } else if (form.getFieldValue('titulo') === undefined) {
            notification.error({
                message: 'Erro',
                description: 'Por favor insira o titulo.'
            })
        }
        else if (form.getFieldValue('tipoApresentacao') === undefined) {
            notification.error({
                message: 'Erro',
                description: 'Por favor seleccione o tipo de apresentação.'
            })
        } else if (form.getFieldValue('categoria') === undefined) {
            notification.error({
                message: 'Erro',
                description: 'Por favor seleccione a categoria.'
            })
        } else if (form.getFieldValue('subCategoria') === undefined) {
            notification.error({
                message: 'Erro',
                description: 'Por favor seleccione a sub-categoria.'
            })
        } else {
            setCurrentStep(1);
        }
    }

    const handleConfirmBody = () => {
        if (countWords(body.introducao) + countWords(body.metodos) + countWords(body.resultados) + countWords(body.conclusao) > 350) {
            notification.error({
                message: 'Erro',
                description: 'O resumo deve ter no máximo 350 palavras.'
            })
        } else if (form.getFieldValue('introducao') === undefined) {
            notification.error({
                message: 'Erro',
                description: 'Por favor insira a introdução.'
            })
        } else if (form.getFieldValue('intervencao') === undefined) {
            notification.error({
                message: 'Erro',
                description: 'Por favor insira a Intervenção.'
            })
        } else if (form.getFieldValue('metodos') === undefined) {
            notification.error({
                message: 'Erro',
                description: 'Por favor insira os metodos.'
            })
        } else if (form.getFieldValue('resultados') === undefined) {
            notification.error({
                message: 'Erro',
                description: 'Por favor insira os resultados.'
            })
        } else if (form.getFieldValue('licoes') === undefined) {
            notification.error({
                message: 'Erro',
                description: 'Por favor insira as lições aprendidas e implicações.'
            })
        } else {
            setCurrentStep(2);
        }
    }

    const submit = () => {
        let keywords = form.getFieldValue('palavrasChave').split(',').map(keyword => ({ name: keyword.trim() }));

        let data = {
            title: String(form.getFieldValue('titulo')).toUpperCase(),
            introduction: form.getFieldValue('introducao'),
            ethic: ethic,
            intervention: form.getFieldValue('intervencao'),
            methodology: form.getFieldValue('metodos'),
            result: form.getFieldValue('resultados'),
            lessons: form.getFieldValue('licoes'),
            keyword: keywords,
            presentation: form.getFieldValue('tipoApresentacao'),
            category: form.getFieldValue('categoria'),
            subcategory: form.getFieldValue('subCategoria'),
            author: JSON.parse(sessionStorage.getItem('user')).user,
            coauthor: coAuthors,
        }

        axios.post(`${process.env.REACT_APP_API_URL}/api/resume/programmatic/`, data, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
        }).then(response => {
            console.log(response.data)
            setAbstract(response.data);
            setCurrentStep(3);
        }).catch(error => {
            console.log(error);
            notification.error({
                message: 'Erro',
                description: 'Erro ao submeter o resumo.'
            })
        })
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex flex-col gap-2 bg-white rounded-lg p-4">
                <div className='hidden sm:block px-10'>
                    <Steps
                        size="small"
                        current={currentStep}
                        direction='horizontal'
                        items={[
                            {
                                title:
                                    <span
                                        className="hidden sm:inline cursor-pointer"
                                    >
                                        Informações do Resumo
                                    </span>,
                            },
                            {
                                title:
                                    <span
                                        className="hidden sm:inline"
                                    >
                                        Resumo
                                    </span>,
                            },
                            {
                                title:
                                    <span
                                        className="hidden sm:inline"
                                    >
                                        Pré-Visualização
                                    </span>,
                            },
                            {
                                title:
                                    <span
                                        className="hidden sm:inline"
                                    >
                                        Concluído
                                    </span>,
                            },
                        ]}
                    />
                </div>
                <div className="sm:hidden">
                    <h2 className="text-center text-lg font-bold mb-3">

                    </h2>
                </div>
                {currentStep === 0 && (
                    <div className='w-full'>
                        <Form
                            form={form}
                            layout='vertical'
                            onFinish={null}
                            scrollToFirstError
                        >
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="titulo"
                                        label="Titulo"
                                        className='mb-2'
                                        rules={[
                                            { required: true, message: 'Por favor insira o titulo' },
                                        ]}
                                    >
                                        <Input value={body.titulo} placeholder='Insira o titulo' onChange={handleInputChange} />
                                        <div className="flex flex-row justify-between w-full m-0">
                                            {titleCount > 15 && <p className='m-0' style={{ color: 'red' }}>O título deve ter no máximo 15 palavras.</p>}
                                            <p
                                                className='ml-auto mb-0'
                                                style={{ color: titleCount > 15 ? 'red' : 'black' }}
                                            >{titleCount}/15 palavras</p>
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="tipoApresentacao"
                                        label="Apresentação"
                                        rules={[
                                            { required: true, message: 'Por favor Seleccione o tipo de apresentação' },
                                        ]}
                                        className='mb-2'
                                    >
                                        <Select
                                            placeholder="Seleccione o tipo de apresentação"
                                            allowClear
                                        >
                                            <Option value={1}>Oral</Option>
                                            <Option value={2}>Poster</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={9}>
                                    <Form.Item
                                        name="categoria"
                                        label="Categoria"
                                        rules={[
                                            { required: true, message: 'Por favor Seleccione a categoria' },
                                        ]}
                                        className='mb-2'
                                    >
                                        <Select
                                            placeholder="Seleccione a categoria"
                                            allowClear
                                            onChange={(value) => setSelectedCategory(value)}
                                        >
                                            {category.map((item, index) => (
                                                <Option key={index} value={item.id}>{item.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={9}>
                                    <Form.Item
                                        name="subCategoria"
                                        label="Sub-Categoria"
                                        rules={[
                                            { required: true, message: 'Por favor Seleccione a sub-categoria' },
                                        ]}
                                        className='mb-2'
                                    >
                                        <Select
                                            placeholder="Seleccione a sub-categoria"
                                            allowClear
                                        >
                                            {subCategory.filter(item => item.category.id == selectedCategory).map((item, index) => (
                                                <Option key={index} value={item.id}>{item.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={9}>
                                    <Form.Item
                                        name="etica"
                                        label="Teve aprovação ética?"
                                        className='mb-2'
                                    >
                                        <Radio.Group onChange={onChange} value={ethic}>
                                            <Radio value={true}>Sim</Radio>
                                            <Radio value={false}>Não</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Divider className='my-4' />
                        <p className='text-sm font-bold mb-2'>Co-Autores</p>
                        <div className='w-full flex flex-col gap-4'>
                            <div className='w-full'>
                                <Form
                                    form={formCoAuthor}
                                    layout='vertical'
                                    onFinish={null}
                                    scrollToFirstError
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="coAuthor"
                                                label="Nome do Co-Autor"
                                                className='mb-2'
                                            >
                                                <Input placeholder='Nome do co-autor' value={coAuthor.name} onChange={(e) => { setCoAuthor({ ...coAuthor, name: e.target.value }) }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="coAuthorInstitution"
                                                label="Instituição do Co-Autor"
                                                className='mb-2'
                                            >
                                                <Input
                                                    placeholder="Nome da instituição"
                                                    onChange={(e) => { setCoAuthor({ ...coAuthor, institution: e.target.value }) }}
                                                    value={coAuthor.institution}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                                <Button
                                    htmlType="submit"
                                    loading={loading}
                                    className='ml-auto bg-gray-600 text-white font-bold m-0 flex-row items-center flex justify-center gap-2 px-5'
                                    onClick={handleAddCoAuthor}
                                >
                                    Adicionar
                                </Button>
                            </div>
                            <div className='w-full'>
                                <Table size='small' dataSource={coAuthors} rowKey={(record, index) => index}>
                                    <Table.Column title="Nome" dataIndex="name" key="name" />
                                    <Table.Column title="Instituição" dataIndex="institution" key="institution" />
                                    <Table.Column
                                        title="Ação"
                                        key="action"
                                        width={100}
                                        align='center'
                                        render={(text, record, index) => (
                                            <Button onClick={() => handleRemoveCoAuthor(index)} className='bg-red-600' icon={<MdDelete color='white' />} />
                                        )}
                                    />
                                </Table>
                            </div>
                        </div>
                        <Button
                            htmlType="submit"
                            loading={loading}
                            className='ml-auto bg-blue-600 mt-4 text-white font-bold m-0 flex-row items-center flex justify-center gap-2 px-5'
                            onClick={() => handleConfirmInfo()}
                        >
                            Continuar
                            <FaArrowRight size={18} color="white" />
                        </Button>
                    </div>
                )}
                {currentStep === 1 && (
                    <div className='w-full'>
                        <p
                            className='text-center text-sm sm:text-sm font-semibold mb-1 mt-4 sm:px-28'
                        >
                            Possui {countWords(body.introducao) + countWords(body.intervencao) + countWords(body.metodos) + countWords(body.resultados) + countWords(body.licoes)}/350 Palavra(s) para preencher o corpo do resumo</p>
                        <Form
                            form={form}
                            layout='vertical'
                            onFinish={null}
                            scrollToFirstError
                        >
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="introducao"
                                        label="Introdução"
                                        className='mb-2'
                                        rules={[
                                            { required: true, message: 'Por favor insira a introdução' },
                                        ]}
                                    >
                                        <Input.TextArea placeholder='Insira a introdução'
                                                        value={body.introducao}
                                                        onChange={(e) => {
                                                            setBody({ ...body, introducao: e.target.value })
                                                            form.setFieldsValue({ introducao: e.target.value })
                                                        }} />
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(body.introducao)} palavra(s)</p>
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="intervencao"
                                        label="Intervenção"
                                        className='mb-2'
                                        rules={[
                                            { required: true, message: 'Por favor insira a intervenção' },
                                        ]}
                                    >
                                        <Input.TextArea placeholder='Insira a intervenção'
                                                        value={body.intervencao}
                                                        onChange={(e) => {
                                                            setBody({ ...body, intervencao: e.target.value })
                                                            form.setFieldsValue({ intervencao: e.target.value })
                                                        }} />
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(body.intervencao)} palavra(s)</p>
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="metodos"
                                        label="Metodos"
                                        className='mb-2'
                                        rules={[
                                            { required: true, message: 'Por favor insira os metodos' },
                                        ]}
                                    >
                                        <Input.TextArea placeholder='Insira os metodos'
                                                        value={body.metodos}
                                                        onChange={(e) => {
                                                            setBody({ ...body, metodos: e.target.value })
                                                            form.setFieldsValue({ metodos: e.target.value })
                                                        }} />
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(body.metodos)} palavra(s)</p>
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="resultados"
                                        label="Resultados"
                                        className='mb-2'
                                        rules={[
                                            { required: true, message: 'Por favor insira os resultados' },
                                        ]}
                                    >
                                        <Input.TextArea placeholder='Insira os resultados'
                                                        value={body.resultados}
                                                        onChange={(e) => {
                                                            setBody({ ...body, resultados: e.target.value })
                                                            form.setFieldsValue({ resultados: e.target.value })
                                                        }} />
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(body.resultados)} palavra(s)</p>
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="licoes"
                                        label="Lições aprendidas e implicações"
                                        className='mb-2'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Por favor insira as lições aprendidas e implicações'
                                            },
                                        ]}
                                    >
                                        <Input.TextArea placeholder='Insira as lições aprendidas e implicações'
                                                        value={body.licoes}
                                                        onChange={(e) => {
                                                            setBody({...body, licoes: e.target.value})
                                                            form.setFieldsValue({licoes: e.target.value})
                                                        }}/>
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(body.licoes)} palavra(s)</p>
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="palavrasChave"
                                        label="Palavras Chave"
                                        className='mb-2'
                                        rules={[
                                            { required: true, message: 'Por favor insira as palavras chave' },
                                        ]}
                                    >
                                        <Input placeholder='Insira as palavras chave'
                                               value={body.palavrasChave}
                                               onChange={(e) => {
                                                   setBody({ ...body, palavrasChave: e.target.value })
                                                   form.setFieldsValue({ palavrasChave: e.target.value })
                                               }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className='w-full flex flex-row gap-4 justify-between items-center mt-4'>
                                <Button
                                    htmlType="submit"
                                    loading={loading}
                                    className='bg-gray-600 text-white font-bold m-0 flex-row items-center flex justify-center gap-2 px-5'
                                    onClick={() => setCurrentStep(0)}
                                >
                                    <FaArrowLeft size={18} color="white" />
                                    Voltar
                                </Button>
                                <Button
                                    htmlType="submit"
                                    loading={loading}
                                    className='ml-auto bg-blue-600 text-white font-bold m-0 flex-row items-center flex justify-center gap-2 px-5'
                                    onClick={() => handleConfirmBody()}
                                >
                                    Continuar
                                    <FaArrowRight size={18} color="white" />
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
                {currentStep === 2 && (
                    <div className='w-full'>
                        <div className='w-full flex flex-col gap-4'>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Pré-Visualização</p>
                                <div className='w-full bg-white rounded-lg p-4'>
                                    <div className='w-full flex flex-col gap-4'>
                                        <div className='w-full'>
                                            <p className='text-sm font-bold mb-2'>Titulo</p>
                                            <p className='text-sm'>{form.getFieldValue('titulo')}</p>
                                        </div>
                                        <Divider className='my-0'/>
                                        <div className='w-full flex flex-row gap-4'>
                                            <div className='w-full'>
                                                <p className='text-sm font-bold mb-2'>Apresentação</p>
                                                <p className='text-sm'>{form.getFieldValue('tipoApresentacao') === 1 ? 'Oral' : 'Poster'} </p>
                                            </div>
                                            <div className='w-full'>
                                                <p className='text-sm font-bold mb-2'>Categoria</p>
                                                <p className='text-sm'>{category.find(item => item.id == form.getFieldValue('categoria'))?.name}</p>
                                            </div>
                                            <div className='w-full'>
                                                <p className='text-sm font-bold mb-2'>Sub-Categoria</p>
                                                <p className='text-sm'>{subCategory.find(item => item.id == form.getFieldValue('subCategoria'))?.name}</p>
                                            </div>
                                        </div>
                                        <Divider className='my-0'/>
                                        <div className='w-full'>
                                            <p className='text-sm font-bold mb-2'>Aprovação ética</p>
                                            <p className='text-sm rounded-md' style={{border: 'none'}}>
                                                {ethic ? <Tag>Sim</Tag> : <Tag>Não</Tag>}
                                            </p>
                                        </div>
                                        <Divider className='my-0'/>
                                        <div className='w-full'>
                                            <p className='text-sm font-bold mb-2'>Co-Autores</p>
                                            <div className='w-full flex flex-col gap-4'>
                                                <Table size='small' dataSource={coAuthors}
                                                       rowKey={(record, index) => index} footer={null}
                                                       pagination={false}>
                                                    <Table.Column title="Nome" dataIndex="name" key="name"/>
                                                    <Table.Column title="Instituição" dataIndex="institution"
                                                                  key="institution"/>
                                                </Table>
                                            </div>
                                        </div>
                                        <Divider className='my-0'/>
                                        <div className='w-full'>
                                            <p className='text-sm font-bold mb-2'>Introdução</p>
                                            <p className='text-sm'>{body.introducao}</p>
                                        </div>
                                        <div className='w-full'>
                                            <p className='text-sm font-bold mb-2'>Intervenção</p>
                                            <p className='text-sm'>{body.intervencao}</p>
                                        </div>
                                        <div className='w-full'>
                                            <p className='text-sm font-bold mb-2'>Metodos</p>
                                            <p className='text-sm'>{body.metodos}</p>
                                        </div>
                                        <div className='w-full'>
                                            <p className='text-sm font-bold mb-2'>Resultados</p>
                                            <p className='text-sm'>{body.resultados}</p>
                                        </div>
                                        <div className='w-full'>
                                            <p className='text-sm font-bold mb-2'>Lições aprendidas e implicações</p>
                                            <p className='text-sm'>{body.licoes}</p>
                                        </div>
                                        <div className='w-full'>
                                            <p className='text-sm font-bold mb-2'>Palavras Chave</p>
                                            <p className='text-sm'>{body.palavrasChave}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-row gap-4 justify-between items-center'>
                                <Button
                                    htmlType="submit"
                                    loading={loading}
                                    className='bg-gray-600 text-white font-bold m-0 flex-row items-center flex justify-center gap-2 px-5'
                                    onClick={() => setCurrentStep(1)}
                                >
                                    <FaArrowLeft size={18} color="white" />
                                    Voltar
                                </Button>
                                <Button
                                    htmlType="submit"
                                    loading={loading}
                                    className='ml-auto bg-blue-600 text-white font-bold m-0 flex-row items-center flex justify-center gap-2 px-5'
                                    onClick={() => submit()}
                                >
                                    Continuar
                                    <FaArrowRight size={18} color="white" />
                                </Button>
                            </div>

                        </div>
                    </div>

                )}
                {currentStep === 3 && (
                    <Result
                        className='p-0 mt-4'
                        status="success"
                        title="Resumo Submetido com Sucesso!"
                        subTitle="O resumo foi submetido com sucesso. Aguarde pela aprovação do resumo."
                        extra={[
                            <ReactToPrint
                                trigger={() => (
                                    <Button className='bg-blue-500 text-white' key="console" onClick={() => navigate('/account/login')}>
                                        <div className='flex flex-row items-center gap-2'>
                                            <FaDownload />
                                            Download do Resumo
                                        </div>
                                    </Button>
                                )}
                                content={() => printRef.current}
                            />
                        ]}
                    />
                )}
                <div className='hidden'>
                    <ComponentToPrint ref={printRef}>
                        <Modelo2 abstract={abstract} />
                    </ComponentToPrint>
                </div>
            </div>
        </div>
    );
};

export default AbstractType3;