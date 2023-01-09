import React, {Fragment, useEffect, useState} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {connect} from 'react-redux'
import cx from 'classnames'
import {Col, Row} from 'reactstrap'
import moment from 'moment'
import 'moment/locale/es'

import Notificaciones from './Components/Notificaciones'
import UserBox from './Components/UserBox'
import {useAuth} from '../../Context'
import {useInput} from "../../hooks";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Header = ({headerBackgroundColor, enableHeaderShadow, history, match}) => {
    const {auth, company} = useAuth()
    const [tipo, setTipo] = useState(1)
    const [mensaje, inputMensaje, setMensaje] = useInput({
        placeholder: 'Escriba mensaje'
    })

    const [view, setView] = useState(<></>)
    useEffect(() => {
        switch (window.location.pathname) {
            case '/':
            case '/main':
                setTipo(1)
                break
            case '/medicos':
                setTipo(3)
                break
            case '/about':
                setTipo(2)
                break
            case '/contacto':
                setTipo(5)
                break
            case '/recomendaciones':
                setTipo(4)
                break
            default:
                setTipo(12)
        }
    }, [match])

    const viewEmpresa = () => {
        let modulo_id = auth.modulo_id ? auth.modulo_id : ''
        const local = company.local ? company.local : {}
        let empresaLocal = modulo_id === '24414f8c-1a66-11ec-9149-dfe7ef2f825e' && local.direccion ? local.direccion : company.razon_social
        let nombre_corto_local = local && local.nombre_corto && local.nombre_corto !== '' ? `(${local.nombre_corto})` : ''
        return (<Fragment>
            {company && company.ruc ?
                <Row className="text-center mr-0">
                    <Col sm="12" md="12" xl="12">
                        <b>{company.ruc} - {empresaLocal.toString().toUpperCase()} - {moment(company.periodo).locale("es").format("MMMM YYYY").toUpperCase()} {nombre_corto_local}</b>
                    </Col>
                </Row> : <></>
            }
        </Fragment>)
    }

    const enviarMensaje = () => {
        let link = 'https://api.whatsapp.com/send?phone=51941809057&text'
        if (mensaje !== '') {
            const separate = mensaje.split(' ')
            if (separate.length > 0) {
                let i = 0
                for (const element of separate) {
                    link += i === 0 ? `=${element}` : `%20${element}`
                    i++
                }
            }
        }
        window.open(`${link}`)
        setMensaje('')
    }
    return (
        <Fragment>
            <ReactCSSTransitionGroup component='div'
                                     className={cx('app-header', headerBackgroundColor, {'header-shadow': enableHeaderShadow})}
                                     transitionName='HeaderAnimation' transitionAppear={true}
                                     transitionAppearTimeout={1500} transitionEnter={false} transitionLeave={false}>
                {/*<HeaderLogo/>*/}

                <div className={cx('app-header__content', {'header-mobile-open': enableHeaderShadow})}>
                    <div className='app-header-left'>
                        <header>
                            <nav className="navbar navbar-expand-lg navbar-light ">
                                <div className="justify-content-center">
                                    <div className="collapse navbar-collapse" id="navbarSupport">
                                        <ul className="navbar-nav ml-auto">
                                            <li className={tipo === 1 ? "nav-item active text-primary" : "nav-item"}
                                                onClick={() => history.push('/')}>
                                                <a className={tipo === 1 ? "nav-item active text-primary" : "nav-link"}>Inicio</a>
                                            </li>
                                            <li className={tipo === 2 ? "nav-item active  text-primary" : "nav-item"}
                                                onClick={() => history.push('/about')}>
                                                <a className={tipo === 2 ? "nav-item active text-primary" : "nav-link"}>Sobre
                                                    Nosotros</a>
                                            </li>
                                            <li className={tipo === 3 ? "nav-item active  text-primary" : "nav-item"}
                                                onClick={() => history.push('/medicos')}>
                                                <a className={tipo === 3 ? "nav-item active text-primary" : "nav-link"}>Médicos</a>
                                            </li>
                                            <li className={tipo === 4 ? "nav-item active  text-primary" : "nav-item"}
                                                onClick={() => history.push('/recomendaciones')}>
                                                <a className={tipo === 4 ? "nav-item active text-primary" : "nav-link"}>Recomendaciones</a>
                                            </li>
                                            <li className={tipo === 5 ? "nav-item active  text-primary" : "nav-item"}
                                                onClick={() => history.push('/contacto')}>
                                                <a className={tipo === 5 ? "nav-item active" : "nav-link"}>Contactanos</a>
                                            </li>
                                        </ul>
                                    </div>

                                </div>

                            </nav>
                        </header>
                    </div>
                    {
                        auth.authentication ?
                            <div className='app-header-right'>
                                <a className="navbar-brand" href="#"><span
                                    className="text-primary">Agendar</span>-Cita</a>
                                <form action="#">
                                    <div className="input-group input-navbar">
                                        <div className="input-group-prepend" onClick={() => enviarMensaje()}>
                                            <span className="input-group-text" icon={faWhatsapp}><FontAwesomeIcon
                                                icon={faWhatsapp}/></span>
                                        </div>
                                        {inputMensaje}
                                    </div>
                                </form>
                            </div> : <></>
                    }


                    {auth.authentication ? <div className='app-header-right'>
                        <Notificaciones/>
                        <UserBox/>
                    </div> : <div className='app-header-right'><a className="navbar-brand" href="#"><span
                        className="text-primary">Agendar</span>-Cita</a>
                        <form action="#">
                            <div className="input-group input-navbar">
                                <div className="input-group-prepend" onClick={() => enviarMensaje()}>
                                    <span className="input-group-text" icon={faWhatsapp}><FontAwesomeIcon
                                        icon={faWhatsapp}/></span>
                                </div>
                                {inputMensaje}
                            </div>
                        </form>
                    </div>}
                </div>

            </ReactCSSTransitionGroup>
        </Fragment>
    )
}

const mapStateToProps = ({ThemeOptions}) => ({
    enableHeaderShadow: ThemeOptions.enableHeaderShadow,
    closedSmallerSidebar: ThemeOptions.closedSmallerSidebar,
    headerBackgroundColor: ThemeOptions.headerBackgroundColor,
    enableMobileMenuSmall: ThemeOptions.enableMobileMenuSmall
})

const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
