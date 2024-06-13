import { t } from 'i18next'
import React, {forwardRef} from 'react'
import {useSelector} from 'react-redux'

export const PaymentCheck = forwardRef((props, ref) => {
    const {payment} = props
    const {user, market} = useSelector((state) => state.login)
    const {currencyType} = useSelector((state) => state.currency)
    return (
        <div ref={ref} className={'bg-white-900 p-4 rounded-md'}>
            <div className='flex pb-2 justify-between border-b-[0.8px] border-black-700'>
                <ul className='w-[35%]'>
                    <li className='check-ul-li'>
                        {t("Do'kon")}:
                        <span className='check-ul-li-span'>{market.name}</span>
                    </li>
                    <li className='check-ul-li'>
                        {t('Telefon')}:
                        <span className='check-ul-li-span'>
                            {market.phone1}
                        </span>
                    </li>
                    <li className='check-ul-li'>
                        {t('Manzil')}:
                        <span className='check-ul-li-span'>
                            {market?.address}
                        </span>
                    </li>
                    <li className='check-ul-li'>
                    {t('Sana')}:
                        <span className='check-ul-li-span'>
                            {new Date(payment?.createdAt).toLocaleDateString()}
                        </span>
                    </li>
                    <li className='check-ul-li'>
                        {t('Mijoz')}:{' '}
                        <span className='check-ul-li-span'>
                            {payment?.saleconnector?.client?.name ||
                                payment?.saleconnector?.packman?.name ||
                                ''}
                        </span>
                    </li>
                </ul>
                <div className='check-ul-li flex-col'>
                    <div className={'grow text-center'}></div>
                    <div className='check-ul-li justify-end'>
                        <p>
                            {t('Sotuvchi')}:{' '}
                            <span className='check-ul-li-span'>
                                {user.firstname} {user.lastname}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className='mt-4'></div>
            <ul>
                <li className='check-ul-li-foot border-t-0 font-bold'>
                    {t("To'lov")}:{' '}
                    <span>
                        {currencyType === 'USD'
                            ? payment?.payment?.toLocaleString()
                            : payment?.paymentuzs?.toLocaleString()}{' '}
                        {currencyType}
                    </span>
                </li>
                <li className='check-ul-li-foot border-t-0 font-bold'>
                    {t("To'lov turi")}:{' '}
                    <span>
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
