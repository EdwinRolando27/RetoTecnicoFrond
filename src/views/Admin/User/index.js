import ReactTable from "../../../Components/ReactTable"
import {useAuth} from "../../../Context"
import React, {Fragment, useEffect, useState} from 'react'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import {columnsUser} from "./ColumnsUser";
import BlockUi from "react-block-ui";
import Loader from "react-loaders";
import {faSpinner} from "@fortawesome/fontawesome-free-solid";
import PageTitle from "../../../Layout/AppMain/PageTitle";
import {faArchive, faUsers} from "@fortawesome/free-solid-svg-icons";
import {Card, CardBody, Container} from "reactstrap";
import User from '../../../Components/Models/User'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Users = () => {
    const {client, toast, removeAllToasts, auth} = useAuth()
    const [config, setConfig] = useState({blocking: true})

    const [users, setUsers] = useState([])
    useEffect(() => {
        User.getAll(client, 'id, nombres, deleted_at,email_verified_at, email')
            .then(response => {
                const {selectUsers}= response.data
                setUsers(selectUsers)
                setConfig({blocking: false})
            })
    }, [])


    const accion = (accion, id) => {
        // 1: activar , 2: eliminar, 3 verificar
        toast.success(<span><FontAwesomeIcon icon={faSpinner} spin/> Procesando...</span>)
        let caso=0
        switch (accion){
            case 'verify':
                caso=3
                break
            case 'delete':
                caso=2
                break
            case 'activar':
                caso=1
                break
        }

        User.caseUser(client, {id, caso: String(caso)}, 'id, nombres, deleted_at,email_verified_at, email')
            .then(response=>{
                const {caseUser}= response.data
                setUsers(prev=>prev.map(element=>{
                    return element.id!==caseUser.id? element: caseUser
                }))
                removeAllToasts()
                toast.success('Accion realizada con exito', {autoClose: 3500})
            })
    }
    return (
        <Fragment>
            <ReactCSSTransitionGroup component='div' transitionName='TabsAnimation' transitionAppear={true}
                                     transitionAppearTimeout={0} transitionEnter={false} transitionLeave={false}>
                <PageTitle heading='Usuarios' subheading={`LISTA DE USUARIOS`} icon={faUsers}
                           menus={[{to: '/admin/users', name: 'Usuarios'}]}/>
            </ReactCSSTransitionGroup>

            <Container fluid>
                <Card className='main-card'>
                    <CardBody>
                        <BlockUi tag='div' blocking={config.blocking}
                                 loader={<Loader active type='ball-pulse'/>}>
                            <ReactTable {...{
                                columns: columnsUser({accion, users, auth}),
                                data: users,
                                getCellProps: ({row}) => {
                                    const {original} = row
                                    return {style: {color: original.deleted_at ? '#d92550' : '#495057'}}
                                }
                            }}/>
                        </BlockUi>
                    </CardBody>

                </Card>
            </Container>

        </Fragment>
    )
}
export default Users