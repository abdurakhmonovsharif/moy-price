import React from 'react'
import {IoDocumentText} from 'react-icons/io5'

const SessionBtn = ({text, onClick}) => {
    return (
        <button
            onClick={onClick}
            className='bg-primary-800 flex items-center gap-[0.3125rem] justify-center p-[10px] text-white-900 rounded-[0.5rem] shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all ease-in-out duration-200 active:shadow-none hover:bg-primary-900'
        >
            <IoDocumentText
                className='text-white-900'
                size={'1.125rem'}
            />{' '}
            {text && <span className={'text-sm leading-[1.125rem]'}>{text}</span>}
        </button>
    )
}

export default SessionBtn
