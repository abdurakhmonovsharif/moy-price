import axios from 'axios'
import Store from '../App/store'
import {logOut} from '../Pages/Login/loginSlice'

const baseURL = process.env.REACT_APP_API_ENDPOINT
// const baseURL =  'http://alo24.uz/api'

const instance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})
instance.interceptors.request.use(
    (config) => {
        const {market, user} = Store.getState().login
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (userData) {
            const {token} = userData
            config.headers['Authorization'] = `Bearer ${token}`
        }
        if (
            market &&
            config.headers['Content-Type'] !== 'multipart/form-data'
        ) {
            config.data = {
                ...config.data,
                market: market._id,
            }
        } else if (
            user?.type === 'Admin' &&
            config.headers['Content-Type'] !== 'multipart/form-data'
        ) {
            config.data = {
                ...config.data,
                administrator: user._id,
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
instance.interceptors.response.use(
    (response) => response,
    ({response: {data, status}}) => {
        if (!status) {
            return Promise.reject({message: 'Internet mavjud emas'})
        } else if (status === 401) {
            localStorage.removeItem('useData')
            Store.dispatch(logOut(data?.error || data?.message))
        } else if (status === 404) {
            return Promise.reject('Bunday manzil mavjud emas !')
        } else {
            return Promise.reject(data?.error || data?.message)
        }
    }
)
export default instance;
