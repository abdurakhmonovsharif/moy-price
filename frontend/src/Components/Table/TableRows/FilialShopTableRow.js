import React from 'react'
import {IoArrowRedoCircleSharp} from 'react-icons/io5'
import {map, uniqueId} from 'lodash'
import {Link} from 'react-router-dom'

export const FilialShopTableRow = ({
    data,
    currentPage,
    countPage,
    currency,
}) => {
    return (
        <>
          {data && map(data, (item, index) => (
                <tr className='tr' key={uniqueId('item')}>
                    <td className='text-left td'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='text-left td'>
                        {new Date(item?.createdAt).toLocaleDateString()}
                    </td>
                    <td className='text-left td'>{item?.id}</td>
                    <td className='text-left td'>{item?.products.length}</td>
                    <td className='text-left td'>{item?.pieces}</td>
                    <td className='text-left td font-medium'>
                        {currency === 'UZS'
                            ? (
                                  Math.round(item.totalincomingpriceuzs * 1) / 1
                              ).toLocaleString('ru-RU')
                            : (
                                  Math.round(item.totalincomingprice * 1000) /
                                  1000
                              ).toLocaleString('ru-RU')}{' '}
                        <span className='text-warning-500'>{currency}</span>
                    </td>
                    <td className='text-left td font-medium'>
                        {currency === 'UZS'
                            ? (
                                  Math.round(item?.totalsellingpriceuzs * 1) / 1
                              ).toLocaleString('ru-RU')
                            : (
                                  Math.round(item?.totalsellingprice * 1000) /
                                  1000
                              ).toLocaleString('ru-RU')}{' '}
                        <span className='text-warning-500'>{currency}</span>
                    </td>
                    <td className='py-[0.375rem] td text-center'>
                        <div className='flex items justify-center'>
                            <Link to='exchangesId' state={{id : item?._id}}>
                                <IoArrowRedoCircleSharp
                                    size={'1.75rem'}
                                    className='cursor-pointer text-black-800'
                                />
                            </Link>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
