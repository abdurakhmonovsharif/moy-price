import React from 'react'
import SearchInput from './SearchInput'
function LabelSearchInput({
    placeholder,
    value,
    onChange,
    someClasses,
    onKeyUp,
    disabled,
    labelText,
}) {
    return (
        <div className='flex flex-col'>
            <span className='text-[#193F8A] text-[1rem] font-[400] leading-[1.875rem] mb-[0.675rem]'>
                {labelText}
            </span>
            <SearchInput 
               placeholder = {placeholder}
               value = {value}
               onChange = {onChange}
               someClasses = {someClasses}
               onKeyUp = {onKeyUp}
               disabled = {disabled}
            />
        </div>
    )
}

export default LabelSearchInput
