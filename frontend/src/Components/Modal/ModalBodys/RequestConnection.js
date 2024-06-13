import React from 'react'
import {useTranslation} from 'react-i18next'

const RequestConnection = ({market, toggleModal, approveFunction}) => {
    const {t} = useTranslation(['common'])
    return (
        <div>
            <div className='py-2'>
                <span className='font-bold'>{t("Do'kon nomi")}: </span>
                <span>{market?.name}</span>
            </div>
            <div className='py-2'>
                <span className='font-bold'>INN : </span>
                <span>{market?.inn}</span>
            </div>
            <div className='py-2'>
                <span className='font-bold'>{t("Telefon raqami")}: </span>
                <span>{market?.phone1}</span>
            </div>
            <div className='py-2'>
                <span className='font-bold'>{t('Direktor')}: </span>
                <span>
                    {market?.director?.firstname} {market?.director?.lastname}
                </span>
            </div>
            <div className='py-2'>
                <span className='font-bold'>{t("Direktor telefon raqami")}: </span>
                <span>{market?.director?.phone}</span>
            </div>
            <div
                className={'flex mt-7 items-center justify-center gap-[1.5rem]'}
            >
                <button
                    className={'approveBtn bg-black-500 hover:bg-black-700'}
                    onClick={toggleModal}
                >
                    {t('Bekor qilish')}
                </button>
                <button
                    className={'approveBtn bg-success-600 hover:bg-success-700'}
                    onClick={approveFunction}
                >
                    {t("So'rov jo'natish")}
                </button>
            </div>
        </div>
    )
}

export default RequestConnection
