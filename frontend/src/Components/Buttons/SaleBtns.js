import React from 'react'
import {
    IoCardOutline,
    IoCashOutline,
    IoGitCompareOutline,
    IoPricetagOutline,
    IoSwapHorizontalOutline,
    IoWalletOutline,
} from 'react-icons/io5'

export const SaleBtn = ({ onClick, text, type, active }) => {
    const icons = {
        cash: <IoCashOutline className='paymentsstyle' size={'1.3125rem'} />,
        card: <IoCardOutline className='paymentsstyle' size={'1.3125rem'} />,
        transfer: (
            <IoSwapHorizontalOutline
                className='paymentsstyle'
                size={'1.3125rem'}
            />
        ),
        mixed: (
            <IoGitCompareOutline className='paymentsstyle' size={'1.3125rem'} />
        ),
    }
    return (
        <button
            onClick={() => onClick(type)}
            className={`salestyle ${active ? 'bg-primary-700 text-white-900' : 'bg-[#E9ECEB]'
                }`}
        >
            {icons[type]}
            {text}
        </button>
    )
}

export const DiscountBtn = ({ onClick, text }) => {
    return (
        <button
            onClick={onClick}
            className='discountstyle w-full h-[3.25rem] bg-warning-500 text-white-900 duration-200 shadow-lg'
        >
            <IoPricetagOutline className='discstyle' size={'1.5rem'} />
            {text}
        </button>
    )
}

export const Payment = ({ onClick, text, onDoubleClick }) => {
    return (
        <button
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            className={`paymentstyle grow`}
        >
            <IoWalletOutline className='paystyle' size={'1.3125rem'} />
            {text}
        </button>
    )
}
