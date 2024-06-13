import React, {useEffect, useState} from 'react'
import TableBtn from '../../Buttons/TableBtn'
import TableInput from '../../Inputs/TableInput'
import {filter, map} from 'lodash'
import {IoAdd, IoEye, IoEyeOff, IoRemove} from 'react-icons/io5'
import {useSelector} from 'react-redux'
import {t} from 'i18next'

export const RegisterSaleTableRow = ({
    data,
    Delete,
    changeHandler,
    currency,
    increment,
    decrement,
    lowUnitpriceProducts,
    wholeSale,
    productId,
    productModal,
    handleClickProduct
}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    const {filials} = useSelector((state) => state.registerSelling)
    const {market} = useSelector((state) => state.login)
    const [showIncomingPrice, setShowIncomingPrice] = useState([])
    const changeShow = (i) => {
        const price = [...showIncomingPrice]
        price[i] = !price[i]
        setShowIncomingPrice([...price])
    }
    useEffect(() => {
        setShowIncomingPrice(map(data, () => false))
    }, [data])
    return (
        <>
            {map(data, (product, index) =>
                !isMobile ? (
                    <tr
                        className={`tr ${
                            filter(
                                lowUnitpriceProducts,
                                (id) => id === product.product._id
                            ).length > 0
                                ? 'bg-warning-200'
                                : ''
                        }`}
                        key={'salerow-' + index + 1}
                    >
                        <td className='text-left td'>{index + 1}</td>
                        {filials.length > 1 && (
                            <td className='td w-[100px]'>
                                <select
                                    onChange={(e) =>
                                        changeHandler(
                                            product.product._id,
                                            {
                                                filial: e.target.value,
                                                productcode:
                                                    product.product.code,
                                                categorycode:
                                                    product.categorycode,
                                            },
                                            'select'
                                        )
                                    }
                                    value={product.filial}
                                    className='w-full outline-none border-[1px] rounded h-[30px]'
                                >
                                    {filials.length > 0 &&
                                        filials.map((filial, ind) => (
                                            <option
                                                key={ind}
                                                value={filial.value}
                                            >
                                                {filial.label}
                                            </option>
                                        ))}
                                </select>
                            </td>
                        )}
                        <td className='text-left td font-bold'>
                            <span
                                style={{
                                    color:
                                        product?.filialProductsTotal > 0
                                            ? 'green'
                                            : 'red',
                                }}
                            >
                                {product?.filialProductsTotal}
                            </span>
                        </td>
                        <td
                            className='text-left td'
                            onClick={() => handleClickProduct(product)}
                        >
                            {product.product.name}
                        </td>
                        <td className='text-left td'>
                            <span className={'flex gap-[0.6rem] items-center'}>
                                <button
                                    className={
                                        'rounded-[4px] duration-100 bg-error-500 hover:bg-error-600 p-[0.2rem] text-base text-white-900 active:scale-95'
                                    }
                                    onClick={() =>
                                        decrement(product.product._id)
                                    }
                                >
                                    <IoRemove size={'0.875rem'} />
                                </button>
                                <TableInput
                                    value={product.pieces}
                                    onChange={(e) =>
                                        changeHandler(
                                            product.product._id,
                                            e.target.value,
                                            'pieces'
                                        )
                                    }
                                    type={'text'}
                                />
                                <button
                                    className={
                                        'rounded-[4px] duration-100 bg-success-500 hover:bg-success-600 p-[0.2rem] text-base text-white-900 active:scale-95'
                                    }
                                    onClick={() =>
                                        increment(product.product._id)
                                    }
                                >
                                    <IoAdd size={'0.875rem'} />
                                </button>
                            </span>
                        </td>
                        {filials.length > 1 && (
                            <td className='text-left td'>
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
                                    disabled={
                                        product.filial === market._id && true
                                    }
                                />
                            </td>
                        )}
                        <td className='text-left td'>
                            <TableInput
                                value={
                                    currency !== 'UZS'
                                        ? wholeSale
                                            ? product.tradeprice ||
                                              product.unitprice
                                            : product.unitprice
                                        : wholeSale
                                        ? product.tradepriceuzs ||
                                          product.unitpriceuzs
                                        : product.unitpriceuzs
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
                        </td>
                        <td className='text-left td'>
                            {currency !== 'UZS'
                                ? product.totalprice.toLocaleString('ru-Ru')
                                : product.totalpriceuzs.toLocaleString(
                                      'ru-Ru'
                                  )}{' '}
                            {currency}
                        </td>
                        <td className='td'>
                            <div className='flex items-center justify-center'>
                                <TableBtn
                                    type={'delete'}
                                    bgcolor={'bg-error-500'}
                                    onClick={() => Delete(index)}
                                />
                            </div>
                        </td>
                        <td className='td border-r-0 text-success-500'>
                            <div className='flex justify-between'>
                                <button onClick={() => changeShow(index)}>
                                    {showIncomingPrice[index] ? (
                                        <IoEye />
                                    ) : (
                                        <IoEyeOff />
                                    )}
                                </button>
                                <span className='min-w-fit'>
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
                            </div>
                        </td>
                    </tr>
                ) : (
                    <li
                        onClick={() => {
                            productModal(true)
                            productId(product.product._id)
                        }}
                        className='w-[90vw]  bg-white list-none mb-[10px] ps-0 rounded-md'
                    >
                        <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                            <p className='text-[green]'>
                                {product.product.name}
                            </p>
                        </li>

                        <li className='border p-[10px] text-[blue] text-sm flex justify-between  items-center border-s-0 border-t-0 border-e-0 p-[10px] text-sm flex justify-between  items-center '>
                            <p className='text-[red]'>
                                <span> {t('Soni')}: </span>
                                {product.pieces}
                            </p>
                            <p>
                                <span className='me-2 w-8'>{t('Narxi')}: </span>
                                {currency !== 'UZS'
                                    ? wholeSale
                                        ? product.tradeprice ||
                                          product.unitprice
                                        : product.unitprice
                                    : wholeSale
                                    ? product.tradepriceuzs ||
                                      product.unitpriceuzs
                                    : product.unitpriceuzs}{' '}
                                {currency}
                            </p>
                        </li>
                        <li className=' p-[10px] text-sm flex justify-between  items-center text-[green]'>
                            <span className='me-2 w-8'>{t('Jami')}: </span>
                            {currency !== 'UZS'
                                ? product.totalprice.toLocaleString('ru-Ru')
                                : product.totalpriceuzs.toLocaleString(
                                      'ru-Ru'
                                  )}{' '}
                            {currency}
                        </li>
                    </li>
                )
            )}
        </>
    )
}
