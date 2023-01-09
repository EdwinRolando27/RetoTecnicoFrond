import React, {useEffect, useState} from "react"
import {
    Button, Col, Modal, ModalBody, ModalHeader, Row, Nav, NavItem, NavLink, TabPane, TabContent, ModalFooter
} from "reactstrap"
import classnames from 'classnames'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCheckCircle, faSave, faTrash} from "@fortawesome/free-solid-svg-icons"
import {faSpinner} from "@fortawesome/fontawesome-free-solid"

import {MyDropzone} from "../../../Components";


import MyLabel from "../../../Components/MyLabel";
import {useAuth} from "../../../Context";
import {useCKeditor4, useInput} from "../../../hooks";
import {uploadImg} from "../../../utils/scripts";
import MedicosModel from "../../../Components/Models/Medicos";

const ModalMedicos = ({
                          config, setConfig, medico, setMedicos
                      }) => {
    const {client, toast, removeAllToasts, auth} = useAuth()

    const [nombres, inputNombre, setNombres, setinvalidNombres, msgNombre, invalidNombre] = useInput({
        typeState: "text", placeholder: "Nombres", initialMessage: 'Ingrese nombre'
    })
    const [dni, inputDNI, setDNI, setInvalidDNI, msgDNI, invalidDNI] = useInput({
        typeState: "text", placeholder: "DNI"
    })
    const [apellidos, inputApellidos, setApellidos, setInvalidApellidos, msgApellido, invalidApellido] = useInput({
        typeState: "text", placeholder: "Apellidos"
    })
    const [especialidad, inputEspecialidad, setEspecialidad, setinvalidEspecialidad, msgEspecialidad, invalidEspecialidad] = useInput({
        typeState: "text", placeholder: "Especialidad",
    })
    const [editor_html, input_editor_html, set_editor_html] = useCKeditor4({})
    const [file, setFile] = useState(null)
    const [activeTab, setActiveTab] = useState('1')
    const toggle = (value) => {
        setActiveTab(value)
    }
    const [save, setSave] = useState(true)

    useEffect(() => {
        setFile(medico.foto ? medico.foto : null)
        setNombres(medico.nombres ? medico.nombres : '')
        setApellidos(medico.apellidos ? medico.apellidos : '')
        setDNI(medico.dni ? medico.dni : '')
        setEspecialidad(medico.especialidad ? medico.especialidad : '')
        set_editor_html(medico.contenido_html ? medico.contenido_html : '')
    }, [medico])
    useEffect(() => {
        setInvalidApellidos(apellidos === '')
        setInvalidDNI(dni === '')
        setinvalidEspecialidad(especialidad === '')
        setinvalidNombres(nombres === '')
        msgNombre('Ingrese Nombre')
        msgDNI('Ingrese DNI')
        msgApellido('Ingrese Apellidos')
        msgEspecialidad('Ingrese Especialidad')
    }, [dni, apellidos, especialidad, nombres])
    useEffect(() => {
        setSave(!invalidApellido && !invalidDNI && !invalidNombre && !invalidEspecialidad)
    }, [invalidApellido, invalidDNI, invalidNombre, invalidEspecialidad])

    const onDrop = accepted => {
        uploadImg(accepted[0], 'medicos', auth)
            .then(response => response.json())
            .then(({data}) => {
                setFile(data.name)
            })
    }
    const saveMedicos = () => {
        toast.success(<span><FontAwesomeIcon icon={faSpinner} spin/> Guardando...</span>)
        const CRUD = medico.id ? MedicosModel.update(client, {
            id: medico.id,
            update: {nombres, apellidos, especialidad, dni, contenido_html: editor_html, foto: file}
        }, 'id, nombres, apellidos, especialidad, dni, contenido_html,foto') : MedicosModel.create(client, {
            nombres, apellidos, especialidad, dni, contenido_html: editor_html, foto: file
        }, 'id, nombres, apellidos, especialidad, dni, contenido_html,foto')
        CRUD
            .then(response => {
                const datos = medico.id ? response.data.updateMedicos : response.data.createMedicos
                if (medico.id) setMedicos(prev => prev.map(element => element.id !== medico.id ? element : datos))
                else setMedicos(prev => [datos, ...prev])

                removeAllToasts()
                toast.success('Guardado exitoso', {autoClose: 3500})
                setConfig({...config, isOpen: false})
            })
    }
    return (
        <Modal isOpen={config.isOpen} toggle={() => setConfig({...config, isOpen: false})} backdrop={false} size="lg">
            <ModalHeader toggle={() => setConfig({...config, isOpen: false})} style={{border: '0px solid'}}
                         close={<button className="close" onClick={() => setConfig({
                             ...config,
                             isOpen: false
                         })}>&times;</button>}>{medico.id ? 'Editar' : 'Nuevo'} médico
            </ModalHeader>
            <ModalBody>
                <Row className="justify-content-center text-center">
                    <Nav pills className="ml-4">
                        <NavItem>
                            <NavLink className={classnames({active: activeTab === '1'})} onClick={() => toggle('1')}>
                                Datos Generales
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({active: activeTab === '2'})} onClick={() => toggle('2')}>
                                Datos Específicos
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Row>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col md={4}>
                                {
                                    !(file === '' || !file) ? <>
                                            <img width={200} height={300}
                                                 src={`${process.env.REACT_APP_API_ECOCONT}/images/medicos/${file}`}
                                                 alt='Foto médico'/>
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
                            <Col md={8}>
                                <Row>
                                    <Col md={4}>
                                        <MyLabel name="DNI"/>
                                        {inputDNI}
                                    </Col>
                                    <Col md={4}>
                                        <MyLabel name="Nombres"/>
                                        {inputNombre}
                                    </Col>
                                    <Col md={4}>
                                        <MyLabel name="Apellidos"/>
                                        {inputApellidos}
                                    </Col>
                                    <Col md={6}>
                                        <MyLabel name="Especialidad"/>
                                        {inputEspecialidad}
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col>
                                {input_editor_html}
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </ModalBody>
            <ModalFooter style={{border: '0px solid'}}>
                <Button color="danger" onClick={() => setConfig({...config, isOpen: false})}>
                    <FontAwesomeIcon icon={faTrash}/> Cancelar
                </Button>
                <Button color="primary" disabled={!save} onClick={() => saveMedicos()}>
                    <FontAwesomeIcon icon={faSave}/> Guardar
                </Button>
            </ModalFooter>
        </Modal>
    )
}
export default ModalMedicos