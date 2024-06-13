import React from 'react'
import DatePicker from 'react-datepicker'
import {IoCalendarNumber} from 'react-icons/io5'
import 'react-datepicker/dist/react-datepicker.css'

function Dates({value, onChange, placeholder, maxWidth, disableIcon}) {
    return (
        <div className={`group relative ${maxWidth ? maxWidth : 'grow'}`}>
            <DatePicker
                selected={value}
                placeholderText={placeholder}
                onChange={onChange}
                className={`datePickerStyle`}
                dateFormat={'dd.MM.yyyy'}
            />
            {!disableIcon && (
                <IoCalendarNumber
                    size={'20px'}
                    className='datePickerIcon group-hover:text-blue-500'
                />
            )}
        </div>
    )
}

export default Dates
