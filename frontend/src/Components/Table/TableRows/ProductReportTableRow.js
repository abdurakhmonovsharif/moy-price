import React from 'react'
import TableBtn from '../../Buttons/TableBtn'
import TableInput from '../../Inputs/TableInput'
import {map} from 'lodash'

const inputVal = (id, printedData) => {
    let hasData = printedData.filter((p) => p.product._id === id)
    return hasData.length > 0 ? hasData[0].numberOfChecks : ''
}

export const ProductReportTableRow = ({
    data,
    Print,
    currentPage,
    countPage,
    currency,
    changeHandler,
    printedData,
}) => {
    return (
        <>
            {map(data, (product, index) => (
                <tr className='tr' key={product._id}>
                    <td className='td'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-center'>{product.category.code}</td>
                    <td className={`td`}>{product.productdata.code}</td>
                    <td className={`td`}>{product.productdata.name}</td>
                    <td className={`td text-right`}>
                        <span className='pointer-events-none'>
                            {product?.total.toLocaleString('ru-Ru')}{' '}
                            {product?.unit?.name}
                        </span>
                    </td>
                    <td className='td text-right'>
                        {currency === 'UZS'
                            ? product.price.incomingpriceuzs.toLocaleString(
                                  'ru-RU'
                              )
                            : product.price.incomingprice.toLocaleString(
                                  'ru-RU'
                              )}{' '}
                        {currency}
                    </td>
                    <td className='td text-right'>
                        {currency === 'UZS'
                            ? (
                                  product.price.incomingpriceuzs * product.total
                              ).toLocaleString('ru-RU')
                            : (
                                  product.price.incomingprice * product.total
                              ).toLocaleString('ru-RU')}{' '}
                        {currency}
                    </td>
                    <td className={`td text-right`}>
                        {currency === 'UZS'
                            ? product.price.sellingpriceuzs.toLocaleString(
                                  'ru-RU'
                              )
                            : product.price.sellingprice.toLocaleString(
                                  'ru-RU'
                              )}{' '}
                        {currency}
                    </td>
                    <td className='td text-right'>
                        {currency === 'UZS'
                            ? (
                                  product.price.sellingpriceuzs * product.total
                              ).toLocaleString('ru-RU')
                            : (
                                  product.price.sellingprice * product.total
                              ).toLocaleString('ru-RU')}{' '}
                        {currency}
                    </td>
                    <td className='py-[0.25rem] td'>
                        <TableInput
                            onChange={(e) => changeHandler(e, product)}
                            type={'number'}
                            value={inputVal(product._id, printedData)}
                        />
                    </td>
                    <td className='td text-center'>
                        <div className='flex items-center justify-center'>
                            <TableBtn
                                type={'print'}
                                bgcolor={'bg-primary-800'}
                                onClick={() => Print(product, 'single')}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
