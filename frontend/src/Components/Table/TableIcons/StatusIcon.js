import React from 'react'
import {IoCheckmark, IoHourglass} from 'react-icons/io5'
import {Link} from 'react-router-dom'

export const StatusIcon = ({status}) => {
    if (status) {
        return (
            <div className='w-[38px] h-[24px] flex items-center justify-center bg-success-500 rounded-lg'>
                <IoCheckmark color='white' />
            </div>
        )
    }
    return (
        <Link
            to={'/maxsulotlar/inventarizatsiya/inventarizatsiya'}
            className='w-[38px] h-[24px] flex items-center justify-center bg-warning-500 rounded-lg'
        >
            <IoHourglass color='white' />
        </Link>
    )
}
