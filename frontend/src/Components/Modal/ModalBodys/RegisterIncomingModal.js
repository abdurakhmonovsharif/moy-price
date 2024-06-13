import React from 'react'
import TableInput from '../../Inputs/TableInput'
import {useTranslation} from 'react-i18next'

const RegisterproductModal = ({
    product,
    changeProduct,
    approveFunction,
    currency,
}) => {
    const current = (usd, uzs) => (currency === 'USD' ? usd : uzs)
    const {t} = useTranslation(['common'])
    return (
        <div className='pt-[1.25rem] text-center'>
            <div className='text-center'>
                <h1 className='text-3xl text-black-900 mb-[20px]'>
                    {product.product.code}
                </h1>
                <h2 className='text-2xl text-black-900 mb-[20px]'>
                    {product.product.name}
                </h2>
            </div>
            <div className='flex justify-center'>
                <table className='overflow-x-auto max-w-[700px]'>
                    <thead className='rounded-t-lg'>
                        <tr className='bg-primary-900 rounded-t-lg'>
                            <th scope='col' className='th w-[15%]'>
                                <span>{t('Soni')}</span>
                            </th>
                            <th scope='col' className='th w-[15%]'>
                                <span>{t('Kelish')}</span>
                            </th>
                            <th scope='col' className='th'>
                                <span>{t('Avvalgi')}</span>
                            </th>
                            <th scope='col' className='th'>
                                <span>{t('Jami')}</span>
                            </th>
                            <th scope='col' className='th w-[15%]'>
                                <span>{t('Sotish')}</span>
                            </th>
                            <th scope='col' className='th w-[15%]'>
                                <span>{t('Sotish')} %</span>
                            </th>
                            <th scope='col' className='th w-[15%]'>
                                <span>{t('Optom narx')}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='tr'>
                            <td className='py-1 td'>
                                <TableInput
                                    onChange={(e) => changeProduct(e, 'pieces')}
                                    type={'number'}
                                    value={product.pieces || ''}
                                />
                            </td>
                            <td className='py-1 td'>
                                <TableInput
                                    onChange={(e) =>
                                        changeProduct(e, 'unitprice')
                                    }
                                    type={'number'}
                                    value={
                                        current(
                                            product.unitprice,
                                            product.unitpriceuzs
                                        ) || ''
                                    }
                                />
                            </td>
                            <td className='py-0 td text-error-500 text-right'>
                                {current(
                                    product.oldprice.toLocaleString('ru-Ru'),
                                    product.oldpriceuzs.toLocaleString('ru-Ru')
                                )}{' '}
                                {currency}
                            </td>
                            <td className='py-0 td text-right'>
                                {current(
                                    product.totalprice.toLocaleString('ru-Ru'),
                                    product.totalpriceuzs.toLocaleString(
                                        'ru-Ru'
                                    )
                                )}{' '}
                                {currency}
                            </td>
                            <td className='py-1 td'>
                                <TableInput
                                    onChange={(e) =>
                                        changeProduct(e, 'sellingprice')
                                    }
                                    type={'number'}
                                    value={
                                        current(
                                            product.sellingprice,
                                            product.sellingpriceuzs
                                        ) || ''
                                    }
                                />
                            </td>
                            <td className='py-1 td'>
                                <TableInput
                                    onChange={(e) =>
                                        changeProduct(e, 'procient')
                                    }
                                    type={'number'}
                                    value={product.procient}
                                />
                            </td>
                            <td className='py-1 td'>
                                <TableInput
                                    onChange={(e) =>
                                        changeProduct(e, 'tradeprice')
                                    }
                                    type={'number'}
                                    value={
                                        current(
                                            product.tradeprice,
                                            product.tradepriceuzs
                                        ) || ''
                                    }
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='pt-[15px]'>
                <button
                    onClick={approveFunction}
                    className={'approveBtn bg-primary-800 hover:bg-primary-900'}
                >
                    {t("Qo'shish")}
                </button>
            </div>
        </div>
    )
}

export default RegisterproductModal
