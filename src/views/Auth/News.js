import React, {Fragment, useState, useEffect} from 'react'

import {Row, Col} from "reactstrap"
import {useAuth} from "../../Context";
import NewsModel from "../../Components/Models/News";

const News = ({match}) => {

    const {client} = useAuth()

    const {id} = match.params
    const [dato, setDato] = useState({})

    useEffect(() => {
        if (id === '' || !id) return
        NewsModel.getById(client, {id}, 'id, contenido_html, descripcion')
            .then(response => {
                const {newsByID} = response.data
                setDato(newsByID)
            })
    }, [id])
    return (
        <Fragment>
            <div className="app-main">
                <Col>
                    <Row style={{justifyContent: 'center'}}>
                        <div>
                            <strong>{dato.descripcion ? dato.descripcion : ''}</strong>
                        </div>
                    </Row>
                    <br/>
                    <Row>
                        <Col md={12}>
                            <div dangerouslySetInnerHTML={{__html: dato.contenido_html ? dato.contenido_html : ''}}/>
                        </Col>
                    </Row>
                </Col>

            </div>
        </Fragment>
    )
}
export default News