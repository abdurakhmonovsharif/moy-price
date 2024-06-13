import React, {useEffect, useState} from 'react'
import {map} from 'lodash'
import TableBtn from '../../Buttons/TableBtn'
import TableInput from '../../Inputs/TableInput'
import {IoAdd, IoEye, IoEyeOff, IoRemove} from 'react-icons/io5'
export const IncomingOrderProductsTableRow = ({
    data,
    currency,
    increment,
    decrement,
    handleDelete,
    handleCountProduct,
    handleUnitPrice,
}) => {
    const [showIncomingPrice, setShowIncomingPrice] = useState([])
    const changeShow = (i) => {
        const price = [...showIncomingPrice]
        price[i] = !price[i]
        setShowIncomingPrice([...price])
    }
    useEffect(() => {
        setShowIncomingPrice(map(data, () => false))
    }, [data])
    return (
        <>
            {map(data, (item, index) => (
                <tr key={index} className='tr'>
                    <td className='td py-2'>{1 + index}</td>
                    <td className='td text-center'> {item?.product?.code}</td>
                    <td className='td text-left'>{item?.product?.name}</td>
                    <td className='td text-end'>
                        {item?.total?.toLocaleString('ru-Ru')}{' '}
                        {item?.unit?.name}
                    </td>
                    <td className='td text-end'>
                        {item?.pieces?.recived} {item?.unit?.name}
                    </td>
                    <td className='td text-end'>
                        <span className={'flex gap-[0.6rem] items-center'}>
                            <button
                                onClick={() => decrement(item?.product?._id)}
                                className={
                                    'rounded-[4px] duration-100 bg-error-500 hover:bg-error-600 p-[0.2rem] text-base text-white-900 active:scale-95'
                                }
                            >
                                <IoRemove size={'0.875rem'} />
                            </button>
                            <TableInput
                                value={item?.pieces?.send}
                                onChange={(e) => {
                                    handleCountProduct(e, item.product._id)
                                }}
                                type={'number'}
                            />
                            <button
                                onClick={() => increment(item?.product?._id)}
                                className={
                                    'rounded-[4px] duration-100 bg-success-500 hover:bg-success-600 p-[0.2rem] text-base text-white-900 active:scale-95'
                                }
                            >
                                <IoAdd size={'0.875rem'} />
                            </button>
                        </span>
                    </td>
                    <td className='text-left td'>
                        <TableInput
                            value={
                                currency === 'UZS'
                                    ? item?.unitpriceuzs
                                    : item?.unitprice
                            }
                            onChange={(e) =>
                                handleUnitPrice(e, item.product._id)
                            }
                            type={'number'}
                        />
                    </td>
                    <td className='td text-end'>
                        {currency === 'UZS'
                            ? item?.totalpriceuzs?.toLocaleString('ru-Ru')
                            : item?.totalprice?.toLocaleString('ru-Ru')}{' '}
                        {currency}
                    </td>
                    <td className='td'>
                        <div className='flex items-center justify-center gap-[5px]'>
                            <TableBtn
                                onClick={() => handleDelete(index)}
                                type={'delete'}
                                bgcolor={'bg-error-500'}
                            />
                        </div>
                    </td>
                    <td className='td border-r-0 text-success-500'>
                        <div className='flex justify-between'>
                            <button onClick={() => changeShow(index)}>
                                {showIncomingPrice[index] ? (
                                    <IoEye />
                                ) : (
                                    <IoEyeOff />
                                )}
                            </button>
                            <span className='min-w-fit'>
                                {showIncomingPrice[index]
                                    ? currency === 'UZS'
                                        ? item?.incomingpriceuzs?.toLocaleString(
                                              'ru-Ru'
                                          ) + ' UZS'
                                        : item?.incomingprice?.toLocaleString(
                                              'ru-Ru'
                                          ) + ' USD'
                                    : ''}
                            </span>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
