import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import cx from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PerfectScrollbar from 'react-perfect-scrollbar'

import Nav from '../AppNav/VerticalNavWrapper'
import HeaderLogo from '../AppLogo'
import {setEnableMobileMenu} from '../../reducers/ThemeOptions'

const AppSidebar = props => {
    const toggleMobileSidebar = () => {
        let {enableMobileMenu, setEnableMobileMenu} = props
        setEnableMobileMenu(!enableMobileMenu)
    }

    let {backgroundColor, enableBackgroundImage, enableSidebarShadow, backgroundImage, backgroundImageOpacity} = props

    return (
        <Fragment>
            <div className="sidebar-mobile-overlay" onClick={toggleMobileSidebar}/>
            <ReactCSSTransitionGroup component="div"
                                     className={cx('app-sidebar', backgroundColor, {'sidebar-shadow': enableSidebarShadow})}
                                     transitionName="SidebarAnimation" transitionAppear={true}
                                     transitionAppearTimeout={1500}
                                     transitionEnter={false} transitionLeave={false}>
                <HeaderLogo/>
                <PerfectScrollbar>
                    <div className="app-sidebar__inner">
                        <Nav/>
                    </div>
                </PerfectScrollbar>
                <div
                    className={cx('app-sidebar-bg', backgroundImageOpacity)}
                    style={{
                        backgroundImage: enableBackgroundImage ? 'url(' + backgroundImage + ')' : null
                    }}
                />
            </ReactCSSTransitionGroup>
        </Fragment>
    )
}

const mapStateToProps = ({ThemeOptions}) => ({
    enableBackgroundImage: ThemeOptions.enableBackgroundImage,
    enableSidebarShadow: ThemeOptions.enableSidebarShadow,
    enableMobileMenu: ThemeOptions.enableMobileMenu,
    backgroundColor: ThemeOptions.backgroundColor,
    backgroundImage: ThemeOptions.backgroundImage,
    backgroundImageOpacity: ThemeOptions.backgroundImageOpacity
})

const mapDispatchToProps = dispatch => ({
    setEnableMobileMenu: enable => dispatch(setEnableMobileMenu(enable))
})

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar)
