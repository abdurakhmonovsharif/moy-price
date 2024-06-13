import React from 'react'
import {IoAttach, IoBagCheck, IoCloudDone, IoDocumentText} from 'react-icons/io5'
import {NavLink} from 'react-router-dom'


export const RouteLink = ({path, title, iconType}) => {
    const setActive = ({isActive}) =>
        isActive ? `activelink linkstyles  ` : ` linkstyles`

    const iconTypes = {
        bag: <IoBagCheck size={'1.5rem'} color='#12B76A' />,
        cloud: <IoCloudDone size={'1.5rem'} color='#F04438' />,
        clip: <IoAttach size={'1.5rem'} color='#F79009' />,
        text: <IoDocumentText size={'1.5rem'} color='#00B4CC' />
    }
    return (
        <NavLink to={path} className={setActive}>
            {iconTypes[iconType]}
            <span className='text-base p-1 text-black-700 leading-[1.875rem]'>{title}</span>
        </NavLink>
    )
}
