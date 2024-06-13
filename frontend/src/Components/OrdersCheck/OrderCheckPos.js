import React, {forwardRef} from 'react'
import {useSelector} from 'react-redux'
import {uniqueId, map} from 'lodash'
import { t } from 'i18next'

export const OrderCheckPos = forwardRef((props, ref) => {
    const {order} = props
    const {currencyType} = useSelector((state) => state.currency)

    return (
        <div
            ref={ref}
            className={
                'bg-white-900 p-4 rounded-md reciept w-full uppercase text-[7pt]'
            }
        >
            <div className='flex justify-between'>
                <span>{t("Do'kon")}:</span>
                <span>{order?.sender?.name}</span>
            </div>
            <div className='flex justify-between'>
                <span>INN:</span>
                <span>{order?.sender?.inn?.toLocaleString('ru-RU')}</span>
            </div>
            <div className='flex justify-between'>
                <span>{t("Buyurtma")}:</span>
                <span> {order?.id}</span>
            </div>
            <div className='flex justify-between'>
                <span>
                    {t("Vaqt")}: {new Date(order?.createdAt).toLocaleTimeString()}
                </span>
                <span>
                {t('Sana')}: {new Date(order?.createdAt).toLocaleDateString()}
                </span>
            </div>
            <br />
            <hr className='text-opacity-50' />
            <br />
            {map(order?.products, (item, index) => {
                return (
                    <div key={uniqueId('sale-check-pos')}>
                        <div className='text-[7pt] font-bold'>
                            {index + 1}. {item?.product?.category?.code}{' '}
                            {item?.product?.productdata?.code}{' '}
                            {item?.product?.productdata?.name}
                        </div>
                        <div className='flex justify-between text-[7pt]'>
                            <span>
                                {item?.pieces.recived}*
                                {currencyType === 'USD'
                                    ? item?.unitprice?.toLocaleString('ru-RU')
                                    : item?.unitpriceuzs?.toLocaleString(
                                          'ru-RU'
                                      )}{' '}
                                {currencyType}
                            </span>
                            <span>
                                {currencyType === 'USD'
                                    ? item?.totalprice?.toLocaleString('ru-RU')
                                    : item?.totalpriceuzs?.toLocaleString(
                                          'ru-RU'
                                      )}{' '}
                                {currencyType}
                            </span>
                        </div>
                    </div>
                )
            })}
            <br />
            <ul>
                <li className='flex justify-between text-[7pt] border-b border-b-black-300'>
                    {t("Jami")}:{' '}
                    <span>
                        {currencyType === 'USD'
                            ? order?.totalprice?.toLocaleString('ru-RU')
                            : order?.totalpriceuzs?.toLocaleString(
                                  'ru-RU'
                              )}{' '}
                        {currencyType}
                    </span>
                </li>
            </ul>
        </div>
    )
})
