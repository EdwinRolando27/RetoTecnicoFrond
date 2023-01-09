import React, {Fragment, useState, useEffect} from 'react'

import {
    Card, Container, CardBody
} from "reactstrap"
import '../../Layout/assets/css/maicons.css'
import '../../Layout/assets/css/bootstrap.css'
import '../../Layout/assets/vendor/owl-carousel/css/owl.carousel.css'
import '../../Layout/assets/vendor/animate/animate.css'
import '../../Layout/assets/css/theme.css'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import MedicosModel from "../../Components/Models/Medicos";
import {useAuth} from "../../Context";
import NewsModel from "../../Components/Models/News";
import moment from "moment";

const Main = ({history}) => {
    const {client, toast, removeAllToasts} = useAuth()
    const [medicos, setMedicos] = useState([])
    const [noticias, setNoticias] = useState([])
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
                if (selectMedicos.length >= 3)
                    setMedicos(selectMedicos.slice(0, 3))
                else
                    setMedicos([])

            })

        NewsModel.getAllOrNot(client, {mostrar: true}, 'id, etiqueta, descripcion, foto, updated_at')
            .then(response => {
                const {selectNews} = response.data
                setNoticias(selectNews.slice(0, 4))
            })
    }, [])

    return (
        <Fragment>
            <ReactCSSTransitionGroup component="div" transitionName="TabsAnimation" transitionAppear={true}
                                     transitionAppearTimeout={0} transitionEnter={false} transitionLeave={false}>
                <Container fluid className="p-0">

                    <Card className="main-card">
                        <CardBody>
                            <div className="back-to-top"></div>
                            <div className="page-hero bg-image overlay-dark"
                                 style={{backgroundImage: 'url(https://m9p8e5u6.rocketcdn.me/wp-content/uploads/2022/07/shutterstock_Guschenkova.jpg)'}}>
                                <div className="hero-section">
                                    <div className="container text-center wow zoomIn">
                                        <span className="subhead">Haga su vida más feliz</span>
                                        <h1 className="display-4">VIVA SALUDABLE</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-light">
                                <div className="page-section py-3 mt-md-n5 custom-index">
                                    <div className="container">
                                        <div className="row justify-content-center">
                                            <div className="col-md-4 py-3 py-md-0">
                                                <div className="card-service wow fadeInUp">
                                                    <div className="circle-shape bg-secondary text-white">
                                                        <span className="mai-chatbubbles-outline"></span>
                                                    </div>
                                                    <p><span>Comunicate</span> con nosotros</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4 py-3 py-md-0">
                                                <div className="card-service wow fadeInUp">
                                                    <div className="circle-shape bg-primary text-white">
                                                        <span className="mai-shield-checkmark"></span>
                                                    </div>
                                                    <p><span>Cuida</span> tu salud</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4 py-3 py-md-0">
                                                <div className="card-service wow fadeInUp">
                                                    <div className="circle-shape bg-accent text-white">
                                                        <span className="mai-basket"></span>
                                                    </div>
                                                    <p>Recomendaciones</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="page-section pb-0">
                                    <div className="container">
                                        <div className="row align-items-center">
                                            <div className="col-lg-6 py-3 wow fadeInUp">
                                                <h1>Welcome to Your Health <br/> Center</h1>
                                                <p className="text-grey mb-4">Lorem ipsum dolor sit amet, consetetur
                                                    sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                                                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero
                                                    eos et accusam et justo duo dolores et ea rebum. Accusantium
                                                    aperiam earum ipsa eius, inventore nemo labore eaque porro
                                                    consequatur ex aspernatur. Explicabo, excepturi accusantium!
                                                    Placeat voluptates esse ut optio facilis!</p>
                                                <a onClick={() => history.push('/about')} className="btn btn-primary">Learn
                                                    More</a>
                                            </div>
                                            <div className="col-lg-6 wow fadeInRight" data-wow-delay="400ms">
                                                <div className="img-place custom-img-1">
                                                    <img
                                                        src="https://www.guiamedicadeguatemala.com/wp-content/uploads/2022/05/Bloque-Registro-web-profesional.png-982x1024.webp"
                                                        alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                medicos.length > 0 ?
                                    <div className="col-lg-12 mt-10">
                                        <h1 className="text-center mb-5 wow fadeInUp">Médicos</h1>
                                        <div className="row justify-content-center">
                                            {
                                                medicos.map(element => {
                                                    return (
                                                        <div className="col-md-6 col-lg-4 wow zoomIn">
                                                            <div className="card-doctor">
                                                                <div className="header">
                                                                    <img
                                                                        src={`${process.env.REACT_APP_API_ECOCONT}/images/medicos/${element.foto ? element.foto : ''}`}
                                                                        alt=""/>
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
                                            <div className="col-12 text-center mt-4 wow zoomIn">
                                                <a onClick={() => history.push('/medicos')} className="btn btn-primary">Ver
                                                    más</a>
                                            </div>
                                        </div>
                                    </div> : <></>
                            }

                            {
                                noticias.length > 0 ?
                                    <div className="page-section bg-light">
                                        <div className="container">
                                            <h1 className="text-center wow fadeInUp">Noticias</h1>
                                            <div className="row mt-5">
                                                {
                                                    noticias.map(element => {
                                                        return (
                                                            <div className="col-lg-4 py-2 wow zoomIn">
                                                                <div className="card-blog">
                                                                    <div className="header">
                                                                        <div className="post-category">
                                                                            <a onClick={() => history.push(`/news/${element.id}`)}>{element.etiqueta}</a>
                                                                        </div>
                                                                        <a className="post-thumb"
                                                                           onClick={() => history.push(`/news/${element.id}`)}>
                                                                            <img
                                                                                src={`${process.env.REACT_APP_API_ECOCONT}/images/noticias/${element.foto ? element.foto : ''}`}
                                                                                alt=""/>
                                                                        </a>
                                                                    </div>
                                                                    <div className="body">
                                                                        <h5 className="post-title"><a
                                                                            onClick={() => history.push(`/news/${element.id}`)}>{element.descripcion}</a>
                                                                        </h5>
                                                                        <div className="site-info">
                                                                            <span className="mai-time"></span> {moment(element.updated_at? element.updated_at:'').format('YYYY-MM-DD')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </div> : <></>
                            }

                        </CardBody>
                    </Card>
                </Container>
            </ReactCSSTransitionGroup>
        </Fragment>
    )
}
export default Main