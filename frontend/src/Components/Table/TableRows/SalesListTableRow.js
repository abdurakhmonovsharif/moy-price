import React, {useEffect, useState} from 'react'
import TableBtn from '../../Buttons/TableBtn'
import {map, uniqueId} from 'lodash'
import {useLocation, useNavigate} from 'react-router-dom'
import {t} from 'i18next'
import {useDispatch} from 'react-redux'
export const SalesListTableRow = ({
    data,
    currentPage,
    countPage,
    currency,
    Print,
    sellers,
    addPlus,
    editComment,
    handleDelete,
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
    const location = useLocation()
    const dispatch = useDispatch()
    const result = (prev, usd, uzs) => {
        return currency === 'USD' ? prev + usd : prev + uzs
    }
    const reduceEl = (arr, usd, uzs) => {
        return (
            (arr.length > 0 &&
                arr.reduce((prev, item) => {
                    return result(prev, item[usd], item[uzs])
                }, 0)) ||
            0
        )
    }

    const navigate = useNavigate()
    const linkToSale = (saleconnector, returnProducts) => {
        navigate(`${sellers ? '/' : '/sotuv/sotish'}`, {
            replace: true,
            state: {saleconnector, returnProducts},
        })
    }

    const handleDeleteProduct = (item) => {
        handleDelete(item)
    }
    if (location.pathname.includes('/kassa/sale')) {
        return (
            <>
                {map(data, (saleconnector, index) => (
                    <tr className='tr' key={uniqueId('sales')}>
                        <td className='text-left td'>
                            {currentPage * countPage + 1 + index}
                        </td>
                        <td className='td '>
                            <div className='flex justify-between'>
                                <span>
                                    {new Date(
                                        saleconnector.updatedAt
                                    ).toLocaleDateString()}
                                </span>
                                <span>
                                    {new Date(
                                        saleconnector.updatedAt
                                    ).toLocaleTimeString()}{' '}
                                </span>
                            </div>
                        </td>
                        <td className='text-left td'>{saleconnector.id}</td>
                        <td className='text-left td'>
                            {saleconnector?.client?.name ? (
                                <div className='flex justify-between items-center'>
                                    <span> {saleconnector?.client?.name}</span>
                                    <TableBtn
                                        type={'edit'}
                                        bgcolor={'bg-success-500'}
                                        onClick={() =>
                                            addPlus(saleconnector._id)
                                        }
                                    />
                                </div>
                            ) : (
                                <div className='flex justify-center items-center'>
                                    <TableBtn
                                        type={'add'}
                                        bgcolor={'bg-success-500'}
                                        onClick={() =>
                                            addPlus(saleconnector._id)
                                        }
                                    />
                                </div>
                            )}
                        </td>
                        <td className='text-success-500 text-left td'>
                            {reduceEl(
                                saleconnector.products,
                                'totalprice',
                                'totalpriceuzs'
                            ).toLocaleString('ru-Ru')}{' '}
                            {currency}
                        </td>
                        <td className='text-warning-500 text-left td'>
                            {(
                                reduceEl(
                                    saleconnector.payments,
                                    'cash',
                                    'cashuzs'
                                ) +
                                reduceEl(
                                    saleconnector.payments,
                                    'card',
                                    'carduzs'
                                ) +
                                reduceEl(
                                    saleconnector.payments,
                                    'transfer',
                                    'transferuzs'
                                )
                            ).toLocaleString('ru-Ru')}{' '}
                            {currency}
                        </td>
                        <td className='text-error-500 text-left td'>
                            {(
                                reduceEl(
                                    saleconnector.products,
                                    'totalprice',
                                    'totalpriceuzs'
                                ) -
                                reduceEl(
                                    saleconnector.payments,
                                    'payment',
                                    'paymentuzs'
                                ) -
                                reduceEl(
                                    saleconnector.discounts,
                                    'discount',
                                    'discountuzs'
                                )
                            ).toLocaleString('ru-Ru')}{' '}
                            {currency}
                        </td>
                        <td className='text-left td  '>
                            {saleconnector.dailyconnectors[
                                saleconnector.dailyconnectors.length - 1
                            ].comment ? (
                                <div className='flex justify-between items-center'>
                                    <span>
                                        {
                                            saleconnector.dailyconnectors[
                                                saleconnector.dailyconnectors
                                                    .length - 1
                                            ].comment
                                        }
                                    </span>
                                    <TableBtn
                                        type={'edit'}
                                        bgcolor={'bg-success-500'}
                                        onClick={() =>
                                            editComment(
                                                saleconnector.dailyconnectors[
                                                    saleconnector
                                                        .dailyconnectors
                                                        .length - 1
                                                ],
                                                saleconnector.dailyconnectors[
                                                    saleconnector
                                                        .dailyconnectors
                                                        .length - 1
                                                ].comment
                                            )
                                        }
                                    />
                                </div>
                            ) : (
                                <div className='flex justify-center items-center'>
                                    <TableBtn
                                        type={'add'}
                                        bgcolor={'bg-success-500'}
                                        onClick={() =>
                                            editComment(
                                                saleconnector.dailyconnectors[
                                                    saleconnector
                                                        .dailyconnectors
                                                        .length - 1
                                                ],
                                                saleconnector.dailyconnectors[
                                                    saleconnector
                                                        .dailyconnectors
                                                        .length - 1
                                                ].comment
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </td>

                        <td className='py-[0.375rem] td border-r-0'>
                            <div className='flex items-center justify-center gap-[0.625rem]'>
                                <TableBtn
                                    type={'print'}
                                    bgcolor={'bg-primary-800'}
                                    onClick={() => Print(saleconnector)}
                                />
                                {!location.pathname.includes('/kassa/sale') && (
                                    <>
                                        <TableBtn
                                            type={'add'}
                                            bgcolor={'bg-success-500'}
                                            onClick={() =>
                                                linkToSale(saleconnector)
                                            }
                                        />
                                        <TableBtn
                                            type={'return'}
                                            bgcolor={'bg-error-500'}
                                            onClick={() =>
                                                linkToSale(
                                                    saleconnector.saleconnector,
                                                    true
                                                )
                                            }
                                        />
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </>
        )
    }
    return (
        <>
            {map(data, (saleconnector, index) =>
                !isMobile ? (
                    <tr className='tr' key={uniqueId('sales')}>
                        <td className='text-left td'>
                            {currentPage * countPage + 1 + index}
                        </td>
                        <td className='td '>
                            <div className='flex justify-between'>
                                <span>
                                    {new Date(
                                        saleconnector.updatedAt
                                    ).toLocaleDateString()}
                                </span>
                                <span>
                                    {new Date(
                                        saleconnector.updatedAt
                                    ).toLocaleTimeString()}{' '}
                                </span>
                            </div>
                        </td>
                        <td className='text-left td'>{saleconnector?.id}</td>
                        <td className='text-left td'>
                            {saleconnector?.client?.name ? (
                                <div className='flex justify-between items-center'>
                                    <span> {saleconnector?.client?.name}</span>
                                    <TableBtn
                                        type={'edit'}
                                        bgcolor={'bg-success-500'}
                                        onClick={() =>
                                            addPlus(saleconnector._id)
                                        }
                                    />
                                </div>
                            ) : (
                                <div className='flex justify-center items-center'>
                                    <TableBtn
                                        type={'add'}
                                        bgcolor={'bg-success-500'}
                                        onClick={() =>
                                            addPlus(saleconnector._id)
                                        }
                                    />
                                </div>
                            )}
                        </td>
                        <td className='text-success-500 text-left td'>
                            {reduceEl(
                                saleconnector.products,
                                'totalprice',
                                'totalpriceuzs'
                            ).toLocaleString('ru-Ru')}{' '}
                            {currency}
                        </td>
                        <td className='text-warning-500 text-left td'>
                            {reduceEl(
                                saleconnector.discounts,
                                'discount',
                                'discountuzs'
                            ).toLocaleString('ru-Ru')}{' '}
                            {currency}
                        </td>
                        <td className='text-error-500 text-left td'>
                            {(
                                reduceEl(
                                    saleconnector.products,
                                    'totalprice',
                                    'totalpriceuzs'
                                ) -
                                reduceEl(
                                    saleconnector.payments,
                                    'payment',
                                    'paymentuzs'
                                ) -
                                reduceEl(
                                    saleconnector.discounts,
                                    'discount',
                                    'discountuzs'
                                )
                            ).toLocaleString('ru-Ru')}{' '}
                            {currency}
                        </td>
                        <td className='text-left td  '>
                            {saleconnector.dailyconnectors[
                                saleconnector.dailyconnectors.length - 1
                            ].comment ? (
                                <div className='flex justify-between items-center'>
                                    <span>
                                        {
                                            saleconnector.dailyconnectors[
                                                saleconnector.dailyconnectors
                                                    .length - 1
                                            ].comment
                                        }
                                    </span>
                                    <TableBtn
                                        type={'edit'}
                                        bgcolor={'bg-success-500'}
                                        onClick={() =>
                                            editComment(
                                                saleconnector.dailyconnectors[
                                                    saleconnector
                                                        .dailyconnectors
                                                        .length - 1
                                                ],
                                                saleconnector.dailyconnectors[
                                                    saleconnector
                                                        .dailyconnectors
                                                        .length - 1
                                                ].comment
                                            )
                                        }
                                    />
                                </div>
                            ) : (
                                <div className='flex justify-center items-center'>
                                    <TableBtn
                                        type={'add'}
                                        bgcolor={'bg-success-500'}
                                        onClick={() =>
                                            editComment(
                                                saleconnector.dailyconnectors[
                                                    saleconnector
                                                        .dailyconnectors
                                                        .length - 1
                                                ],
                                                saleconnector.dailyconnectors[
                                                    saleconnector
                                                        .dailyconnectors
                                                        .length - 1
                                                ].comment
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </td>
                        <td className='py-[0.375rem] td border-r-0'>
                            <div className='flex items-center justify-center gap-[0.625rem]'>
                                <TableBtn
                                    type={'print'}
                                    bgcolor={'bg-primary-800'}
                                    onClick={() => Print(saleconnector)}
                                />

                                {!location.pathname.includes('/kassa/sale') && (
                                    <>
                                        <TableBtn
                                            type={'return'}
                                            bgcolor={'bg-error-500'}
                                            onClick={() =>
                                                linkToSale(
                                                    saleconnector.saleconnector,
                                                    true
                                                )
                                            }
                                        />
                                        <TableBtn
                                            type={'add'}
                                            bgcolor={'bg-success-500'}
                                            onClick={() =>
                                                linkToSale(saleconnector)
                                            }
                                        />
                                        <TableBtn
                                            type={'delete'}
                                            bgcolor={'bg-error-500'}
                                            onClick={() =>
                                                handleDeleteProduct(
                                                    saleconnector
                                                )
                                            }
                                        />
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ) : (
                    <li
                        onClick={() => Print(saleconnector)}
                        className='text-sm w-[90vw] bg-[white] rounded-lg m-1 list-none'
                    >
                        <li className='border p-[10px] text-[black] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                            <p>
                                {t('Mijoz')}: {saleconnector?.client?.name}
                            </p>
                            <p>
                                <span>
                                    {new Date(
                                        saleconnector.updatedAt
                                    ).toLocaleDateString()}{' '}
                                </span>
                                <span>
                                    {new Date(
                                        saleconnector.updatedAt
                                    ).toLocaleTimeString()}{' '}
                                </span>
                            </p>
                        </li>
                        <li className='border p-[10px] text-[blue] text-sm flex items-center justify-between border-s-0 border-t-0 border-e-0'>
                            <p className='text-[green]'>
                                {t('Jami')}{' '}
                                {reduceEl(
                                    saleconnector.products,
                                    'totalprice',
                                    'totalpriceuzs'
                                ).toLocaleString('ru-Ru')}{' '}
                                {currency}
                            </p>
                            <p className='text-warning-500'>
                                {t('Chegirma')}
                                {`: `}
                                {reduceEl(
                                    saleconnector.discounts,
                                    'discount',
                                    'discountuzs'
                                ).toLocaleString('ru-Ru')}{' '}
                                {currency}
                            </p>
                        </li>
                        <li className=' p-[10px] text-[blue] text-sm flex items-center justify-between '>
                            <p className='text-[red]'>
                                {t('Qarz')}{' '}
                                {(
                                    reduceEl(
                                        saleconnector.products,
                                        'totalprice',
                                        'totalpriceuzs'
                                    ) -
                                    reduceEl(
                                        saleconnector.payments,
                                        'payment',
                                        'paymentuzs'
                                    ) -
                                    reduceEl(
                                        saleconnector.discounts,
                                        'discount',
                                        'discountuzs'
                                    )
                                ).toLocaleString('ru-Ru')}{' '}
                                {currency}
                            </p>
                            <p>
                                {!location.pathname.includes('/kassa/sale') && (
                                    <>
                                        <div className='flex gap-2'>
                                            <TableBtn
                                                type={'add'}
                                                bgcolor={'bg-success-500'}
                                                onClick={() =>
                                                    linkToSale(saleconnector)
                                                }
                                            />
                                            <TableBtn
                                                type={'return'}
                                                bgcolor={'bg-error-500'}
                                                onClick={() =>
                                                    linkToSale(
                                                        saleconnector.saleconnector,
                                                        true
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </p>
                        </li>
                    </li>
                )
            )}
        </>
    )
}
