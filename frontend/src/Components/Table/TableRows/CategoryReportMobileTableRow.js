import React from 'react'
import { map } from 'lodash'
import { useSelector } from 'react-redux'
import { t } from 'i18next'

export const CategoryReportMobileTableRow = ({ data }) => {
    const { currencyType } = useSelector((state) => state.currency)
    return (
        <>
            {map(data, (product, index) => (
                <li className='w-[90vw]  bg-white list-none mb-[10px]  rounded-md'>
                <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                    <p >
                    {product.productdata.code}-{product.unit && product.productdata.name}
                    </p>    
                    <p>
                    {product.total.toLocaleString('ru-RU')}{' '}
                        {product.unit && product.unit.name}
                    </p>
                </li>
                <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                    <p className='gap-1 text-[blue]'>
                    {product.price && currencyType === 'USD' ? product.price.incomingprice.toLocaleString(
                             'ru-RU'
                         ) : product.price.incomingpriceuzs.toLocaleString(
                             'ru-RU'
                         )} {currencyType}
                    </p>    
                    <p className='text-[green]'>
                    {product.price && currencyType === 'USD' ? product.price.sellingprice.toLocaleString(
                            'ru-RU'
                        ) : product.price.sellingpriceuzs.toLocaleString(
                            'ru-RU'
                        )} {currencyType}
                    </p>
                </li>
                <li className=' p-[10px] text-[blue] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                    <p ><span>{t('Sotilganlar')}: </span>
                    {product?.totalsaleproducts.toLocaleString(
                            'ru-RU'
                        )}
                    </p>    
                    <p className='text-[green]'><span>{t('Jami')}: </span>
                    {currencyType === 'USD' ? product?.totalsales.toLocaleString(
                            'ru-RU'
                        ) : product?.totalsalesuzs.toLocaleString(
                            'ru-RU'
                        )} {currencyType}
                    </p>
                </li>
            </li>
            ))}
        </>
    )
}
