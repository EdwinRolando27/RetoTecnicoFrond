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
        appapi.query({
            query: gql`query verifyemail($email: String!) {
                  verifyemail(email: $email) {
                    email
                  }
                }`,
            context: {headers: {isAuth: isToken()}},
            variables: {
                email
            },
            fetchPolicy: "no-cache"
        }).then(response => {
            if (!response.data.verifyemail.email) {
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

                        appapi.mutate({
                            mutation: gql`mutation createUsuarioEco(
                            $name: String!,
                            $apellido_paterno: String!,
                            $apelido_materno: String!,
                            $email: String!,
                            $password: String!,
                            $telefono: String!
                        ) {
                        createUsuarioEco(
                            name: $name,
                            apellido_paterno: $apellido_paterno,
                            apelido_materno: $apelido_materno,
                            email: $email,
                            password: $password,
                            telefono: $telefono
                        ){
                            email
                        }
                    }`,
                            context: {headers: {isAuth: isToken()}},
                            variables: {
                                name: nombres,
                                apellido_paterno: '',
                                apelido_materno: '',
                                email,
                                password,
                                telefono
                            }
                        }).catch(({message}) => {
                            toast.error(message, {autoClose: 2000})
                            setExpRight(false)
                        })
                    })
                    .catch(({message}) => {
                        toast.warning(message, {autoClose: 2000})
                        setExpRight(false)
                    })
            } else {
                toast.error("Ya creado", {autoClose: 2000})
                setExpRight(false)

                User.create(client, {nombres, email, telefono, password}, `id`)
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

                        appapi.mutate({
                            mutation: gql`mutation resetEco(
                                $email: String!,
                                $password: String!
                            ) {
                            resetEco(
                                email: $email,
                                password: $password
                            ){
                                email
                            }
                        }`,
                            context: {headers: {isAuth: isToken()}},
                            variables: {
                                email,
                                password
                            }
                        }).catch(({message}) => {
                            toast.error(message, {autoClose: 2000})
                            setExpRight(false)
                        })

                        setRegistrado(true)
                    })
                    .catch(({message}) => {
                        toast.warning(message, {autoClose: 2000})
                        setExpRight(false)
                    })
            }
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
                    <Row className="h-100 no-gutters">
                        <Col lg="7" md="12"
                             className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center">
                            <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
                                <div className="text-center">
                                    <img src="/logo.png" alt="Logo"/>
                                </div>
                                <h4>
                                    <div>Bienvenido,</div>
                                    <br/>
                                    <p style={{textAlign: 'justify'}}>Se ha envido un correo electrónico a la dirección
                                        que has registrado
                                        ({email}), por favor ingresa a tu bandeja y confirma tu cuenta, en caso de
                                        no existir ningún correo. <p style={{color: 'red', fontSize: '15px'}}>Revisa tu
                                            span o pulsa en el boton reenviar para que
                                            te reenviemos el correo.</p></p>
                                    <hr/>
                                    <span className="text-muted">Mientras no confirmes tu cuenta no podras usar ningún servicio gratuito.</span>
                                </h4>
                            </Col>
                        </Col>
                        <Col lg="5" className="d-none d-lg-block">
                            <div className="slider-light">
                                <Slider  {...settings}>
                                    <div
                                        className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                                        <div className="slide-img-bg"
                                             style={{
                                                 backgroundImage: 'url(' + bg1 + ')'
                                             }}/>
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
                                             style={{
                                                 backgroundImage: 'url(' + bg3 + ')'
                                             }}/>
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
                                             style={{
                                                 backgroundImage: 'url(' + bg2 + ')'
                                             }}/>
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
            :
            <Fragment>
                <div className="h-100">
                    <Row className="h-100 no-gutters">
                        <Col lg="7" md="12"
                             className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center">
                            <Col lg="11" md="11" sm="12" className="mx-auto app-login-box">
                                <div className="text-center">
                                    <img src="/logo.png" alt="Logo"/>
                                </div>
                                <h4>
                                    <div>Bienvenido,</div>
                                    <span>Solo toma unos <span className="text-success">segundos</span> crear su cuenta</span>
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
                                            <Col md={12}>
                                                <MyLabel name='¿Desea que le contactemos para mayor información?'/>
                                                <br/>
                                                {switchContacto}
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
                        <Col lg="5" className="d-none d-lg-block">
                            <div className="slider-light">
                                <Slider  {...settings}>
                                    <div
                                        className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                                        <div className="slide-img-bg"
                                             style={{
                                                 backgroundImage: 'url(' + bg1 + ')'
                                             }}/>
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
                                             style={{
                                                 backgroundImage: 'url(' + bg3 + ')'
                                             }}/>
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
                                             style={{
                                                 backgroundImage: 'url(' + bg2 + ')'
                                             }}/>
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
    )
}
export default Register