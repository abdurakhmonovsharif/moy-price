import { t } from 'i18next'
import React, {forwardRef} from 'react'
import {useSelector} from 'react-redux'

export const PaymentCheckPos = forwardRef((props, ref) => {
    const {payment} = props
    const {user, market} = useSelector((state) => state.login)
    const {currencyType} = useSelector((state) => state.currency)
    return (
        <div
            ref={ref}
            className={
                'bg-white-900 p-4 rounded-md reciept w-full uppercase text-[7pt]'
            }
        >
            <div className='flex justify-between'>
                <span className='font-bold'>{t("Do'kon")}:</span>
                <span className='font-bold'>{market.name}</span>
            </div>
            <div className='flex justify-between'>
                <span className='font-bold'>{t('Sotuvchi')}:</span>
                <span className='font-bold'>
                    {user.firstname} {user.lastname}
                </span>
            </div>
            <div className='flex justify-between'>
                <span className='font-bold'>{t('Mijoz')}:</span>
                <span className='font-bold'>
                    {payment?.saleconnector?.client?.name ||
                        payment?.saleconnector?.packman?.name ||
                        ''}
                </span>
            </div>
            <div className='flex justify-between font-bold'>
                <span className='font-bold'>{t('ID')}:</span>
                <span className='font-bold'>{payment?.saleconnector?.id}</span>
            </div>

            <div className='flex justify-between font-bold'>
                <span className='font-bold'>
                    {t('Vaqt')}: {new Date(payment?.createdAt).toLocaleTimeString()}
                </span>
                <span className='font-bold'>
                {t('Sana')}: {new Date(payment?.createdAt).toLocaleDateString()}
                </span>
            </div>
            <ul>
                <li className='flex justify-between text-[7pt] border-b border-b-black-300'>
                    {t('Jami')}:{' '}
                    <span className='font-bold'>
                        {currencyType === 'USD'
                            ? payment?.payment?.toLocaleString('ru-RU')
                            : payment?.paymentuzs?.toLocaleString('ru-RU')}{' '}
                        {currencyType}
                    </span>
                </li>
                <li className='flex justify-between text-[7pt] border-b border-b-black-300'>
                    {t("To'lov turi")}:{' '}
                    <span className='font-bold'>
                       {payment.type === 'cash'
                           ? `${t('Naqt')}`
                           : payment.type === 'card'
                               ? `${t('Plastik')}`
                               : payment.type === 'transfer'
                                   ? `${t("O'tkazma")}`
                                   : `${t('Aralash')}`
                       }
                    </span>
                </li>
            </ul>
        </div>
    )
})
