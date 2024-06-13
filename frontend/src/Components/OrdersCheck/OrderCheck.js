import React, {forwardRef} from 'react'
import {useSelector} from 'react-redux'
import {uniqueId, map} from 'lodash'
import { t } from 'i18next'
export const OrderCheck = forwardRef((props, ref) => {
    const {order} = props
    const {market} = useSelector((state) => state.login)
    const {currencyType} = useSelector((state) => state.currency)

    return (
        <div ref={ref} className={'bg-white-900 p-4 rounded-md'}>
            <div className='flex pb-2 justify-between border-b-[0.8px] border-black-700'>
                <ul className='w-[35%]'>
                    <li className='check-ul-li'>
                    {t('Do\'kon')}:
                        <span className='check-ul-li-span'>
                            {order?.sender?.name}
                        </span>
                    </li>
                    <li className='check-ul-li'>    
                        INN:
                        <span className='check-ul-li-span'>
                            {order?.sender?.inn.toLocaleString('ru-Ru')}
                        </span>
                    </li>
                    <li className='check-ul-li'>
                    {t('Sana')}:
                        <span className='check-ul-li-span'>
                            {new Date(order?.createdAt).toLocaleTimeString()}{' '}
                            {new Date(order?.createdAt).toLocaleDateString()}
                        </span>
                    </li>
                    <li className='check-ul-li'>
                    {t('Buyurtmachi')}:{' '}
                        <span className='check-ul-li-span'>{market?.name}</span>
                    </li>
                </ul>
                <div className='check-ul-li flex-col'>
                    <div className={'grow text-center'}>
                        <h2 className='check-text-style mb-5'>
                        {t('Buyurtma')}:{' '}
                            <span className={'ml-2'}>{order?.id}</span>
                        </h2>
                    </div>
                </div>
            </div>
            <div className='mt-4'>
                <table className='border-collapse border border-slate-400 w-full break-inside-auto'>
                    <thead>
                        <tr className={'break-inside-avoid break-after-auto'}>
                            <td className='check-table-rtr'>№</td>
                            <td className='check-table-rtr'>{t('Kategoriya')}</td>
                            <td className='check-table-rtr'>{t('Kodi')}</td>
                            <td className='check-table-rtr'>{t('Maxsulot')}</td>
                            <td className='check-table-rtr'>{t('Buyurtma')}</td>
                            <td className='check-table-rtr'>{t('Yuborilgan')}</td>
                            <td className='check-table-rtr'>{t('Qabul qilingan')}</td>
                            <td className='check-table-rtr'>{t('Qaytarilgan')}</td>
                            <td className='check-table-rtr'>{t('Jami')}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {map(order?.products, (item, index) => {
                            return (
                                <tr key={uniqueId('saleCheck')}>
                                    <td className='p-1 border text-center text-[0.875rem] font-bold'>
                                        {index + 1}
                                    </td>
                                    <td className='check-table-body text-center'>
                                        {item?.product?.category?.code}
                                    </td>
                                    <td className='check-table-body text-center'>
                                        {item?.product?.productdata?.code}
                                    </td>
                                    <td className='check-table-body text-start'>
                                        {item?.product?.productdata?.name}
                                    </td>
                                    <td className='check-table-body'>
                                        {item?.pieces?.recived?.toLocaleString(
                                            'ru-RU'
                                        )}
                                    </td>
                                    <td className='check-table-body'>
                                        {item?.pieces?.send?.toLocaleString(
                                            'ru-RU'
                                        )}
                                    </td>
                                    <td className='check-table-body'>
                                        {item?.pieces?.delivered?.toLocaleString(
                                            'ru-RU'
                                        )}
                                    </td>
                                    <td className='check-table-body'>
                                        {item?.pieces?.returned?.toLocaleString(
                                            'ru-RU'
                                        )}
                                    </td>
                                    <td className='check-table-body'>
                                        {currencyType === 'USD'
                                            ? item?.totalprice?.toLocaleString(
                                                  'ru-RU'
                                              )
                                            : item?.totalpriceuzs?.toLocaleString(
                                                  'ru-RU'
                                              )}{' '}
                                        {currencyType}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className='border-t-[0.8px] border-black-700 w-full my-[1rem]'></div>
            <ul>
                <li className='check-ul-li-foot border-t-0'>
                {t('Jami')}:{' '}
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
