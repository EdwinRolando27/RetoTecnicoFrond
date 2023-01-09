import React, {Fragment, useMemo} from "react";
import {Button, Container} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faTrash, faUserPlus,} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../../../Components/Tooltip";
import {faEdit,} from "@fortawesome/fontawesome-free-solid";
import {decodeToken} from "../../../utils/scripts";


export const columnsUser = ({accion, users, auth}) => useMemo(
    () => [
        {
            Header: '#',
            Cell: ({row}) => row.index + 1,
            style: {
                textAlign: 'left'
            }
        },
        {
            Header: 'Nombres',
            accessor: 'nombres',
            style: {
                textAlign: 'left'
            }
        },
        {
            Header: 'Correo',
            accessor: 'email',
            style: {
                textAlign: 'center'
            }
        },
        {
            Header: 'ACCIONES',
            Cell: ({row}) => {
                const {original} = row
                const {role_id} = decodeToken(auth.authentication)
                return (
                    role_id!=='ea7e35be-220b-11ec-bdf8-13a4a75f3041' ? <></> :
                        <Container fluid className="text-center">
                            {
                                original.deleted_at ? <Fragment>
                                    <Button id={`Tooltip-${original.id}-a`} className="btn-icon btn-icon-only p-0 mr-1"
                                            color="link">
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-success"
                                                         onClick={() => accion('activar', original.id)}/>
                                    </Button>
                                    <Tooltip id={`Tooltip-${original.id}-a`} name='Reactivar '/>
                                </Fragment> : <Fragment>
                                    <Button id={`Tooltip-${original.id}-c`} className='btn-icon btn-icon-only p-0'
                                            color='link'>
                                        <FontAwesomeIcon icon={faTrash} className='text-danger'
                                                         onClick={() => accion('delete', original.id)}/>
                                    </Button>
                                    <Tooltip id={`Tooltip-${original.id}-c`} name='Eliminar '/>
                                    {
                                        !original.email_verified_at ? <>
                                            <Button id={`Tooltip-${original.id}-d`}
                                                    className='btn-icon btn-icon-only p-0'
                                                    color='link'>
                                                <FontAwesomeIcon icon={faUserPlus} className='text-primary'
                                                                 onClick={() => accion('verify', original.id)}/>
                                            </Button>
                                            <Tooltip id={`Tooltip-${original.id}-d`} name='Verificar user '/>
                                        </> : <></>
                                    }
                                </Fragment>
                            }
                        </Container>
                )
            },
            maxWidth: 150,
            style: {
                textAlign: 'center'
            }
        }
    ],
    [users]
)

