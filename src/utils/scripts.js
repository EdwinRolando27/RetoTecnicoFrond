import React from "react"
import moment from 'moment'
import jwt from 'jsonwebtoken'

import {ALFABETO} from "./constantes"

const navbar = require('../Layout/AppNav/navItems')

require('dotenv').config()

const download2 = (data, strFileName, strMimeType) => {
    let self = window, // this script is only for browsers anyway...
        defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
        mimeType = strMimeType || defaultMime,
        payload = data,
        url = !strFileName && !strMimeType && payload,
        anchor = document.createElement("a"),
        toString = function (a) {
            return String(a)
        },
        myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
        fileName = strFileName || "download",
        blob,
        reader
    myBlob = myBlob.call ? myBlob.bind(self) : Blob

    if (String(this) === "true") { //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
        payload = [payload, mimeType]
        mimeType = payload[0]
        payload = payload[1]
    }

    if (url && url.length < 2048) { // if no filename and no mime, assume a url was passed as the only argument
        fileName = url.split("/").pop().split("?")[0]
        anchor.href = url // assign href prop to temp anchor
        if (anchor.href.indexOf(url) !== -1) { // if the browser determines that it's a potentially valid url path:
            let ajax = new XMLHttpRequest()
            ajax.open("GET", url, true)
            ajax.responseType = 'blob'
            ajax.onload = function (e) {
                download2(e.target.response, fileName, defaultMime)
            }
            setTimeout(function () {
                ajax.send()
            }, 0) // allows setting custom ajax headers using the return:
            return ajax
        } // end if valid url?
    } // end if url?

    //go ahead and download dataURLs right away
    if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {
        if (payload.length > (1024 * 1024 * 1.999) && myBlob !== toString) {
            payload = dataUrlToBlob(payload)
            mimeType = payload.type || defaultMime
        } else
            return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
                navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
                saver(payload) // everyone else can save dataURLs un-processed
    }//end if dataURL passed?

    blob = payload instanceof myBlob ? payload : new myBlob([payload], {type: mimeType})

    function dataUrlToBlob(strUrl) {
        let parts = strUrl.split(/[:;,]/),
            type = parts[1],
            decoder = parts[2] === "base64" ? atob : decodeURIComponent,
            binData = decoder(parts.pop()),
            mx = binData.length,
            i = 0,
            uiArr = new Uint8Array(mx)

        for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i)

        return new myBlob([uiArr], {type: type})
    }

    function saver(url, winMode) {
        if ('download' in anchor) { //html5 A[download]
            anchor.href = url
            anchor.setAttribute("download", fileName)
            anchor.className = "download-js-link"
            anchor.innerHTML = "downloading..."
            anchor.style.display = "none"
            document.body.appendChild(anchor)
            setTimeout(function () {
                anchor.click()
                document.body.removeChild(anchor)
                if (winMode)
                    setTimeout(function () {
                        self.URL.revokeObjectURL(anchor.href)
                    }, 250)
            }, 66)

            return true
        }

        // handle non-a[download] safari as best we can:
        if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
            url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime)
            if (!window.open(url)) { // popup blocked, offer direct download:
                if (window.confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page."))
                    window.location.href = url
            }

            return true
        }

        //do iframe dataURL download (old ch+FF):
        let f = document.createElement("iframe")
        document.body.appendChild(f)

        if (!winMode) // force a mime that will download:
            url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime)

        f.src = url
        setTimeout(function () {
            document.body.removeChild(f)
        }, 333)
    }//end saver

    if (navigator.msSaveBlob) // IE10+ : (has Blob, but not a[download] or URL)
        return navigator.msSaveBlob(blob, fileName)

    if (self.URL) // simple fast and modern way using Blob and URL:
        saver(self.URL.createObjectURL(blob), true)
    else {
        // handle non-Blob()+non-URL browsers:
        if (typeof blob === "string" || blob.constructor === toString)
            try {
                return saver("data:" + mimeType + ";base64," + self.btoa(blob))
            } catch (y) {
                return saver("data:" + mimeType + "," + encodeURIComponent(blob))
            }

        // Blob but not URL support:
        reader = new FileReader()
        reader.onload = function (e) {
            saver(this.result)
        }
        reader.readAsDataURL(blob)
    }

    return true
}

