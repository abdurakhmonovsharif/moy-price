import React from 'react'
import TableBtn from '../../Buttons/TableBtn'
import TableInput from '../../Inputs/TableInput'
import {map} from 'lodash'
export const RegisterIncomingTableRow = ({
    changeHandler,
    data,
    Delete,
    currency,
}) => {
    return (
        <>
            {map(data, (product, index) => (
                <tr key={product._id} className='tr'>
                    <td className='py-0 td text-left'>{index + 1}</td>
                    <td className='py-0 td text-right'>
                        {product?.product?.code}
                    </td>
                    <td className='py-0 td text-left'>
                        {product?.product?.name}
                    </td>
                    <td className='py-1 td'>
                        <TableInput
                            onChange={(e) =>
                                changeHandler(e, 'pieces', product._id)
                            }
                            type={'number'}
                            value={product?.pieces}
                        />
                    </td>
                    <td className='py-1 td'>
                        <TableInput
                            onChange={(e) =>
                                changeHandler(e, 'unitprice', product._id)
                            }
                            type={'number'}
                            value={
                                currency === 'USD'
                                    ? product.unitprice
                                    : product.unitpriceuzs
                            }
                        />
                    </td>
                    <td className='py-0 td text-error-500 text-right'>
                        {currency === 'USD'
                            ? product.oldprice.toLocaleString('ru-Ru')
                            : product.oldpriceuzs.toLocaleString('ru-Ru')}{' '}
                        {currency}
                    </td>
                    <td className='py-0 td text-right'>
                        {currency === 'USD'
                            ? product.totalprice.toLocaleString('ru-Ru')
                            : product.totalpriceuzs.toLocaleString(
                                  'ru-Ru'
                              )}{' '}
                        {currency}
                    </td>
                    <td className='py-1 td'>
                        <TableInput
                            onChange={(e) =>
                                changeHandler(e, 'sellingprice', product._id)
                            }
                            type={'number'}
                            value={
                                currency === 'USD'
                                    ? product.sellingprice
                                    : product.sellingpriceuzs
                            }
                        />
                    </td>
                    <td className='py-1 td'>
                        <TableInput
                            onChange={(e) =>
                                changeHandler(e, 'tradeprice', product._id)
                            }
                            type={'number'}
                            value={
                                currency === 'USD'
                                    ? product.tradeprice
                                    : product.tradepriceuzs
                            }
                        />
                    </td>
                    <td className='py-0 td border-r-0'>
                        <div className='flex justify-center items-center'>
                            <TableBtn
                                type={'delete'}
                                bgcolor={'bg-error-500'}
                                onClick={() => Delete(product)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
