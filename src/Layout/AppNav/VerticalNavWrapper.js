import React, {Fragment, useState, useEffect, useLayoutEffect} from 'react'
import {withRouter} from 'react-router-dom'
import MetisMenu from 'react-metismenu'

import {decodeToken} from "../../utils/scripts"
import {useAuth} from '../../Context'
import {
    AdminNav
} from './navItems'

Array.prototype.uniqueObject = function (element) {
    return [...new Set(this.map(item => item[element]))]
}

Array.prototype.orderByString = function () {
    return this.sort((a, b) => a.localeCompare(b))
}

Array.prototype.unique = function (a) {
    return function () {
        return this.filter(a)
    }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
})

const Nav = () => {
        const {auth} = useAuth()
        const {role_id} = decodeToken(auth.authentication)
        const [navAdmin, setNavAdmin] = useState(AdminNav)

        useEffect(() => {
            if (role_id !== 'ea7e35be-220b-11ec-bdf8-13a4a75f3041') setNavAdmin(AdminNav.filter(element => element.id !== 'NAD004'))
        }, [role_id])

        return (
            <Fragment>
                {/*ADMINISTRADORES (EXCLUSIVAMENTE)*/}
                {
                    decodeToken(auth.authentication) ? (
                        <Fragment>
                            <h5 className={`app-sidebar__heading`}>ADMINISTRADOR</h5>
                            <MetisMenu content={navAdmin} activeLinkFromLocation className="vertical-nav-menu"
                                       iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/>
                        </Fragment>
                    ) : (<></>)
                }
            </Fragment>
        )
    },
    getId = (ids, id) => {
        ids.push(id)
        id.lastIndexOf('-')
        const found = id.lastIndexOf('-')
        if (found > -1)
            getId(ids, id.substring(0, found))

        return ids
    },
    myNav = (navs, myServices) => {
        let myIds = []
        for (const myId of myServices) {
            const newNav = navs.find(({id}) => myId === id)
            if (newNav) myIds.push(newNav)
        }
        myIds = myIds.uniqueObject('id')
        let ids = []
        for (const id of myIds)
            ids = ids.concat(getId([], id))
        ids = ids.unique()
        // ids.orderByString()
        const myNavs = []
        for (const id2 of ids) {
            const newNav = navs.find(({id}) => id2 === id)
            if (newNav) myNavs.push(newNav)
        }
        return myNavs
    }

export default withRouter(Nav)
