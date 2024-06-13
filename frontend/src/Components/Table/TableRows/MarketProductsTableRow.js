import React from 'react'
import {map} from 'lodash'
import {useParams} from 'react-router-dom'
import ProductCheckbox from '../../Checkbox/ProductCheckBox.js'
export const MarketProductsTableRow = ({
    data,
    currentPage,
    countPage,
    handleShowProduct,
}) => {
    const partner = useParams().id
    return (
        <>
            {map(data, (product, index) => (
                <tr key={product._id} className='tr'>
                    <td className='td py-2'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-center'>
                        {product?.productdata?.barcode}
                    </td>
                    <td className='td text-center'>
                        {product?.category?.code}
                    </td>
                    <td className='td text-center'>
                        {product?.productdata?.code}
                    </td>
                    <td className='td text-left'>
                        {product?.productdata?.name}
                    </td>
                    <td className='td'>
                        <div className='flex items-center justify-center'>
                            <ProductCheckbox
                                onChange={(e) =>
                                    handleShowProduct(
                                        e,
                                        product._id,
                                        partner,
                                        index
                                    )
                                }
                                value={product?.connections?.some(
                                    (connection) => connection === partner
                                )}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
