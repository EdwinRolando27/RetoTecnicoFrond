import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {ToastProvider} from 'react-toast-notifications'

import * as serviceWorker from './serviceWorker'
import './assets/base.scss'
import Main from './Main'
import configureStore from './config/configureStore'

require('dotenv').config()

const store = configureStore()

const renderApp = Component => {
    render(
        <Provider store={store}>
            <ToastProvider autoDismiss={true} transitionDuration={0}>
                <BrowserRouter>
                    <Component/>
                </BrowserRouter>
            </ToastProvider>
        </Provider>,
        document.getElementById('root')
    )
}

renderApp(Main)

if (module.hot) {
    module.hot.accept('./Main', () => {
        const NextApp = require('./Main').default
        renderApp(NextApp)
    })
}

serviceWorker.unregister()

