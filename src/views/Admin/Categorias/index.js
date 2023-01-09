import React, {Fragment, useEffect, useState} from "react"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSpinner} from "@fortawesome/fontawesome-free-solid"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import {faArchive, faPlusCircle} from "@fortawesome/free-solid-svg-icons"
import {Button, Card, CardBody, CardFooter, Col, Container} from "reactstrap"
import BlockUi from "react-block-ui"
import Loader from "react-loaders"

import {useAuth} from "../../../Context"
import ReactTable from "../../../Components/ReactTable"
import {columnsCategoria} from "./columnsCategorias";
import CrudCategoria from "./CrudCategoria";
import PageTitle from "../../../Layout/AppMain/PageTitle"
import Categoria from "../../../Components/Models/Categoria";

const MySwal = withReactContent(Swal)

const Categorias = () => {
    const {client, toast, removeAllToasts, company, idLocal} = useAuth()
    const [categorias, setCategorias] = useState([])
    const [categoria, setCategoria] = useState({})
    const [config, setConfig] = useState({
        blocking: true,
        isOpen: false
    })

    useEffect(() => {
        Categoria
            .getAll(client, 'id, codigo, nombre, deleted_at')
            .then(response => {
                setCategorias(response.data.categorias)
                setConfig({
                    ...config,
                    blocking: false
                })
                removeAllToasts()
            })
            .catch(({message}) => {
                setConfig({
                    ...config,
                    blocking: false
                })
                removeAllToasts()

            })
    }, [])
    const activateCategoria = categoria_id =>
        MySwal
            .fire({
                icon: 'question',
                title: `¿Desea activar esta categoria?`,
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
                    Categoria
                        .activate(client, categoria_id, 'id')
                        .then(response => {
                            setCategorias(prevState => prevState.map(element => element.id !== categoria_id ? element : {
                                ...element,
                                deleted_at: null
                            }))
                            removeAllToasts()
                            toast.success('Categoria activada...', {autoClose: 5000})
                        })
                        .catch(({message}) => {
                            removeAllToasts()
                            toast.error(message, {autoClose: 5000})
                        })
                }
            })
    const deleteCategoria = categoria_id =>
        MySwal
            .fire({
                icon: 'question',
                title: `¿Desea eliminar esta categoria?`,
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
                    Categoria
                        .delete(client, categoria_id, 'id')
                        .then(response => {
                            setCategorias(prevState => prevState.map(element => element.id !== categoria_id ? element : {
                                ...element,
                                deleted_at: true
                            }))
                            removeAllToasts()
                            toast.success('Categoria eliminada...', {autoClose: 5000})
                        })
                        .catch(({message}) => {
                            removeAllToasts()
                            toast.error(message, {autoClose: 5000})
                        })
                }
            })
    const editarCategoria = categoria_id => {
        Categoria
            .getById(client, categoria_id, 'id, codigo, nombre, deleted_at, local_id')
            .then(response => {
                setCategoria({
                    ...response.data.categoria
                })
                setConfig({
                    ...config,
                    isOpen: true
                })
                removeAllToasts()
            })
            .catch(({message}) => {
                removeAllToasts()
                toast.error(message, {autoClose: 5000})
            })
    }

    return (
        <Fragment>
            <ReactCSSTransitionGroup component='div' transitionName='TabsAnimation' transitionAppear={true}
                                     transitionAppearTimeout={0} transitionEnter={false} transitionLeave={false}>
                <PageTitle heading='Categorías' subheading={`LISTA DE CATEGORÍAS`} icon={faArchive}
                           menus={[{to: '/fac/categorias', name: 'Categorías'}]}/>

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
                                            setCategoria({})
                                        }}>
                                    <FontAwesomeIcon icon={faPlusCircle}/> Nueva Categoría
                                </Button>
                            </div>
                            <Col md={12}>
                                <BlockUi tag='div' blocking={config.blocking}
                                         loader={<Loader active type='ball-pulse'/>}>
                                    <ReactTable {...{
                                        columns: columnsCategoria({
                                            activateCategoria, editarCategoria, deleteCategoria, categorias, config
                                        }),
                                        data: categorias,
                                        getCellProps: ({row}) => {
                                            const {original} = row
                                            return {style: {color: original.deleted_at ? '#d92550' : '#495057'}}
                                        }
                                    }} />
                                </BlockUi>
                            </Col>
                        </CardBody>
                        <CardFooter style={{paddingTop: '0', paddingBottom: '0'}}>
                            <small><span style={{
                                color: 'var(--dark)',
                                transition: 'all .3s ease'
                            }}>&#x25cf;</span> <strong>ACTIVO</strong></small>{' '}
                            <small><span style={{
                                color: 'var(--danger)',
                                transition: 'all .3s ease'
                            }}>&#x25cf;</span> <strong>BAJA</strong></small>
                        </CardFooter>
                    </Card>
                    <CrudCategoria {...{config, setConfig, categoria, setCategorias, categorias}}/>
                </Container>

            </ReactCSSTransitionGroup>
        </Fragment>
    )
}
export default Categorias