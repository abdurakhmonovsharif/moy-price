import React from 'react'
import {map} from 'lodash'

export const PartnerProductsTableRow = ({data, currentPage, countPage}) => {

    return (
        <>
            {map(data, (product, index) => (
                <tr key={product._id} className='tr'>
                    <td className='td py-2'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-center'>{product?.productdata?.barcode}</td>
                    <td className='td text-center'>{product?.category?.code}</td>
                    <td className='td text-center'>{product?.productdata?.code}</td>
                    <td className='td text-left'>{product?.productdata?.name}</td>
                    <td className='td text-end'>{product?.total} {product?.unit?.name}</td>
                    <td className='td text-end'>{product?.price?.sellingpriceuzs}</td>
                    <td className='td text-end'>{product?.price?.sellingprice}</td>
                </tr>
            ))}
        </>
    )
}
