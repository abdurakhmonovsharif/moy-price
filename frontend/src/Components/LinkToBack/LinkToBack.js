import React from 'react'
import {Link} from 'react-router-dom'
import {IoChevronBack} from 'react-icons/io5'

const LinkToBack = ({link}) => {
    return (
        <Link to={link} className='lg:mt-[10px] lg:ms-[20px] mt-[50px] ms-[30px] linktoback'>
            <IoChevronBack className='mt-[]'/>
        </Link>
    )
}

export default LinkToBack
