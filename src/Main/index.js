import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import cx from 'classnames'
import {withRouter} from 'react-router-dom'
import ResizeDetector from 'react-resize-detector'

import AppMain from '../Layout/AppMain'

const Main = ({
                  colorScheme, enableFixedHeader, enableFixedSidebar, enableFixedFooter, enableClosedSidebar,
                  closedSmallerSidebar, enableMobileMenu, enablePageTabsAlt, history, match
              }) => {

    return (
        <ResizeDetector handleWidth render={({width}) => (
            <Fragment>
                <div className={cx(
                    "app-container app-theme-" + colorScheme,
                    {'fixed-header': enableFixedHeader},
                    {'fixed-sidebar': enableFixedSidebar || width < 1250},
                    {'fixed-footer': enableFixedFooter},
                    {'closed-sidebar': enableClosedSidebar || width < 1250},
                    {'closed-sidebar-mobile': closedSmallerSidebar || width < 1250},
                    {'sidebar-mobile-open': enableMobileMenu},
                    {'body-tabs-shadow-btn': enablePageTabsAlt},
                )}>
                    <AppMain {...{history, match}}/>
                </div>
            </Fragment>
        )}
        />
    )
}

const mapStateToProp = ({ThemeOptions}) => ({
    colorScheme: ThemeOptions.colorScheme,
    enableFixedHeader: ThemeOptions.enableFixedHeader,
    enableMobileMenu: ThemeOptions.enableMobileMenu,
    enableFixedFooter: ThemeOptions.enableFixedFooter,
    enableFixedSidebar: ThemeOptions.enableFixedSidebar,
    enableClosedSidebar: ThemeOptions.enableClosedSidebar,
    enablePageTabsAlt: ThemeOptions.enablePageTabsAlt,
})

export default withRouter(connect(mapStateToProp)(Main))