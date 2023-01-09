import React from 'react'
import {connect} from 'react-redux'
import cx from 'classnames'
import {Breadcrumb, BreadcrumbItem} from "reactstrap"
import {Link} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHome} from "@fortawesome/free-solid-svg-icons"

const PageTitle = ({enablePageTitleIcon, enablePageTitleSubheading, heading, icon, subheading, menus}) => {

    return (
        <div className="app-page-title pt-1 pb-1 pr-3 pl-3 mb-0">
            <div className="page-title-wrapper">
                <div className="page-title-heading">
                    <div
                        className={cx("page-title-icon", {'d-none': !enablePageTitleIcon})}>
                        <FontAwesomeIcon icon={icon} className="text-primary"/>
                    </div>
                    <div>
                        <span className="text-primary">{heading}</span>
                        <div
                            className={cx("page-title-subheading", {'d-none': !enablePageTitleSubheading}, 'opacity-9')}>
                            {subheading}
                        </div>
                    </div>
                </div>
                <div className="page-title-actions">
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <Link to={'/home'}>
                                <FontAwesomeIcon icon={faHome}/>
                            </Link>
                        </BreadcrumbItem>
                        {
                            menus.map(({to, name}, index) => {
                                const active = index === menus.length - 1
                                return (
                                    <BreadcrumbItem key={index}>
                                        <Link to={to} style={{
                                            pointerEvents: active ? 'none' : '',
                                            color: active ? '#000' : '#0d4a83'
                                        }}>{name}</Link>
                                    </BreadcrumbItem>
                                )
                            })
                        }
                    </Breadcrumb>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ThemeOptions}) => ({
    enablePageTitleIcon: ThemeOptions.enablePageTitleIcon,
    enablePageTitleSubheading: ThemeOptions.enablePageTitleSubheading,
})

const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PageTitle)