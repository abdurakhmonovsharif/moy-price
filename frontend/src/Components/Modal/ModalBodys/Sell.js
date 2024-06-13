import React, {useCallback, useEffect, useState} from 'react'
import TableInput from '../../Inputs/TableInput.js'
import {useSelector} from 'react-redux'
import {IoEye, IoEyeOff} from 'react-icons/io5'
import {useTranslation} from 'react-i18next'

function Sell({ product, changeProduct, approveFunction, toggleModal }) {
    const { t } = useTranslation(['common'])
    const { currencyType } = useSelector((state) => state.currency)
    // submit form when user press enter
    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                approveFunction()
            }
        },
        [approveFunction]
    )

    const [showIncomingPrice, setShowIncomingPrice] = useState(false)
    const changeShow = () => setShowIncomingPrice(!showIncomingPrice)
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])
    return (
        <div className={'modal-content pt-[1.25rem] text-center'}>
            <div className='text-center'>
                <h1 className='text-2xl text-black-900 mb-[1rem]'>
                    {product?.product?.code}
                </h1>
                <h2 className='text-xl text-black-900 mb-[2rem]'>
                    {product?.product?.name}
                </h2>
            </div>
            <div className='flex justify-center'>
                <table className='overflow-x-auto w-[50rem]'>
                    <thead className='rounded-t-lg'>
                        <tr className='bg-primary-900 rounded-t-lg'>
                            <th scope='col' className='th w-[20%]'>
                                <span>{t("Soni")}</span>
                            </th>
                            <th scope='col' className='th w-[30%]'>
                                <span>{t("Narxi")}</span>
                            </th>

                            <th scope='col' className='th'>
                                <span>{t("Jami")}</span>
                            </th>
                            <th scope='col' className='th'>
                                <span></span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='tr'>
                            <td className='py-1 td'>
                                <TableInput
                                    onChange={(e) =>
                                        changeProduct(e.target.value, 'pieces')
                                    }
                                    type={'number'}
                                    value={product?.pieces}
                                />
                            </td>
                            <td className='py-1 td'>
                                <TableInput
                                    onChange={(e) =>
                                        changeProduct(
                                            e.target.value,
                                            'unitprice'
                                        )
                                    }
                                    type={'number'}
                                    value={
                                        currencyType !== 'UZS'
                                            ? product?.unitprice
                                            : product?.unitpriceuzs
                                    }
                                />
                            </td>
                            <td className='py-0 td text-right text-success-600 font-medium'>
                                {currencyType !== 'UZS'
                                    ? product?.totalprice.toLocaleString(
                                        'ru-Ru'
                                    )
                                    : product?.totalpriceuzs.toLocaleString(
                                        'ru-Ru'
                                    )}{' '}
                                {currencyType}
                            </td>
                            <td className='py-0 td text-right text-success-600 font-medium border-r-0 '>
                                <div className='flex justify-between'>
                                    <button onClick={changeShow}>
                                        {showIncomingPrice ? (
                                            <IoEye />
                                        ) : (
                                            <IoEyeOff />
                                        )}
                                    </button>
                                    <span>
                                        {showIncomingPrice
                                            ? currencyType === 'UZS'
                                                ? product.incomingpriceuzs.toLocaleString('ru-Ru') +
                                                ' UZS'
                                                : product.incomingprice.toLocaleString('ru-Ru') +
                                                ' UZS'
                                            : ''}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                className={
                    'flex mt-12 items-center justify-center gap-[1.5rem]'
                }
            >
                <button
                    className={'approveBtn bg-black-500 hover:bg-black-700'}
                    onClick={toggleModal}
                >
                    {t("Bekor qilish")}
                </button>
                <button
                    className={'approveBtn bg-success-500 hover:bg-success-700'}
                    onClick={approveFunction}
                >
                    {t("Tasdiqlash")}
                </button>
            </div>
        </div>
    )
}

export default Sell