export const date = (date = null) => date ? moment(date, 'YYYY-MM-DD').utcOffset('-0500').format('DD/MM/YYYY') : moment().format('YYYY-MM-DD')
export const dateTimeS = (date) => String(moment(date).format()).substr(0, 16)
export const timestamp = () => moment().utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
export const dateTime = dateTime => moment(dateTime).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
export const dateTimeP = dateTime => moment(dateTime).utcOffset('-0500').format('LT')
export const dateTimeT = dateTimeValue => dateTime(dateTimeValue).replace(' ', 'T').substring(0, 16)
export const dateTimeUTC = dateTimeValue => (dateTimeValue ? dateTimeValue.replace('T', ' ').substring(0, 19) : '')
export const uploadImg = (file, type, {authentication}, name = null, isDrive = false) => {
    const formData = new FormData()
    formData.append('img', file)
    formData.append('type', type)
    formData.append('name', name ? name.toString().split('.')[0] : null)

    return fetch(!isDrive ? `${process.env.REACT_APP_API_ECOCONT}/upload` : `${process.env.REACT_APP_API_ECOCONT}/uploadDrive`, {
        method: 'POST',
        headers: {
            authentication: `Bearer ${authentication}`
        },
        body: formData
    })
}

export const downloadPdf = async (param, {authentication}) => {
    return fetch(`${process.env.REACT_APP_API_ECOCONT}/download?${param}`, {
        method: 'GET',
        headers: {
            authentication: `Bearer ${authentication}`
        }
    })
}
export const downloadPdfConteiner = async (param) => {
    return fetch(`${param}`, {
        method: 'GET',
        headers: {
            authentication: `Bearer `
        }
    })
}
export const whatsapp = async (file, phone, {authentication}) => {
    return fetch(`${process.env.REACT_APP_API_ECOCONT}/whatsapp`, {
        method: 'POST',
        headers: {
            authentication: `Bearer ${authentication}`
        },
        body: {
            file,
            phone
        }
    })
}
export const myToFixed = (number, decimals = 2) => {
    // const rounding = Math.round((parseFloat(number) + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals)
    let usarComa = false
    const opciones = {maximumFractionDigits: decimals, useGrouping: false}
    usarComa = usarComa ? 'es' : 'en'
    const rounding = new Intl.NumberFormat(usarComa, opciones).format(number)
    return Number(rounding).toFixed(decimals)
}
export const download = ({file, name}) => {
    let x = new XMLHttpRequest()
    file = file.includes('.txt') || file.includes('.TXT') ? file : `${file}.txt`
    x.open('GET', `${process.env.REACT_APP_API_ECOCONT}/storage/txt/${file}`, true)
    x.responseType = 'blob'
    x.onload = function (e) {
        name = name.includes('.txt') || name.includes('.TXT') ? name : `${name}.TXT`
        download2(x.response, name, 'text/plain')
    }
    x.send()
}

export const downloadAPP = ({file, name}) => {
    let x = new XMLHttpRequest()
    x.open('GET', `${process.env.REACT_APP_API_APPAPI}/txt/${file}.txt`, true)
    x.responseType = 'blob'
    x.onload = function (e) {
        download2(x.response, `${name}.TXT`, 'text/plain')
    }
    x.send()
}

