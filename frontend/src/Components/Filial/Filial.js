import React, {useEffect, useState} from 'react'
import FilialButtons from '../FilialButtons/FilialButtons'
import Avatar from '../Avatar/Avatar.js'
import {Link, Route, Routes, useLocation, useParams} from 'react-router-dom'
import Labels from '../../Pages/Labels/Labels.js'
import {AnimatePresence} from 'framer-motion'
import Sellings from '../../Pages/Sale/Routes/Sellings'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import FilialExchangesProduct from '../../Pages/FilialExchanges/FilialExchengesProduct'
import ProductIdExchanges from '../../Pages/ProductIdExchanges/ProductIdExchanges'
import LabelsIncome from '../../Pages/Labels/LabelsIncome'
const Filial = ({active, value}) => {
    const {currencyType} = useSelector((state) => state.currency)
    const {tablename, _id} = useParams()
    const location = useLocation()
    const [reportOpen, setReprotOpen] = useState(true)
    const [salesOpen, setSalesOpen] = useState(true)
    const [paymentOpen, setPaymentOpen] = useState(true)
    const [useParamsId, setUseParamsId] = useState(_id)
    const [incomeProducts, setIncomeProducts] = useState()


    const handleReportOpen = (e) => {
        e && e.preventDefault()
        setReprotOpen(!reportOpen)
        setSalesOpen(true)
        setPaymentOpen(true)
    }

    const handleSalesOpen = (e) => {
        e && e.preventDefault()
        setSalesOpen(!salesOpen)
        setReprotOpen(true)
        setPaymentOpen(true)
    }

    const handlePaymentOpen = (e) => {
        e && e.preventDefault()
        setPaymentOpen(!paymentOpen)
        setReprotOpen(true)
        setSalesOpen(true)
    }

    const handleIncomeProducts = (e) => {
        e && e.preventDefault()
        setIncomeProducts(!incomeProducts)
        setReprotOpen(true)
        setSalesOpen(true)
    }

    const {t} = useTranslation(['common'])

    useEffect(() => {
        if (_id) {
            setUseParamsId(_id)
        }
    }, [_id])

    return (
        <section>
            <div
                className={`shops_card flex gap-[1.25rem] ${
                    active ? 'active_shop' : ''
                }`}
            >
                <Avatar border={true} director={value.director} />
                <div className='product-cost'>
                    <div
                        className={'flex flex-col items-center justify-center'}
                    >
                        <p className='product'>{t('Kategoriyalar')}</p>
                        <p className='product-number'>{value.typecount}</p>
                    </div>
                    <div
                        className={'flex flex-col items-center justify-center'}
                    >
                        <p className='product'>{t('Maxsulotlar turi')}</p>
                        <p className='product-number'>{value.productcount}</p>
                    </div>
                    <div
                        className={'flex flex-col items-center justify-center'}
                    >
                        <p className='product'>{t('Jami')}</p>
                        <p className='product-total'>
                            {currencyType === 'UZS'
                                ? value.totalPrice.toLocaleString('ru-Ru')
                                : value.totalPriceUSD.toLocaleString(
                                      'ru-Ru'
                                  )}{' '}
                            {currencyType}
                        </p>
                    </div>
                </div>
                <div className='shop-name flex flex-col w-[13.4375rem]'>
                    <div className='shop-title'>
                        <p>{t(value.shopname)}</p>
                    </div>
                    <div className={'filial-btn'}>
                        <Link
                            to={`${
                                reportOpen
                                    ? `/dukonlar/filiallar/report/${value._id}`
                                    : '/dukonlar/filiallar'
                            }`}
                            onClick={() => handleReportOpen()}
                        >
                            <FilialButtons
                                type={'product'}
                                active={
                                    _id === value._id && tablename === 'report'
                                }
                            />
                        </Link>
                        <Link
                            to={`${
                                salesOpen
                                    ? `/dukonlar/filiallar/sales/${value._id}`
                                    : '/dukonlar/filiallar'
                            } `}
                            onClick={() => handleSalesOpen()}
                        >
                            <FilialButtons
                                type={'selling'}
                                active={
                                    _id === value._id && tablename === 'sales'
                                }
                            />
                        </Link>
                        <Link
                            to={`${
                                paymentOpen
                                    ? `/dukonlar/filiallar/payment/${value._id}`
                                    : '/dukonlar/filiallar'
                            }`}
                            onClick={() => handlePaymentOpen()}
                        >
                            <FilialButtons
                                type={'payments'}
                                active={
                                    (_id === value._id &&
                                        tablename === 'payment') ||
                                    (_id === value._id &&
                                        location.pathname ===
                                            `/dukonlar/filiallar/payment/${_id}/exchangesId`)
                                }
                            />
                        </Link>
                        <Link
                            to={`${
                                incomeProducts
                                    ? `/dukonlar/filiallar/income/${value._id}`
                                    : '/dukonlar/filiallar'
                            }`}
                            onClick={() => handleIncomeProducts()}
                        >
                            <FilialButtons
                                type={'income'}
                                active={
                                    (_id === value._id &&
                                        tablename === 'income') ||
                                    (_id === value._id &&
                                        location.pathname ===
                                            `/dukonlar/filiallar/income/${_id}`)
                                }
                            />
                        </Link>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                <Routes location={location} key={location.pathname}>
                    <Route
                        path={`/:tablename/:_id`}
                        element={
                            _id === value._id ? (
                                tablename === 'report' ? (
                                    <Labels id={_id} />
                                ) : tablename === 'income' ? (
                                    <LabelsIncome id={_id} />
                                ) :  tablename === 'sales' ? (
                                    <Sellings id={_id} />
                                ) : (
                                    <FilialExchangesProduct
                                        id={value._id}
                                        currency={currencyType}
                                    />
                                )
                            ) : (
                                ''
                            )
                        }
                    />
                    <Route
                        path={`/:tablename/:_id/exchangesId`}
                        element={
                            useParamsId === value._id ? (
                                <ProductIdExchanges currency={currencyType} />
                            ) : (
                                ''
                            )
                        }
                    />
                </Routes>
            </AnimatePresence>
        </section>
    )
}

export default Filial
