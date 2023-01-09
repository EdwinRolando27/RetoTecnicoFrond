import React, {Fragment, useState, useEffect} from 'react'

import {
    Card,
    Container,
    CardBody,
    Row,
    Col,
    CardHeader,
    ButtonGroup,
    Button,
    TabContent,
    TabPane,
    Table,
    ModalHeader,
    Modal,
    ModalBody
} from "reactstrap"
import '../../Layout/assets/css/maicons.css'
import '../../Layout/assets/css/bootstrap.css'
import '../../Layout/assets/vendor/owl-carousel/css/owl.carousel.css'
import '../../Layout/assets/vendor/animate/animate.css'
import '../../Layout/assets/css/theme.css'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import MedicosModel from "../../Components/Models/Medicos";
import {useAuth} from "../../Context";

const Medicos = ({history}) => {
    const {client} = useAuth()
    const [medicos, setMedicos] = useState([])
    const [medico, setMedico] = useState({})
    const [config, setConfig] = useState({isOpen: false})
    const addScript = (enlace) => {
        const script = document.createElement('script');
        script.src = `${enlace}`
        script.async = true

        script.crossOrigin = "anonymous"

        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script);
        }
    }

    useEffect(() => {
        addScript("../../Layout/assets/js/jquery-3.5.1.min.js")
        addScript("../../Layout/assets/js/bootstrap.bundle.min.js")
        addScript("../../Layout/assets/vendor/owl-carousel/js/owl.carousel.min.js")
        addScript("../../Layout/assets/vendor/wow/wow.min.js")
        addScript("../../Layout/assets/js/theme.js")

    }, [])

    useEffect(() => {
        MedicosModel.getAllOrNot(client, {mostrar: true}, 'id, nombres, apellidos, especialidad, dni, contenido_html,foto, deleted_at')
            .then(response => {
                const {selectMedicos} = response.data
                setMedicos(selectMedicos)
            })
    }, [])
    const seleccionar = (element) => {
        setMedico({})
        if (element.contenido_html === '' || !element.contenido_html) return
        setMedico(element)
        setConfig({isOpen: true})
    }


    return (
        <Fragment>
            <ReactCSSTransitionGroup component="div" transitionName="TabsAnimation" transitionAppear={true}
                                     transitionAppearTimeout={0} transitionEnter={false} transitionLeave={false}>
                <Container fluid className="p-0">

                    <Card className="main-card">
                        <CardBody>
                            <div className="page-banner overlay-dark bg-image"
                                 style={{backgroundImage: 'url(https://m9p8e5u6.rocketcdn.me/wp-content/uploads/2022/07/shutterstock_Guschenkova.jpg)'}}>
                                <div className="banner-section">
                                    <div className="container text-center wow fadeInUp">
                                        <nav aria-label="Breadcrumb">
                                            <ol className="breadcrumb breadcrumb-dark bg-transparent justify-content-center py-0 mb-2">
                                                <li className="breadcrumb-item" onClick={() => history.push('/')}>
                                                    <a>Inicio</a></li>
                                                <li className="breadcrumb-item active" aria-current="page">Médicos</li>
                                            </ol>
                                        </nav>
                                        <h1 className="font-weight-normal">Nuestros médicos</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="page-section bg-light">
                                <div className="container">
                                    <div className="row justify-content-center">
                                        <div className="col-lg-10">

                                            <div className="row">
                                                {
                                                    medicos.map(element => {
                                                        return (
                                                            <div className="col-md-6 col-lg-4 py-3 wow zoomIn">
                                                                <div className="card-doctor">
                                                                    <div className="header"
                                                                         onClick={() => seleccionar(element)}>
                                                                        <img
                                                                            src={`${process.env.REACT_APP_API_ECOCONT}/images/medicos/${element.foto ? element.foto : ''}`}/>
                                                                    </div>
                                                                    <div className="body">
                                                                        <p className="text-xl mb-0">{`${element.apellidos} ${element.nombres}`}</p>
                                                                        <span
                                                                            className="text-sm text-grey">{element.especialidad}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                        <Modal isOpen={config.isOpen} toggle={() => setConfig({...config, isOpen: false})}
                               backdrop={false} size="lg">
                            <ModalHeader toggle={() => setConfig({...config, isOpen: false})}
                                         style={{border: '0px solid'}}
                                         close={<button className="close" onClick={() => setConfig({
                                             ...config,
                                             isOpen: false
                                         })}>&times;</button>}>
                                <ModalBody>
                                    <Row className="justify-content-center text-center">
                                        <div><span>{`${medico.apellidos} ${medico.nombres}`}</span></div>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <div
                                                dangerouslySetInnerHTML={{__html: medico.contenido_html ? medico.contenido_html : ''}}/>
                                        </Col>
                                    </Row>
                                </ModalBody>
                            </ModalHeader>

                        </Modal>
                    </Card>
                </Container>
            </ReactCSSTransitionGroup>
        </Fragment>
    )


}
export default Medicos