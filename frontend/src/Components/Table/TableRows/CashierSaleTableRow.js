import {map, uniqueId} from 'lodash'
import React from 'react'
import TableBtn from '../../Buttons/TableBtn'

export const CashierSaleTableRow = ({
    data,
    currentPage,
    countPage,
    currency,
    Print,
}) => {
    const calculateTotalPrice = (datas, property) => {
        return datas.reduce((summ, data) => summ + data[property], 0)
    }

    return (
        <>
            {map(data, (saleconnector, index) => (
                <tr className='tr' key={uniqueId('sales')}>
                    <td className='text-left td'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='text-left td'>
                        {new Date(saleconnector.createdAt).toLocaleDateString()}
                    </td>
                    <td className='text-left td'>
                        {saleconnector.saleconnector.id}
                    </td>
                    <td className='text-left td'>
                        {saleconnector?.client?.name}
                    </td>
                    <td className='text-left td py-[0.625rem] font-medium'>
                        {(currency === 'USD'
                            ? calculateTotalPrice(
                                  saleconnector.products,
                                  'totalprice'
                              )
                            : calculateTotalPrice(
                                  saleconnector.products,
                                  'totalpriceuzs'
                              )
                        ).toLocaleString('ru-Ru')}{' '}
                        {currency}
                    </td>
                    <td className='text-left td font-medium'>
                        {(currency === 'USD'
                            ? Number(saleconnector?.payment?.cash || 0)
                            : Number(saleconnector?.payment?.cashuzs || 0)
                        ).toLocaleString('ru-Ru')}{' '}
                        <span className='text-primary-800'>{currency}</span>
                    </td>
                    <td className='text-left td font-medium'>
                        {(currency === 'USD'
                            ? Number(saleconnector?.payment?.card || 0)
                            : Number(saleconnector?.payment?.carduzs || 0)
                        ).toLocaleString('ru-Ru')}{' '}
                        <span className='text-success-500'>{currency}</span>
                    </td>
                    <td className='text-left td font-medium'>
                        {(currency === 'USD'
                            ? Number(saleconnector?.payment?.transfer || 0)
                            : Number(saleconnector?.payment?.transferuzs || 0)
                        ).toLocaleString('ru-Ru')}{' '}
                        <span className='text-warning-500'>{currency}</span>
                    </td>
                    <td className='td border-r-0'>
                        <div className='flex justify-center'>
                            <TableBtn
                                type={'print'}
                                bgcolor={'bg-primary-800'}
                                onClick={() => Print(saleconnector)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
