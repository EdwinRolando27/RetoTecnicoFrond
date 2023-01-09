import React, {Fragment, useMemo} from "react";
import {Button, Container} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../../../Components/Tooltip";
import {Link} from "react-router-dom";
import {faEdit} from "@fortawesome/fontawesome-free-solid";

export const columnsMedicos = ({accion, medicos, config}) => useMemo(
    () => [
        {
            Header: '#',
            Cell: ({row}) => row.index + 1,
            style: {
                textAlign: 'left'
            }
        },
        {
            Header: 'DNI',
            accessor: 'dni',
            style: {
                textAlign: 'center'
            }
        },
        {
            Header: 'NOMBRES',
            accessor: 'nombre',
            style: {
                textAlign: 'left'
            },
            Cell: ({row}) => {
                const {original} = row
                return (
                    <div>
                        {`${original.nombres} ${original.apellidos}`}
                    </div>)
            }
        },
        {
            Header: 'Especialidad',
            accessor: 'especialidad',
            style: {
                textAlign: 'center'
            }
        },
        {
            Header: 'ACCIONES',
            Cell: ({row}) => {
                const {original} = row
                return (
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
                                <Button id={`Tooltip-${original.id}-b`} className="btn-icon btn-icon-only p-0 mr-1"
                                        color="link">
                                    <FontAwesomeIcon icon={faEdit} className="text-warning"
                                                     onClick={() => accion('editar', original)}/>
                                </Button>
                                <Tooltip id={`Tooltip-${original.id}-b`} name='Editar '/>
                                <Button id={`Tooltip-${original.id}-c`} className='btn-icon btn-icon-only p-0'
                                        color='link'>
                                    <FontAwesomeIcon icon={faTrash} className='text-danger'
                                                     onClick={() => accion('delete', original.id)}/>
                                </Button>
                                <Tooltip id={`Tooltip-${original.id}-c`} name='Eliminar '/>
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
    [medicos, config]
)