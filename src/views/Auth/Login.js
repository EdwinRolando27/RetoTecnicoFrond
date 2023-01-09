import React, {Fragment, useState, useEffect} from 'react'
import {faPaperPlane, faUser} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Col, Row, Form, Button} from 'reactstrap'
import {Link, Redirect} from 'react-router-dom'
import LaddaButton, {EXPAND_RIGHT} from 'react-ladda'
import gql from "graphql-tag"


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
                }, 'authentication, id')
                .then(response => {
                    const {login} = response.data
                    setExpRight(false)
                    if (login === null) {
                        toast.error('Credenciales incorrectas', {autoClose: 2000})
                    } else {
                        if(login.authentication==='verify'){
                            toast.error('Cuenta sin confirmar', {autoClose:3500})
                            return
                        }
                        setClient({...login})
                        return (<Redirect to={'/'}/>)
                    }

                })
                .catch(({message}) => {
                    setExpRight(false)
                    if (message === `GraphQL error: Cannot read property 'email_verified_at' of null`)
                        setVerific(true)
                })
        }

        useEffect(()=>{
            console.log(auth)
        },[auth])
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

    return auth.authentication ? (
        <Redirect to={'/'}/>
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
                                    <hr/>
                                    <span className="text-muted">Mientras no confirmen tu cuenta no podras usar los modulos administrativos</span>
                                    <div style={{textAlign: 'center'}}>
                                        <br/>
                                        <Button color="primary" size="lg" active={true} onClick={() => resetsend()}>
                                            <FontAwesomeIcon icon={faPaperPlane}/> Reenviar Correo de Verificación
                                        </Button>
                                    </div>
                                </h4>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        ) : (
            <Fragment>
                <div className="h-100">
                    <Row className="h-100 no-gutters justify-content-center">
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
                                <div className="d-flex align-items-center" style={{justifyContent: 'center'}}>
                                    {/*<div className="ml-auto" >*/}
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
