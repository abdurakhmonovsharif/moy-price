import React, {useEffect, useState} from 'react'
import TableBtn from '../../Buttons/TableBtn'
import {map, uniqueId} from 'lodash'
import {roundUsd, roundUzs} from '../../../App/globalFunctions'
import {t} from 'i18next'

export const SellerTableRow = ({
    data,
    currentPage,
    countPage,
    Edit,
    linkToSellerReports,
    currency,
    modalOpen1,
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
            {map(data, (seller, index) =>
                !isMobile ? (
                    <tr className='tr' key={uniqueId('filial')}>
                        <td className='text-left td'>
                            {currentPage * countPage + index + 1}
                        </td>
                        <td className='text-left td'>{seller.firstname}</td>
                        <td className='text-left td'>{seller.lastname}</td>
                        <td className='text-left td'>{seller.phone}</td>
                        <td className='text-left td'>{seller?.sales || 0}</td>
                        <td className='text-left td'>
                            {currency === 'USD'
                                ? seller?.totalsales?.toLocaleString('ru-RU')
                                : seller?.totalsalesuzs?.toLocaleString(
                                      'ru-RU'
                                  )}{' '}
                            {currency}
                        </td>
                        <td className='text-left td'>
                            {currency === 'USD'
                                ? roundUsd(seller?.profit).toLocaleString(
                                      'ru-RU'
                                  )
                                : roundUzs(seller?.profituzs).toLocaleString(
                                      'ru-RU'
                                  )}{' '}
                            {currency}
                        </td>
                        <td className='border-r-0 td py-[0.375rem]'>
                            <div className='flex items-center justify-center gap-[0.625rem]'>
                                <TableBtn
                                    type={'edit'}
                                    bgcolor={'bg-warning-500'}
                                    onClick={() => Edit(seller)}
                                />
                                <TableBtn
                                    type={'info'}
                                    bgcolor={'bg-primary-800'}
                                    onClick={() =>
                                        linkToSellerReports(seller._id)
                                    }
                                />
                            </div>
                        </td>
                    </tr>
                ) : (
                    <li className='w-[90vw]  bg-white list-none mb-[10px]  rounded-md'>
                        <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                            <p className='text-lg'>
                                {seller.firstname} {seller.lastname}
                            </p>
                        </li>
                        <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                            <p>
                                {t('Sotuvlar')}
                                {': '}
                                {seller?.sales || 0}
                            </p>
                            <p>
                                {t('Summa')}
                                {': '}
                                {currency === 'USD'
                                    ? seller?.totalsales?.toLocaleString(
                                          'ru-RU'
                                      )
                                    : seller?.totalsalesuzs?.toLocaleString(
                                          'ru-RU'
                                      )}{' '}
                                {currency}
                            </p>
                        </li>
                        <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                            <p className='text-[green]'>
                                {t('Sof foyda')}
                                {': '}
                                {currency === 'USD'
                                    ? roundUsd(seller?.profit).toLocaleString(
                                          'ru-RU'
                                      )
                                    : roundUzs(
                                          seller?.profituzs
                                      ).toLocaleString('ru-RU')}{' '}
                                {currency}
                            </p>
                        </li>
                        <li className=' p-[10px] text-sm flex justify-center border-s-0 '>
                            <p className='text-[green]'>
                                <div className='flex items-center justify-center gap-[0.625rem]'>
                                    <TableBtn
                                        type={'edit'}
                                        bgcolor={'bg-warning-500 w-[41vw]'}
                                        onClick={() => {
                                            Edit(seller)
                                            modalOpen1(true)
                                        }}
                                    />
                                    <TableBtn
                                        type={'info'}
                                        bgcolor={'bg-primary-800 w-[41vw]'}
                                        onClick={() =>
                                            linkToSellerReports(seller._id)
                                        }
                                    />
                                </div>
                            </p>
                        </li>
                    </li>
                )
            )}
        </>
    )
}
