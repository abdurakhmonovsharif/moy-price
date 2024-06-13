import React from 'react'
import {map, uniqueId} from 'lodash'
import {useSelector} from 'react-redux'

function DailyReport({data}) {
    const {currencyType} = useSelector((state) => state.currency)
    return (
        <>
            {map(data, (dailyReport, index) => {
                const {
                    product: {
                        productdata: {name, code},
                        unit,
                    },
                    pieces,
                    createdAt,
                    unitprice,
                    unitpriceuzs,
                    totalprice,
                    totalpriceuzs,
                    user: {firstname, lastname},
                } = dailyReport
                return (
                    <tr className='tr' key={uniqueId('daily-report-row')}>
                        <td className='text-left td py-[0.375rem]'>
                            {index + 1}
                        </td>
                        <td className='td'>
                            <span className={'flex justify-between w-full'}>
                                <p>
                                    {' '}
                                    {new Date(createdAt).toLocaleDateString(
                                        'ru-RU'
                                    )}{' '}
                                </p>
                                <p>
                                    {new Date(createdAt).toLocaleTimeString(
                                        'ru-RU',
                                        {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hourCycle: 'h24',
                                        }
                                    )}
                                </p>
                            </span>
                        </td>
                        <td className='text-left td'>
                            {dailyReport.saleconnector?.client?.name ||
                                dailyReport.saleconnector?.id}
                        </td>
                        <td className='td text-right'>{code}</td>
                        <td className='td'>{name}</td>
                        <td className='text-left td'>
                            {dailyReport?.previous || ''}
                        </td>
                        <td className='text-left td'>
                            {pieces + ' ' + unit.name || ''}
                        </td>
                        <td className='text-left td'>
                            {dailyReport?.next ? dailyReport.next : ''}
                        </td>
                        <td className='text-left td font-medium'>
                            {currencyType === 'UZS'
                                ? unitpriceuzs.toLocaleString('ru-RU')
                                : unitprice.toLocaleString('ru-RU')}
                        </td>
                        <td className='text-left td font-medium'>
                            {currencyType === 'UZS'
                                ? totalpriceuzs.toLocaleString('ru-RU')
                                : totalprice.toLocaleString('ru-RU')}
                        </td>
                        <td className='text-left td'>
                            {lastname[0] + '. ' + firstname}
                        </td>
                    </tr>
                )
            })}
        </>
    )
}

export default DailyReport
