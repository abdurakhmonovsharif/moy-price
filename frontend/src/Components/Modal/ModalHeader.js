import React from 'react'
import {IoClose} from 'react-icons/io5'

function ModalHeader({toggleModal}) {
    return (
        <div className={'flex items-center justify-end'}>
            <button
                type={'button'}
                className={
                    'text-[1.8rem] text-black-500 transition-all ease-in duration-100 hover:text-error-500 active:scale-75'
                }
                onClick={toggleModal}
            >
                <IoClose size={'1.8rem'} className={'pointer-events-none'} />
            </button>
        </div>
    )
}

export default ModalHeader