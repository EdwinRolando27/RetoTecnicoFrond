import React, {Fragment, useState} from 'react'
import {connect} from 'react-redux'
import Hamburger from 'react-hamburgers'
import cx from 'classnames'
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Button} from 'reactstrap'

import {
    setEnableMobileMenu,
    setEnableMobileMenuSmall,
} from '../../reducers/ThemeOptions'

const AppMobileMenu = props => {
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

    const toggleMobileSidebar = () => {
        let {enableMobileMenu, setEnableMobileMenu} = props
        setEnableMobileMenu(!enableMobileMenu)
    }


    const toggleMobileSmall = () => {
        let {enableMobileMenuSmall, setEnableMobileMenuSmall} = props
        setEnableMobileMenuSmall(!enableMobileMenuSmall)
    }

    let {enableMobileMenu} = props

    return (
        <Fragment>

            <div className="app-header__mobile-menu">
                <div onClick={toggleMobileSidebar}>
                    <Hamburger
                        active={enableMobileMenu}
                        type="elastic"
                        onClick={() => setConfig({
                            ...config,
                            activeMobile: !config.activeMobile
                        })}
                    />
                </div>
            </div>
            <div className="app-header__menu">
                    <span onClick={toggleMobileSmall}>
                        <Button size="sm"
                                className={cx("btn-icon btn-icon-only", {active: config.activeSecondaryMenuMobile})}
                                color="primary"
                                onClick={() => setConfig({
                                    ...config,
                                    activeSecondaryMenuMobile: !config.activeSecondaryMenuMobile
                                })}>
                            <div className="btn-icon-wrapper"><FontAwesomeIcon icon={faEllipsisV}/></div>
                        </Button>
                    </span>
            </div>
        </Fragment>
    )
}

const mapStateToProps = ({ThemeOptions}) => ({
    closedSmallerSidebar: ThemeOptions.closedSmallerSidebar,
    enableMobileMenu: ThemeOptions.enableMobileMenu,
    enableMobileMenuSmall: ThemeOptions.enableMobileMenuSmall,
})

const mapDispatchToProps = dispatch => ({
    setEnableMobileMenu: enable => dispatch(setEnableMobileMenu(enable)),
    setEnableMobileMenuSmall: enable => dispatch(setEnableMobileMenuSmall(enable)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppMobileMenu)