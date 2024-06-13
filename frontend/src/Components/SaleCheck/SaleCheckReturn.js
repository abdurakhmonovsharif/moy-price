import React, {forwardRef} from 'react'
import {useSelector} from 'react-redux'
import {uniqueId, map} from 'lodash'
import { t } from 'i18next'

export const SaleCheckReturn = forwardRef((props, ref) => {
    const {product} = props
    const totalprice = (datas, property) => {
        return datas.reduce((summ, data) => summ + data[property], 0)
    }
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
                            {new Date(product?.createdAt).toLocaleDateString()}
                        </span>
                    </li>
                    <li className='check-ul-li'>
                        {t('Mijoz')}:{' '}
                        <span className='check-ul-li-span'>
                            {product?.client?.name ||
                                product?.packman?.name ||
                                ''}
                        </span>
                    </li>
                </ul>
                <div className='check-ul-li flex-col'>
                    <div className={'grow text-center'}>
                        <h2 className='check-text-style mb-5'>
                            {t('Sotuv')}:{' '}
                            <span className={'ml-2'}>
                                {product?.saleconnector.id}
                            </span>
                        </h2>
                        <h2 className='check-text-style'>
                            {t('Chek')}: {product?.id}
                        </h2>
                    </div>
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
            <div className='mt-4'>
                <table className='border-collapse border border-slate-400 w-full break-inside-auto'>
                    <thead>
                        <tr className={'break-inside-avoid break-after-auto'}>
                            <td className='check-table-rtr'>№</td>
                            <td className='check-table-rtr'>{t('Kodi')}</td>
                            <td className='check-table-rtr'>{t('Maxsulot')}</td>
                            <td className='check-table-rtr'>{t('Soni')}</td>
                            <td className='check-table-rtr'>{t('Narxi')} ({t('dona')})</td>
                            <td className='check-table-rtr'>{t('Jami')}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {map(product?.products, (item, index) => {
                            return (
                                <tr key={uniqueId('sale-check-return')}>
                                    <td className='p-1 border text-center text-[0.875rem] font-bold'>
                                        {index + 1}
                                    </td>
                                    <td className='check-table-body text-end'>
                                        {item?.product?.productdata?.code}
                                    </td>
                                    <td className='check-table-body text-start'>
                                        {item?.product?.productdata?.name}
                                    </td>
                                    <td className='check-table-body'>
                                        {item?.pieces}
                                    </td>
                                    <td className='check-table-body'>
                                        {currencyType === 'USD'
                                            ? item?.unitprice
                                            : item?.unitpriceuzs}{' '}
                                        {currencyType}
                                    </td>
                                    <td className='check-table-body'>
                                        {(currencyType === 'USD'
                                            ? item?.totalprice
                                            : item?.totalpriceuzs
                                        ).toLocaleString('ru-RU')}{' '}
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
                    {' '}
                    Jami:{' '}
                    <span>
                        {totalprice(
                            product.products,
                            currencyType === 'UZS'
                                ? 'totalpriceuzs'
                                : 'totalprice'
                        ).toLocaleString('ru-RU')}{' '}
                        {currencyType}
                    </span>
                </li>
                <li className='check-ul-li-foot'>
                    {' '}
                    To'langan:{' '}
                    <span>
                        {(currencyType === 'USD'
                            ? product?.payment?.payment || 0
                            : product?.payment?.paymentuzs || 0
                        ).toLocaleString('ru-RU')}{' '}
                        {currencyType}
                    </span>
                </li>
            </ul>
        </div>
    )
})
