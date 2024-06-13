import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import Store from './App/store'
import App from './App'
import './index.css'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './i18n'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <>
        <Router>
            <Provider store={Store}>
                <App />
            </Provider>
        </Router>
        <ToastContainer
            position='top-right'
            theme={'colored'}
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
        />
    </>
)
