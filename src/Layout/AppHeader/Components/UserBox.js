import React, {Fragment} from 'react'
import {DropdownToggle, DropdownMenu, Nav, Button, NavItem, UncontrolledButtonDropdown} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faPlayCircle, faPowerOff, faStream, faUserCircle} from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom'

import {useAuth} from '../../../Context'
import {decodeToken} from '../../../utils/scripts'

import avatar from '../../../assets/utils/images/avatars/avatar.png'
import city3 from '../../../assets/utils/images/dropdown-header/city3.jpg'

const UserBox = () => {
    const {auth, setAuth} = useAuth()

    const {authentication} = auth
    const {sub, email} = decodeToken(authentication)

    return (
        <Fragment>
            <div className="header-btn-lg pr-0">
                <div className="widget-content p-0">
                    <div className="widget-content-wrapper">
                        <div className="widget-content-left">
                            <UncontrolledButtonDropdown>
                                <DropdownToggle color="link" className="p-0">
                                    <img width={42} className="rounded-circle" src={avatar} alt="Avatar"/>
                                    <FontAwesomeIcon className="ml-2 opacity-8" icon={faAngleDown}/>
                                </DropdownToggle>
                                <DropdownMenu right className="rm-pointers dropdown-menu-lg">
                                    <div className="widget-content-left ml-3 header-user-info">
                                        <div className="widget-heading">{sub}</div>
                                        <div className="widget-subheading opacity-9">{email}</div>
                                    </div>
                                    <Nav vertical>
                                        <NavItem className="nav-item-divider"/>
                                        <NavItem className="nav-item-btn text-center pt-0 pb-0">
                                            <Button className="btn-pill btn-shadow btn-shine" color="danger"
                                                    onClick={() => {
                                                        localStorage.setItem('Auth', JSON.stringify({}))
                                                        window.location.href = '/'
                                                    }}>
                                                <FontAwesomeIcon icon={faPowerOff}/> Cerrar Sesión
                                            </Button>
                                        </NavItem>
                                    </Nav>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default UserBox
