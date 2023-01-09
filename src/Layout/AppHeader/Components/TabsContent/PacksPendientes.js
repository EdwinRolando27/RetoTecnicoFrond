import React, {Fragment} from 'react'
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {Link} from 'react-router-dom'

import {dateTimeUTC} from '../../../../utils/scripts'

const MatriculasPendientes = ({packs}) => {
    return (
        <Fragment>
            <div className="scroll-area-sm">
                <PerfectScrollbar>
                    <div className="p-3">
                        <VerticalTimeline className="vertical-time-simple vertical-without-time" layout="1-column">
                            {packs.map(({
                                            id,
                                            payu_id,
                                            created_at,
                                            alumno_email,
                                            importe,
                                            observaciones,
                                            alumno
                                        }, index) => (
                                <VerticalTimelineElement key={index} className="vertical-timeline-item">
                                    <h4 className="timeline-title">
                                        {`${alumno ? `${alumno.nombres} ` : ''}
                      ${alumno ? `${alumno.a_paterno} ` : ''}
                      ${alumno ? alumno.a_materno : ''}
                      ${alumno_email}`}
                                        <br/>
                                        <Link to={`/app/pack/${id}`}>
                                            <small className="text-info">
                                                PAYU ID: {payu_id}, IMPORTE: {importe}
                                            </small>
                                        </Link>
                                        <br/>
                                        <small className="text-success">{dateTimeUTC(created_at)}</small>
                                    </h4>
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
