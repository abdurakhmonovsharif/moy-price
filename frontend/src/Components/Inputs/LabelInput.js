import React from 'react'

function LabelInput({label, type, onChange, value, placeholder}) {
    return (
        <div className='flex justify-between gap-[0.9375rem]'>
            <label className='text-[1rem] text-black-700 font-[300] flex items-center'>
                {label} <span className='pl-[0.25rem]'>:</span>{' '}
            </label>
            <input
                type={`${type ? type : 'text'}`}
                className='w-full px-[0.675rem] py-[0.5rem] bg-white-900 border border-[#A9C0EF] rounded-[0.25rem] outline-0 shadow-[0px_10px_10px_rgba(0,0,0,0.05)] text-[0.875rem] text-end'
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    )
}

export default LabelInput
