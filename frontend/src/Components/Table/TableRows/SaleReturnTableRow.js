import React, {useEffect, useState} from 'react'
import TableInput from '../../Inputs/TableInput'
import {map} from 'lodash'
import {t} from 'i18next'

export const SaleReturnTableRow = ({
                                       data,
                                       changeHandler,
                                       currency,
                                       onKeyUp
                                   }) => {
                                    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
                                    useEffect(() => {
                                        const handleResize = () => {
                                            setIsMobile(window.innerWidth <= 768);
                                        };
                                
                                        window.addEventListener('resize', handleResize);
                                
                                        return () => {
                                            window.removeEventListener('resize', handleResize);
                                        };
                                    }, []);
    
    return (
        <>
            {map(data,(salereturn, index) => (
                !isMobile?<tr className='tr' key={salereturn._id}>
                    <td className='text-left td'>{index + 1}</td>
                    <td className='text-left td'>
                        {salereturn.productdata.code}
                    </td>
                    <td className='text-left td'>
                        {salereturn.productdata.name}
                    </td>
                    <td className='text-left td'>
                        {salereturn.product.pieces}
                    </td>
                    <td className='text-left td'>
                        {(currency === 'UZS'
                                ? salereturn.product.totalpriceuzs
                                : salereturn.product.totalprice
                        ).toLocaleString('ru-RU')}{' '}
                        {currency}
                    </td>
                    <td className='text-left td py-[5px]'>
                        <TableInput
                            onKeyUp={onKeyUp}
                            onChange={(e) =>
                                changeHandler(
                                    e.target.value,
                                    salereturn._id,
                                    index
                                )
                            }
                            value={salereturn.pieces}
                            type={'number'}
                        />
                    </td>
                    <td className='text-left td'>
                        {currency === 'UZS'
                            ? salereturn.totalpriceuzs
                            : salereturn.totalprice}{' '}
                        {currency}
                    </td>
                </tr>:
                <li className='text-sm w-[90vw]  bg-[white] rounded-lg m-1 list-none'>
                    <li className='border p-[10px] text-[black] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                        
                        <p className='text-[green]'>
                            {t('Nomi')}{': '}
                            {salereturn.productdata.name}
                        </p>
                    </li>
                    <li className='border p-[10px] text-[black] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                        <p className='text-[blue]'>
                            {t('Soni')}{': '}
                            {salereturn.product.pieces}
                        </p>
                        <p className='text-[green]'>
                            {t('Jami')}{': '}
                            {(currency === 'UZS'
                                ? salereturn.product.totalpriceuzs
                                : salereturn.product.totalprice
                        ).toLocaleString('ru-RU')}{' '}
                        {currency}
                        </p>
                    </li>
                    <li className=' p-[10px] text-[black] text-sm flex items-center justify-between border-s-0 border-t-0 border-e-0'>
                        <p >
                            <div className='h-[30px] w-[150px]'>

                            <TableInput
                            onKeyUp={onKeyUp}
                            onChange={(e) =>
                                changeHandler(
                                    e.target.value,
                                    salereturn._id,
                                    index
                                )
                            }
                            value={salereturn.pieces}
                            type={'number'}
                            />
                            </div>
                        </p>
                        <p className='text-[green]'>
                            {t('Jami')}{': '}
                            {currency === 'UZS'
                            ? salereturn.totalpriceuzs
                            : salereturn.totalprice}{' '}
                        {currency}
                        </p>
                    </li>
                </li>
            ))}
        </>
    )
}
