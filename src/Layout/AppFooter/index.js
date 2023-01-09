import React, {Fragment, useEffect} from 'react'

import '../assets/css/maicons.css'
import '../assets/css/bootstrap.css'
import '../assets/vendor/owl-carousel/css/owl.carousel.css'
import '../assets/vendor/animate/animate.css'
import '../assets/css/theme.css'


const AppFooter = () => {
    const {host} = window.location
    let isAcSRL = host.includes('ecofact')

    const addScript = (enlace) => {
        const script = document.createElement('script');
        script.src = `${enlace}`
        script.async = true

        script.crossOrigin = "anonymous"

        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script);
        }
    }

    useEffect(() => {
        addScript("../assets/js/jquery-3.5.1.min.js")
        addScript("../assets/js/bootstrap.bundle.min.js")
        addScript("../assets/vendor/owl-carousel/js/owl.carousel.min.js")
        addScript("../assets/vendor/wow/wow.min.js")
        addScript("../assets/js/theme.js")

    }, [])
    return (
        <div className="page-footer">
            <div className="row px-md-12" style={{margin: 0, padding: 0}}>
                <div className="col-sm-3 col-lg-3 py-3"/>
                <div className="col-sm-4 col-lg-4 py-4" style={{margin: 0, padding: 0}}>
                    <div className="app-footer-right">
                    <span>
                      copyright © and development {new Date().getFullYear()}{' '}
                        <Fragment>
                                <a rel="noreferrer" target="_blank">
                                    Centro Cadera.  <span>v<strong>1.0.0</strong></span>
                                </a>
                            </Fragment>
                    </span>
                    </div>
                </div>
                <div className="col-sm-3 col-lg-3 py-3" style={{margin: 0, padding: 0}}>
                    <h5>Redes Sociales</h5>
                    <a href="#" target="_blank"><span className="mai-logo-facebook-f"></span></a>
                    <a href="#" target="_blank"><span className="mai-logo-twitter"></span></a>
                    <a href="#" target="_blank"><span className="mai-logo-google-plus-g"></span></a>
                    <a href="#" target="_blank"><span className="mai-logo-instagram"></span></a>
                    <a href="#" target="_blank"><span className="mai-logo-linkedin"></span></a>
                </div>
            </div>

        </div>
    )
}

export default AppFooter