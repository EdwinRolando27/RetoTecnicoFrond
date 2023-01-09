import ReactTable from "../../../Components/ReactTable"
import moment from "moment"
import {useAuth} from "../../../Context"
import React, {Fragment, useCallback, useEffect, useState} from 'react'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import {faArchive, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../../Layout/AppMain/PageTitle"
import {Button, Card, CardBody, Container} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {columnsMedicos} from "./ColumnsMedicos";
import BlockUi from "react-block-ui";
import Loader from "react-loaders";
import MedicosModel from "../../../Components/Models/Medicos";
import ModalMedicos from "./ModalMedicos";
import {faSpinner} from "@fortawesome/fontawesome-free-solid";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal)


const Medicos = () => {
    const {client, toast, removeAllToasts} = useAuth()
    const [config, setConfig] = useState({
        blocking: true,
        isOpen: false
    })
    const [medico, setMedico] = useState({})
    const [medicos, setMedicos] = useState([])

    useEffect(() => {
        MedicosModel.getAllOrNot(client, {mostrar: false}, 'id, nombres, apellidos, especialidad, dni, contenido_html,foto, deleted_at')
            .then(response => {
                const {selectMedicos} = response.data
                setMedicos(selectMedicos)
                setConfig({...config, blocking: false})
            })
    }, [])


    const accion = (tipo, dato) => {
        setMedico({})
        switch (tipo) {
            case 'activar':
                MySwal
                    .fire({
                        icon: 'question',
                        title: `¿Desea activar al médico?`,
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
                            MedicosModel.activateDelete(client, {id: dato, eliminar: false})
                                .then(() => {
                                    setMedicos(prev => prev.map(element => element.id !== dato ? element : {
                                        ...element,
                                        deleted_at: null
                                    }))
                                    removeAllToasts()
                                    toast.success('Médico activado...', {autoClose: 5000})
                                }).catch(({message}) => {
                                removeAllToasts()
                                toast.error(message, {autoClose: 5000})
                            })
                        }
                    })
                break
            case 'editar':
                setMedico(dato)
                setConfig({...config, isOpen: true})
                break
            case 'delete':
                MySwal
                    .fire({
                        icon: 'question',
                        title: `¿Desea eliminar al médico?`,
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
                            MedicosModel.activateDelete(client, {id: dato, eliminar: true})
                                .then(() => {
                                    setMedicos(prev => prev.map(element => element.id !== dato ? element : {
                                        ...element,
                                        deleted_at: true
                                    }))
                                    removeAllToasts()
                                    toast.success('Médico eliminado...', {autoClose: 5000})
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
                <PageTitle heading='Médicos' subheading={`LISTA DE MÉDICOS`} icon={faArchive}
                           menus={[{to: 'admin/medicos', name: 'Médicos'}]}/>
            </ReactCSSTransitionGroup>

            <Container fluid>
                <Card className='main-card'>
                    <CardBody>
                        <div className='text-center'>
                            <Button className='btn-pill text-white' active size='sm' color='primary'
                                    onClick={() => {
                                        setConfig({...config, isOpen: true})
                                        setMedico({})
                                    }}>
                                <FontAwesomeIcon icon={faPlusCircle}/> Nuevo médico
                            </Button>
                        </div>
                        <BlockUi tag='div' blocking={config.blocking}
                                 loader={<Loader active type='ball-pulse'/>}>
                            <ReactTable {...{
                                columns: columnsMedicos({accion, medicos, config}),
                                data: medicos,
                                getCellProps: ({row}) => {
                                    const {original} = row
                                    return {style: {color: original.deleted_at ? '#d92550' : '#495057'}}
                                }
                            }}/>
                        </BlockUi>
                    </CardBody>
                </Card>
                <ModalMedicos {...{config, setConfig, medico, setMedicos}}/>
            </Container>
        </Fragment>
    )
}
export default Medicos