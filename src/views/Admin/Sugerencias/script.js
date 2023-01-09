import React, {Fragment, useMemo} from "react";
import {Button, Container} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons/faEye";
import Tooltip from "../../../Components/Tooltip";

export const columnsSugerencias = ({data, ver, history}) => useMemo(
    () => [
        {
            Header: '#',
            Cell: ({row}) => row.index + 1,
            style: {
                textAlign: 'left'
            }
        },
        {
            Header: 'Paciente',
            accessor: 'nombre',
            style: {
                textAlign: 'left'
            }
        },
        {
            Header: 'Correo',
            accessor: 'correo',
            style: {
                textAlign: 'left'
            }
        },
        {
            Header: 'Télefono',
            accessor: 'numero',
            style: {
                textAlign: 'left'
            }
        },
        {
            Header: 'Asunto',
            accessor: 'asunto',
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
                            <Fragment>
                                <Button id={`Tooltip-${original.id}-a`} className="btn-icon btn-icon-only p-0 mr-1"
                                        color="link">
                                    <FontAwesomeIcon icon={faEye}
                                                     className={!original.readed_at ? "text-danger" : "text-success"}
                                                     onClick={() => history.push(`/admin/sugerencia/${original.id}`)}/>
                                </Button>
                                <Tooltip id={`Tooltip-${original.id}-a`} name='Ver Detalle'/>
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

    ], [data, ver]
)