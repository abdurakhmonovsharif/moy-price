import React from 'react'
import {
    IoSwapHorizontalOutline,
    IoCashOutline,
    IoArrowForward,
} from 'react-icons/io5'

export const BtnCreateShop = ({onClick, text, type}) => {
    const icons = {
        cash: <IoCashOutline className='paymentsstyle' size={'0.625rem'} />,
        shop: <IoArrowForward className='paymentsstyle ml-[0.25rem]' size={'0.625rem'} />,
        transfer: <IoSwapHorizontalOutline className='paymentsstyle' size={'0.625rem'} />,
    }
    return (
        <button
            onClick={onClick}
            className={`bg-[#0090A3] rounded-lg p-[0.625rem] text-white-900 text-[0.825rem] pr-[0.4375rem] leading-[1.125rem] font-medium w-full shadow-[0_15px_6px_rgba(0,0,0,0.01),0_9px_5px_rgba(0,0,0,0.03),0_4px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.05),0_0_0_rgba(0,0,0,0.05)] active:shadow-none`}
        > 
            {text}
            {icons[type]}
        </button>
    )
 }

 export default BtnCreateShop


