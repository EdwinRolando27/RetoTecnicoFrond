import React, {Fragment, useState, useEffect} from 'react'
import {faPaperPlane, faUser} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Col, Row, Form, Button} from 'reactstrap'
import {Link, Redirect} from 'react-router-dom'
import LaddaButton, {EXPAND_RIGHT} from 'react-ladda'
import Slider from 'react-slick'
import gql from "graphql-tag"
import {GoogleReCaptcha} from 'react-google-recaptcha-v3'

import bg1 from '../../assets/utils/images/originals/bg1.jpg'
import bg2 from '../../assets/utils/images/originals/bg2.jpg'
import bg3 from '../../assets/utils/images/originals/bg3.jpg'

import Auth from '../../Components/Models/Auth'
import {useAuth} from '../../Context'
import {useInput} from '../../hooks'
import {isToken} from "../../utils/scripts"

const Login = () => {
    let settings = {
        dots: true, infinite: true, speed: 500, arrows: true, slidesToShow: 1, slidesToScroll: 1, fade: true,
        initialSlide: 0, autoplay: true, adaptiveHeight: true
    }

    const {client, appapi, auth, company, setClient, setClient2, toast, setCompany} = useAuth(),
        [verific, setVerific] = useState(false),
        [expRight, setExpRight] = useState(false),

        [email, inputEmail, , invalidEmail, msgEmail] = useInput({
            typeState: 'email', placeholder: 'Email'
        }),
        [password, inputPassword, , invalidPassword, msgPassword] = useInput({
            placeholder: 'Password', typeState: 'password'
        }),

        resetsend = () => {
            Auth
                .verific(client, {email})
                .then(response => {
                    let {id} = response.data.sendVerific
                    if (id)
                        toast.success("Mensaje fue enviado a su correo", {autoClose: 2000})
                })
                .catch(({message}) => {
                    if (message === `GraphQL error: Cannot destructure property 'id' of 'user' as it is null.`)
                        toast.error("Su correo no esta registrado", {autoClose: 2000})
                    else
                        toast.error(message, {autoClose: 2000})
                })
        },
        postLogin = async () => {
            invalidEmail(email === '')
            invalidPassword(password === '')

            if (email === '' || password === '') {
                msgEmail('¡Ingrese un Email válido!')
                msgPassword('¡Ingrese su Password!')
                return
            }
            setExpRight(true)

            Auth
                .login(client, {
                    email, password
                }, 'authentication, authorization, refresh, company {id, ruc, razon_social, soap_envio ,periodo, rubro, uit}, local {id, direccion, nombre_corto}, modulo_id')
                .then(response => {
                    const {login} = response.data
                    setExpRight(false)
                    if (login === null) {
                        toast.error('Credenciales incorrectas', {autoClose: 2000})
                        return
                    }

                    appapi
                        .query({
                            query: gql`query createToken($email: String!, $password: String!) {
                              login(email: $email, password: $password) {
                                authentication
                                layout
                              }
                            }`,
                            context: {headers: {isAuth: isToken()}},
                            variables: {email, password},
                            fetchPolicy: "no-cache"
                        })
                        .then(response => {
                            const {login} = response.data
                            if (login === null) {
                                // toast.error('Credenciales incorrectas', {autoClose: 2000})
                                return
                            }
                            setClient2(login)
                        })

                    const {authentication, authorization, refresh, company, local, modulo_id} = login

                    if (authentication === 'verify') {
                        setVerific(true)
                        return
                    }
                    if (authentication === 'expired') {
                        toast.warning('Caducó su Tiempo Como Practicante', {autoClose: 2000})
                        // setVerific(true)
                        return
                    }
                    setCompany({...company, local})
                    setClient({authentication, authorization, refresh, modulo_id})
                })
                .catch(({message}) => {
                    setExpRight(false)
                    if (message === `GraphQL error: Cannot read property 'email_verified_at' of null`)
                        setVerific(true)
                })
        }

    useEffect(() => {
        const listener = ({keyCode}) => {
            if (keyCode === 13) postLogin()
        }
        window.addEventListener('keydown', listener)
        return () => window.removeEventListener('keydown', listener)
    }, [email, password])

    // useLayoutEffect(() => {
    //     localStorage.clear()
    //     sessionStorage.clear()
    //     document.cookie.split(";").forEach(function (c) {
    //         document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    //     })
    //
    //     localStorage.setItem('Auth', JSON.stringify({}))
    //     localStorage.setItem('Auth2', JSON.stringify({}))
    //     localStorage.setItem('Company', JSON.stringify({}))
    //     localStorage.setItem('localempresa', JSON.stringify({}))
    // }, [])

    return auth.authentication && company.id ? (
        <Redirect to={'/modulos'}/>
    ) : (
        verific ? (
            <Fragment>
                <div className="h-100">
                    <Row className="h-100 no-gutters">
                        <Col lg="7" md="12"
                             className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center">
                            <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
                                <div className="text-center">
                                    <img src="/logo.png" alt="Logo"/>
                                </div>
                                <h4>
                                    <div style={{textAlign: 'center'}}>
                                        <strong>Bienvenido</strong>
                                    </div>
                                    <br/>
                                    <p style={{textAlign: 'justify'}}>Se ha envido un correo electrónico a la dirección
                                        que has registrado
                                        ({email}), por favor ingresa a tu bandeja y confirma tu cuenta, en caso de
                                        no existir ningún correo. <p style={{color: 'red', fontSize: '15px'}}>Revisa tu
                                            span o pulsa en el boton reenviar para que
                                            te reenviemos el correo.</p></p>
                                    <hr/>
                                    <span className="text-muted">Mientras no confirmes tu cuenta no podras usar ningún servicio gratuito.</span>
                                    <div style={{textAlign: 'center'}}>
                                        <br/>
                                        <Button color="primary" size="lg" active={true} onClick={() => resetsend()}>
                                            <FontAwesomeIcon icon={faPaperPlane}/> Reenviar Correo de Verificación
                                        </Button>
                                    </div>
                                </h4>
                            </Col>
                        </Col>
                        <Col lg="5" className="d-none d-lg-block">
                            <div className="slider-light">
                                <Slider  {...settings}>
                                    <div
                                        className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                                        <div className="slide-img-bg"
                                             style={{backgroundImage: 'url(' + bg1 + ')'}}/>
                                        <div className="slider-content">
                                            <h3>Consulta de Validez de CPE</h3>
                                            <p>
                                                Consulte la validez de boletas, facturas y sus respectivas notas
                                                electrónicas.
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                                        <div className="slide-img-bg"
                                             style={{backgroundImage: 'url(' + bg3 + ')'}}/>
                                        <div className="slider-content">
                                            <h3>Pago masivo de detracciones con NPD</h3>
                                            <p>
                                                Operaciones SOL para pago masivo.
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                                        <div className="slide-img-bg opacity-6"
                                             style={{backgroundImage: 'url(' + bg2 + ')'}}/>
                                        <div className="slider-content">
                                            <h3>Consulta DNI, RUC y EsSalud</h3>
                                            <p>
                                                Consultas de reniec, sunat y essalud sin capcha.
                                            </p>
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        ) : (
            <Fragment>
                <div className="h-100">
                    <Row className="h-100 no-gutters">
                        <Col lg="8" className="d-none d-lg-block">
                            <div className="slider-light">
                                <Slider {...settings}>
                                    <div
                                        className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                                        <div
                                            className="slide-img-bg"
                                            style={{
                                                backgroundImage: 'url(' + bg1 + ')'
                                            }}
                                        />
                                        <div className="slider-content">
                                            <h3>Sistema Contable</h3>
                                            <p>Sistema Contable intuitivo</p>
                                        </div>
                                    </div>
                                    <div
                                        className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                                        <div
                                            className="slide-img-bg"
                                            style={{
                                                backgroundImage: 'url(' + bg3 + ')'
                                            }}
                                        />
                                        <div className="slider-content">
                                            <h3>Automatizamos</h3>
                                            <p>Procesos de facturador, contables</p>
                                        </div>
                                    </div>
                                    <div
                                        className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                                        <div
                                            className="slide-img-bg opacity-6"
                                            style={{
                                                backgroundImage: 'url(' + bg2 + ')'
                                            }}
                                        />
                                        <div className="slider-content">
                                            <h3>Administramos</h3>
                                            <p>Empresas, usuarios</p>
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                        </Col>
                        <Col lg="4" md="12" className="h-100 d-flex bg-white justify-content-center align-items-center">
                            <Col lg="10" md="10" sm="12" className="mx-auto app-login-box">
                                <div className="text-center">
                                    <img src="/logo.png" alt="Logo"/>
                                    <Row className="divider"/>
                                    <h4 className="mb-0">
                                        <div>Bienvenido,</div>
                                        <label>Inicia sesión en tu cuenta.</label>
                                    </h4>
                                </div>
                                <Row className="divider"/>

                                <Form>
                                    <Row form>
                                        <Col md={12} className="mb-2">
                                            <strong>Email</strong>
                                            {inputEmail}
                                        </Col>
                                        <Col md={12}>
                                            <strong>Contraseña</strong>
                                            {inputPassword}
                                        </Col>
                                    </Row>
                                </Form>
                                <Row className="divider"/>
                                <div className="d-flex align-items-center" style={{justifyContent: 'center'}}>
                                    {/*<div className="ml-auto" >*/}
                                    <GoogleReCaptcha onVerify={token => {
                                    }}/>
                                    <LaddaButton style={{width: '60%'}} className="btn btn-pill btn-primary"
                                                 loading={expRight} data-style={EXPAND_RIGHT}
                                                 onClick={() => postLogin()}>
                                        <FontAwesomeIcon icon={faUser}/> Ingresar
                                    </LaddaButton>
                                    {/*</div>*/}
                                </div>
                                <h6 className="mt-3 align-items-center" style={{textAlign: '-webkit-center'}}>
                                    <Link to="/password/reset" className="btn-lg btn btn-link">
                                        <strong> ¿Olvidó su contraseña? </strong>
                                    </Link>
                                </h6>
                                <h6 className="mt-3" style={{textAlign: '-webkit-center'}}>
                                    <strong style={{color: 'black'}}> ¿Sin cuenta? {' '} </strong>
                                    <Link to={'/register'} className="text-primary"> <strong> Regístrate
                                        ahora </strong></Link>
                                </h6>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    )
}

export default Login
