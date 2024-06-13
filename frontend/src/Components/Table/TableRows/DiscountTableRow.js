import {map, uniqueId} from 'lodash'
import React, {useEffect, useState} from 'react'
import {t} from 'i18next'

export const DiscountTableRow = ({data, currentPage, countPage, currency}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    return (
        <>
            {map(data, (discount, index) => (
                !isMobile ? <tr className='tr' key={uniqueId('discount')}>
                        <td className='text-left td'>
                            {currentPage * countPage + 1 + index}
                        </td>
                        <td className='text-left td'>
                            {new Date(discount.createdAt).toLocaleDateString()}
                        </td>
                        <td className='text-left td'>
                            {discount.saleconnector.id}
                        </td>
                        <td className='text-left td'>
                            {discount.client && discount.client.name}
                        </td>
                        <td className='text-left td font-medium'>
                            {currency === 'UZS'
                                ? (
                                    Math.round(discount.totalpriceuzs * 1) / 1
                                ).toLocaleString('ru-RU')
                                : (
                                    Math.round(discount.totalprice * 1000) / 1000
                                ).toLocaleString('ru-RU')}{' '}
                            <span className='text-warning-500'>{currency}</span>
                        </td>
                        <td className='text-left td py-[0.625rem] font-medium'>
                            {currency === 'UZS'
                                ? (
                                    Math.round(discount.discountuzs * 1) / 1
                                ).toLocaleString('ru-RU')
                                : (
                                    Math.round(discount.discount * 1000) / 1000
                                ).toLocaleString('ru-RU')}{' '}
                            <span className='text-success-500'>{currency}</span>
                        </td>
                        <td className='text-left td border-r-0 py-[0.625rem] font-medium'>
                            {discount?.procient?.toLocaleString()}{' '}
                            <span className='text-primary-500'>%</span>
                        </td>
                    </tr> :
                    <li className='text-sm w-[90vw]  bg-[white] rounded-lg mb-2 list-none'>
                        <li className='flex justify-between p-[10px] border border-b-1 border-s-0 border-t-0 border-e-0'>
                            <p>{currentPage * countPage + 1 + index}- {new Date(discount.createdAt).toLocaleDateString()}</p>
                            <p className='text-[blue]'>{t('ID')}: {discount.saleconnector.id}</p>
                        </li>

                        <li className='flex justify-between p-[10px] border border-b-1 border-s-0 border-t-0 border-e-0'>
                            <p className='text-warning-500'><span>{t('Chegirma')}</span>: {currency === 'UZS'
                                ? (
                                    Math.round(discount.discountuzs * 1) / 1
                                ).toLocaleString('ru-RU')
                                : (
                                    Math.round(discount.discount * 1000) / 1000
                                ).toLocaleString('ru-RU')}{' '}
                                <span className=''>{currency}</span></p>
                            <p className='text-[blue]'>{t('Mijoz')}: {discount.client && discount.client.name}</p>
                        </li>

                        <li className='flex justify-between p-[10px] '>
                            <p className='text-[blue]'>{t('Jami')}: {currency === 'UZS'
                                ? (
                                    Math.round(discount.totalpriceuzs * 1) / 1
                                ).toLocaleString('ru-RU')
                                : (
                                    Math.round(discount.totalprice * 1000) / 1000
                                ).toLocaleString('ru-RU')}{' '}
                                <span className=''>{currency}</span></p>
                            <p className='text-primary-500'>
                                <span>{t('Foiz')}</span>: {discount?.procient?.toLocaleString()}{' '}
                                <span className='text-primary-500'>%</span></p>
                        </li>
                    </li>
            ))}
            {!isMobile && <tr className='tr'>
                <td className='text-left td'>
                </td>
                <td className='text-left td'>
                </td>
                <td className='text-left td'>
                </td>
                <td className='text-left td'>
                </td>
                <td className='text-left td font-medium'>
                    {currency === 'UZS'
                        ? data.reduce((prev, el) => prev + Math.round(el.totalpriceuzs * 1) / 1, 0).toLocaleString('ru-RU')
                        : data.reduce((prev, el) => prev + Math.round(el.totalprice * 1000) / 1000, 0).toLocaleString('ru-RU')}{' '}
                    <span className='text-warning-500'>{currency}</span>
                </td>
                <td className='text-left td py-[0.625rem] font-medium'>
                    {currency === 'UZS'
                        ? data.reduce((prev, el) => prev + Math.round(el.discountuzs * 1) / 1, 0).toLocaleString('ru-RU')
                        : data.reduce((prev, el) => prev + Math.round(el.discount * 1000) / 1000, 0).toLocaleString('ru-RU')}{' '}
                    <span className='text-success-500'>{currency}</span>
                </td>
                <td className='text-left td border-r-0 py-[0.625rem] font-medium'>
                    {data.reduce((prev, el) => prev + el.procient, 0).toLocaleString()}{' '}
                    <span className='text-primary-500'>%</span>
                </td>
            </tr>}
        </>
    )
}
