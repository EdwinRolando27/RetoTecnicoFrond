import React, {Fragment} from 'react'
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {Link} from 'react-router-dom'

import { dateTimeUTC } from '../../../../utils/scripts'

const MatriculasPendientes = ({matriculas}) => {
    return (
        <Fragment>
            <div className="scroll-area-sm">
                <PerfectScrollbar>
                    <div className="p-3">
                        <VerticalTimeline className="vertical-time-simple vertical-without-time" layout="1-column">
                            {matriculas.map(({alumno, curso, curso_id, id, created_at}, index) => (
                                <VerticalTimelineElement key={index} className="vertical-timeline-item">
                                    <Link to={`/app/matricula/${curso_id}/edit/${id}`}>
                                        <h4 className="timeline-title">
                                            {`${alumno.nombres ? `${alumno.nombres} ` : ''}
                  ${alumno.a_paterno ? `${alumno.a_paterno} ` : ''}
                  ${alumno.a_materno ? alumno.a_materno : ''}`}{' '}
                                            <br/>
                                            <small className="text-info">
                                                {curso.nombre_corto ? `${curso.nombre_corto.toString().substring(0, 47)}...` : ''}
                                            </small>
                                            <br/>
                                            <small className="text-success">{dateTimeUTC(created_at)}</small>
                                        </h4>
                                    </Link>
                                </VerticalTimelineElement>
                            ))}
                        </VerticalTimeline>
                    </div>
                </PerfectScrollbar>
            </div>
        </Fragment>
    )
}

export default MatriculasPendientes
