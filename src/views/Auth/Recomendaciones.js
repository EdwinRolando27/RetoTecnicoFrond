import React, {Fragment, useCallback, useEffect, useState} from "react"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSpinner} from "@fortawesome/fontawesome-free-solid"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import {faArchive, faFileExcel, faPlusCircle, faSave, faTrash} from "@fortawesome/free-solid-svg-icons"
import {
    Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row
} from "reactstrap"
import BlockUi from "react-block-ui"
import Loader from "react-loaders"
import PageTitle from "../../Layout/AppMain/PageTitle";
import ReactTable from "../../Components/ReactTable";
import {columnsRecomendaciones, columnsRecomendacionesFree} from "../Admin/Recomendaciones/columnsRecomendaciones";
import MyLabel from "../../Components/MyLabel";
import {columnsCategoriaFree} from "../Admin/Categorias/columnsCategorias";
import CategoriaModel from "../../Components/Models/Categoria";
import {useAuth} from "../../Context";

const Recomendacionesfree = () => {
    const {client, toast, removeAllToasts} = useAuth()
    const [config, setConfig] = useState({isOpen: false, isBlocking: true})
    const [categorias, setCategorias] = useState([])
    const [recomendacion, setRecomendacion] = useState({})
    useEffect(() => {
        CategoriaModel.getNoDeleted(client, 'codigo, nombre, recomendaciones{descripcion, contenido}')
            .then((response => {
                const {categoriaNoDeleted} = response.data
                setCategorias(categoriaNoDeleted)
            }))
    }, [])

    const SubRowAsync = ({row}) => {
        const {original} = row
        const accion = (data_row) => {
            setRecomendacion({...data_row, categoria: original.nombre})
            setConfig({...config, isOpen: true})
        }
        if (original.recomendaciones.length === 0 || !original.recomendaciones) {
            removeAllToasts()
            toast.warning('No hay recomendaciones disponibles', {autoClose: 3000})
            return (<></>)
        }
        return (
            <Fragment>
                <ReactTable {...{
                    columns: columnsRecomendacionesFree({recomendaciones: original.recomendaciones, accion, config}),
                    data: original.recomendaciones,
                    globalSearch: false,
                    pagination: false
                }}/>
            </Fragment>
        )
    }
    const renderRowSubComponent = useCallback(({row}) => (<SubRowAsync{...{row}}/>), [categorias])

    return (
        <Fragment>
            <Container fluid>
                <Card className='main-card'>
                    <CardBody>
                        <Row>
                            <Col md={12}>
                                <BlockUi tag='div' blocking={config.blocking}
                                         loader={<Loader active type='ball-pulse'/>}>
                                    <ReactTable {...{
                                        columns: columnsCategoriaFree({
                                            config, categorias
                                        }),
                                        renderRowSubComponent,
                                        data: categorias,
                                        globalSearch: false
                                    }} />
                                </BlockUi>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Modal isOpen={config.isOpen} toggle={() => setConfig({...config, isOpen: false})}
                       backdrop={false} size="lg">
                    <ModalHeader toggle={() => setConfig({...config, isOpen: false})}
                                 style={{border: '0px solid'}}
                                 close={<button className="close" onClick={() => setConfig({
                                     ...config,
                                     isOpen: false
                                 })}>&times;</button>}> {recomendacion.categoria}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={12}>
                                <MyLabel name={`${recomendacion.descripcion}`}/>
                                {
                                    <div dangerouslySetInnerHTML={{__html: recomendacion.contenido ? recomendacion.contenido : ''}}/>
                                }
                            </Col>

                        </Row>
                    </ModalBody>
                </Modal>
            </Container>


        </Fragment>
    )
}
export default Recomendacionesfree
