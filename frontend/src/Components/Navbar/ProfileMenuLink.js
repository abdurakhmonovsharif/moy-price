import React from 'react'
import {NavLink} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

function ProfileMenuLink({path, label, icon}) {
    const {t} = useTranslation(['common'])

    const profileLinkClasses = ({isActive}) => {
        return `transition-all ease duration-200 w-full flex px-[20px] py-[10px] gap-[10px] items-center ${isActive
            ? 'text-white-900 font-bold md:font-regular bg-primary-800'
            : 'text-white-900 font-bold md:font-regular md:text-black-700 hover:bg-black-100'
        }`
    }
    return (
        <NavLink className={profileLinkClasses} to={path}>
            <span>{icon}</span>
            <span className={'text-xs'}>{t(label)}</span>
        </NavLink>
    )
}

export default ProfileMenuLink