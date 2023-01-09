import React, {Fragment, useEffect} from 'react'

import {
    Card, Container, CardBody
} from "reactstrap"
import '../../Layout/assets/css/maicons.css'
import '../../Layout/assets/css/bootstrap.css'
import '../../Layout/assets/vendor/owl-carousel/css/owl.carousel.css'
import '../../Layout/assets/vendor/animate/animate.css'
import '../../Layout/assets/css/theme.css'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import {useAuth} from "../../Context";
import {useInput, useTextareaAutosize} from "../../hooks";
import isEmail from "validator/es/lib/isEmail"
import {Sugerencias} from "../../Components/Models";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/fontawesome-free-solid";


const Contacto = ({history}) => {
    const {client, toast, removeAllToasts} = useAuth()

    const [nombre, inputNombre, setNombre, setInvalidNombre, , invalidNombre] = useInput({
        placeholder: 'Nombre'
    })
    const [recomendacion, inputRecomendacion, setRecomendacion, setInvalidRecomendacion, setMesssageRecomendacion, invalidRecomendacion] = useTextareaAutosize({
        minRows: 6
    })
    const [email, inputEmail, setEmail, setInvalidEmail, msgEmail, invalidEmail] = useInput({
        placeholder: 'Correo electrónico'
    })
    const [asunto, inputAsunto, setAsunto, setInvalidAsunto, msgAsunto, invalidAsunto] = useInput({
        placeholder: 'Asunto'
    })
    const [telefono, inputTelefono, setTelefono, setInvalidTelefono, msgTelefono, invalidTelefono] = useInput({
        placeholder: 'Número de contacto'
    })

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

    const limpiar = () => {
        setTelefono('')
        setAsunto('')
        setEmail('')
        setRecomendacion('')
        setNombre('')
    }
    useEffect(() => {
        addScript("../../Layout/assets/js/jquery-3.5.1.min.js")
        addScript("../../Layout/assets/js/bootstrap.bundle.min.js")
        addScript("../../Layout/assets/vendor/owl-carousel/js/owl.carousel.min.js")
        addScript("../../Layout/assets/vendor/wow/wow.min.js")
        addScript("../../Layout/assets/js/theme.js")

    }, [])
    useEffect(() => {
        setInvalidNombre(nombre === '')
        setInvalidEmail(!isEmail(email))
        setInvalidRecomendacion(recomendacion === '')
        setInvalidAsunto(asunto === '')
        setInvalidTelefono(telefono === '')
        msgEmail('Correo Invalido')
    }, [nombre, email, asunto, telefono, recomendacion])
    const enviar = () => {
        toast.success(<span><FontAwesomeIcon icon={faSpinner} spin/> Enviando...</span>)
        Sugerencias.create(client, {
            correo: email, numero: telefono, mensaje: recomendacion, asunto, nombre
        }, ' correo, numero, mensaje, asunto, nombre')
            .then(() => {
                try {
                    removeAllToasts()
                    toast.success('Mensaje enviado correctamente', {autoClose: 2500})
                } catch ({err}) {
                    removeAllToasts()
                    toast.warning(err, {autoClose: 3500})
                }
            })

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
                                                <li className="breadcrumb-item active" aria-current="page">Contacto</li>
                                            </ol>
                                        </nav>
                                        <h1 className="font-weight-normal">Contacto</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="page-section">
                                <div className="container">
                                    <h1 className="text-center wow fadeInUp">Ponerse en contacto</h1>

                                    <div className="contact-form mt-5">
                                        <div className="row mb-3">
                                            <div className="col-sm-6 py-2 wow fadeInLeft">
                                                <label htmlFor="fullName">Nombre</label>
                                                {inputNombre}
                                            </div>
                                            <div className="col-sm-6 py-2 wow fadeInRight">
                                                <label htmlFor="emailAddress">Correo</label>
                                                {inputEmail}
                                            </div>
                                            <div className="col-sm-6 py-2 wow fadeInLeft">
                                                <label htmlFor="fullName">Teléfono</label>
                                                {inputTelefono}
                                            </div>
                                            <div className="col-sm-6 py-2 wow fadeInRight">
                                                <label htmlFor="subject">Asunto</label>
                                                {inputAsunto}
                                            </div>
                                            <div className="col-12 py-2 wow fadeInUp">
                                                <label htmlFor="message">Mensaje</label>
                                                {inputRecomendacion}
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary wow zoomIn"
                                                disabled={!(!invalidAsunto && !invalidNombre && !invalidEmail && !invalidRecomendacion && !invalidTelefono)}
                                                onClick={() => enviar()}>Enviar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Container>
            </ReactCSSTransitionGroup>
        </Fragment>
    )

}
export default Contacto