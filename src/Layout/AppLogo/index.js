import React, {Fragment, useState} from 'react'
import {connect} from 'react-redux'
import Hamburger from 'react-hamburgers'
import {Link} from "react-router-dom"

import AppMobileMenu from '../AppMobileMenu'
import {setEnableClosedSidebar, setEnableMobileMenu, setEnableMobileMenuSmall} from '../../reducers/ThemeOptions'

const HeaderLogo = props => {
    const [config, setConfig] = useState({
        active: false,
        mobile: false,
        activeSecondaryMenuMobile: false,
        openLeft: false,
        openRight: false,
        relativeWidth: false,
        width: 280,
        noTouchOpen: false,
        noTouchClose: false,
    })

    const toggleEnableClosedSidebar = () => {
        let {enableClosedSidebar, setEnableClosedSidebar} = props;
        setEnableClosedSidebar(!enableClosedSidebar);
    }

    let {enableClosedSidebar} = props

    return (
        <Fragment>
            <div className="app-header__logo">
                <Link to={`/home`}>
                    <div className="logo-src"/>
                </Link>
                <div className="header__pane ml-auto">
                    <div onClick={toggleEnableClosedSidebar}>
                        <Hamburger
                            active={enableClosedSidebar}
                            type="elastic"
                            onClick={() => setConfig({
                                ...config,
                                active: !config.active
                            })}
                        />
                    </div>
                </div>
            </div>
            <AppMobileMenu/>
        </Fragment>
    )
}

const mapStateToProps = ({ThemeOptions}) => ({
    enableClosedSidebar: ThemeOptions.enableClosedSidebar,
    enableMobileMenu: ThemeOptions.enableMobileMenu,
    enableMobileMenuSmall: ThemeOptions.enableMobileMenuSmall,
})

const mapDispatchToProps = dispatch => ({
    setEnableClosedSidebar: enable => dispatch(setEnableClosedSidebar(enable)),
    setEnableMobileMenu: enable => dispatch(setEnableMobileMenu(enable)),
    setEnableMobileMenuSmall: enable => dispatch(setEnableMobileMenuSmall(enable)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderLogo)