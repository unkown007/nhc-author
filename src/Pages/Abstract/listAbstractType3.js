import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaNotesMedical, FaPlus, FaEye, FaDownload, FaArrowRight, FaRegComment, FaFlag } from 'react-icons/fa';
import { MdPeople, MdDelete } from 'react-icons/md';
import {Input, Button, Form, Space, Table, Divider, notification, Select, Modal, Tag, Row, Col, Radio} from 'antd';
import { EyeOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ComponentToPrint } from '../../Components/Form/print';
import ReactToPrint from 'react-to-print';
import Modelo2 from '../../Components/Form/modelo2';
import { MdOutlineGrade } from "react-icons/md";

const { Option } = Select;


const ListAbstractType3 = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [markedPage, setMarkedPage] = useState(true);
    const [modalKey, setModalKey] = useState(Date.now());
    const [modalView, setModalView] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalPrint, setModalPrint] = useState(false);
    const [selected, setSelected] = useState({});
    const [form] = Form.useForm();
    const [formCoAuthor] = Form.useForm();
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [titleCount, setTitleCount] = useState(0);
    const printRef = useRef();
    const [searchValue, setSearchValue] = useState({
        nid: '',
        nome: '',
        contacto: '',
    });

    const onChange = (e) => {
        setSelected({ ...selected, ethic: e.target.value });
    }

    useEffect(() => {
        localStorage.setItem('title', 'Meus Resumos');
        localStorage.setItem('type', '2');
        getResumes();
        Promise.all([getCategory(), getSubCategory()]);
    }, [])

    const getCategory = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/category/`, {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }
            });
            setCategory(response.data);
        } catch (error) {
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
        }
    }

    const getResumes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${JSON.parse(sessionStorage.getItem('user')).user}/author/resume/programmatic/`, {
                headers: {
                    Authorization: `Token ${sessionStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            setDataMarked(response.data);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleRemoveReview = (record) => {
        axios.delete(`${process.env.REACT_APP_API_URL}/api/resume/programmatic/${record.id}/`, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
        }).then(response => {
            getResumes();
        }).catch(error => {
            console.log(error);
            notification.error({
                message: 'Erro',
                description: 'Erro ao Eliminar o resumo.'
            })
        })
    }

    const goView = (record) => {
        try {
            setSelected(record);
            setModalKey(Date.now());
        } finally {
            setModalView(true);
        }
    }

    const goEdit = (record) => {
        try {
            setSelectedCategory(record.category.id);
            setSelected({
                id: record.id,
                titulo: record.title,
                presentation: record.presentation.id,
                category: record.category.id,
                subcategory: record.subcategory.id,
                coauthor: record.coauthor,
                ethic: record.ethic,
                introducao: record.introduction,
                intervencao: record.intervention,
                metodos: record.methodology,
                resultados: record.result,
                licoes: record.lessons,
                palavrasChave: record.keyword.map(item => item.name).join(', ')
            })
            form.setFieldsValue({
                tipoApresentacao: record.presentation.id,
                categoria: record.category.id,
                subCategoria: record.subcategory.id,
            })
            setModalKey(Date.now());
        } finally {
            setModalEdit(true);
        }
    }

    const handlePrint = (row) => {
        console.log(row)
        setSelected(row);
        setModalPrint(true);
    };

    const columnsMarked = [
        {
            title: "ID",
            dataIndex: "id",
            width: 90,
            key: "id",
        },
        {
            title: "Titulo do Resumo",
            dataIndex: "title",
        },
        {
            title: "Data de Submissão",
            dataIndex: "created_at",
            width: 160,
            render: (text, record) => (
                <div>
                    {dayjs(record.created_at).format('DD/MM/YYYY HH:mm')}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 130,
            render: (text, record) => (
                <div>
                    <Tag color={record.status.name === "Em Validação" ? "yellow" : record.status.name === "Aprovado" ? "green" : record.status.name === "Em Revisão" ? "blue" : "red"}>
                        {record.status.name}
                    </Tag>
                </div>
            ),
        },
        {
            title: "Acções",
            key: "actions",
            width: 140,
            align: "center",
            render: (text, record) => (
                <Space size="middle">
                    <Button size="small" style={{ backgroundColor: '#00728a' }} className="text-white flex items-center" type="link" onClick={() => goView(record)}>
                        <EyeOutlined className='text-white' size={35} />
                    </Button>
                    <Button disabled={record.status.name !== "Em validação"} style={{ backgroundColor: record.status.name === "Em validação" ? '#00728a' : 'gray' }} size="small" className="text-white flex items-center" type="link" onClick={() => goEdit(record)}>
                        <EditOutlined className='text-white' size={35} />
                    </Button>
                    <Button disabled={record.status.name !== "Em validação"} onClick={() => handleRemoveReview(record)} className='bg-red-600' icon={<MdDelete color='white' />} size="small"/>
                </Space>
            ),
        },
    ];

    const [dataMarked, setDataMarked] = useState([]);

    const filteredMarked = dataMarked.filter((item) => {
        if (searchValue.nome && item.title.toLowerCase().indexOf(searchValue.nome.toLowerCase()) === -1) {
            return false;
        }
        return true;
    });

    const countWords = (text) => {
        return text?.split(' ').filter(word => word).length;
    }

    // const formCoAuthor = Form.useForm();
    const [addAuthor, setAddAuthor] = useState({});


    const handleAddCoAuthor = () => {
        if (addAuthor.name && addAuthor.institution) {
            setSelected({ ...selected, coauthor: [...selected.coauthor, addAuthor] });
            formCoAuthor.resetFields();
            setAddAuthor({});
        }
    }

    const handleRemoveCoAuthor = (index) => {
        setSelected({ ...selected, coauthor: selected.coauthor.filter((item, i) => i !== index) });
    }

    const submit = () => {
        form.validateFields()
        let keywords = selected.palavrasChave.split(',').map(keyword => ({ name: keyword.trim() }));
        console.log(keywords);

        let data = {
            title: String(selected.titulo).toUpperCase(),
            introduction: selected.introducao,
            ethic: selected.ethic,
            intervention: selected.intervencao,
            methodology: selected.metodos,
            result: selected.resultados,
            lessons: selected.licoes,
            keyword: keywords,
            presentation: selected.presentation,
            category: selected.category,
            subcategory: selected.subcategory,
            author: JSON.parse(sessionStorage.getItem('user')).user,
            coauthor: selected.coauthor,
        }
        console.log("Edit data")
        console.log(data)

        axios.put(`${process.env.REACT_APP_API_URL}/api/resume/programmatic/${selected.id}/`, data, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
        }).then(response => {
            // window.location.reload()
            getResumes();
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
                <div className="flex flex-col items-center sm:flex-row gap-2">
                    <FaSearch />
                    <Input
                        placeholder="Pesquisa por Titulo"
                        value={searchValue.nome}
                        className='sm:w-64'
                        onChange={(e) => setSearchValue({ ...searchValue, nome: e.target.value })}
                    />
                </div>
                <Divider className='my-0' />
                {markedPage &&
                    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                        <Table
                            size='middle'
                            columns={columnsMarked}
                            dataSource={filteredMarked}
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                        />
                    </div>
                }
                <Modal
                    key={modalKey}
                    title={"Resumo"}
                    visible={modalView}
                    onCancel={() => setModalView(false)}
                    footer={null}
                    width={800}
                >
                    <div className='w-full'>
                        <div className='w-full flex flex-row justify-between items-center mb-0'>
                            <p className='text-sm font-bold mb-2'>Pré-Visualização</p>
                            <ReactToPrint
                                trigger={() => (
                                    <Button className='flex items-center bg-blue-500 text-white cursor-pointer hover:bg-blue-600' onClick={() => handlePrint(selected)}>
                                        <FaDownload className='mr-2' />Baixar
                                    </Button>
                                )}
                                content={() => printRef.current}
                            />
                            <div className='hidden'>
                                <ComponentToPrint ref={printRef}>
                                    <Modelo2 abstract={selected} /> {/* passa a linha selecionada como prop */}
                                </ComponentToPrint>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Titulo</p>
                                <p className='text-sm rounded-md'>{selected?.title}</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.title || "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Tipo de Apresentação</p>
                                <p className='text-sm rounded-md'>{selected.presentation?.name}</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.presentation == 1 ? 'Oral' : item.presentation == 2 ? 'Poster' : "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Tipo de Categoria</p>
                                <p className='text-sm rounded-md'>{selected.category?.name}</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.category || "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Tipo de Subcategoria</p>
                                <p className='text-sm rounded-md'>{selected.subcategory?.name}</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.subcategory || "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Aprovação ética</p>
                                <p className='text-sm rounded-md' style={{border: 'none'}}>
                                    {selected.ethic ? <Tag>Sim</Tag> : <Tag>Não</Tag>}
                                </p>
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Introdução</p>
                                <p className='text-sm rounded-md' style={{border: 'none'}}>{selected.introduction}</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.introduction || "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Intervenção</p>
                                <p className='text-sm rounded-md' style={{border: 'none'}}>{selected.intervention}</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.intervention || "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Metodos</p>
                                <p className='text-sm rounded-md' style={{border: 'none'}}>{selected.methodology}</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.methodology || "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Resultados</p>
                                <p className='text-sm rounded-md' style={{border: 'none'}}>{selected.result}</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.result || "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Lições aprendidas e implicações</p>
                                <p className='text-sm rounded-md' style={{border: 'none'}}>{selected.lessons}</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.lessons || "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Palavras Chave</p>
                                <p className='text-sm rounded-md'
                                   style={{border: 'none'}}>{selected?.keyword?.map((item, index) => <Tag
                                    key={item.id}>{item.name}</Tag>)} </p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.keyword || "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Comentário Geral</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item.comment || "---Não Revisto---"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Decisão dos Revisores</p>
                                {selected.reviews?.map((item, index) => (
                                    <div key={index} className='w-full flex flex-col gap-2'>
                                        <p className='text-sm mb-2 flex items-center'>
                                            <FaRegComment className='mr-2'/>
                                            : {item?.status?.name} • <MdOutlineGrade className='mr-2' style={{
                                            width: '22px',
                                            height: '22px'
                                        }}/>
                                            : {item?.classification} Pontos
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Divider className='my-0'/>
                            <div className='w-full'>
                                <p className='text-sm font-bold mb-2'>Decisão Actual</p>
                                <div className='w-full flex flex-col gap-2'>
                                    <p className='text-sm mb-2 flex items-center'>
                                        <FaFlag className='mr-2'/>
                                        : {selected?.status?.name}
                                    </p>
                                </div>
                                <div className='w-full flex flex-col gap-2'>
                                    <p className='text-sm mb-2 flex items-center'>
                                        <FaRegComment className='mr-2'/>
                                        : {selected?.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal
                    key={modalKey}
                    title={"Editar Resumo"}
                    visible={modalEdit}
                    onCancel={() => setModalEdit(false)}
                    footer={null}
                    width={1000}
                >
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
                                    >
                                        <Input placeholder='Insira o titulo' value={selected.titulo} onChange={
                                            (e) => {
                                                setSelected({...selected, titulo: e.target.value})
                                                form.setFieldsValue({titulo: e.target.value})
                                            }
                                        }/>
                                        <div className="flex flex-row justify-between w-full m-0">
                                            {titleCount > 15 &&
                                                <p className='m-0' style={{color: 'red'}}>O título deve ter no máximo 15
                                                    palavras.</p>}
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
                                        className='mb-2'
                                    >
                                        <Select
                                            placeholder="Seleccione o tipo de apresentação"
                                            allowClear
                                            onChange={(value) => {
                                                setSelected({ ...selected, presentation: value })
                                                form.setFieldsValue({ tipoApresentacao: value })

                                            }}
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
                                        className='mb-2'
                                    >
                                        <Select
                                            placeholder="Seleccione a categoria"
                                            allowClear
                                            onChange={(value) => {
                                                setSelectedCategory(value)
                                                setSelected({...selected, category: value})
                                                form.setFieldsValue({ categoria: value })
                                            }}
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
                                        className='mb-2'
                                    >
                                        <Select
                                            placeholder="Seleccione a sub-categoria"
                                            allowClear
                                            onChange={(value) => {
                                                setSelected({...selected, subcategory: value})
                                                form.setFieldsValue({ subCategoria: value })
                                            }}
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
                                        <Radio.Group
                                            onChange={onChange}
                                            value={selected.ethic}
                                            defaultValue={selected.ethic}
                                        >
                                            <Space direction="vertical">
                                                <Radio value={true}>Sim</Radio>
                                                <Radio value={false}>Não</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider className='my-4' />
                            <p className='text-sm font-bold mb-2'>Co-Autores</p>
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
                                            <Input placeholder='Nome do co-autor' value={addAuthor.name} onChange={(e) => { setAddAuthor({ ...addAuthor, name: e.target.value }) }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="coAuthorInstitution"
                                            label="Instituição do Co-Autor"
                                            className='mb-2'
                                        >
                                            <Input placeholder='Instituição do co-autor' value={addAuthor.institution} onChange={(e) => setAddAuthor({ ...addAuthor, institution: e.target.value })} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                            <Button
                                htmlType="submit"
                                className='ml-auto bg-gray-600 text-white font-bold m-0 flex-row items-center flex justify-center gap-2 px-5'
                                onClick={handleAddCoAuthor}
                            >
                                Adicionar
                            </Button>
                            <div className='w-full'>
                                <Table size='small' dataSource={selected.coauthor} rowKey={(record, index) => index}>
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
                            <Divider className='my-3' />
                            <p
                                className='text-center text-sm sm:text-sm font-semibold mb-1 sm:px-28'
                            >
                                Possui {countWords(selected.introducao) + countWords(selected.metodos) + countWords(selected.resultados) + countWords(selected.conclusao) + countWords(selected.palavrasChave)}/350 Palavra(s) para preencher o corpo do resumo</p>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="introducao"
                                        label="Introdução"
                                        className='mb-2'
                                    >
                                        <Input.TextArea placeholder='Insira a introdução'
                                                        value={selected.introducao}
                                                        onChange={(e) => {
                                                            setSelected({ ...selected, introducao: e.target.value })
                                                            form.setFieldsValue({ introducao: e.target.value })
                                                        }} />
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(selected.introducao)} palavra(s)</p>
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
                                    >
                                        <Input.TextArea placeholder='Insira a intervenção'
                                                        value={selected.intervencao}
                                                        onChange={(e) => {
                                                            setSelected({ ...selected, intervencao: e.target.value })
                                                            form.setFieldsValue({ intervencao: e.target.value })
                                                        }} />
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(selected.intervencao)} palavra(s)</p>
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
                                    >
                                        <Input.TextArea placeholder='Insira os metodos'
                                                        value={selected.metodos}
                                                        onChange={(e) => {
                                                            setSelected({ ...selected, metodos: e.target.value })
                                                            form.setFieldsValue({ metodos: e.target.value })
                                                        }} />
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(selected.metodos)} palavra(s)</p>
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
                                    >
                                        <Input.TextArea placeholder='Insira os resultados'
                                                        value={selected.resultados}
                                                        onChange={(e) => {
                                                            setSelected({ ...selected, resultados: e.target.value })
                                                            form.setFieldsValue({ resultados: e.target.value })
                                                        }} />
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(selected.resultados)} palavra(s)</p>
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
                                    >
                                        <Input.TextArea placeholder='Insira as lições aprendidas e implicações'
                                                        value={selected.licoes}
                                                        onChange={(e) => {
                                                            setSelected({...selected, licoes: e.target.value})
                                                            form.setFieldsValue({licoes: e.target.value})
                                                        }}/>
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(selected.licoes)} palavra(s)</p>
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
                                    >
                                        <Input placeholder='Insira as palavras chave'
                                               value={selected.palavrasChave}
                                               onChange={(e) => {
                                                   setSelected({ ...selected, palavrasChave: e.target.value })
                                                   form.setFieldsValue({ palavrasChave: e.target.value })
                                               }} />
                                        <div className="flex flex-row justify-between w-full m-0">
                                            <p
                                                className='ml-auto mb-0'
                                            >{countWords(selected.palavrasChave)} palavra(s)</p>
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className='w-full flex flex-row gap-4 justify-between items-center mt-4'>
                                <Button
                                    htmlType="submit"
                                    loading={loading}
                                    className='ml-auto bg-blue-600 text-white font-bold m-0 flex-row items-center flex justify-center gap-2 px-5'
                                    onClick={() => submit()}
                                >
                                    Salvar
                                    <FaArrowRight size={18} color="white" />
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </div >
        </div >
    );
}

export default ListAbstractType3;