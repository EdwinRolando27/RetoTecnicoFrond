import React, {Fragment, useState, useEffect} from 'react'

import {Row, Col, Card, Container, CardBody} from "reactstrap"
import {useAuth} from "../../../../Context"
import {Sugerencias} from "../../../../Components/Models";
import MyLabel from "../../../../Components/MyLabel";
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

const SugerenciaOnly = ({match}) => {
    const {client} = useAuth()
    const [data, setData] = useState([])

    const {id} = match.params
    useEffect(() => {
        if (id === '' || !id) return
        Sugerencias.getByID(client, id)
            .then(response => {
                const {data} = response.data.sugerenciaId
                if (!data.readed_at)
                    Sugerencias.updateRead(client, data.id, 'id')
                        .then(() => {
                        })
                setData(data)

            })

    }, [])


    return (
        <Fragment>
            <ReactCSSTransitionGroup component="div" transitionName="TabsAnimation" transitionAppear={true}
                                     transitionAppearTimeout={0} transitionEnter={false} transitionLeave={false}>
                <Container fluid className="p-0">
                    <Card className="main-card">
                        <CardBody>
                            <Row>
                                <Col md={4}>
                                    <MyLabel name='Nombre'/>
                                    <p>{data.nombre}</p>
                                </Col>
                                <Col md={4}>
                                    <MyLabel name='Correo'/>
                                    <p>{data.correo}</p>
                                </Col>
                                <Col md={4}>
                                    <MyLabel name='Teléfono'/>
                                    <p>{data.numero}</p>
                                </Col>
                                <Col md={4}>
                                    <MyLabel name='Asunto'/>
                                    <p>{data.asunto}</p>
                                </Col>
                                <Col md={12}>
                                    <MyLabel name='Mensaje'/>
                                    <p>{data.mensaje}</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </ReactCSSTransitionGroup>
        </Fragment>
    )

}
export default SugerenciaOnly