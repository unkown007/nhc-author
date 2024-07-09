import React, { useState, useEffect, useRef } from 'react';
import './css/index.css';
import { Tag } from 'antd';

const Modelo = ({ abstract }) => {
    useEffect(() => {
        console.log(abstract);
    }, []);
    return (
        <div class="main">
            <div class="container-1">
                <div class="image-container-1">
                    <img src={require('../../assets/logo/ins2.png')} alt="Logo do Instituto Nacional de Saúde" class="logo" />
                    <p>REPÚBLICA DE MOÇAMBIQUE</p>
                    <p>INSTITUTO NACIONAL DE SAÚDE</p>
                </div>

                <div class="content">
                    <div class="author-info">
                        <div class="author-row">
                            <div class="author-column">
                                <p ><strong>Nome:</strong> {abstract.author?.first_user_name} {abstract.author?.last_user_name}</p>
                            </div>
                        </div>
                        <div class="author-row">
                            <div class="author-column">
                                <p><strong>Gênero:</strong> {abstract.author?.gender}</p>
                            </div>
                            <div class="author-column">
                                <p><strong>Nacionalidade:</strong> {abstract.author?.nationality}</p>
                            </div>
                        </div>
                        <div class="author-row">
                            <div class="author-column">
                                <p><strong>Província:</strong> {abstract.author?.province}</p>
                            </div>
                            <div class="author-column">
                                <p><strong>Cidade:</strong> {abstract.author?.city}</p>
                            </div>
                        </div>
                        <div class="author-row">
                            <div class="author-column">
                                <p><strong>Distrito:</strong> {abstract.author?.district}</p>
                            </div>
                            <div class="author-column">
                                <p><strong>Profissão:</strong> {abstract.author?.profession}</p>
                            </div>
                        </div>
                        <div class="author-row">
                            <div class="author-column">
                                <p><strong>Proveniência:</strong> {abstract.author?.provenance}</p>
                            </div>
                        </div>
                    </div>

                    <div class="author-data">
                        <div class="author-title">
                            <p><strong>Título:</strong> {abstract.title}</p>
                        </div>

                        <div class="content-columns">
                            <div class="left-side">
                                <div class="data-section">
                                    <p><strong>Formato de apresentação:</strong> {abstract.presentation?.name}</p>
                                    <p><strong>Categoria:</strong> • {abstract.category?.name}</p>
                                    <p><strong>Sub-categoria:</strong> • {abstract.subcategory?.name}</p>
                                </div>
                            </div>

                            <div class="right-side">
                                <div class="co-authors-section">
                                    <p><strong>Lista de co-autores</strong></p>
                                    <ul class="author-list">
                                        {abstract.coauthor?.map((item, index) => <li
                                            key={item.id}>{item.name} -- {item.institution}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className='text-sm font-bold mb-2'>Aprovação ética</p>
                            <p className='text-sm rounded-md' style={{border: 'none'}}>
                                {abstract.ethic ? <Tag>Sim</Tag> : <Tag>Não</Tag>}
                            </p>
                        </div>
                    </div>

                    <div class="box">
                        <h5><strong>INTRODUÇÃO:</strong></h5>
                        <p>{abstract.introduction}</p>

                        <h5><strong>METODOLOGIA:</strong></h5>
                        <p>{abstract.methodology}</p>

                        <h5><strong>RESULTADOS:</strong></h5>
                        <p>{abstract.result}</p>

                        <h5><strong>CONCLUSÃO:</strong></h5>
                        <p>{abstract.conclusion}</p>

                        <h5><strong>Palavras-chave:</strong></h5>
                        <p>{abstract.keyword?.map((item, index) => <Tag key={item.id}>{item.name}</Tag>)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modelo;