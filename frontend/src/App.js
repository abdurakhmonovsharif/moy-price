import {lazy, Suspense, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Loader from './Components/Loader/Loader'
import {logIn} from './Pages/Login/loginSlice'

// pages
const Login = lazy(() => import('./Pages/Login/Login'))
const PageRoutes = lazy(() => import('./Pages/PageRoutes'))

function App() {
    const dispatch = useDispatch()
    const {logged} = useSelector((state) => state.login)

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        // const userData = JSON.parse(localStorage.getItem('userData'))
        if (userData) {
            dispatch(logIn(userData))
        }
    }, [dispatch])

    return (
        <div className='App'>
            <Suspense fallback={<Loader />}>
                {logged ? <PageRoutes /> : <Login />}
            </Suspense>
        </div>
    )
}

export default App
