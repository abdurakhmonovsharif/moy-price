import React from 'react'
import {map} from 'lodash'
import {useSelector} from 'react-redux'
import {t} from 'i18next'

function DailyReportMobile({data}) {
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
                    
                    <li className='w-[90vw]  bg-white list-none mb-[10px]  rounded-md'>
                <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                    <p >
                        {name}
                    </p>    
                    <p>{dailyReport?.next ? dailyReport.next : ''}-
                    {currencyType === 'UZS'
                                 ? unitpriceuzs.toLocaleString('ru-RU')
                                 : unitprice.toLocaleString('ru-RU')
                                 } {currencyType}
                    </p>
                </li>
                <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                    <p className='gap-1 text-[blue]'><span>{t('Mijoz')}: </span>
                    {dailyReport.saleconnector?.client?.name ||
                                dailyReport.saleconnector?.id}
                    </p>    
                    <p className='text-[green]'><span></span>
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
                    </p>
                </li>
                <li className=' p-[10px] text-[blue] text-sm flex justify-between '>
                    <p className='text-[green]'><span>{t('Summa')}: </span>
                    {currencyType === 'UZS'
                                 ? unitpriceuzs.toLocaleString('ru-RU')
                                 : unitprice.toLocaleString('ru-RU')
                                 } {currencyType}
                    </p>    
                    <p ><span className='me-1 text-black-800'>{t('Avvalgi')}: {dailyReport?.previous || ''}</span>
                    
                    <span className='text-[red]'>{t('Qolgan')}: {dailyReport?.next ? dailyReport.next : ''}</span>
                    
                    </p>
                </li>
            </li>
                )
            })}
        </>
    )
}

export default DailyReportMobile
