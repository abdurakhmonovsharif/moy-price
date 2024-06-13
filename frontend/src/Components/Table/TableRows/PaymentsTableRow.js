import {map, uniqueId} from 'lodash'
import React, {useEffect, useState} from 'react'
import {roundUsd} from '../../../App/globalFunctions'
import TableBtn from '../../Buttons/TableBtn'
import {t} from 'i18next'

export const PaymentsTableRow = ({
                                     data,
                                     currentPage,
                                     countPage,
                                     currency,
                                     Print,
                                     type
                                 }) => {

    const payDebt = data.reduce((prev, el) => {
        if (!el.totalprice) {
            prev += el.cash + el.card + el.transfer
        }
        return prev
    }, 0)
    const payDebtUzs = data.reduce((prev, el) => {
        if (!el.totalprice) {
            prev += el.cashuzs + el.carduzs + el.transferuzs
        }
        return prev
    }, 0)
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
            {map(data, (sale, index) => (
                !isMobile ? <tr className='tr' key={uniqueId('sale')}>
                        <td className='text-left td'>
                            {currentPage * countPage + 1 + index}
                        </td>
                        <td className='text-left td'>
                            {new Date(sale.createdAt).toLocaleDateString()}
                        </td>
                        <td className='text-left td'>{sale.id}</td>
                        <td className='text-left td'>{sale?.client?.name}</td>
                        <td className='text-left td py-[0.625rem] font-bold'>
                            {currency === 'USD'
                                ? sale?.cash?.toLocaleString('ru-RU')
                                : sale?.cashuzs?.toLocaleString('ru-RU')}{' '}
                            {currency}
                        </td>
                        <td className='text-left td py-[0.625rem] font-bold'>
                            {currency === 'USD'
                                ? sale?.card?.toLocaleString('ru-RU')
                                : sale?.carduzs?.toLocaleString('ru-RU')}{' '}
                            {currency}
                        </td>
                        <td className='text-left td py-[0.625rem] font-bold'>
                            {currency === 'USD'
                                ? sale?.transfer?.toLocaleString('ru-RU')
                                : sale?.transferuzs?.toLocaleString('ru-RU')}{' '}
                            {currency}
                        </td>
                        <td className='text-success-500 text-left td py-[0.625rem] font-bold'>
                            {!sale.totalprice ? (<>
                                {currency === 'USD' ? (sale.cash + sale.card + sale.transfer).toLocaleString('ru-RU') : (sale.cashuzs + sale.carduzs + sale.transferuzs).toLocaleString('ru-RU')}
                            </>) : 0} {' '}
                            {currency}
                        </td>
                        <td className='text-left td py-[0.625rem] font-bold'>
                            {sale.cash < 0 || sale.carrd < 0 || sale.transfer < 0 ? (<>
                                {currency === 'USD' ? (sale.cash + sale.card + sale.transfer).toLocaleString('ru-RU') : (sale.cashuzs + sale.carduzs + sale.transferuzs).toLocaleString('ru-RU')}
                            </>) : 0} {' '}
                            {currency}
                        </td>
                        <td className='py-[0.375rem] td border-r-0'>
                            <div className='flex items-center justify-center gap-[0.625rem]'>
                                <TableBtn
                                    type={'print'}
                                    bgcolor={'bg-primary-800'}
                                    onClick={() => Print(sale.saleconnector)}
                                />
                            </div>
                        </td>
                    </tr> :
                    <li className='text-sm w-[90vw]  bg-[white] rounded-lg mb-2 list-none'>
                        <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                            <p><span>{currentPage * countPage + 1 + index}- </span>
                                {new Date(sale.createdAt).toLocaleDateString()}
                            </p>
                            <p className='text-[green]'><span>{t('Mijoz')}: </span>
                                {sale?.client?.name}
                            </p>
                        </li>
                        <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                            <p><span>{t('Naqt')}: </span>{currency === 'USD'
                                ? sale?.cash?.toLocaleString('ru-RU')
                                : sale?.cashuzs?.toLocaleString('ru-RU')}{' '}
                                {currency}
                            </p>
                            <p className='text-[black]'><span>{t('Plastik')}: </span>
                                {currency === 'USD'
                                    ? sale?.card?.toLocaleString('ru-RU')
                                    : sale?.carduzs?.toLocaleString('ru-RU')}{' '}
                                {currency}
                            </p>
                        </li>
                        <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                            <p><span>{t('O\'tkazma')}: </span>
                                {currency === 'USD'
                                    ? sale?.transfer?.toLocaleString('ru-RU')
                                    : sale?.transferuzs?.toLocaleString('ru-RU')}{' '}
                                {currency}
                            </p>
                            <p className='text-[green]'><span>{t('Qarzdan To\'lov')}: </span>
                                {!sale.totalprice ? (<>
                                    {currency === 'USD' ? (sale.cash + sale.card + sale.transfer).toLocaleString('ru-RU') : (sale.cashuzs + sale.carduzs + sale.transferuzs).toLocaleString('ru-RU')}
                                </>) : 0} {' '}
                                {currency}
                            </p>
                        </li>
                        <li className=' p-[10px] text-sm flex justify-between items-center '>
                            <p><span>{t('Qaytarilgan')}: </span>
                                {sale.cash < 0 || sale.carrd < 0 || sale.transfer < 0 ? (<>
                                    {currency === 'USD' ? (sale.cash + sale.card + sale.transfer).toLocaleString('ru-RU') : (sale.cashuzs + sale.carduzs + sale.transferuzs).toLocaleString('ru-RU')}
                                </>) : 0} {' '}
                                {currency}
                            </p>
                            <TableBtn
                                type={'print'}
                                bgcolor={'bg-primary-800'}
                                onClick={() => Print(sale.saleconnector)}
                            />
                        </li>
                    </li>
            ))}
            {
                !isMobile && <tr className='tr'>
                    <td className='text-left td'>
                    </td>
                    <td className='text-left td'>
                    </td>
                    <td className='text-left td'></td>
                    <td className='text-left td'></td>
                    <td className='text-left td py-[0.625rem] font-bold'>
                        {currency === 'USD'
                            ? data.reduce((prev, el) => prev + el.cash, 0).toLocaleString('ru-RU')
                            : data.reduce((prev, el) => prev + el.cashuzs, 0).toLocaleString('ru-RU')} {' '}
                        {currency}
                    </td>
                    <td className='text-left td py-[0.625rem] font-bold'>
                        {currency === 'USD'
                            ? data.reduce((prev, el) => prev + el.card, 0).toLocaleString('ru-RU')
                            : data.reduce((prev, el) => prev + el.carduzs, 0).toLocaleString('ru-RU')
                        }{' '}
                        {currency}
                    </td>
                    <td className='text-left td py-[0.625rem] font-bold'>
                        {currency === 'USD'
                            ? data.reduce((prev, el) => prev + el.transfer, 0).toLocaleString('ru-RU')
                            : data.reduce((prev, el) => prev + el.transferuzs, 0).toLocaleString('ru-RU')
                        }{' '}
                        {currency}
                    </td>

                    <td className='p-2 td font-bold text-success-500'>{currency === 'USD' ?
                        roundUsd(payDebt).toLocaleString('ru-RU')
                        : roundUsd(payDebtUzs).toLocaleString('ru-RU')}{' '} {currency} </td>
                    <td className='text-left td py-[0.625rem] font-bold'>
                        {currency === 'USD'
                            ? data.reduce((prev, el) => prev + (el.cash < 0 || el.carrd < 0 || el.transfer < 0 ? (el.cash + el.card + el.transfer) : 0), 0).toLocaleString('ru-RU')
                            : data.reduce((prev, el) => prev + (el.cash < 0 || el.carrd < 0 || el.transfer < 0 ? (el.cashuzs + el.carduzs + el.transferuzs) : 0), 0).toLocaleString('ru-RU')
                        }{' '}
                        {currency}
                    </td>
                    <td className='py-[0.375rem] td border-r-0'>
                    </td>
                </tr>
            }
        </>
    )
}
