import React, {Fragment, useMemo} from "react"
import {Button, Container, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown} from "reactstrap"
import {Link} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEdit, faFilePdf} from "@fortawesome/fontawesome-free-solid"
import {faCheckCircle, faCode, faEllipsisV, faFileCode, faFileExport, faTrash} from "@fortawesome/free-solid-svg-icons"

import Tooltip from "../../../../src/Components/Tooltip"

export const columnsCategoria = ({activateCategoria, editarCategoria, deleteCategoria, categorias, config}) => useMemo(
    () => [
        {
            Header: '#',
            Cell: ({row}) => row.index + 1,
            style: {
                textAlign: 'left'
            }
        },
        {
            Header: 'CÓDIGO',
            accessor: 'codigo',
            style: {
                textAlign: 'center'
            }
        },
        {
            Header: 'NOMBRE',
            accessor: 'nombre',
            style: {
                textAlign: 'left'
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
                                                     onClick={() => activateCategoria(original.id)}/>
                                </Button>
                                <Tooltip id={`Tooltip-${original.id}-a`} name='Reactivar '/>
                            </Fragment> : <Fragment>
                                <Button id={`Tooltip-${original.id}-b`} className="btn-icon btn-icon-only p-0 mr-1"
                                        color="link">
                                    <FontAwesomeIcon icon={faEdit} className="text-warning"
                                                     onClick={() => editarCategoria(original.id)}/>
                                </Button>
                                <Tooltip id={`Tooltip-${original.id}-b`} name='Editar '/>
                                <Button id={`Tooltip-${original.id}-c`} className='btn-icon btn-icon-only p-0'
                                        color='link'>
                                    <FontAwesomeIcon icon={faTrash} className='text-danger'
                                                     onClick={() => deleteCategoria(original.id)}/>
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
    [categorias, config]
)
export const columnsCategoriaFree = ({categorias, config}) => useMemo(
    () => [
        {
            Header: () => null,
            id: 'expander',
            Cell: ({row}) => {
                return <span {...row.getToggleRowExpandedProps()}
                             style={{fontSize: '15px'}}>{row.isExpanded ? '👇' : '👉'}</span>
            },
            SubCell: () => null,
            style: {
                textAlign: 'center',
                cursor: 'pointer'
            }
        },
        {
            Header: '#',
            Cell: ({row}) => row.index + 1,
            style: {
                textAlign: 'left'
            }
        },
        {
            Header: 'CÓDIGO',
            accessor: 'codigo',
            style: {
                textAlign: 'center'
            }
        },
        {
            Header: 'DETALLE',
            accessor: 'nombre',
            style: {
                textAlign: 'center'
            }
        }
    ],
    [categorias, config]
)

export const columnsNews = ({noticias, config, accion}) => useMemo(
    () => [
        {
            Header: '#',
            Cell: ({row}) => row.index + 1,
            style: {
                textAlign: 'left'
            }
        },
        {
            Header: 'ETIQUETA',
            accessor: 'etiqueta',
            style: {
                textAlign: 'center'
            }
        },
        {
            Header: 'DESCRIPCIÓN',
            accessor: 'descripcion',
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
    [noticias, config]
)