import React from 'react'
import {Route, Redirect} from 'react-router-dom'

import {useAuth} from './Context'

const PrivateRoute = ({component: Component, ...rest}) => {
    const {auth} = useAuth()
    const {authentication} = auth

    if (window.location.pathname.includes('reset') || window.location.pathname.includes('verify'))
        return <Route {...rest} render={props => <Component {...props} />}/>
    if (!authentication) return <Redirect to="/main"/>
    return <Route {...rest} render={props => <Component {...props} />}/>
}

export default PrivateRoute