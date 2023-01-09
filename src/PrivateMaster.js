import React from 'react'
import {Route, Redirect} from 'react-router-dom'

import {useAuth} from './Context'
import {decodeToken} from "./utils/scripts";

const PrivateMaster = ({component: Component, ...rest}) => {
    const {auth, toast, removeAllToasts} = useAuth()
    const {role_id} = decodeToken(auth.authentication)

    if (window.location.pathname.includes('reset') || window.location.pathname.includes('verify'))
        return <Route {...rest} render={props => <Component {...props} />}/>
    if (!auth.authentication) return <Redirect to="/main"/>
    if (role_id !== 'ea7e35be-220b-11ec-bdf8-13a4a75f3041') {
        removeAllToasts()
        toast.warning('No cuenta con los permisos suficientes para ver el apartado', {autoClose: 3500})
        return <Redirect to="/login"/>
    }
    return <Route {...rest} render={props => <Component {...props} />}/>


}
export default PrivateMaster
