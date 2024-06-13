import React from 'react'
import {BiBell, BiPlus} from 'react-icons/bi'
import {MdOutlineClear} from 'react-icons/md'

const BtnAddRemove = ({onClick, text, add, edit, bell, count, disabled}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`focus-visible:outline-none ${
                disabled ? 'cursor-not-allowed' : ''
            } ${add ? 'createElement' : edit ? 'edit-button' : 'clearElement'}`}
        >
            {bell ? (
                <div className='plusIcon relative pr-2'>
                    <BiBell size={18} />
                    {count !== 0 && (
                        <span className='absolute bg-primary-800 text-white-900 w-[15px] h-[15px] rounded-full text-[10px] top-0'>
                            {count}
                        </span>
                    )}
                </div>
            ) : add && !edit ? (
                <div className='plusIcon'>
                    <BiPlus />
                </div>
            ) : !add && !edit ? (
                <div className='plusIcon'>
                    <MdOutlineClear />
                </div>
            ) : (
                ''
            )}
            {text}
        </button>
    )
}

export default BtnAddRemove
