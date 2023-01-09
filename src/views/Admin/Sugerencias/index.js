import React, {Fragment, useEffect, useState} from "react"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSpinner} from "@fortawesome/fontawesome-free-solid"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import {faArchive, faPlusCircle, faSave, faTrash} from "@fortawesome/free-solid-svg-icons"
import {
    Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row
} from "reactstrap"
import {useAuth} from "../../../Context";
import PageTitle from "../../../Layout/AppMain/PageTitle";
import {faLeanpub} from "@fortawesome/free-brands-svg-icons/faLeanpub";
import ReactTable from "../../../Components/ReactTable"
import Loader from "react-loaders";
import BlockUi from "react-block-ui";
import {columnsSugerencias} from "./script";
import SugerenciasModel from "../../../Components/Models/Sugerencias"

const Sugerencias = ({history}) => {
    const {client} = useAuth()
    const [data, setData] = useState([])
    const [blocking, setBlocking]= useState(true)


    useEffect(() => {
        SugerenciasModel.selectSugerencias(client, false)
            .then(response => {
                const {data} = response.data.selectNoRead
                setData(data)
                setBlocking(false)
            })
    }, [])


    return (
        <Fragment>
            <ReactCSSTransitionGroup component='div' transitionName='TabsAnimation' transitionAppear={true}
                                     transitionAppearTimeout={0} transitionEnter={false} transitionLeave={false}>
                <PageTitle heading='Sugerencias' subheading={`Sugerencias`} icon={faLeanpub}
                           menus={[{to: '/admin/sugerencias', name: 'Sugerencias'}]}/>
                <Container fluid>
                    <Card className='main-card'>
                        <CardBody>
                            <Col md={12}>
                                <BlockUi tag='div' blocking={blocking}
                                         loader={<Loader active type='ball-pulse'/>}>
                                    <ReactTable {...{
                                        columns: columnsSugerencias({data, history}),
                                        data
                                    }}/>
                                </BlockUi>
                            </Col>
                        </CardBody>
                    </Card>
                </Container>
            </ReactCSSTransitionGroup>
        </Fragment>
    )

}
export default Sugerencias