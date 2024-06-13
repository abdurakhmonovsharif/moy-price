import React from 'react'
import {
    IoAdd,
    IoCreateOutline,
    IoDocument,
    IoInformation,
    IoPrint,
    IoSave,
    IoSwapHorizontal,
    IoTrashOutline,
} from 'react-icons/io5'
import {SiMicrosoftexcel} from 'react-icons/si'
import {FaMoneyBill} from 'react-icons/fa'

const TableBtn = ({type, onClick, bgcolor, isDisabled}) => {
    const chooseIcon = () => {
        switch (type) {
            case 'delete':
                return <IoTrashOutline color='white' size={14} />
            case 'edit':
                return <IoCreateOutline color='white' size={14} />
            case 'print':
                return <IoPrint color='white' size={14} />
            case 'save':
                return <IoSave color='white' size={14} />
            case 'excel':
                return <SiMicrosoftexcel color='white' size={14} />
            case 'add':
                return <IoAdd color='white' size={14} />
            case 'return':
                return <IoSwapHorizontal color='white' size={14} />
            case 'pay':
                return <FaMoneyBill color='white' size={14} />
            case 'info':
                return <IoInformation color='white' size={14} />
            case 'report':
                return <IoDocument color='white' size={14} />
            default:
                return ''
        }
    }

    return (
        <button
            className={`lg:w-[24px] w-[50px] z- lg:h-[24px] h-[35px] flex justify-center items-center lg:rounded-full rounded-md ${bgcolor}`}
            onClick={onClick}
            disabled={isDisabled}
        >
            {chooseIcon()}
        </button>
    )
}

export default TableBtn
