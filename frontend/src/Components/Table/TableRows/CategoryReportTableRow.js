import React from 'react'
import {map} from 'lodash'
import {useSelector} from 'react-redux'

export const CategoryReportTableRow = ({ data }) => {
    const { currencyType } = useSelector((state) => state.currency)
    return (
        <>
            {map(data, (product, index) => (
                <tr key={product._id} className='tr'>
                    <td className='td text-center p-2'>
                        {index + 1}
                    </td>
                    <td className='td text-center'>
                        {product.productdata.code}
                    </td>
                    <td className='td text-left'>{product.productdata.name}</td>
                    <td className='td text-right'>
                        {product.total.toLocaleString('ru-RU')}{' '}
                        {product.unit && product.unit.name}
                    </td>
                    <td className='td text-right'>
                        {product.price && currencyType === 'USD' ? product.price.incomingprice.toLocaleString(
                            'ru-RU'
                        ) : product.price.incomingpriceuzs.toLocaleString(
                            'ru-RU'
                        )} {currencyType}
                    </td>
                    <td className='td text-right'>
                        {product.price && currencyType === 'USD' ? product.price.sellingprice.toLocaleString(
                            'ru-RU'
                        ) : product.price.sellingpriceuzs.toLocaleString(
                            'ru-RU'
                        )} {currencyType}
                    </td>
                    <td className='td text-right'>
                        {product?.totalsaleproducts.toLocaleString(
                            'ru-RU'
                        )}
                    </td>
                    <td className='td text-right'>
                        {currencyType === 'USD' ? product?.totalsales.toLocaleString(
                            'ru-RU'
                        ) : product?.totalsalesuzs.toLocaleString(
                            'ru-RU'
                        )} {currencyType}
                    </td>
                </tr>
            ))}
        </>
    )
}
