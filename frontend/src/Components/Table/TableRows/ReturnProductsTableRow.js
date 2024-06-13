import {map, uniqueId} from 'lodash'
import React, {useEffect, useState} from 'react'
import TableBtn from '../../Buttons/TableBtn'
import {t} from 'i18next'

export const ReturnProductsTableRow = ({
                                           data,
                                           currentPage,
                                           countPage,
                                           currency,
                                           Print
                                       }) => {
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
            {map(data, (connector, index) => (
                !isMobile ? <tr className='tr' key={uniqueId('connector')}>
                        <td className='text-left td'>
                            {currentPage * countPage + 1 + index}
                        </td>
                        <td className='text-left td'>
                            {new Date(connector.createdAt).toLocaleDateString()}
                        </td>
                        <td className='text-left td'>
                            {connector.saleconnector.id}
                        </td>
                        <td className='text-left td'>
                            {connector.saleconnector?.client &&
                                connector.saleconnector?.client?.name}
                        </td>
                        <td className='text-left td'>
                            {Number(connector.count).toLocaleString()}
                        </td>
                        <td className='text-left td font-medium'>
                            {currency === 'UZS'
                                ? connector.totalpriceuzs.toLocaleString('ru-RU')
                                : connector.totalprice.toLocaleString('ru-RU')}{' '}
                            <span className='text-warning-500'>{currency}</span>
                        </td>
                        <td className='text-left td py-[0.625rem] font-medium'>
                            {currency === 'UZS'
                                ? connector.backuzs.toLocaleString('ru-RU')
                                : connector.back.toLocaleString('ru-RU')}{' '}
                            <span className='text-success-500'>{currency}</span>
                        </td>
                        <td className='td border-r-0 py-[6px]'>
                            <div className='flex justify-center items-center gap-[0.625rem]'>
                                <TableBtn
                                    type={'print'}
                                    bgcolor={'bg-primary-800'}
                                    onClick={() => Print(connector.dailyconnector)}
                                />
                            </div>
                        </td>
                    </tr> :
                    <li className='text-sm w-[90vw]  bg-[white] rounded-lg mb-2 list-none'>
                        <li className='flex justify-between p-[10px] border border-b-1 border-s-0 border-t-0 border-e-0'>
                            <p>{currentPage * countPage + 1 + index}- {new Date(connector.createdAt).toLocaleDateString()}</p>
                            <p className='text-[blue]'>{t('ID')}: {connector.saleconnector.id}</p>
                        </li>
                        <li className='flex justify-between p-[10px] border border-b-1 border-s-0 border-t-0 border-e-0'>
                            <p><span>{t('Mijoz')}: </span>{connector.saleconnector?.client &&
                                connector.saleconnector?.client?.name}</p>
                            <p className='text-[blue]'>{t('Soni')}: {Number(connector.count).toLocaleString()}</p>
                        </li>
                        <li className='flex justify-between p-[10px]  '><p className='text-[green]'>
                            <span>{t('Jami')}: </span>{currency === 'UZS'
                            ? connector.totalpriceuzs.toLocaleString('ru-RU')
                            : connector.totalprice.toLocaleString('ru-RU')}{' '}
                            <span className='text-warning-500'>{currency}</span></p>
                            <p className='text-[blue]'>{t('Qaytarilgan')}: {currency === 'UZS'
                                ? connector.backuzs.toLocaleString('ru-RU')
                                : connector.back.toLocaleString('ru-RU')}{' '}
                                <span className='text-success-500'>{currency}</span></p>
                        </li>
                        <li className='flex justify-end p-[10px]  '>
                            <div className='flex justify-center items-center gap-[0.625rem]'>
                                <TableBtn
                                    type={'print'}
                                    bgcolor={'bg-primary-800'}
                                    onClick={() => Print(connector.dailyconnector)}
                                />
                            </div>
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
                <td className='text-left td'>
                    {data.reduce((prev, el) => prev + el.count, 0)}
                </td>
                <td className='text-left td font-medium'>
                    {currency === 'UZS'
                        ? data.reduce((prev, el) => prev + el.totalpriceuzs, 0).toLocaleString('ru-RU')
                        : data.reduce((prev, el) => prev + el.totalprice, 0).toLocaleString('ru-RU')}{' '}
                    <span className='text-warning-500'>{currency}</span>
                </td>
                <td className='text-left td py-[0.625rem] font-medium'>
                    {currency === 'UZS'
                        ? data.reduce((prev, el) => prev + el.backuzs, 0).toLocaleString('ru-RU')
                        : data.reduce((prev, el) => prev + el.back, 0).toLocaleString('ru-RU')
                    }{' '}
                    <span className='text-success-500'>{currency}</span>
                </td>
                <td className='td border-r-0 py-[6px]'>

                </td>
            </tr>}
        </>
    )
}