export const decodeToken = auth => jwt.decode(auth)
export const Permission = (permit, html) => {
    return permit ? (html) : (<></>)
}
export const getNavId = () => {
    const _auth = JSON.parse(localStorage.getItem('Auth')).authorization,
        permits = decodeToken(_auth) ? decodeToken(_auth).permissions : []

    let path = '/fac/facturador', tag = [], id = ''
    for (let temp in navbar)
        tag.push(temp)
    tag.map(item => navbar[item].map(ite => ite.to === path ? id = ite.id : ''))
    const permit = permits.find(item => item.id === id)
    return permit ? permit : {}
}
export const verifyJwt = (token) => {
    let unix = (jwt.decode(token)).exp,
        verify = moment.unix(unix).format("DD-MM-YYYY hh:mm")
    return !moment(verify).isAfter(moment().format('DD-MM-YYYY hh:mm'))
}
export const isToken = (tab = '', urlId = null) => {
    let a = JSON.parse(localStorage.getItem('Auth')).authorization
    const {id} = getNavId(decodeToken(a) ? decodeToken(a).permissions : [])
    const {pathname} = window.location

    return jwt.sign({
        sub: 'smartb',
        id: urlId ? urlId : id,
        pathname: (pathname).toLowerCase(),
        tab
    }, process.env.REACT_APP_AUTH_JWT_SECRET, {expiresIn: "10s"})
}
export const fileToBase64 = (filename, filepath) => {
    return new Promise(resolve => {
        let file = new File([filename], filepath)
        let reader = new FileReader()
        // Read file content on file loaded event
        reader.onload = event => {
            resolve(event.target.result)
        }
        reader.onerror = error => {
            console.log('Error: ', error)
        }
        // Convert data to base64
        reader.readAsDataURL(file)
    })
}
export const utilvalidarDni = dni => {
    if (dni === null) return {success: false, mensaje: 'Ingrese el número de DNI'}

    if (dni.length !== 8) return {success: false, mensaje: 'Ha ingresado un DNI con menos de 8 digitos'}

    if (!/^([0-9])*$/.test(dni)) return {success: false, mensaje: 'Ha ingresado letras'}

    return {success: true, mensaje: "Ok"}
}
export const validateE_empresa = (empresa, type) => {
    if (empresa[`ruc${type}`] === undefined || empresa[`ruc${type}`] === '')
        return {status: false, message: 'Ingrese el RUC de la Empresa'}
    if (empresa[`periodo${type}`] === undefined || empresa[`periodo${type}`] === '')
        return {status: false, message: 'Ingrese el Periodo'}
    if (empresa[`operacion${type}`] === undefined || empresa[`operacion${type}`] === '')
        return {status: false, message: 'Ingrese el Indicador de Operaciones'}
    if (typeof empresa[`contenido${type}`] !== 'boolean')
        return {status: false, message: 'Ingrese el Indicador de Contenido'}

    return {status: true, message: 'Ok'}
}
export const utilvalidarRuc = ruc => {
    ruc = ruc.trim()

    if (ruc === null) return {success: false, mensaje: 'Ingrese el número de RUC'}

    if (ruc.length !== 11) return {success: false, mensaje: 'Ha ingresado un RUC con menos de 11 digitos'}

    if (!/^([0-9])*$/.test(ruc)) return {success: false, mensaje: 'Ha ingresado un RUC con letras'}

    if (!((ruc >= 1e10 && ruc < 11e9) || (ruc >= 15e9 && ruc < 18e9) || (ruc >= 2e10 && ruc < 21e9))) return {
        success: false, mensaje: 'RUC no válido!'
    }

    let ultimo = ruc.substring(10, 11)
    let suma = 0
    const factores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
    factores.forEach((valor, index) => suma += (Number(ruc.substring(index, index + 1)) * valor))

    let di = Math.trunc(suma / 11)
    let resultado = 11 - (Number(suma) - Number(di) * 11)

    if (resultado === 10) resultado = 0
    if (resultado === 11) resultado = 1

    return Number(ultimo) === resultado ? {success: true, mensaje: 'Ok'} : {success: false, mensaje: 'RUC no válido!'}
}
export const myDate = value => value ? moment(value).utcOffset('-0500').format('YYYY-MM-DD') : ''
export const strRandom = length => Array(length).join().split(',').map(() => ALFABETO.charAt(Math.floor(Math.random() * ALFABETO.length))).join('')
export const myFormatNumber = (number, withCeros = false, digits = 2) => {
    number = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: digits, maximumFractionDigits: digits
    }).format(number ? number : 0)

    return withCeros ? number : (number !== '0.'.padEnd(digits + 2, '0') ? number : '')
}
export const timeComputableG = (code, finigreso, tipo, periode, fcese, isVaca, faltas = 0) => {
    let mcomp = 0, dcomp = 0, t_transc = 0,
        ffinperiodo = tipo === 4 ? fcese : tipo === 1 ? String(periode) + '-06-30' : (String(periode) + '-12-31'),
        finicioperiode = (ffinperiodo.split('-')[0] === finigreso.split('-')[0] ? finigreso : (moment(finigreso) > moment(ffinperiodo) ? ('0-0-0') : (tipo === 1 ? (ffinperiodo.split('-')[0] + '-01-01') : (tipo === 2 ? (ffinperiodo.split('-')[0] + '-07-01') : fcese))))

    switch (tipo) {
        case 1:
            if (finicioperiode.split('-')[1] + '-' + finicioperiode.split('-')[2] === '01-01') {
                mcomp = 6
                dcomp = ((finicioperiode.split('-')[1] % 4 === 0) && (finicioperiode.split('-')[1] % 100 !== 0) || finicioperiode.split('-')[1] === 0) ? 181 : 180
            } else {
                if (moment(ffinperiodo) > moment(finigreso)) {
                    mcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).subtract(1, 'days')), 'months'))
                    dcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'days'))
                }
            }
            break

        case 2:
            if (Number(finicioperiode.split('-')[1]) < 7) {
                finicioperiode = ffinperiodo.split('-')[0] + '-07-01'
            }
            if (finicioperiode.split('-')[1] + '-' + finicioperiode.split('-')[2] === '07-01') {
                mcomp = 6
                dcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'days'))
            } else {
                if (moment(ffinperiodo) > moment(finigreso)) {
                    mcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'months'))
                    dcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'days'))
                }
            }
            break

        case 3:
            if (fcese.split('-')[0] !== finigreso.split('-')[0]) {
                if (Number(fcese.split('-')[1]) >= 7) {
                    mcomp = Math.abs(moment(fcese).add(1, 'days').diff(moment(fcese.split('-')[0] + '-07-01'), 'months'))
                    dcomp = Math.abs(moment(fcese).add(1, 'days').diff(moment(fcese.split('-')[0] + '-07-01'), 'days'))
                } else {
                    mcomp = Math.abs(moment(fcese).add(1, 'days').diff(moment(fcese.split('-')[0] + '-01-01'), 'months'))
                    dcomp = Math.abs(moment(fcese).add(1, 'days').diff(moment(fcese.split('-')[0] + '-01-01'), 'days'))
                }
            } else {
                mcomp = Math.abs(moment(fcese).add(1, 'days').diff(moment(finigreso), 'months'))
                dcomp = Math.abs(moment(fcese).add(1, 'days').diff(moment(finigreso), 'days'))
            }
            break
        // case 4 es para liquidaciones
        case 4:
            let mes_cese = Number(moment(fcese).format('MM'))
            switch (mes_cese) {
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                    let periode1 = periode + '-07-01'
                    finicioperiode = periode1 < finigreso ? finigreso : periode1
                    break
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    let periode2 = periode + '-01-01'
                    finicioperiode = periode2 < finigreso ? finigreso : periode2
                    break

            }
            ffinperiodo = moment(ffinperiodo).subtract(faltas, 'days').format('YYYY-MM-DD')
            if (isVaca) {
                let periodoA = moment(periode).format('YYYY')
                let ingreso = moment(finigreso).format('YYYY')
                if (Number(periodoA) > Number(ingreso)) {
                    let n = Number(periodoA) - Number(ingreso)
                    finicioperiode = moment(finigreso).add((n - 1), 'years').format('YYYY-MM-DD')
                }
                mcomp = Math.abs(moment(ffinperiodo).add(1, 'days').diff(moment(finicioperiode), 'months'))
                if (mcomp > 0) {
                    const month_init = moment(finicioperiode).format('YYYY-MM')
                    const monthFin = moment(ffinperiodo).format('YYYY-MM')
                    let dias = 0
                    if (moment(finicioperiode).format('DD') !== moment(ffinperiodo).format('DD')) {
                        if (moment(finicioperiode).format('DD') > moment(ffinperiodo).format('DD')) {
                            if (moment(month_init, 'YYYY-MM').startOf('month').format('YYYY-MM-DD') !== moment(finicioperiode).format('YYYY-MM-DD')) {
                                dias += Number(moment(moment(month_init, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')).diff(finicioperiode, 'days'))
                            }
                            if (moment(monthFin, 'YYYY-MM').endOf('month').format('YYYY-MM-DD') !== moment(ffinperiodo).format('YYYY-MM-DD')) {
                                dias += Number(moment(ffinperiodo).format('DD'))
                            }
                        } else {
                            dias = moment(ffinperiodo).add(1, "days").format('DD') - moment(finicioperiode).format('DD')
                        }
                        dcomp = dias
                    }
                } else {
                    dcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'days'))
                }
                t_transc = Math.abs(moment(ffinperiodo).add(1, 'days').diff(moment(finicioperiode), 'days'))
            } else {
                mcomp = Math.abs(moment(ffinperiodo).add(1, 'days').diff(moment(finicioperiode), 'months'))
                if (mcomp > 0) {
                    let pcInit = '', pcFin = ''
                    if (moment(finicioperiode).startOf('months').format('YYYY-MM-DD') !== moment(finicioperiode).format('YYYY-MM-DD')) pcInit = moment(finicioperiode).add(1, 'months').format('YYYY-MM')
                    else pcInit = moment(finicioperiode).format('YYYY-MM')

                    if (moment(ffinperiodo).endOf('months').format('YYYY-MM-DD') !== moment(ffinperiodo).format('YYYY-MM-DD')) {
                        pcFin = moment(ffinperiodo).subtract(1, 'months').format('YYYY-MM')
                    } else {
                        pcFin = moment(ffinperiodo).format('YYYY-MM')
                    }
                    mcomp = moment(moment(pcFin, 'YYYY-MM').add(1, 'month')).diff(moment(pcInit, 'YYYY-MM'), 'months')
                    t_transc = moment(moment(pcFin, 'YYYY-MM').add(1, 'month')).diff(moment(pcInit, 'YYYY-MM'), 'days')
                } else t_transc = 0
            }
            break
    }
    return fcese ? (
        {
            'Tipo': tipo,
            'Codigo': code,
            'Fecha_Ingreso': moment(finigreso).format('DD-MM-YYYY'),
            'ingreso': moment(finicioperiode).format('DD-MM-YYYY'),
            'final': fcese ? moment(fcese).format('DD-MM-YYYY') : moment(ffinperiodo).format('DD-MM-YYYY'),
            'mes': mcomp,
            'dia': dcomp,
            'transc': t_transc
        }
    ) : (
        {
            'Tipo': tipo,
            'Codigo': code,
            'Fecha_Ingreso': finigreso,
            'Incio_Periodo': finicioperiode,
            'FinPeriodo': fcese ? fcese : ffinperiodo,
            'Meses': mcomp,
            'Dias': dcomp,
        }
    )
}

