import React from 'react'
import {IoNotifications} from 'react-icons/io5'

const BtnWarning = ({onClick, text, warning, error, number}) => {
    return (
        <button
            onClick={onClick}
            className={`focus-visible:outline-none  ${
                warning ? 'edit-button' : error ? 'clearElement' : ''
            }`}
        >
            {number && (
                <span className='relative'>
                    <span className='plusIcon'>
                        {' '}
                        <IoNotifications />
                    </span>
                    <span className='text-[0.5rem] w-[1rem] h-[1rem] flex justify-center items-center rounded-full bg-primary-900 text-blue absolute top-[-0.4rem] left-2'>
                        {number}
                    </span>
                </span>
            )}

            {text}
        </button>
    )
}

export default BtnWarning
