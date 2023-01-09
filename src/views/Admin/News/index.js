import ReactTable from "../../../Components/ReactTable"
import moment from "moment"
import {useAuth} from "../../../Context"
import React, {Fragment, useCallback, useEffect, useState} from 'react'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import {faArchive, faPlusCircle, faSave, faTrash} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../../Layout/AppMain/PageTitle"
import {Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import BlockUi from "react-block-ui";
import Loader from "react-loaders";

import {faSpinner} from "@fortawesome/fontawesome-free-solid";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {useCKeditor4, useInput} from "../../../hooks";
import {columnsRecomendaciones} from "../Recomendaciones/columnsRecomendaciones";
import {columnsNews} from "../Categorias/columnsCategorias";
import MyLabel from "../../../Components/MyLabel";
import RecomendacionesModel from "../../../Components/Models/Recomendaciones";
import NewsModel from "../../../Components/Models/News";
import {MyDropzone} from "../../../Components";
import {uploadImg} from "../../../utils/scripts";

const MySwal = withReactContent(Swal)

const News = () => {
    const {client, toast, removeAllToasts, auth} = useAuth()
    const [config, setConfig] = useState({
        blocking: true,
        isOpen: false
    })
    const [noticia, setNoticia] = useState({})
    const [noticias, setNoticias] = useState([])
    const [etiqueta, inputEtiqueta, setEtiqueta] = useInput({})
    const [descripcion, inputDescripcion, setDescripcion] = useInput({})
    const [editor_html, input_editor_html, set_editor_html] = useCKeditor4({})
    const [file, setFile] = useState(null)


    useEffect(() => {
        NewsModel.getAllOrNot(client, {mostrar: false}, 'id, descripcion, etiqueta, deleted_at, contenido_html, foto')
            .then(response => {
                const {selectNews} = response.data
                setNoticias(selectNews)
                setConfig({...config, blocking: false})
            })
    }, [])

    const saveNoticia = () => {
        toast.success(<span><FontAwesomeIcon icon={faSpinner} spin/> Guardando...</span>)
        const CRUD = noticia.id ? NewsModel.update(client, {
                id: noticia.id,
                update: {etiqueta, descripcion, contenido_html: editor_html, foto: file}
            }, 'id, descripcion, etiqueta, deleted_at, contenido_html, foto') :
            NewsModel.create(client, {
                etiqueta, descripcion, contenido_html: editor_html, foto: file
            }, 'id, descripcion, etiqueta, deleted_at, contenido_html, foto')
        CRUD.then(response => {
            const datos = noticia.id ? response.data.updateNews : response.data.createNews
            if (noticia.id) setNoticias(prev => prev.map(element => element.id !== noticia.id ? element : datos))
            else setNoticias(prev => [datos, ...prev])

            removeAllToasts()
            toast.success('Guardado exitoso', {autoClose: 3500})
            setConfig({...config, isOpen: false})
        })
    }
    useEffect(() => {
        set_editor_html(noticia.contenido_html ? noticia.contenido_html : '')
        setDescripcion(noticia.descripcion ? noticia.descripcion : '')
        setEtiqueta(noticia.etiqueta ? noticia.etiqueta : '')
        setFile(noticia.foto ? noticia.foto : null)
    }, [noticia])
    const onDrop = accepted => {
        uploadImg(accepted[0], 'noticias', auth)
            .then(response => response.json())
            .then(({data}) => {
                setFile(data.name)
            })
    }
    const accion = (caso, dato) => {
        switch (caso) {
            case 'activar':
                MySwal
                    .fire({
                        icon: 'question',
                        title: `¿Desea activar la noticia?`,
                        showCancelButton: true,
                        reverseButtons: true,
                        confirmButtonText: 'Sí, activar!',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#d92550',
                        cancelButtonColor: '#1a92c6'
                    })
                    .then(result => {
                        if (result.value) {
                            toast.success(<span><FontAwesomeIcon icon={faSpinner} spin/> Procesando...</span>)
                            NewsModel.activateDelete(client, {id: dato, eliminar: false})
                                .then(() => {
                                    setNoticias(prev => prev.map(element => element.id !== dato ? element : {
                                        ...element,
                                        deleted_at: null
                                    }))
                                    removeAllToasts()
                                    toast.success('Recomendación activada...', {autoClose: 5000})
                                }).catch(({message}) => {
                                removeAllToasts()
                                toast.error(message, {autoClose: 5000})
                            })
                        }
                    })
                break
            case 'editar':
                setNoticia(dato)
                setConfig({...config, isOpen: true})
                break
            case 'delete':
                MySwal
                    .fire({
                        icon: 'question',
                        title: `¿Desea eliminar la noticia?`,
                        showCancelButton: true,
                        reverseButtons: true,
                        confirmButtonText: 'Sí, eliminar!',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#d92550',
                        cancelButtonColor: '#1a92c6'
                    })
                    .then(result => {
                        if (result.value) {
                            toast.success(<span><FontAwesomeIcon icon={faSpinner} spin/> Procesando...</span>)
                            NewsModel.activateDelete(client, {id: dato, eliminar: true})
                                .then(() => {
                                    setNoticias(prev => prev.map(element => element.id !== dato ? element : {
                                        ...element,
                                        deleted_at: true
                                    }))
                                    removeAllToasts()
                                    toast.success('Recomendación eliminada...', {autoClose: 5000})
                                }).catch(({message}) => {
                                removeAllToasts()
                                toast.error(message, {autoClose: 5000})
                            })
                        }
                    })
                break
        }
    }
    return (
        <Fragment>
            <ReactCSSTransitionGroup component='div' transitionName='TabsAnimation' transitionAppear={true}
                                     transitionAppearTimeout={0} transitionEnter={false} transitionLeave={false}>
                <PageTitle heading='Categorías' subheading={`LISTA DE NOTICIAS`} icon={faArchive}
                           menus={[{to: '/admin/news', name: 'Categorías'}]}/>

                <Container fluid>
                    <Card className='main-card'>
                        <CardBody>
                            <div className='text-left'>
                                <br/>
                            </div>
                            <div className='text-center'>
                                <Button className='btn-pill text-white' active size='sm' color='primary'
                                        onClick={() => {
                                            setConfig({...config, isOpen: true})
                                            setNoticia({})
                                        }}>
                                    <FontAwesomeIcon icon={faPlusCircle}/> Nueva Noticia
                                </Button>
                            </div>
                            <Col md={12}>
                                <BlockUi tag='div' blocking={config.blocking}
                                         loader={<Loader active type='ball-pulse'/>}>
                                    <ReactTable {...{
                                        columns: columnsNews({
                                            noticias, config, accion,
                                        }),
                                        data: noticias,
                                        getCellProps: ({row}) => {
                                            const {original} = row
                                            return {style: {color: original.deleted_at ? '#d92550' : '#495057'}}
                                        }
                                    }} />
                                </BlockUi>
                            </Col>
                        </CardBody>
                    </Card>
                    <Modal isOpen={config.isOpen} toggle={() => setConfig({...config, isOpen: false})}
                           backdrop={false} size="lg">
                        <ModalHeader toggle={() => setConfig({...config, isOpen: false})}
                                     style={{border: '0px solid'}}
                                     close={<button className="close" onClick={() => setConfig({
                                         ...config,
                                         isOpen: false
                                     })}>&times;</button>}>{noticia.id ? 'Editar' : 'Nueva'} noticia
                        </ModalHeader>
                        <ModalBody>
                            <Row style={{justifyContent: 'center'}}>
                                <Col md={5}>
                                    <MyLabel name="Portada foto:"/>
                                    {
                                        !(file === '' || !file) ? <>
                                                <img width={200} height={300}
                                                     src={`${process.env.REACT_APP_API_ECOCONT}/images/noticias/${file}`}
                                                     alt='Foto portada'/>
                                                <Row className="justify-content-center text-center">
                                                    <Button onClick={() => setFile(null)}>
                                                        Cambia Foto
                                                    </Button>
                                                </Row>

                                            </>
                                            : <MyDropzone {...{
                                                onDrop: onDrop,
                                                accept: 'image/*',
                                            }} />
                                    }
                                </Col>

                            </Row>
                            <Row>
                                <Col md={6} className="pr-0">
                                    <MyLabel name="Etiqueta" required/>
                                    {inputEtiqueta}
                                </Col>
                                <Col md={6}>
                                    <MyLabel name="Descripción"/>
                                    {inputDescripcion}
                                </Col>
                                <Col md={12}>
                                    <MyLabel name="Contenido"/>
                                    {input_editor_html}
                                </Col>

                            </Row>
                        </ModalBody>
                        <ModalFooter style={{border: '0px solid'}}>
                            <Button color="danger" onClick={() => setConfig({...config, isOpen: false})}>
                                <FontAwesomeIcon icon={faTrash}/> Cancelar
                            </Button>
                            <Button color="primary" onClick={() => saveNoticia()}>
                                <FontAwesomeIcon icon={faSave}/> Guardar
                            </Button>
                        </ModalFooter>
                    </Modal>
                </Container>
            </ReactCSSTransitionGroup>
        </Fragment>
    )
}
export default News