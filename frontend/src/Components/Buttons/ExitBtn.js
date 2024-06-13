import React from 'react'
import {IoCloseSharp} from 'react-icons/io5'

export const ExitBtn = ({onClick}) => {
    return (
        <>
            <button onClick={onClick} className='exitbtn'>
                <IoCloseSharp size={'0.75rem'} />
            </button>
        </>
    )
}
