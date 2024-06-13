import React from 'react'
import {BsPaperclip, BsShieldFillCheck} from 'react-icons/bs'

export const SaveBtn = ({onClick, text}) => {
    return (
        <button
            onClick={onClick}
            className='bg-warning-500 shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all ease-in-out duration-200 active:shadow-none hover:bg-warning-600 p-[10px] flex items-center justify-center gap-[0.3125rem] text-white-900 rounded-[0.5rem]'
        >
            <BsPaperclip className='text-white-900' size={'1.125rem'} />{' '}
            <span className={'text-sm leading-[1.125rem]'}>{text}</span>
        </button>
    )
}

export const ConfirmBtn = ({onClick, text}) => {
    return (
        <button
            onClick={onClick}
            className='bg-primary-800 flex items-center gap-[0.3125rem] justify-center p-[10px] text-white-900 rounded-[0.5rem] shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all ease-in-out duration-200 active:shadow-none hover:bg-primary-900'
        >
            <BsShieldFillCheck className='text-white-900' size={'1.125rem'} />{' '}
            <span className={'text-sm leading-[1.125rem]'}>{text}</span>
        </button>
    )
}
