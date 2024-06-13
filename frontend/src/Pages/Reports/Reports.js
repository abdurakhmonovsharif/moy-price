import React, {useEffect, useState} from 'react'
import CheckoutCards from '../../Components/CheckoutCard/CheckoutCards'
import SearchForm from '../../Components/SearchForm/SearchForm.js'
import {useDispatch, useSelector} from 'react-redux'
import {universalToast} from '../../Components/ToastMessages/ToastMessages.js'
import {map, uniqueId} from 'lodash'
import {VscClose} from 'react-icons/vsc'

import {
    changeEndDate,
    changeStartDate,
    clearErrorReports,
    getIncomings,
    getProducts,
    getReports,
    getReportsForTotal,
    getSaleProducts,
} from './reportsSlice.js'
import {useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import UniversalModal from '../../Components/Modal/UniversalModal'
import {FaFilter} from 'react-icons/fa'

const Reports = () => {
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
    const [modalOpen, setModalOpen] = useState(false)
    const {t} = useTranslation(['common'])

    const card = [
        {
            name: 'Sof foyda',
            type: 'income',
        },
        {
            name: 'Xarajatlar',
            type: 'expenses',
        },
        {
            name: 'Tushumlar',
            type: 'payments',
        },
        {
            name: 'Qaytarilgan',
            type: 'backproducts',
        },
        {
            name: 'Chegirmalar',
            type: 'discounts',
        },
        {
            name: 'Qarzlar',
            type: 'debts',
        },
    ]

    const dispatch = useDispatch()
    const {
        reports,
        clearErrorrReports,
        errorReports,
        productreport,
        incomingreport,
        totalreports,
        saleproductsreport,
        startDate,
        endDate,
    } = useSelector((state) => state.reports)

    const {currencyType} = useSelector((state) => state.currency)

    const [modalVisible, setModalVisible] = useState(false)
    const [modalBody, setModalBody] = useState(null)

    const handleClickPrint = () => {
        setModalVisible(true)
        setModalBody('totalReport')
    }

    const toggleClickPrint = () => {
        setModalVisible(false)
        setModalBody('')
    }

    const handleStartDate = (e) => {
        dispatch(changeStartDate({start: e.toISOString()}))
    }
    const handleEndDate = (e) => {
        dispatch(changeEndDate({end: e.toISOString()}))
    }

    useEffect(() => {
        const body = {
            startDate: new Date(
                new Date(startDate).getFullYear(),
                new Date(startDate).getMonth(),
                new Date(startDate).getDate()
            ).toISOString(),
            endDate: endDate,
        }
        let bodyTotal = {
            startDate: new Date(
                new Date().setMonth(new Date().getMonth() - 1)
            ).toISOString(),
            endDate: new Date(),
        }

        dispatch(getReports(body))
        dispatch(getProducts())
        dispatch(getIncomings(bodyTotal))
        dispatch(getReportsForTotal(bodyTotal))
        dispatch(getSaleProducts(bodyTotal))
    }, [dispatch, startDate, endDate])
    useEffect(() => {
        if (errorReports) {
            universalToast(errorReports, 'error')
            dispatch(clearErrorReports())
        }
    }, [dispatch, clearErrorrReports, errorReports])

    return (
        <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
                open: {opacity: 1, height: 'auto'},
                collapsed: {opacity: 0, height: 0},
            }}
            transition={{duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98]}}
        >
            <div className='mt-[60px]  flex items-center ps-[20px] pe-[20px]'>
                {isMobile ? (
                    <button
                        onClick={() => setModalOpen(true)}
                        className='  hover:bg-blue-200  bg-blue-400   focus-visible:outline-none w-[116px] h-[34px] createElement '
                    >
                        <FaFilter /> {t('izlash')}
                    </button>
                ) : (
                    <div className=''>
                        <SearchForm
                            filterBy={['startDate', 'endDate']}
                            startDate={new Date(startDate)}
                            endDate={new Date(endDate)}
                            setStartDate={handleStartDate}
                            setEndDate={handleEndDate}
                        />
                    </div>
                )}
                {/*<PrintBtn key={'print_btn_1'}  onClick={handleClickPrint} />*/}
            </div>

            {modalOpen ? (
                <div className='fixed w-[100%] h-[100vh] bg-[white] z-50 top-0 start-0 pt-[50px]'>
                    <VscClose
                        onClick={() => setModalOpen(false)}
                        className='absolute text-3xl end-[25px] top-[25px] cursor-pointer'
                    />
                    <SearchForm
                        filterBy={['startDate', 'endDate']}
                        startDate={new Date(startDate)}
                        endDate={new Date(endDate)}
                        setStartDate={handleStartDate}
                        setEndDate={handleEndDate}
                    />
                    <div className='flex justify-center mt-[100px]'>
                        <button
                            onClick={() => setModalOpen(false)}
                            className='  hover:bg-blue-200  bg-blue-400   focus-visible:outline-none w-[116px] h-[34px] createElement '
                        >
                            <FaFilter /> {t('izlash')}
                        </button>
                    </div>
                </div>
            ) : null}

            <div className='checkout-card pl-[20px] mainPadding mt-[30px]'>
                {reports &&
                    map(card, (i) => (
                        <CheckoutCards
                            key={uniqueId('card')}
                            path={i.type}
                            name={t(i.name)}
                            type={i.type}
                            percentage={i.percentage}
                            cost={i.cost}
                            currency={currencyType}
                            report={reports && reports[i.type]}
                        />
                    ))}
            </div>
            <UniversalModal
                body={modalBody}
                toggleModal={toggleClickPrint}
                incomingreport={incomingreport}
                productreport={productreport}
                saleproductsreport={saleproductsreport}
                totalreports={totalreports}
                currency={currencyType}
                isOpen={modalVisible}
                headerText={
                    modalBody === 'complete' &&
                    "To'lovni amalga oshirishni tasdiqlaysizmi ?"
                }
                title={
                    modalBody === 'complete' &&
                    "To'lovni amalga oshirgach bu ma`lumotlarni o`zgaritirb bo`lmaydi !"
                }
            />
        </motion.section>
    )
}

export default Reports
