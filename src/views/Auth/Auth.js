import React, {Fragment, useEffect} from 'react'

import AppHeader from '../../Layout/AppHeader'
import AppFooter from '../../Layout/AppFooter'

import About from "./About";
import Main from "./Main";
import Medicos from "./Medicos";
import {Route} from "react-router-dom";

const Auth =({history, match})=>{
    return(
        <Fragment>
            <AppHeader {...{history, match}}/>
            <br/>
            <br/>
            <br/>
            <Route exact path='/' component={Main}/>
            <Route exact path={`${match.url}/main`} component={Main}/>
            <Route exact path={`${match.url}/about`} component={About}/>
            <Route exact path={`${match.url}/medicos`} component={Medicos}/>
            <AppFooter/>
        </Fragment>
    )

}
export default Auth