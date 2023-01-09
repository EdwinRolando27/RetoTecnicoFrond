import React, {Fragment, useState, useEffect} from 'react'
import {
    Card, Container, CardBody, Row, Col, CardHeader, ButtonGroup, Button, TabContent, TabPane, Table
} from "reactstrap"
import '../../Layout/assets/css/maicons.css'
import '../../Layout/assets/css/bootstrap.css'
import '../../Layout/assets/vendor/owl-carousel/css/owl.carousel.css'
import '../../Layout/assets/vendor/animate/animate.css'
import '../../Layout/assets/css/theme.css'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

const About = () => {
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

    return (
        <Fragment>
            <ReactCSSTransitionGroup component="div" transitionName="TabsAnimation" transitionAppear={true}
                                     transitionAppearTimeout={0} transitionEnter={false} transitionLeave={false}>
                <Container fluid className="p-0">

                    <Card className="main-card">
                        <CardBody>
                            <div className="page-section bg-light">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-4 py-3 wow zoomIn">
                                            <div className="card-service">
                                                <div className="circle-shape bg-secondary text-white">
                                                    <span className="mai-chatbubbles-outline"></span>
                                                </div>
                                                <p><span>Chat</span> with a doctors</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 py-3 wow zoomIn">
                                            <div className="card-service">
                                                <div className="circle-shape bg-primary text-white">
                                                    <span className="mai-shield-checkmark"></span>
                                                </div>
                                                <p><span>One</span>-Health Protection</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 py-3 wow zoomIn">
                                            <div className="card-service">
                                                <div className="circle-shape bg-accent text-white">
                                                    <span className="mai-basket"></span>
                                                </div>
                                                <p><span>One</span>-Health Pharmacy</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="page-section">
                                    <div className="container">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-8 wow fadeInUp">
                                                <h1 className="text-center mb-3">Welcome to Your Health Center</h1>
                                                <div className="text-lg">
                                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
                                                        neque sit, explicabo vero nulla animi nemo quae cumque, eaque
                                                        pariatur eum ut maxime! Tenetur aperiam maxime iure explicabo
                                                        aut consequuntur. Lorem ipsum dolor sit amet consectetur
                                                        adipisicing elit. Nesciunt neque sit, explicabo vero nulla animi
                                                        nemo quae cumque, eaque pariatur eum ut maxime! Tenetur aperiam
                                                        maxime iure explicabo aut consequuntur.</p>
                                                    <p>Expedita iusto sunt beatae esse id nihil voluptates magni,
                                                        excepturi distinctio impedit illo, incidunt iure facilis atque,
                                                        inventore reprehenderit quidem aliquid recusandae. Lorem ipsum
                                                        dolor sit amet consectetur adipisicing elit. Laudantium quod ad
                                                        sequi atque accusamus deleniti placeat dignissimos illum nulla
                                                        voluptatibus vel optio, molestiae dolore velit iste maxime,
                                                        nobis odio molestias!</p>
                                                </div>
                                            </div>
                                        </div>
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
export default About