export const timeComputableC = (code, finigreso, tipo, periode, fcese, faltas = 0) => {
    tipo = tipo === 3 ? 3 : tipo ? tipo : (finigreso.split('-')[1] <= 4) ? 1 : 2
    let mcomp = 0, dcomp = 0, t_transc = 0,
        ffinperiodo = tipo === 3 ? fcese : tipo === 1 ? String(periode) + '-04-30' : (String(periode) + '-10-31'),
        finicioperiode = Number(periode) - Number(finigreso.split('-')[0]) === 1 ? finigreso : Number(periode) >= Number(finigreso.split('-')[0]) ? (tipo === 1 ? (periode - 1) + '-11-01' : periode + '-05-01') : '0-0-0'
    switch (tipo) {
        case 1:
            if (Number(finigreso.split('-')[0]) < Number(periode)) {
                finicioperiode = `${periode - 1}-11-01`
            } else {
                finicioperiode = (ffinperiodo.split('-')[0] === finigreso.split('-')[0] ? finigreso : (moment(finigreso) > moment(ffinperiodo) ? ('0-0-0') : (tipo === 1 ? (ffinperiodo.split('-')[0] + '-11-01') : (tipo === 2 ? (ffinperiodo.split('-')[0] + '-05-01') : fcese))))
            }
            if (finicioperiode.split('-')[1] + '-' + finicioperiode.split('-')[2] === '11-01') {
                mcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'months'))
                dcomp = ((finicioperiode.split('-')[1] % 4 === 0) && (finicioperiode.split('-')[1] % 100 !== 0) || finicioperiode.split('-')[1] === 0) ? 181 : 180
            } else {
                if (moment(ffinperiodo) > moment(finigreso)) {
                    mcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'months'))
                    dcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'days'))
                }
            }
            break

        case 2:
            if (Number(finigreso.split('-')[0]) <= Number(periode)) {
                finicioperiode = `${periode}-05-01`
            } else {
                finicioperiode = (ffinperiodo.split('-')[0] === finigreso.split('-')[0] ? finigreso : (moment(finigreso) > moment(ffinperiodo) ? ('0-0-0') : (tipo === 1 ? (ffinperiodo.split('-')[0] + '-11-01') : (tipo === 2 ? (ffinperiodo.split('-')[0] + '-05-01') : fcese))))
            }
            if (finicioperiode.split('-')[1] + '-' + finicioperiode.split('-')[2] === '-05-01') {
                mcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'months'))
                dcomp = ((finicioperiode.split('-')[1] % 4 === 0) && (finicioperiode.split('-')[1] % 100 !== 0) || finicioperiode.split('-')[1] === 0) ? 181 : 180
            } else {
                if (moment(ffinperiodo) > moment(finigreso)) {
                    mcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'months'))
                    dcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'days'))
                }
            }
            break
        case 3:
            let mes_cese = Number(moment(fcese).format('MM'))
            switch (mes_cese) {
                case 10:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    let periode1 = periode + '-05-01'
                    finicioperiode = periode1 < finigreso ? finigreso : periode1
                    break
                case 1:
                case 2:
                case 3:
                case 4:
                    let periode2 = Number(periode) - 1 + '-11-01'
                    finicioperiode = periode2 < finigreso ? finigreso : periode2
                    break
                case 11:
                case 12:
                    let periode3 = periode + '-11-01'
                    finicioperiode = periode3 < finigreso ? finigreso : periode3
                    break
            }
            ffinperiodo = moment(ffinperiodo).subtract(faltas, 'days').format('YYYY-MM-DD')
            mcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'months'))
            if (mcomp > 0) {
                const month_init = moment(finicioperiode).format('YYYY-MM')
                const monthFin = moment(ffinperiodo).format('YYYY-MM')
                let dias = 0
                if (moment(finicioperiode).format('DD') !== moment(ffinperiodo).format('DD')) {
                    if (moment(finicioperiode).format('DD') > moment(ffinperiodo).format('DD')) {
                        if (moment(month_init, 'YYYY-MM').startOf('month').format('YYYY-MM-DD') !== moment(finicioperiode).format('YYYY-MM-DD')) {
                            dias += Number(moment(moment(month_init, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')).diff(finicioperiode, 'days'))
                        }
                        if (moment(monthFin, 'YYYY-MM').endOf('month').format('YYYY-MM-DD') !== moment(ffinperiodo).format('YYYY-MM-DD')) {
                            dias += Number(moment(ffinperiodo).format('DD'))
                        }
                    } else {
                        dias = moment(ffinperiodo).add(1, "days").format('DD') - moment(finicioperiode).format('DD')
                    }
                    dcomp = dias
                }

            } else {
                dcomp = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'days'))
            }
            t_transc = Math.abs(moment(finicioperiode).diff(moment(moment(ffinperiodo).add(1, 'days')), 'days'))

            break
    }

    return fcese ? (
        {
            'Tipo': tipo,
            'Codigo': code,
            'Fecha_ingreso': finigreso,
            'ingreso': finicioperiode,
            'final': fcese ? fcese : ffinperiodo,
            'mes': mcomp,
            'dia': dcomp,
            'transc': t_transc
        }
    ) : (
        {
            'Tipo': tipo,
            'Codigo': code,
            'Fecha_Ingreso': finigreso,
            'Incio_Periodo': finicioperiode,
            'FinPeriodo': fcese ? fcese : ffinperiodo,
            'Meses': mcomp,
            'Dias': dcomp,
        }
    )
}

