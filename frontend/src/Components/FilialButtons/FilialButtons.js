import React from 'react'
import {IoCartOutline, IoCubeOutline, IoEnterOutline, IoNewspaperOutline} from 'react-icons/io5'

function FilialButtons({type, onClick, active}) {
    const propsType = {
        product: {
            icon: <IoNewspaperOutline className='shopIcons' />,
            bgColor: 'bg-[#12B76A]'
        },
        selling: {
            icon: <IoCartOutline className='shopIcons' />,
            bgColor: 'bg-[#F79009]'
        },
        payments: {
            icon: <IoCubeOutline className='shopIcons' />,
            bgColor: 'bg-[#00B4CC]'
        },
        income: {
            icon: <IoEnterOutline className='shopIcons' />,
            bgColor: 'bg-[#00B4CC]'
        }
    }

    return (
        <button
            onClick={onClick}
            className={`${active ? 'filial-active' : propsType[type].bgColor} shopButton`}
        >
            {propsType[type].icon}
        </button>
    )
}

export default FilialButtons
