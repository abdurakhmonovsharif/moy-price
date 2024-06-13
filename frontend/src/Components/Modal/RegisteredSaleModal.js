import React, {useEffect, useState} from 'react'
import TableInput from '../Inputs/TableInput'
import {map} from 'lodash'
import {IoEye, IoEyeOff} from 'react-icons/io5'
import {useSelector} from 'react-redux'

import {t} from 'i18next'

export const RegisteredSaleModal = (
    {
        data,
        Delete,
        changeHandler,
        currency,
        increment,
        decrement,
        lowUnitpriceProducts,
        wholeSale,
        productId,
        productModal
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
    const { filials } = useSelector((state) => state.registerSelling)
    const { market } = useSelector((state) => state.login)
    const [showIncomingPrice, setShowIncomingPrice] = useState([])
    const changeShow = (i) => {
        const price = [...showIncomingPrice]
        price[i] = !price[i]
        setShowIncomingPrice([...price])
    }
    useEffect(() => {   
        setShowIncomingPrice(map(data, () => false))
    }, [data])
    
    let findData = data.find((a)=>a.product._id == productId)
    const newData = findData ? [findData] : [];
    
    return (
        <>
            {newData.map((product, index) => (
                <li className='w-[100vw] mt-[50px] bg-white list-none mb-[10px] p-[20px] rounded-md'>
                    <li className='mt-2 text-2xl flex justify-between text-start'>
                    
                    <p className='text-black-700 leading-7'>
                        {product.product.name}
                    </p>
                   
                </li>
                <li className='flex justify-end mt-[20px] pe-7 text-2xl text-[green]'>
                {product?.filialProductsTotal}
                </li>
                <p className='mt-3 text-sm'>{t('Fillial')}</p>
                <li className='w-[100vw] mt-1 bg-white list-none  rounded-md'>
                {filials.length > 1 && <div className='flex justify-center w-[80vw]'>
                        <select onChange={(e) => changeHandler(
                            product.product._id,
                            {
                                filial: e.target.value,
                                productcode: product.product.code,
                                categorycode: product.categorycode
                            },
                            'select'
                        )} value={product.filial} className='w-full outline-none border-[1px] rounded h-[40px] p-2 bg-[white]'>
                            {filials.length > 0 && filials.map((filial, ind) =>
                                <option key={ind} value={filial.value}>{filial.label}</option>
                            )}
                        </select>
                    </div>}
                </li>
                    <p className='mt-3 text-sm'>{t('Soni')}</p>
                <li className=' mt-1 mb-3 text-sm flex justify-start '>
                <span className={'flex gap-[0.6rem]  items-center justify-start'}>
                            
                            <div className='w-[40vw] '>
                            <TableInput
                                value={product.pieces}
                                onChange={(e) =>
                                    changeHandler(
                                        product.product._id,
                                        e.target.value,
                                        'pieces'
                                    )
                                }
                                type={'number'}
                                min={'h-[50px]'}
                            />
                            </div>
                            <button
                                className={'rounded-[4px] duration-100 bg-success-500 hover:bg-success-600 p-[0.2rem]  h-[40px] w-[70px] text-3xl text-center text-white-900 active:scale-95'}
                                onClick={() => increment(product.product._id)}>+</button>
                            <button
                                className={'rounded-[4px] duration-100 bg-error-500 hover:bg-error-600 p-[0.2rem]  text-white-900 h-[40px] w-[70px] text-3xl text-center active:scale-95'}
                                onClick={() => decrement(product.product._id)}>-</button>
                            
                        </span>
                </li>
                <p className='mt-3 text-sm'>{t('Ombordan')}</p>
                <li className='w-[40vw] mt-1'>
                <TableInput
                            value={product.fromFilial}
                            onChange={(e) =>
                                changeHandler(
                                    product.product._id,
                                    e.target.value,
                                    'fromFilial'
                                )
                            }
                            type={'number'}
                            disabled={product.filial === market._id && true}
                        />
                </li>
                <p className='mt-3 text-sm'>{t('Narxi')}: {currency}</p>
                <li className=' mt-1 text-sm flex justify-start  items-center '>
                <TableInput
                            value={
                                currency !== 'UZS'
                                ? wholeSale ? product.tradeprice || product.unitprice : product.unitprice
                                : wholeSale ? product.tradepriceuzs || product.unitpriceuzs : product.unitpriceuzs
                            }
                            onChange={(e) =>
                                changeHandler(
                                    product.product._id,
                                    e.target.value,
                                    'unitprice'
                                    )
                                }
                                type={'number'}
                                />
                                
                    
                </li>
                <li className=' p-[10px] mt-3 text-xl flex justify-between  items-center '>
                <span className='me-2 w-8'>{t('Jami')}: </span>
                {currency !== 'UZS'
                            ? product.totalprice.toLocaleString('ru-Ru')
                            : product.totalpriceuzs.toLocaleString(
                                'ru-Ru'
                            )}{' '}
                        {currency}
                    
                </li>
                <li className=' p-[10px] text-xl flex justify-between items-center '>
              
                            <button onClick={() => changeShow(index)}>
                                {showIncomingPrice[index] ? (
                                    <IoEye />
                                ) : (
                                    <IoEyeOff />
                                )}
                            </button>
                            <span className=''>
                                {showIncomingPrice[index]
                                    ? currency === 'UZS'
                                        ? product.incomingpriceuzs.toLocaleString(
                                            'ru-Ru'
                                        ) + ' UZS'
                                        : product.incomingprice.toLocaleString(
                                            'ru-Ru'
                                        ) + ' USD'
                                    : ''}
                            </span>
                </li>
                <li className='flex justify-evenly mt-3'>     
                    <button onClick={()=>productModal(false)} className='rounded-[4px] duration-100 bg-success-500 hover:bg-success-600 p-[0.2rem]  h-[40px] w-[40vw]  text-center text-white-900 active:scale-95'>{t("Qo'shish")}</button>
                    <button  className='rounded-[4px] duration-100 bg-error-500 hover:bg-error-600 p-[0.2rem]  h-[40px] w-[40vw]  text-center text-white-900 active:scale-95' onClick={() => {
                            Delete(index)
                            productModal(false)}}>{t("O'chirish")}</button>
                </li>
                </li>
            ))}
        </>
    )
}
