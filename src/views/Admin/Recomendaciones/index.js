import React, {Fragment, useEffect, useState} from "react"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSpinner} from "@fortawesome/fontawesome-free-solid"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import {faArchive, faPlusCircle, faSave, faTrash} from "@fortawesome/free-solid-svg-icons"
import {
    Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row
} from "reactstrap"
import BlockUi from "react-block-ui"
import {useCKeditor4, useInput} from "../../../hooks";
import useSelect from "../../../hooks/useSelect";
import {useAuth} from "../../../Context";
import Categoria from "../../../Components/Models/Categoria";
import PageTitle from "../../../Layout/AppMain/PageTitle";
import Loader from "react-loaders";
import ReactTable from "../../../Components/ReactTable";
import {columnsCategoria} from "../Categorias/columnsCategorias";
import CrudCategoria from "../Categorias/CrudCategoria";
import {columnsRecomendaciones} from "./columnsRecomendaciones";
import MyLabel from "../../../Components/MyLabel";
import MedicosModel from "../../../Components/Models/Medicos";
import RecomendacionesModel from "../../../Components/Models/Recomendaciones";

const MySwal = withReactContent(Swal)


const Recomendaciones = () => {
    const {client, toast, removeAllToasts} = useAuth()
    const [orden, inputOrden, setOrden] = useInput({
        typeState: 'Number',
    })
    const [categoria_id, selectCategoria, setCategoria, , setOptionCategoria] = useSelect({optionsState: []})

    const [editor_html, input_editor_html, set_editor_html] = useCKeditor4({})
    const [descripcion, inputDescripcion, setDescripcion] = useInput({})
    const [config, setConfig] = useState({isOpen: false, isBlocking: true})
    const [recomendaciones, setRecomendaciones] = useState([])
    const [recomendacion, setRecomendacion] = useState({})
    useEffect(() => {
        getCategorias()
    }, [])
    const getCategorias = () => {
        Categoria
            .getAll(client, 'id, nombre, codigo')
            .then(result => {
                setOptionCategoria(result.data.categorias.map(element => ({
                    value: element.id,
                    label: element.codigo + ' - ' + element.nombre
                })))
            })
    }
    useEffect(() => {
        setCategoria(recomendacion.categoria_id ? recomendacion.categoria_id : '')
        set_editor_html(recomendacion.contenido ? recomendacion.contenido : '')
        setDescripcion(recomendacion.descripcion ? recomendacion.descripcion : '')
        setOrden(recomendacion.orden ? recomendacion.orden : '')
    }, [recomendacion])
    useEffect(() => {
        RecomendacionesModel.getAll(client, 'id, orden, descripcion, categoria_id, contenido, deleted_at')
            .then(response => {
                const {selectRecomendaciones} = response.data
                setRecomendaciones(selectRecomendaciones)
            })
    }, [])
    const accion = (caso, dato) => {
        switch (caso) {
            case 'activar':
                MySwal
                    .fire({
                        icon: 'question',
                        title: `¿Desea activar la recomendación?`,
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
                            RecomendacionesModel.activateDelete(client, {id: dato, eliminar: false})
                                .then(() => {
                                    setRecomendaciones(prev => prev.map(element => element.id !== dato ? element : {
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
                setRecomendacion(dato)
                setConfig({...config, isOpen: true})
                break
            case 'delete':
                MySwal
                    .fire({
                        icon: 'question',
                        title: `¿Desea eliminar la recomendación?`,
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
                            RecomendacionesModel.activateDelete(client, {id: dato, eliminar: true})
                                .then(() => {
                                    setRecomendaciones(prev => prev.map(element => element.id !== dato ? element : {
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
    const saveRecomendacion = () => {
        toast.success(<span><FontAwesomeIcon icon={faSpinner} spin/> Guardando...</span>)
        const CRUD = recomendacion.id ? RecomendacionesModel.update(client, {
            id: recomendacion.id,
            update: {orden: Number(orden), descripcion, categoria_id, contenido: editor_html}
        }, 'id, orden, descripcion, categoria_id, contenido') : RecomendacionesModel.create(client, {
            orden: Number(orden), descripcion, categoria_id, contenido: editor_html
        }, 'id, orden, descripcion, categoria_id, contenido')
        CRUD.then(response => {
            const datos = recomendacion.id ? response.data.updateRecomendaciones : response.data.createRecomendacion
            if (recomendacion.id) setRecomendaciones(prev => prev.map(element => element.id !== recomendacion.id ? element : datos))
            else setRecomendaciones(prev => [datos, ...prev])
            removeAllToasts()
            toast.success('Guardado exitoso', {autoClose: 3500})
            setConfig({...config, isOpen: false})
        })
    }

    return (
        <Fragment>
            <ReactCSSTransitionGroup component='div' transitionName='TabsAnimation' transitionAppear={true}
                                     transitionAppearTimeout={0} transitionEnter={false} transitionLeave={false}>
                <PageTitle heading='Categorías' subheading={`LISTA DE CATEGORÍAS`} icon={faArchive}
                           menus={[{to: '/admin/categorias', name: 'Categorías'}]}/>

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
                                            setRecomendacion({})
                                        }}>
                                    <FontAwesomeIcon icon={faPlusCircle}/> Nueva Recomendación
                                </Button>
                            </div>
                            <Col md={12}>
                                <BlockUi tag='div' blocking={config.blocking}
                                         loader={<Loader active type='ball-pulse'/>}>
                                    <ReactTable {...{
                                        columns: columnsRecomendaciones({
                                            accion, config, recomendaciones
                                        }),
                                        data: recomendaciones,
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
                                     })}>&times;</button>}>{recomendacion.id ? 'Editar' : 'Nueva'} recomendación
                        </ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md={4} className="pr-0">
                                    <MyLabel name="Orden" required/>
                                    {inputOrden}
                                </Col>
                                <Col md={4}>
                                    <MyLabel name="Descripción"/>
                                    {inputDescripcion}
                                </Col>
                                <Col md={4}>
                                    <MyLabel name="Categoria"/>
                                    {selectCategoria}
                                </Col>
                                <Col md={12}>
                                    <MyLabel name="Recomendación"/>
                                    {input_editor_html}
                                </Col>

                            </Row>
                        </ModalBody>
                        <ModalFooter style={{border: '0px solid'}}>
                            <Button color="danger" onClick={() => setConfig({...config, isOpen: false})}>
                                <FontAwesomeIcon icon={faTrash}/> Cancelar
                            </Button>
                            <Button color="primary" onClick={() => saveRecomendacion()}>
                                <FontAwesomeIcon icon={faSave}/> Guardar
                            </Button>
                        </ModalFooter>
                    </Modal>
                </Container>

            </ReactCSSTransitionGroup>
        </Fragment>

    )

}
export default Recomendaciones