export const timeCts = (inicio, periodo, restar = 0) => {
    if (!inicio || isNaN(new Date(inicio))) return

    let dateNac = new Date(inicio)
    periodo = new Date(periodo)

    if (periodo - dateNac < 0)
        return {
            transc: moment(moment(periodo, 'MM/DD/YYYY')).diff(moment(inicio, 'MM/DD/YYYY'), 'days'),
            ingreso: moment(inicio, 'MM/DD/YYYY').format('DD-MM-YYYY'),
            final: moment(periodo, 'MM/DD/YYYY').subtract(1, 'days').format('DD-MM-YYYY'),
            anual: 0,
            mes: 0,
            dia: moment(moment(periodo).endOf('month')).diff(moment(inicio).add(-1, 'days'), 'days')
        }


    let dias = periodo.getUTCDate() - dateNac.getUTCDate(),
        meses = periodo.getUTCMonth() - dateNac.getUTCMonth(),
        years = periodo.getUTCFullYear() - dateNac.getUTCFullYear()

    if (dias < 0) {
        meses--
        dias = 30 + dias
    }

    if (meses < 0) {
        years--
        meses = 12 + meses
    }

    if (restar && meses < 7 && years <= 0) {
        return timeCts(new Date(moment(inicio, 'MM/DD/YYYY').add(restar, 'days').format('MM/DD/YYYY')), moment(periodo).format('MM/DD/YYYY'))
    }

    if (meses > 6) {
        let time = moment(periodo).format('YYYY-MM')
        if (Number(time.split('-')[1]) <= 5) {
            inicio = moment(`11-01-${time.split('-')[0]}`, 'MM-DD-YYYY').subtract(1, 'years').add(restar, 'days').format('MM/DD/YYYY')
        } else {
            inicio = moment(`05-01-${time.split('-')[0]}`, 'MM-DD-YYYY').add(restar, 'days').format('MM/DD/YYYY')
        }
        return timeCts(inicio, periodo)
    }

    if (years > 0) {
        let time = moment(periodo).format('YYYY-MM')
        if (Number(time.split('-')[1]) <= 5) {
            inicio = moment(`11-01-${time.split('-')[0]}`, 'MM-DD-YYYY').subtract(1, 'years').add(restar, 'days').format('MM/DD/YYYY')
        } else {
            inicio = moment(`05-01-${time.split('-')[0]}`, 'MM-DD-YYYY').add(restar, 'days').format('MM/DD/YYYY')
        }
        return timeCts(inicio, periodo)
    }

    return {
        transc: moment(periodo, 'MM/DD/YYYY').diff(moment(inicio, 'MM/DD/YYYY'), 'days'),
        ingreso: moment(inicio, 'MM/DD/YYYY').format('DD-MM-YYYY'),
        final: moment(periodo, 'MM/DD/YYYY').subtract(1, 'days').format('DD-MM-YYYY'),
        anual: years,
        mes: meses,
        dia: dias
    }
}

