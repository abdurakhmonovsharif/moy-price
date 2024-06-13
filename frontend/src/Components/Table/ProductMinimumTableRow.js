import React from 'react'
import { map } from 'lodash'
import { t } from 'i18next'
export const ProductMinimumTableRow = ({
    currentPage,
    countPage,
    data,
    currency,
    currencyType,
    productminimumpage,
}) => {
    return (
        <>

            {map(data, (product, index) => (
                <li className='w-[90vw]  bg-white list-none mb-[10px] ps-0 rounded-md'>
                
                <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                    <p >
                    {product.productdata.name}
                    </p>    
                    <p className='text-[red]'>
                    {product.total.toLocaleString('ru-RU')}{' '}
                        {product.unit && product.unit.name}
                    </p>
                </li>
                
                <li className='text-[green] p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                    <p ><span>{t('Kategoriya')}: </span>
                    {product?.category?.name && ` ${product?.category?.name}`}
                    </p>    
                    <p className='text-[red]'><span>{t('Minimum')}: </span>
                    {product?.minimumcount || ''}
                    </p>
                </li>
                
                
            </li>
            ))}
        </>
    )
}
