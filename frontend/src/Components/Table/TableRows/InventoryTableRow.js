import React from 'react'
import TableBtn from '../../Buttons/TableBtn'
import TableInput from '../../Inputs/TableInput'
import {map} from 'lodash'

export const InventoryTableRow = ({
                                      data,
                                      currentPage,
                                      countPage,
                                      changeHandler,
                                      inputDisabled,
                                      Save,
                                      onKeyUp
                                  }) => {
    return (
        <>
            {map(data,(product, index) => (
                <tr key={product._id} className='tr'>
                    <td className='td text-left'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-center'>{product.category.code}</td>
                    <td className='td text-center'>
                        {product.productdata.code}
                    </td>
                    <td className='td text-left'>{product.productdata.name}</td>
                    <td className='td text-right'>{product.total.toLocaleString('ru-Ru')}</td>
                    <td className='py-1 td'>
                        <TableInput
                            disabled={inputDisabled}
                            onChange={(e) =>
                                changeHandler(e, index, product, 'count')
                            }
                            type={'number'}
                            value={
                                product.inventory.inventorycount &&
                                product.inventory.inventorycount
                            }
                            onKeyUp={(e) => onKeyUp(e, index)}
                        />
                    </td>
                    <td className='td text-error-500 text-right'>
                        {product.inventory && product.inventory.inventorycount
                            ? product.inventory.inventorycount -
                            product.inventory.productcount >
                            0
                                ? '+' +
                                (
                                    Math.round(
                                        (product.inventory.inventorycount -
                                            product.inventory.productcount) *
                                        100
                                    ) / 100
                                ).toLocaleString('ru-RU')
                                : (
                                    Math.round(
                                        (product.inventory.inventorycount -
                                            product.inventory.productcount) *
                                        100
                                    ) / 100
                                ).toLocaleString('ru-RU')
                            : ''}{' '}
                        <span className='text-error-500'>
                            {product.unit.name}
                        </span>
                    </td>
                    <td className='py-1 td'>
                        <TableInput
                            disabled={inputDisabled}
                            onChange={(e) =>
                                changeHandler(e, index, product, 'comment')
                            }
                            type={'text'}
                            value={
                                product.inventory.comment &&
                                product.inventory.comment
                            }
                            onKeyUp={(e) => onKeyUp(e, index)}
                        />
                    </td>
                    <td className='py-0 td'>
                        <div className='flex justify-center items-center'>
                            <TableBtn
                                type={'save'}
                                bgcolor={'bg-success-500'}
                                onClick={() => Save(index)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
