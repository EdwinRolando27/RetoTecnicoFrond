import React, {Fragment, useState, useEffect} from 'react'
import Ionicon from 'react-ionicons'
import {UncontrolledDropdown, DropdownToggle, DropdownMenu} from 'reactstrap'
import {VerticalTimeline, VerticalTimelineElement} from "react-vertical-timeline-component"
import PerfectScrollbar from "react-perfect-scrollbar"
import moment from "moment"
import {Link, Redirect, useHistory} from "react-router-dom"

import city3 from '../../../assets/utils/images/dropdown-header/city3.jpg'

import {useAuth} from '../../../Context'
import {decodeToken} from "../../../utils/scripts"
import {Sugerencias} from "../../../Components/Models";

Array.prototype.uniqueObject = function (element) {
    return [...new Set(this.map(item => item[element]))]
}

const Notificaciones = () => {
    const {client, auth, toast} = useAuth()
    const history = useHistory()
    const [notifications, setNotifications] = useState([])
    const {role_id} = decodeToken(auth.authentication)

    useEffect(() => {
        if (role_id !== 'ea7e35be-220b-11ec-bdf8-13a4a75f3041') return
        Sugerencias.selectSugerencias(client, true)
            .then(response => {
                const {data} = response.data.selectNoRead
                setNotifications(data)
            })

    }, [role_id])

    return (
        <Fragment>
            <div className='header-dots'>
                <UncontrolledDropdown>
                    <DropdownToggle className='p-0 mr-2' color='link'>
                        <div className='icon-wrapper icon-wrapper-alt rounded-circle'>
                            <div
                                className={`icon-wrapper-bg bg-${notifications.length === 0 ? 'success ' : 'danger'}`}/>
                            <Ionicon beat={notifications.length > 0}
                                     color={notifications.length === 0 ? '#3ac47d ' : '#d92550'} fontSize='23px'
                                     icon='md-notifications-outline'/>
                            {notifications.length > 0 ? (
                                <div className='badge badge-dot badge-dot-sm badge-danger'>Notificaciones></div>
                            ) : (
                                ''
                            )}
                        </div>
                    </DropdownToggle>

                    <DropdownMenu right className='dropdown-menu-xl rm-pointers'>
                        <div className='dropdown-menu-header mb-0'>
                            <div className='dropdown-menu-header-inner bg-deep-blue'>
                                <div className='menu-header-image opacity-1'
                                     style={{backgroundImage: 'url(' + city3 + ')'}}/>
                                <div className='menu-header-content text-dark'>
                                    <h5 className='menu-header-title'>Notificaciones comentarios y sugerencias</h5>
                                    <h6 className="menu-header-subtitle">Tú
                                        tienes <b>{notifications.length} notificación(es)</b>
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <Fragment>
                            <div className="scroll-area-sm">
                                <PerfectScrollbar>
                                    <div className="p-3">
                                        <VerticalTimeline className="vertical-time-simple vertical-without-time"
                                                          layout="1-column">
                                            {notifications.map(({
                                                                    created_at, asunto, nombre, message, id = null
                                                                }, index) => (
                                                <VerticalTimelineElement key={index} className="vertical-timeline-item">
                                                    <h4 className="timeline-title">
                                                        <Link onClick={() => {
                                                            history.push('')
                                                            history.push(`admin/sugerencia/${id}`)
                                                        }}>
                                                            <p><strong
                                                                style={{fontSize: '0.7rem'}}>ASUNTO: </strong><small
                                                                className="text-info">{asunto}</small></p>
                                                            <p><strong style={{fontSize: '0.7rem'}}>PACIENTE:</strong>
                                                                <small
                                                                    className="text-success"> {nombre}</small>
                                                            </p>
                                                            <p><strong style={{fontSize: '0.7rem'}}>FECHA:</strong>
                                                                <small
                                                                    className="text-success">{moment(created_at).format('YYYY-MM-DD')}</small>
                                                            </p>
                                                        </Link>
                                                    </h4>
                                                </VerticalTimelineElement>
                                            ))}
                                        </VerticalTimeline>
                                    </div>
                                </PerfectScrollbar>
                            </div>
                        </Fragment>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
        </Fragment>
    )
}

export default Notificaciones
