import React, {Suspense, lazy, useEffect, Fragment, useState} from 'react'
import {Route, Redirect} from 'react-router-dom'
import Loader from 'react-loaders'
import {ApolloClient} from 'apollo-client'
import {ApolloLink, Observable} from 'apollo-link'
import {onError} from 'apollo-link-error'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {getMainDefinition} from 'apollo-utilities'
import {WebSocketLink} from 'apollo-link-ws'
import ApolloLinkTimeout from 'apollo-link-timeout'
import {useToasts} from 'react-toast-notifications'
import {createUploadLink} from 'apollo-upload-client'
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"

import {AuthContext} from '../../Context'
import Login from '../../views/Auth/Login'
import Register from "../../views/Auth/Register"
import Main from "../../views/Auth/Main"
import About from "../../views/Auth/About"
import Medicos from "../../views/Auth/Medicos"
import Contacto from "../../views/Auth/Contacto";
import Recomendaciones from "../../views/Auth/Recomendaciones";
import NewsFree from "../../views/Auth/News"
import useLocalStorage from '../../hooks/useLocalStorage'
import {Auth} from "../../Components/Models"

import {decodeToken} from "../../utils/scripts"
import AppHeader from "../AppHeader";
import AppFooter from "../AppFooter";
import AppSidebar from "../AppSidebar";
import Admin from "../../views/Admin";


require('dotenv').config()

const MySwal = withReactContent(Swal)
let client

const AppMain = ({history, match}) => {
    const {addToast, removeAllToasts} = useToasts()

    const [auth, setAuth] = useLocalStorage('Auth', {})
    const [header, setHeader] = useState(true)
    let count = true

    const logout = () => {
        setAuth({})
        window.location.href = '/login'
    }
    useEffect(() => {
        switch (window.location.pathname) {
            case '/login':
            case '/register':
                setHeader(false)
                break
            default:
                setHeader(true)
                break
        }
    }, [match])

    const setClient = au => {
        const {role_id} = au.authentication ? decodeToken(au.authentication) : {}
        if (['1990d988-220c-11ec-9b6d-335378e45614', '129965aa-220c-11ec-adf6-5784bddb7a64', '0f17e438-220c-11ec-adf5-77be0344e22b'].includes(role_id))
            au = {...au}
        setAuth(au)
        const timeoutLink = new ApolloLinkTimeout(120000) // Milliseconds
        let {authentication} = JSON.parse(localStorage.getItem('Auth'))
        client = new ApolloClient({
            link: ApolloLink.from([
                onError(({graphQLErrors, networkError, operation, forward}) => {
                    if (networkError) {
                        const {statusCode} = networkError
                        switch (statusCode) {
                            case 401:
                                const {refresh} = JSON.parse(localStorage.getItem('Auth'))
                                return new Observable(observer => {
                                    Auth
                                        .refresh(client, {refresh: `Bearer ${refresh}`}, 'authentication, refresh')
                                        .then(response => {
                                            let {refresh} = response.data

                                            if (response.error || refresh === null) {
                                                logout()
                                                return
                                            }

                                            operation.setContext({headers: {Authentication: `Bearer ${refresh.authentication}`}})

                                            forward(operation)
                                                .subscribe({
                                                    next: observer.next.bind(observer),
                                                    error: observer.error.bind(observer),
                                                    complete: observer.complete.bind(observer)
                                                })

                                            if (auth.modulo_id) refresh.modulo_id = auth.modulo_id
                                            setClient({
                                                ...JSON.parse(localStorage.getItem('Auth')),
                                                ...refresh
                                            })
                                        })
                                        .catch(error => {
                                            // No refresh or client token available, we force user to login
                                            observer.error(error)
                                            logout()
                                        })
                                })
                            case 402:
                                if (count === true) {
                                    const Toast = MySwal.mixin({
                                        toast: true,
                                        position: 'center',
                                        showConfirmButton: false,
                                        timer: 10000,
                                        timerProgressBar: true,
                                        didOpen: (toast) => {
                                            toast.addEventListener('mouseenter', Swal.stopTimer)
                                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                                        }
                                    })

                                    Toast.fire({icon: 'error', title: 'Se ha Inicio Sessión en otro Dispositivo'})
                                    count = false
                                    setTimeout(() => logout(), 1000)
                                }
                                break
                            case 403:
                                addToast('No tiene los privilegios...', {appearance: 'error', autoDismissTimeout: 5000})
                                break
                            default:
                                break
                        }
                    }
                }),
                ApolloLink.split(({query}) => {
                        const {kind, operation} = getMainDefinition(query)
                        return kind === 'OperationDefinition' && operation === 'subscription'
                    },
                    new WebSocketLink({
                        uri: `ws://${process.env.REACT_APP_WS}/graphql`,
                        options: {
                            reconnect: true,
                            connectionParams: {
                                headers: {
                                    Authentication: `Bearer ${authentication}`
                                }
                            }
                        }
                    }),
                    timeoutLink.concat(createUploadLink({
                        uri: `${process.env.REACT_APP_API_ECOCONT}/api`,
                        headers: {
                            Authentication: `Bearer ${authentication}`
                        }
                    }))
                )
            ]),
            cache: new InMemoryCache()
        })
    }

    const toast = {
        success: (message, {autoClose} = {}) => {
            if (autoClose) addToast(message, {appearance: 'success', autoDismissTimeout: autoClose})
            else addToast(message, {appearance: 'success', autoDismiss: false})
        },
        error: (message, {autoClose}) => addToast(message, {appearance: 'error', autoDismissTimeout: autoClose}),
        warning: (message, {autoClose}) => addToast(message, {appearance: 'warning', autoDismissTimeout: autoClose}),
        info: (message, {autoClose}) => addToast(message, {appearance: 'info', autoDismissTimeout: autoClose})
    }

    useEffect(() => {
        setClient(auth)
    }, [])

    return (
        client ? (
            <AuthContext.Provider value={{
                auth, setAuth, client, setClient, toast, removeAllToasts
            }}>
                {
                    !header ? <Fragment>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path="/register" component={Register}/>
                    </Fragment> : <Fragment>
                        <AppHeader {...{history, match}}/>
                        <div className="app-main">
                            {
                                auth.authentication ? <AppSidebar/> : <></>
                            }
                            <div className={auth.authentication ? 'app-main__outer p-50' : 'app-main__outer p-0'}>
                                <div className={auth.authentication ? 'app-main__inner p-50' : 'app-main__inner p-0'}>
                                    <Route exact path='/' component={Main}/>
                                    <Route exact path='/main' component={Main}/>
                                    <Route exact path='/about' component={About}/>
                                    <Route exact path='/medicos' component={Medicos}/>
                                    <Route exact path='/login' component={Login}/>
                                    <Route exact path="/register" component={Register}/>
                                    <Route exact path="/contacto" component={Contacto}/>
                                    <Route exact path="/recomendaciones" component={Recomendaciones}/>
                                    <Route exact path="/news/:id" component={NewsFree}/>
                                    <Suspense fallback={<div className='loader-container'>
                                        <div className='loader-container-inner'>
                                            <div className='text-center'>
                                                <Loader type='ball-pulse-rise' active/>
                                            </div>
                                            <h6 className='mt-5'>Cargando los Componentes...</h6>
                                        </div>
                                    </div>}>
                                        <Route path='/admin' component={Admin}/>
                                    </Suspense>
                                </div>
                                {
                                    !auth.authentication ? <AppFooter/> : <></>
                                }

                            </div>
                        </div>
                    </Fragment>
                }

            </AuthContext.Provider>
        ) : (<></>))
}

export default AppMain