export const timeGrati = (inicio, periodo, restar = 0) => {
    if (!inicio || isNaN(new Date(inicio))) return

    let dateNac = new Date(inicio)
    periodo = new Date(periodo)

    if (periodo - dateNac < 0)
        return {
            transc: moment(moment(periodo, 'MM/DD/YYYY')).diff(moment(inicio, 'MM/DD/YYYY'), 'days'),
            ingreso: moment(inicio, 'MM/DD/YYYY').format('DD-MM-YYYY'),
            final: moment(periodo, 'MM/DD/YYYY').subtract(1, 'days').format('DD-MM-YYYY'),
            anual: 0,
            mes: 0,
            dia: moment(moment(periodo).endOf('month')).diff(moment(inicio).add(-1, 'days'), 'days')
        }


    let dias = periodo.getUTCDate() - dateNac.getUTCDate(),
        meses = periodo.getUTCMonth() - dateNac.getUTCMonth(),
        years = periodo.getUTCFullYear() - dateNac.getUTCFullYear()
    if (dias < 0) {
        meses--
        dias = 30 + dias
    }

    if (meses < 0) {
        years--
        meses = 12 + meses
    }

    if (years === 1 && meses === 0 && dias === 0) {
        years = 2
    }

    if (years >= 1) {
        let year = moment(periodo).format('YYYY'),
            month = moment(periodo).format('MM')

        if (!(Number(month) <= 6))
            return timeCts(`01/01/${year}`, periodo)

        return timeCts(`07/01/${year - 1}`, periodo)
    }

    if (restar && meses < 7 && years <= 0) {
        return timeGrati(new Date(moment(inicio, 'MM/DD/YYYY').add(restar, 'days').format('MM/DD/YYYY')), moment(periodo).format('MM/DD/YYYY'))
    }

    if (meses > 6) {
        let time = moment(periodo).format('YYYY-MM')
        if (Number(time.split('-')[1]) <= 6) {
            inicio = `01/01/${moment(periodo).format('YYYY')}`
        } else {
            inicio = `07/01/${moment(periodo).format('YYYY') - 1}`
        }
        return timeGrati(inicio, moment(periodo).format('MM/DD/YYYY'))
    }
    return {
        transc: moment(moment(periodo, 'MM/DD/YYYY')).diff(moment(inicio, 'MM/DD/YYYY'), 'days'),
        ingreso: moment(inicio, 'MM/DD/YYYY').format('DD-MM-YYYY'),
        final: moment(periodo, 'MM/DD/YYYY').subtract(1, 'days').format('DD-MM-YYYY'),
        anual: years,
        mes: meses,
        dia: dias
    }
}
export const timepoAtipico = async (work, slepp, init, periode, work_sleep = true, time_atipico = null, data = []) => {
    let dia = ''
    const dia_final = Number(moment(periode, 'MM-YYYY').endOf('month').format('DD'))
    const fecha_final = moment(periode, 'MM-YYYY').endOf('month').format('DD-MM-YYYY')
    let day_continue = ''
    let time_add = 0
    let condicion_continuar = true
    if (work_sleep) {
        time_add = time_atipico ? time_atipico : work
        const day_init = Number(moment(init, 'DD-MM-YYYY').format('DD'))
        day_continue = moment(init, 'DD-MM-YYYY').add(time_add, 'd').format('DD-MM-YYYY')
        condicion_continuar = (moment(fecha_final, 'DD-MM-YYYY') >= moment(day_continue, 'DD-MM-YYYY'))
        const day_final = !condicion_continuar ? dia_final : Number(moment(day_continue, 'DD-MM-YYYY').format('DD'))
        for (let a = (day_init); a < (day_final + (!condicion_continuar ? 1 : 0)); a++) {
            dia = moment(`${a}-${periode}`, 'DD-MM-YYYY').format('DD-MM-YYYY')
            data.push({periodo: dia, tipo: 'TRABAJA'})
        }
        if (condicion_continuar) return await timepoAtipico(work, slepp, day_continue, periode, !work_sleep, null, data)
        else {
            let trabajo = 0
            if (moment(day_continue, 'DD-MM-YYYY').diff(moment(fecha_final, 'DD-MM-YYYY').add(1, 'd'), 'days') > 0) {
                trabajo = Number(moment(day_continue, 'DD-MM-YYYY').diff(moment(fecha_final, 'DD-MM-YYYY').add(1, 'd'), 'days'))
            }
            return {days_all: data, detalle_atypical: {trabajo}}
        }

    } else {
        time_add = time_atipico ? time_atipico : slepp
        const day_init = Number(moment(init, 'DD-MM-YYYY').format('DD'))
        day_continue = moment(init, 'DD-MM-YYYY').add(time_add, 'd').format('DD-MM-YYYY')

        condicion_continuar = (moment(fecha_final, 'DD-MM-YYYY') >= moment(day_continue, 'DD-MM-YYYY'))
        const day_final = !condicion_continuar ? dia_final : Number(moment(day_continue, 'DD-MM-YYYY').format('DD'))
        for (let a = (day_init); a < (day_final + (!condicion_continuar ? 1 : 0)); a++) {
            dia = moment(`${a}-${periode}`, 'DD-MM-YYYY').format('DD-MM-YYYY')
            data.push({periodo: dia, tipo: 'NO TRABAJA'})
        }
        if (condicion_continuar) return await timepoAtipico(work, slepp, day_continue, periode, !work_sleep, null, data)
        else {
            let descanso = 0
            if (moment(day_continue, 'DD-MM-YYYY').diff(moment(fecha_final, 'DD-MM-YYYY').add(1, 'd'), 'days') > 0) {
                descanso = Number(moment(day_continue, 'DD-MM-YYYY').diff(moment(fecha_final, 'DD-MM-YYYY').add(1, 'd'), 'days'))
            }
            return {days_all: data, detalle_atypical: {descanso}}
        }
    }
}
export const timeAtypical = (work, slepp, init, periode) => {
    let array = [], dia = '', end = []
    for (let a = 1; a <= 300; a++) {
        dia = moment(init, 'DD-MM-YYYY').add((work + slepp) * a, 'days').format('DD-MM-YYYY')
        array.push({dia})
    }

    if (array.filter(i => (i.dia).substring(3, (i.dia).length) === periode).length === 0) {
        let nro = moment('01-' + periode, 'DD-MM-YYYY').endOf('months').format('DD') - Number(init.substring(0, 2))
        array = []
        for (let a = 0; a <= nro; a++) {
            dia = moment(init, 'DD-MM-YYYY').add(a, 'days').format('DD-MM-YYYY')
            array.push({periodo: dia, tipo: 'TRABAJA'})
        }
        return array.sort((a, b) => moment(a.periodo, "DD-MM-YYYY").unix() - moment(b.periodo, "DD-MM-YYYY").unix())
    } else {
        array = array.filter(i => (i.dia).substring(3, (i.dia).length) === periode)
    }

    if (Number(array[array.length - 1].dia.substring(0, 2)) === 18 || 19) {
        for (let k = Number(array[array.length - 1].dia.substring(0, 2)) + work; k <= moment('01-' + periode, 'DD-MM-YYYY').endOf('months').format('DD'); k++) {
            end.push({periodo: `${k}-${periode}`, tipo: 'NO TRABAJA'})
        }
    }

    for (let i = 1; i <= moment('01-' + periode, 'DD-MM-YYYY').endOf('months').format('DD'); i++) {
        for (const j of array) {
            if (Number(j.dia.substring(0, 2)) > i && Number(j.dia.substring(0, 2)) - slepp <= i) {
                end.push({periodo: `${i}-${periode}`, tipo: 'NO TRABAJA'})
            }
        }

        if (!end.find(z => z.periodo === `${i}-${periode}`))
            end.push({periodo: `${i}-${periode}`, tipo: 'TRABAJA'})
    }
    return end.sort((a, b) => moment(a.periodo, "DD-MM-YYYY").unix() - moment(b.periodo, "DD-MM-YYYY").unix())
}
export const datosPaginaciones = (data, showData) => {
    const {pageIndex, pageSize} = showData
    let datosFiltrados = [], pageOptions = [], pageCount = 0
    if (!pageIndex && !pageSize)
        datosFiltrados = data.slice(0, 10)
    const lenght = Math.trunc(Number(data.length) / Number(pageSize)) + ((Number(data.length) % Number(pageSize)) > 0 ? 1 : 0)
    for (let i = 0; i < lenght; i++)
        pageOptions = [...pageOptions, i]
    pageCount = pageOptions.length
    const inicio = pageSize * pageIndex
    const final = inicio + pageSize
    datosFiltrados = data.slice(inicio, final)

    return ({pageCount, pageOptions, datosFiltrados})
}
export const myFormatNumberWithCeros = number => new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
}).format(number)
export const diasMes = ({periodo}) => {
    let fecha_inicial = `${periodo}-01`
    let fecha_final = ''
    switch (moment(periodo, 'YYYY-MM').format('MM')) {
        case '01':
        case '03':
        case '05':
        case '07':
        case '08':
        case '10':
        case '12':
            fecha_final = `${periodo}-31`
            break
        case '02':
            let year = Number(moment(periodo, 'YYYY-MM').format('YYYY'))
            if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                fecha_final = `${periodo}-29`
            } else {
                fecha_final = `${periodo}-28`
            }
            break
        default:
            fecha_final = `${periodo}-30`
            break
    }

    return {fecha_inicial, fecha_final}
}
export const vDate = (fecha, format = "YYYY-MM-DD") => {
    fecha = fecha ? fecha.toString().trim().replace(/-/g, "/") : ''

    if (fecha.length === 8)
        fecha = moment(fecha, "DD/MM/YYYY")
    else if (fecha.length === 10) {
        const index = fecha.indexOf("/")
        if (index === 4)
            fecha = moment(fecha, "YYYY/MM/DD")
        if (index === 2)
            fecha = moment(fecha, "DD/MM/YYYY")
        if (index === 1)
            fecha = moment(fecha, "DD/MM/YYYY")
    } else if (fecha.length === 9) {
        const index = fecha.indexOf("/")
        if (index === 1)
            fecha = moment(fecha, "DD/MM/YYYY")
        else
            return {status: false, input: '', msg: `La fecha "${fecha}" no es válida!`}
    } else
        return {status: false, input: '', msg: `Fecha "${fecha}" no es válida!`}

    if (!fecha.isValid())
        return {status: false, input: '', msg: `Fecha "${fecha}" no es válida!`}

    return {status: true, fecha, input: moment(fecha, format)}
}
export const isPeriodValid = period => {
    period = period ? period : ''
    return period.length === 7
}