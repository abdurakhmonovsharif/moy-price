import {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import Paths, {navListForAdmin, navListForSeller, profileList} from './Path'
import NavbarFooterLogo from '../../Images/logotip.png'
import Avatar from '../Avatar/Avatar'
import {IoCart, IoChevronBack, IoEllipsisVertical} from 'react-icons/io5'
import ProfileMenuLink from './ProfileMenuLink'
import NavbarLink from './NavbarLink'
import {logOut} from '../../Pages/Login/loginSlice'
import {useDispatch, useSelector} from 'react-redux'
import Language from './../Languages/Language'
import {useTranslation} from 'react-i18next'
import {map} from 'lodash'

function Navbar() {
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.login)
    const [navbarExpended, setNavbarExpended] = useState(false)
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
    const [activeFirstSubMenuId, setActiveFirstSubMenuId] = useState(false)
    const [activeSecondSubMenuId, setActiveSecondSubMenuId] = useState(false)
    const handleClickNavbarExpand = useCallback(() => {
        setNavbarExpended(!navbarExpended)
        sessionStorage.setItem('navbarExpended', !navbarExpended)
    }, [navbarExpended])
    const handleClickFirstMenu = (id) => {
        if (id === activeFirstSubMenuId) {
            setActiveFirstSubMenuId(null)
        } else {
            setActiveFirstSubMenuId(id)
        }
        setNavbarExpended(false)
        sessionStorage.setItem('navbarExpended', false)
    }
    const handleClickSecondMenu = (id) => {
        if (id === activeSecondSubMenuId) {
            setActiveSecondSubMenuId(null)
        } else {
            setActiveSecondSubMenuId(id)
        }
    }
    const handleClickLogout = () => {
        dispatch(logOut())
    }
    const handleKeyDown = useCallback(
        (e) => {
            if (e.ctrlKey && e.keyCode === 32) {
                handleClickNavbarExpand()
            }
        },
        [handleClickNavbarExpand]
    )
    const chooseRouteArray = () => {
        switch (user.type.toLowerCase()) {
            case 'seller':
                return !user.isIncomePage
                    ? navListForSeller
                    : [
                          ...navListForSeller,
                          {
                              id: 5,
                              label: 'Qabul qilish',
                              icon: <IoCart size={'1.5rem'} />,
                              path: 'maxsulotlar/qabul/qabulqilish',
                              submenu: false,
                          },
                          {
                              id: 6,
                              label: 'Sotilgan mahsulotlar',
                              icon: '',
                              path: 'sotilganlar',
                              submenu: false,
                          },
                          {
                              id: 7,
                              label: 'Kam qolganlar',
                              icon: '',
                              path: 'kamqolganlar',
                              submenu: false,
                          },
                      ]
            case 'director':
                return Paths
            case 'admin':
                return navListForAdmin
            default:
                dispatch(logOut())
        }
    }
    useLayoutEffect(() => {
        const navbarExpanded =
            sessionStorage.getItem('navbarExpended') === 'true'
        if (navbarExpanded) setNavbarExpended(navbarExpanded)
    }, [])
    useEffect(() => {
        navbarExpended && setActiveFirstSubMenuId(null)
    }, [navbarExpended])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])
    useEffect(() => {
        const handleEvent = (e) => {
            let activeClass = e.target.hasOwnProperty('class')
            let include = !e.target.classList.contains('toggle-avatar-menu')
            if (activeClass || include) setIsAvatarMenuOpen(false)
        }
        document.addEventListener('click', handleEvent)
    }, [])

    return (
        <div className={'relative'}>
            <nav
                className={`transition-all ease-in-out duration-200 min-h-screen bg-white-300 flex flex-col justify-between rounded-tr-[8px] rounded-br-[8px] shadow-[5px_0_25px_rgba(0,0,0,0.1),10px_0_50px_rgba(0,0,0,0.05)] ${
                    navbarExpended
                        ? 'min-w-[4.375rem] max-w-[4.375rem]'
                        : 'min-w-[17.625rem] max-w-[17.625rem]'
                }`}
            >
                <div className={'navbar-header overflow-hidden'}>
                    <div
                        className={`transition-all ease duration-300 navbar-avatar ${
                            navbarExpended
                                ? 'w-[100vw] justify-start'
                                : 'justify-center'
                        } bg-white-400 border-b-2 border-b-black-100 flex items-center py-[0.9375rem] px-[10px] gap-[30px]`}
                    >
                        <Avatar navbarExpended={navbarExpended} />
                        <button
                            className={`toggle-avatar-menu transition ease duration-200 ${
                                isAvatarMenuOpen
                                    ? 'text-primary-800'
                                    : 'text-black-700 hover:text-primary-800'
                            }`}
                            onClick={() => setIsAvatarMenuOpen(true)}
                        >
                            <IoEllipsisVertical
                                size={'20px'}
                                className={'pointer-events-none'}
                            />
                        </button>
                    </div>
                </div>
                <div className='navbar-body relative grow overflow-y-auto'>
                    <div
                        className={
                            'absolute left-0 w-full h-full pt-[2.8125rem] pb-[0.75rem] px-[0.75rem] scroll-smooth overflow-y-auto '
                        }
                    >
                        {chooseRouteArray().map((item) => (
                            <NavbarLink
                                icon={item.icon}
                                label={t(item.label)}
                                path={item.path}
                                submenu={item.submenu}
                                id={item.id}
                                activeFirstSubMenuId={activeFirstSubMenuId}
                                activeSecondSubMenuId={activeSecondSubMenuId}
                                expanded={navbarExpended}
                                handleClickFirstMenu={handleClickFirstMenu}
                                handleClickSecondMenu={handleClickSecondMenu}
                                key={item.id}
                            />
                        ))}
                    </div>
                </div>
                <div
                    className={`navbar-footer transition-all ease-in-out duration-300 text-center flex flex-col justify-center gap-[10px] bg-white-400 border-t-[2px] border-t-black-100 ${
                        navbarExpended
                            ? `h-0 opacity-0 hidden`
                            : 'p-[10px] opacity-100'
                    }`}
                >
                    <div className='w-full flex justify-center items-center'>
                        <Language />
                    </div>
                    <div className='footer-logo flex items-center justify-center'>
                        <img
                            src={NavbarFooterLogo}
                            style={{maxWidth: '200px',height:"80px",objectFit:"contain"}}
                            alt='alo24 logo'
                        />
                    </div>
                    <p className={'text-[0.625rem] text-black-500'}>
                        Copyright © 2022 Alo 24. All Rights Reserved
                    </p>
                </div>
            </nav>
            <button
                className={`w-[40px] h-[40px] flex items-center justify-center z-[30] rounded-full bg-white-900 text-black-700 shadow-[0_10px_20px_rgba(0,0,0,0.1)] absolute backdrop-blur-[10px] top-[5.3rem] right-[-20px] transition-all ease-linear duration-300 hover:bg-black-100 ${
                    navbarExpended ? 'rotate-180' : ''
                }`}
                onClick={handleClickNavbarExpand}
            >
                <IoChevronBack size={'20px'} />
            </button>
            {isAvatarMenuOpen && (
                <div className='avatar-config-menu absolute z-[90] w-max left-[17rem] top-[1.375rem] bg-white-700 backdrop-blur-[8px] py-[10px] rounded-[8px]'>
                    {map(
                        profileList.filter(
                            (el) =>
                                !(
                                    user.type === 'Admin' &&
                                    el.path === 'shaxsiy/smsapi'
                                )
                        ),
                        (item, index) => {
                            return item.path ? (
                                <ProfileMenuLink
                                    path={item.path}
                                    icon={item.icon}
                                    label={t(item.label)}
                                    key={index + 1}
                                />
                            ) : (
                                <button
                                    className={
                                        'transition-all ease duration-200 w-full flex px-[20px] py-[10px] gap-[10px] items-center text-black-700 hover:bg-black-100'
                                    }
                                    key={index + 1}
                                    onClick={handleClickLogout}
                                >
                                    <span>{item.icon}</span>
                                    <span className={'text-xs'}>
                                        {t(item.label)}
                                    </span>
                                </button>
                            )
                        }
                    )}
                </div>
            )}
        </div>
    )
}

export default Navbar
