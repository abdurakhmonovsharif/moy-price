import React from 'react'
import {map, uniqueId} from 'lodash'
export const FilialShopDataIdTableRow = ({
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
                        {item?.category?.code}
                    </td>
                    <td className='text-left td py-[0.75rem]'>{item?.productdata?.code}</td>
                    <td className='text-left td'>{item?.productdata?.name}</td>
                    <td className='text-left td'>{item?.pieces}</td>
                    <td className='text-left td font-medium'>
                        {currency === 'UZS'
                            ? (
                                  Math.round(item?.price?.incomingpriceuzs * 1) / 1
                              ).toLocaleString('ru-RU')
                            : (
                                  Math.round(item?.price?.incomingprice * 1000) /
                                  1000
                              ).toLocaleString('ru-RU')}{' '}
                        <span className='text-warning-500'>{currency}</span>
                    </td>
                    <td className='text-left td font-medium'>
                        {currency === 'UZS'
                             ? (
                                Math.round(item?.price?.incomingpriceuzs + item?.price?.sellingpriceuzs)
                            ).toLocaleString('ru-RU')
                          : (
                                Math.round(item?.price?.incomingprice + item?.price?.sellingprice) 
                            ).toLocaleString('ru-RU')}{' '}
                      <span className='text-warning-500'>{currency}</span>
                    </td>

                </tr>
            ))}
        </>
    )
}
