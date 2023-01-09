import React, {Fragment, useState, useEffect} from "react"
import {Link} from "react-router-dom"
import {Col, Row, Form} from "reactstrap"
import Slider from "react-slick"
import gql from "graphql-tag"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUserPlus} from "@fortawesome/free-solid-svg-icons"
import LaddaButton, {EXPAND_RIGHT} from "react-ladda"

import bg3 from '../../assets/utils/images/originals/bg1.jpg'
import bg1 from "../../assets/utils/images/originals/bg2.jpg"
import bg2 from "../../assets/utils/images/originals/bg3.jpg"

import {useAuth} from "../../Context"
import User from "../../Components/Models/User"
import {useInput, useSwitch} from "../../hooks"
import {MyLabel} from "../../Components"
import {isToken} from "../../utils/scripts";

const Register = () => {
    let settings = {
        dots: true,
        infinite: true,
        speed: 500,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        initialSlide: 0,
        autoplay: true,
        adaptiveHeight: true
    }

    const {client, toast, appapi} = useAuth()

    const [registrado, setRegistrado] = useState(false)
    const [expRight, setExpRight] = useState(false)

    const [nombres, inputNombres, , invalidNombres, msgNombres] = useInput({
        placeholder: 'Nombres'
    })
    const [email, inputEmail, setEmail, invalidEmail, msgEmail] = useInput({
        placeholder: 'Email',
        typeState: 'email'
    })
    const [telefono, inputTelefono, , invalidTelefono, msgTelefono] = useInput({
        placeholder: 'Teléfono',
        typeState: 'numeric'
    })
    const [password, inputPassword, , invalidPassword, msgPassword] = useInput({
        placeholder: 'Password',
        typeState: 'password'
    })
    const [confirm_password, inputConfirmPassword, , invalidConfirmPassword, msgConfirmPassword] = useInput({
        placeholder: 'Confirmar Password',
        typeState: 'password'
    })
    const [contacto, switchContacto, setContacto] = useSwitch({
        initialState: false
    })

    useEffect(() => {
        setContacto(false)
    }, [])

    const postRegister = () => {
        invalidNombres(nombres === '')
        invalidEmail(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email))
        invalidTelefono(telefono === '' && contacto)
        invalidPassword(password === '')
        invalidConfirmPassword(password !== confirm_password)

        if (
            nombres === '' ||
            !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email) ||
            telefono === '' && contacto ||
            password === '' ||
            password !== confirm_password
        ) {
            msgNombres('Ingrese un nombre de Usuario')
            msgEmail(`La dirección de email "${email}" es incorrecta`)
            msgTelefono('Ingrese un número del teléfono de contacto válido')
            msgPassword('La contraseña debe tener de 5 a 20 caracteres')
            msgConfirmPassword('Las contraseñas no son iguales')
            return
        }

        setExpRight(true)
        setEmail(email.toLowerCase())
        User
            .create(client, {nombres, email, telefono, password}, `id`)
            .then(response => {
                const {createUser} = response.data
                setExpRight(false)

                if (createUser === null) {
                    invalidEmail(true)
                    msgEmail(`El correo ya esta en uso`)
                    return
                }
                if (createUser.id === '123') {
                    invalidEmail(true)
                    msgEmail(`No se permite correos Temporales`)
                    return
                }

                setRegistrado(true)
            })
            .catch(({message}) => {
                toast.warning(message, {autoClose: 2000})
                setExpRight(false)
            })


    }

    useEffect(() => {
        const listener = ({keyCode}) => {
            if (keyCode === 13) postRegister()
        }
        window.addEventListener("keydown", listener)
        return () => window.removeEventListener("keydown", listener)
    }, [nombres, email, telefono, password, confirm_password])

    return (
        registrado ?
            <Fragment>
                <div className="h-100">
                    <Row className="h-100 no-gutters justify-content-center">
                        <Col lg="7" md="12"
                             className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center">
                            <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
                                <div className="text-center">
                                    <img src="/logo.png" alt="Logo"/>
                                </div>
                                <h4>
                                    <div>Bienvenido,</div>
                                    <br/>
                                    <hr/>
                                    <span className="text-muted">Mientras no confirmen tu cuenta no podras usar ningún servicio gratuito.</span>
                                </h4>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </Fragment>
            :
            <Fragment>
                <div className="h-100">
                    <Row className="h-100 no-gutters justify-content-center">
                        <Col lg="7" md="12"
                             className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center">
                            <Col lg="11" md="11" sm="12" className="mx-auto app-login-box">
                                <div className="text-center">
                                    <img src="/logo.png" alt="Logo"/>
                                </div>
                                <h4>
                                    <div>Bienvenido,</div>
                                    <span>Solo toma unos <span
                                        className="text-success">segundos</span> crear su cuenta</span>
                                </h4>
                                <div>
                                    <Form>
                                        <Row form>
                                            <Col md={12}>
                                                <MyLabel name='Nombres' requerid/>
                                                {inputNombres}
                                            </Col>
                                            <Col md={6}>
                                                <MyLabel name='Email' requerid/>
                                                {inputEmail}
                                            </Col>
                                            <Col md={6}>
                                                <MyLabel name='Teléfono de Contacto' requerid/>
                                                {inputTelefono}
                                            </Col>
                                            <Col md={6}>
                                                <MyLabel name='Contraseña' requerid/>
                                                {inputPassword}
                                            </Col>
                                            <Col md={6}>
                                                <MyLabel name='Confirmar Contraseña' requerid/>
                                                {inputConfirmPassword}
                                            </Col>
                                        </Row>
                                    </Form>
                                    <div className="mt-4 d-flex align-items-center">
                                        <h5 className="mb-0">
                                            ¿Ya tienes una cuenta?{' '}
                                            <Link to="/login" className="text-primary">Login</Link>
                                        </h5>
                                        <div className="ml-auto">
                                            <LaddaButton className="btn btn-pill btn-primary"
                                                         loading={expRight} onClick={postRegister}
                                                         data-style={EXPAND_RIGHT}>
                                                <FontAwesomeIcon icon={faUserPlus}/> Crear cuenta
                                            </LaddaButton>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </Fragment>
    )
}
export default Register