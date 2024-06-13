import React, {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'
import {roundUsd, roundUzs, UsdToUzs, UzsToUsd} from '../../App/globalFunctions'
import LinkToBack from '../../Components/LinkToBack/LinkToBack'
import UniversalModal from '../../Components/Modal/UniversalModal'
import Pagination from '../../Components/Pagination/Pagination'
import SessionBtn from '../../Components/Buttons/SessionBtn'
import CustomerPayment from '../../Components/Payment/CustomerPayment'
import SearchForm from '../../Components/SearchForm/SearchForm'
import Table from '../../Components/Table/Table'
import TableMobile from '../../Components/Table/TableMobile'
import {
    warningLessPayment,
    warningMoreDiscount,
    warningMorePayment,
} from '../../Components/ToastMessages/ToastMessages'
import {
    clearDatas,
    clearSuccessDebtComment,
    getBackProducts,
    getDebts,
    getDiscounts,
    getExpensesReport,
    getPaymentReport,
    getProducts,
    getProfit,
    getReportsForTotal,
    getSaleProducts,
    payDebt,
    setDebtComment,
} from './reportsSlice'
import {getExpense} from '../Expense/expenseSlice'
import {ReportsTableHeaders} from './ReportsTableHeaders'
import {filter} from 'lodash'
import {universalSort} from './../../App/globalFunctions'
import {excelAllSellings, getSellings} from '../Sale/Slices/sellingsSlice'
import {VscClose} from 'react-icons/vsc'
import {GrSettingsOption} from 'react-icons/gr'
import {t} from 'i18next'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import Excel from '../../Images/Excel.svg'
import SelectForm from '../../Components/Select/SelectForm.js'
import SmallLoader from '../../Components/Spinner/SmallLoader.js'

const ReportPage = () => {
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
    const {id} = useParams()

    const dispatch = useDispatch()

    const {market: _id, user} = useSelector((state) => state.login)
    const {expenses} = useSelector((state) => state.expense)
    const {datas, count, startDate, endDate, successDebtComment, totalpayment} =
        useSelector((state) => state.reports)
    const {sellings} = useSelector((state) => state.sellings)
    const {currencyType, currency} = useSelector((state) => state.currency)
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)
    const [totalPage, setTotalPage] = useState(1)
    const [comment, setComment] = useState('')
    const [sendingSearch, setSendingSearch] = useState({
        id: '',
        client: '',
    })
    const [localSearch, setLocalSearch] = useState({
        id: '',
        client: '',
    })
    const [storageData, setStorageData] = useState([])
    const [currentData, setCurrentData] = useState(datas)

    // Payments STATES
    const [modalVisible, setModalVisible] = useState(false)
    const [paymentModalVisible, setPaymentModalVisible] = useState(false)
    const [paymentType, setPaymentType] = useState('cash')
    const [paymentCash, setPaymentCash] = useState('')
    const [paymentCashUzs, setPaymentCashUzs] = useState('')
    const [paymentCard, setPaymentCard] = useState('')
    const [paymentCardUzs, setPaymentCardUzs] = useState('')
    const [paymentTransfer, setPaymentTransfer] = useState('')
    const [paymentTransferUzs, setPaymentTransferUzs] = useState('')
    const [paymentDiscount, setPaymentDiscount] = useState('')
    const [paymentDiscountUzs, setPaymentDiscountUzs] = useState('')
    const [paymentDiscountPercent, setPaymentDiscountPercent] = useState('')
    const [hasDiscount, setHasDiscount] = useState(false)
    const [saleConnectorId, setSaleConnectorId] = useState(null)
    const [userValue, setUserValue] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [discountSelectOption, setDiscountSelectOption] = useState({
        label: '%',
        value: '%',
    })
    const [sorItem, setSorItem] = useState({
        filter: '',
        sort: '',
        count: 0,
    })
    const [storeData, setStoreData] = useState(datas)
    const [paymentDebt, setPaymentDebt] = useState(0)
    const [paymentDebtUzs, setPaymentDebtUzs] = useState(0)
    const [allPayment, setAllPayment] = useState(0)
    const [allPaymentUzs, setAllPaymentUzs] = useState(0)
    const [paid, setPaid] = useState(0)
    const [paidUzs, setPaidUzs] = useState(0)
    const [modalBody, setModalBody] = useState('')
    const [modalData, setModalData] = useState(null)
    const [totalDebt, setTotalDebt] = useState({
        usd: 0,
        uzs: 0,
    })
    const [beginDay, setBeginDay] = useState(null)
    const [endDay, setEndDay] = useState(new Date())
    const [customLoading, setCustomLoading] = useState(false)
    const [printBody, setPrintBody] = useState({})

    const headers = [
        {title: '№'},
        {title: 'Kodi'},
        {title: 'Nomi'},
        {title: 'Soni'},
        {title: 'Narxi'},
        {title: 'Jami', styles: 'w-[10rem]'},
        {title: ''},
    ]

    const filterByTotal = ({value}) => {
        setCountPage(Number(value))
        setCurrentPage(0)
    }

    const memoizedExpenses = useMemo(() => {
        return {
            cash: {
                uzs: expenses
                    .filter((item) => item.type === 'cash')
                    .reduce((prev, {sumuzs}) => {
                        return prev + sumuzs
                    }, 0),
                usd: expenses
                    .filter((item) => item.type === 'cash')
                    .reduce((prev, {sum}) => {
                        return prev + sum
                    }, 0),
            },
            card: {
                uzs: expenses
                    .filter((item) => item.type === 'card')
                    .reduce((prev, {sumuzs}) => {
                        return prev + sumuzs
                    }, 0),
                usd: expenses
                    .filter((item) => item.type === 'card')
                    .reduce((prev, {sum}) => {
                        return prev + sum
                    }, 0),
            },
            transfer: {
                uzs: expenses
                    .filter((item) => item.type === 'transfer')
                    .reduce((prev, {sumuzs}) => {
                        return prev + sumuzs
                    }, 0),
                usd: expenses
                    .filter((item) => item.type === 'transfer')
                    .reduce((prev, {sum}) => {
                        return prev + sum
                    }, 0),
            },
        }
    }, [expenses])

    const handlePrintModal = async (el) => {
        setCustomLoading(true)
        try {
            let numberofsellingsbody = {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                search: {
                    client: '',
                    id: '',
                    product: '',
                },
            }
            let reportstotalbody = {
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate),
            }

            const [
                {saleconnectors},
                {income, debts, discounts},
                {totalpieces},
                {
                    totalpieces: numberOfRemaningProducts,
                    totalprice,
                    totalpriceuzs,
                    producttypes,
                },
            ] = await Promise.all([
                await dispatch(excelAllSellings(numberofsellingsbody)).unwrap(),
                await dispatch(getReportsForTotal(reportstotalbody)).unwrap(),
                await dispatch(getSaleProducts(reportstotalbody)).unwrap(),
                await dispatch(getProducts()).unwrap(),
            ])
            toggleCheckModal()
            setModalBody('dailySaleCheck')
            setPrintBody({
                boshsana: startDate,
                tugashsana: endDate,
                sotuvlarsoni: saleconnectors.length,
                tushumlar: {
                    naqt: {
                        sum: totalpayment.payment.cashuzs,
                        dollar: totalpayment.payment.cash,
                    },
                    plastik: {
                        sum: totalpayment.payment.carduzs,
                        dollar: totalpayment.payment.card,
                    },
                    utkazma: {
                        sum: totalpayment.payment.transferuzs,
                        dollar: totalpayment.payment.transfer,
                    },
                },
                qaytarilganlar: {
                    naqt: {
                        sum: totalpayment.back.cashuzs,
                        dollar: totalpayment.back.cash,
                    },
                    plastik: {
                        sum: totalpayment.back.carduzs,
                        dollar: totalpayment.back.card,
                    },
                    utkazma: {
                        sum: totalpayment.back.transferuzs,
                        dollar: totalpayment.back.transfer,
                    },
                },
                xarajatlar: {
                    naqt: {
                        sum: memoizedExpenses.cash.uzs,
                        dollar: memoizedExpenses.cash.usd,
                    },
                    plastik: {
                        sum: memoizedExpenses.card.uzs,
                        dollar: memoizedExpenses.card.usd,
                    },
                    utkazma: {
                        sum: memoizedExpenses.transfer.uzs,
                        dollar: memoizedExpenses.transfer.usd,
                    },
                },
                foyda: {
                    sum: income.incomeuzs,
                    dollar: income.income,
                },
                qarzlar: {
                    sum: debts.debtsuzs,
                    dollar: debts.debts,
                },
                chegirmalar: {
                    sum: discounts.discountsuzs,
                    dollar: discounts.discounts,
                },
                kassaqoldiq: {
                    naqt: {
                        sum:
                            totalpayment.result.cashuzs -
                            memoizedExpenses.cash.uzs,
                        dollar:
                            totalpayment.result.cash -
                            memoizedExpenses.cash.usd,
                    },
                    plastik: {
                        sum:
                            totalpayment.result.carduzs -
                            memoizedExpenses.card.uzs,
                        dollar:
                            totalpayment.result.card -
                            memoizedExpenses.card.usd,
                    },
                    utkazma: {
                        sum:
                            totalpayment.result.transferuzs -
                            memoizedExpenses.transfer.uzs,
                        dollar:
                            totalpayment.result.transfer -
                            memoizedExpenses.transfer.usd,
                    },
                },
                sotilganmaxsulotlarsoni: totalpieces,
                qolganmaxsulotlarsoni: producttypes,
                qolganmaxsulotlarumumiysoni: numberOfRemaningProducts,
                qolganmaxsulotlarqiymati: {
                    sum: totalpriceuzs,
                    dollar: totalprice,
                },
            })
        } catch (e) {
            setCustomLoading(false)
            return console.error(e)
        }
        setCustomLoading(false)
    }

    // payment
    const togglePaymentModal = (bool) => {
        bool
            ? setPaymentModalVisible(!paymentModalVisible)
            : setPaymentModalVisible(bool)
        setPaymentType('cash')
        setHasDiscount(false)
        setPaymentDiscount('')
        setPaymentDiscountUzs('')
        setPaymentDiscountPercent('')
        setPaymentDebt(0)
        setPaymentDebtUzs(0)
        setDiscountSelectOption({label: '%', value: '%'})
    }
    const toggleCheckModal = () => {
        setModalVisible(!modalVisible)
        setModalBody('')
        setModalData(null)
    }
    const toggleSaleCheck = () => {
        setModalVisible(!modalVisible)
        setModalBody('')
        setModalBody(null)
    }

    const convertToUsd = (value) => Math.round(value * 1000) / 1000
    const convertToUzs = (value) => Math.round(value)
    const handleClickPayment = (debt) => {
        const all = debt.debt
        const allUzs = debt.debtuzs
        setAllPayment(all)
        setAllPaymentUzs(allUzs)
        setPaymentCash(all)
        setPaymentCashUzs(allUzs)
        setPaid(all)
        setPaidUzs(allUzs)
        setSaleConnectorId(debt._id)
        setPaymentModalVisible(true)
    }
    const handleChangePaymentType = (type) => {
        const all = allPayment - Number(paymentDiscount)
        const allUzs = allPaymentUzs - Number(paymentDiscountUzs)
        if (paymentType !== type) {
            setPaymentType(type)
            switch (type) {
                case 'cash':
                    setPaymentCash(all)
                    setPaymentCashUzs(allUzs)
                    setPaymentCard('')
                    setPaymentCardUzs('')
                    setPaymentTransfer('')
                    setPaymentTransferUzs('')
                    setPaid(all)
                    setPaidUzs(allUzs)
                    setPaymentDebt(0)
                    setPaymentDebtUzs(0)
                    break
                case 'card':
                    setPaymentCard(all)
                    setPaymentCardUzs(allUzs)
                    setPaymentCash('')
                    setPaymentCashUzs('')
                    setPaymentTransfer('')
                    setPaymentTransferUzs('')
                    setPaid(all)
                    setPaidUzs(allUzs)
                    setPaymentDebt(0)
                    setPaymentDebtUzs(0)
                    break
                case 'transfer':
                    setPaymentTransfer(all)
                    setPaymentTransferUzs(allUzs)
                    setPaymentCash('')
                    setPaymentCashUzs('')
                    setPaymentCard('')
                    setPaymentCardUzs('')
                    setPaid(all)
                    setPaidUzs(allUzs)
                    setPaymentDebt(0)
                    setPaymentDebtUzs(0)
                    break
                default:
                    setPaymentCash('')
                    setPaymentCashUzs('')
                    setPaymentCard('')
                    setPaymentCardUzs('')
                    setPaymentTransfer('')
                    setPaymentTransferUzs('')
                    setPaid(0)
                    setPaidUzs(0)
                    setPaymentDebt(allPayment - Number(paymentDiscount))
                    setPaymentDebtUzs(
                        allPaymentUzs - Number(paymentDiscountUzs)
                    )
                    break
            }
        }
    }
    const writePayment = (value, type) => {
        const maxSum = allPayment - Number(paymentDiscount)
        const maxSumUzs = allPaymentUzs - Number(paymentDiscountUzs)
        if (currencyType === 'USD') {
            if (type === 'cash') {
                const all =
                    Number(value) +
                    Number(paymentCard) +
                    Number(paymentTransfer)
                const allUzs =
                    Number(paymentCashUzs) +
                    Number(paymentCardUzs) +
                    Number(paymentTransferUzs)
                if (all <= maxSum) {
                    setPaymentCash(value)
                    setPaymentCashUzs(UsdToUzs(value, currency))
                    setPaymentDebt(convertToUsd(maxSum - all))
                    setPaymentDebtUzs(UsdToUzs(maxSum - all, currency))
                    setPaid(all)
                    setPaidUzs(allUzs)
                } else {
                    warningMorePayment()
                }
            } else if (type === 'card') {
                const all =
                    Number(value) +
                    Number(paymentCash) +
                    Number(paymentTransfer)
                const allUzs =
                    Number(paymentCashUzs) +
                    Number(paymentCardUzs) +
                    Number(paymentTransferUzs)
                if (all <= maxSum) {
                    setPaymentCard(value)
                    setPaymentCardUzs(UsdToUzs(value, currency))
                    setPaymentDebt(convertToUsd(maxSum - all))
                    setPaymentDebtUzs(UsdToUzs(maxSum - all, currency))
                    setPaid(all)
                    setPaidUzs(allUzs)
                } else {
                    warningMorePayment()
                }
            } else {
                const all =
                    Number(value) + Number(paymentCash) + Number(paymentCard)
                const allUzs =
                    Number(paymentCashUzs) +
                    Number(paymentCardUzs) +
                    Number(paymentTransferUzs)
                if (all <= maxSum) {
                    setPaymentTransfer(value)
                    setPaymentTransferUzs(UsdToUzs(value, currency))
                    setPaymentDebt(convertToUsd(maxSum - all))
                    setPaymentDebtUzs(UsdToUzs(maxSum - all, currency))
                    setPaid(all)
                    setPaidUzs(allUzs)
                } else {
                    warningMorePayment()
                }
            }
        } else {
            if (type === 'cash') {
                const all =
                    Number(value) +
                    Number(paymentCardUzs) +
                    Number(paymentTransferUzs)
                const allUsd =
                    Number(paymentCash) +
                    Number(paymentCard) +
                    Number(paymentTransfer)
                if (all <= maxSumUzs) {
                    setPaymentCashUzs(value)
                    setPaymentCash(UzsToUsd(value, currency))
                    setPaymentDebt(UzsToUsd(maxSumUzs - all, currency))
                    setPaymentDebtUzs(convertToUzs(maxSumUzs - all))
                    setPaid(allUsd)
                    setPaidUzs(all)
                } else {
                    warningMorePayment()
                }
            } else if (type === 'card') {
                const all =
                    Number(value) +
                    Number(paymentCashUzs) +
                    Number(paymentTransferUzs)
                if (all <= maxSumUzs) {
                    setPaymentCard(UzsToUsd(value, currency))
                    setPaymentCardUzs(value)
                    setPaymentDebt(UzsToUsd(maxSumUzs - all, currency))
                    setPaymentDebtUzs(convertToUzs(maxSumUzs - all))
                    setPaid(UzsToUsd(all, currency))
                    setPaidUzs(all)
                } else {
                    warningMorePayment()
                }
            } else {
                const all =
                    Number(value) +
                    Number(paymentCashUzs) +
                    Number(paymentCardUzs)
                const allUsd =
                    Number(paymentCash) +
                    Number(paymentCard) +
                    Number(paymentTransfer)
                if (all <= maxSumUzs) {
                    setPaymentTransfer(UzsToUsd(value, currency))
                    setPaymentTransferUzs(value)
                    setPaymentDebt(UzsToUsd(maxSumUzs - all, currency))
                    setPaymentDebtUzs(convertToUzs(maxSumUzs - all))
                    setPaid(allUsd)
                    setPaidUzs(all)
                } else {
                    warningMorePayment()
                }
            }
        }
    }
    const handleChangeDiscount = (value) => {
        const allPaymentAfterDiscount =
            Math.round(((allPayment * 5) / 100) * 10) / 10
        const allPaymentUzsAfterDiscount =
            Math.round(((allPaymentUzs * 5) / 100) * 10) / 10
        if (discountSelectOption.value === 'USD') {
            if (value > allPaymentAfterDiscount) {
                warningMoreDiscount(`${allPaymentAfterDiscount} USD`)
            } else {
                setPaymentDiscount(value)
                setPaymentDiscountUzs(UsdToUzs(value, currency))
                setPaymentDiscountPercent(
                    Math.round(((allPayment * value) / 100) * 10) / 10
                )
                setPaymentDebt(allPayment - value)
                setPaymentDebtUzs(UsdToUzs(allPayment - value, currency))
            }
        } else if (discountSelectOption.value === 'UZS') {
            if (value > allPaymentUzsAfterDiscount) {
                warningMoreDiscount(`${allPaymentUzsAfterDiscount} UZS`)
            } else {
                setPaymentDiscountUzs(value)
                setPaymentDiscount(UzsToUsd(value, currency))
                setPaymentDiscountPercent(
                    Math.round(((allPaymentUzs * value) / 100) * 10) / 10
                )
                setPaymentDebt(UzsToUsd(allPaymentUzs - value, currency))
                setPaymentDebtUzs(allPaymentUzs - value)
            }
        } else {
            if (value > 5) {
                warningMoreDiscount('5%')
            } else {
                const discountUsd =
                    Math.round(((allPayment * value) / 100) * 10) / 10
                const discountUzs =
                    Math.round(((allPaymentUzs * value) / 100) * 10) / 10
                setPaymentDiscountPercent(value)
                setPaymentDiscount(discountUsd)
                setPaymentDiscountUzs(discountUzs)
                setPaymentDebt(convertToUsd(allPayment - discountUsd))
                setPaymentDebtUzs(convertToUzs(allPaymentUzs - discountUzs))
                setPaid(allPayment - discountUsd)
                setPaidUzs(allPaymentUzs - discountUzs)
            }
        }
        setPaymentCash('')
        setPaymentCashUzs('')
        setPaymentCard('')
        setPaymentCardUzs('')
        setPaymentTransfer('')
        setPaymentTransferUzs('')
        setPaid(0)
        setPaidUzs(0)
    }
    const handleChangePaymentInput = (value, key) => {
        writePayment(value, key)
    }
    const handleClickDiscountBtn = () => {
        setHasDiscount(!hasDiscount)
        if (paymentType === 'cash') {
            setPaymentCash(allPayment)
            setPaymentCashUzs(allPaymentUzs)
            setPaid(allPayment)
            setPaidUzs(allPaymentUzs)
        } else if (paymentType === 'card') {
            setPaymentCard(allPayment)
            setPaymentCardUzs(allPaymentUzs)
            setPaid(allPayment)
            setPaidUzs(allPaymentUzs)
        } else if (paymentType === 'transfer') {
            setPaymentTransfer(allPayment)
            setPaymentTransferUzs(allPaymentUzs)
            setPaid(allPayment)
            setPaidUzs(allPaymentUzs)
        } else {
            setPaymentCash('')
            setPaymentCashUzs('')
            setPaymentCard('')
            setPaymentCardUzs('')
            setPaymentTransfer('')
            setPaymentTransferUzs('')
            setPaid(0)
            setPaidUzs(0)
            setPaymentDebt(allPayment)
            setPaymentDebtUzs(allPaymentUzs)
        }
        setPaymentDiscount('')
        setPaymentDiscountUzs('')
        setPaymentDiscountPercent('')
    }
    const handleChangeDiscountSelectOption = (option) => {
        if (discountSelectOption.value !== option.value) {
            setDiscountSelectOption(option)
            setPaymentDiscount('')
            setPaymentDiscountUzs('')
            setPaymentDiscountPercent('')
            setPaymentCash('')
            setPaymentCashUzs('')
            setPaymentCard('')
            setPaymentCardUzs('')
            setPaymentTransfer('')
            setPaymentTransferUzs('')
            setPaymentDebt(allPayment)
            setPaymentDebtUzs(allPaymentUzs)
            setPaid(0)
            setPaidUzs(0)
        }
    }
    const clearAll = (bool) => {
        setPaymentCash('')
        setPaymentCashUzs('')
        setPaymentCard('')
        setPaymentCardUzs('')
        setPaymentTransfer('')
        setPaymentTransferUzs('')
        setPaymentDebt(0)
        setPaymentDebtUzs(0)
        setPaid(0)
        setPaidUzs(0)
        setUserValue('')
        setSaleConnectorId(null)
        togglePaymentModal(bool)
    }
    const handleClickPay = () => {
        setModalBody('complete')
        setModalVisible(true)
    }
    const handleClosePay = () => {
        setModalVisible(false)
        setTimeout(() => {
            setModalBody('')
        }, 500)
    }
    const handleApprovePay = () => {
        handleClosePay()

        const totalSumFromInputs =
            Number(paymentCard) +
            Number(paymentCardUzs) +
            Number(paymentCash) +
            Number(paymentCashUzs) +
            Number(paymentTransfer) +
            Number(paymentTransferUzs)

        if (totalSumFromInputs < Number(allPayment) + Number(allPaymentUzs)) {
            warningLessPayment() 
            return 
        }
        const body = {
            payment: {
                totalprice: Number(allPayment),
                totalpriceuzs: Number(allPaymentUzs),
                type: paymentType,
                cash: Number(paymentCash),
                cashuzs: Number(paymentCashUzs),
                card: Number(paymentCard),
                carduzs: Number(paymentCardUzs),
                transfer: Number(paymentTransfer),
                transferuzs: Number(paymentTransferUzs),
                discount: 0,
                discountuzs: 0,
            },
            user: user._id,
            saleconnectorid: saleConnectorId,
        }
        dispatch(payDebt(body)).then(({payload}) => {
            setModalData(payload)
            dispatch(getDebts())
            setTimeout(() => {
                setModalBody('allDebtPayedCheck')
                setModalVisible(true)
                clearAll()
            }, 500)
        })
    }

    const toggleModal = () => {
        setModalBody('')
        setModalVisible(!modalVisible)
        setTimeout(() => {
            // setCurrentProduct(null)
        }, 500)
    }

    const handleClickPrint = (saleconnector) => {
        if (id === 'debts') {
            setModalData(saleconnector)
            setModalBody('allChecks')
            setModalVisible(true)
        }
        if (id === 'sale') {
            setModalData(saleconnector)
            setModalBody('allChecks')
            setModalVisible(true)
        }
        if (id === 'backproducts') {
            setModalBody('allChecks')
            setModalData(saleconnector)
            setModalVisible(!modalVisible)
        }
        if (id === 'income') {
            setModalBody('allChecks')
            setModalData(saleconnector)
            setModalVisible(!modalVisible)
        }
        if (id === 'payments') {
            if (saleconnector.payment) {
                setModalBody('checkSell')
                setModalData(saleconnector)
                setModalVisible(!modalVisible)
            } else {
                setModalBody('allChecks')
                setModalData(saleconnector)
                setModalVisible(!modalVisible)
            }
        }
    }

    // search functions
    const searchId = (e) => {
        let target = e.target.value
        setCurrentData([
            ...filter([...storageData], (item) =>
                item.saleconnector
                    ? item.saleconnector.id.includes(target)
                    : item.id.includes(target)
            ),
        ])
        setLocalSearch({
            ...localSearch,
            id: target,
        })
    }

    const searchClientName = (e) => {
        let target = e.target.value.toLowerCase()
        setCurrentData([
            ...filter(
                [...storageData],
                (item) =>
                    item.client &&
                    item.client.name.toLowerCase().includes(target)
            ),
        ])
        setLocalSearch({
            ...localSearch,
            client: target,
        })
    }

    const onKeySearch = (e) => {
        if (e.key === 'Enter') {
            setSendingSearch(localSearch)
        }
    }

    const handleBeginDay = (e) => {
        let date = new Date(e.setHours(0, 0, 0))
        setBeginDay(date)
    }
    const handleEndDay = (e) => {
        let date = new Date(e.setHours(23, 59, 59))
        setEndDay(date)
    }
    const filterData = (filterKey) => {
        if (filterKey === sorItem.filter) {
            switch (sorItem.count) {
                case 1:
                    setSorItem({
                        filter: filterKey,
                        sort: '1',
                        count: 2,
                    })
                    universalSort(
                        currentData,
                        setCurrentData,
                        filterKey,
                        1,
                        storeData
                    )
                    break
                case 2:
                    setSorItem({
                        filter: filterKey,
                        sort: '',
                        count: 0,
                    })
                    universalSort(
                        currentData,
                        setCurrentData,
                        filterKey,
                        '',
                        storeData
                    )
                    break
                default:
                    setSorItem({
                        filter: filterKey,
                        sort: '-1',
                        count: 1,
                    })
                    universalSort(
                        currentData,
                        setCurrentData,
                        filterKey,
                        -1,
                        storeData
                    )
            }
        } else {
            setSorItem({
                filter: filterKey,
                sort: '-1',
                count: 1,
            })
            universalSort(currentData, setCurrentData, filterKey, -1, storeData)
        }
    }

    const handleModalDebtComment = (comment, debtid) => {
        dispatch(setDebtComment({comment, debtid}))
        setModalBody('debtcomment')
        setModalVisible(!modalVisible)
    }

    const toggleDebtCommentModal = () => {
        dispatch(setDebtComment({comment: null, debtid: null}))
        setModalBody('')
        setModalVisible(!modalVisible)
    }

    useEffect(() => {
        const check = (page) => id === page
        let body = {
            type: id,
            currentPage,
            countPage,
            startDate: beginDay,
            endDate: endDay,
            market: _id,
            search: sendingSearch,
        }
        let debtBody = {
            startDate: beginDay,
            endDate: endDay,
        }
        check('sale') && dispatch(getSellings(body))
        check('income') && dispatch(getProfit(body))
        check('payments') && dispatch(getPaymentReport(body))
        check('debts') && dispatch(getDebts(debtBody))
        check('discounts') && dispatch(getDiscounts(body))
        check('backproducts') && dispatch(getBackProducts(body))
        check('expenses') && dispatch(getExpensesReport(body))
        return () => {
            dispatch(clearDatas())
        }
    }, [
        dispatch,
        sendingSearch,
        currentPage,
        countPage,
        beginDay,
        endDay,
        _id,
        id,
    ])
    useEffect(() => {
        if (id === 'cash' || id === 'card' || id === 'transfer') {
            setCurrentData([...datas.filter((item) => item[id] !== 0)])
            setStorageData([...datas.filter((item) => item[id] !== 0)])
        }
        if (id === 'sale') {
            setCurrentData(sellings)
            setStorageData(sellings)
        } else {
            setCurrentData(datas)
            setStorageData(datas)
        }
        return () => {
            setCurrentData([])
            setStorageData([])
        }
    }, [datas, id, sellings])
    useEffect(() => {
        count > 0 && setTotalPage(count)
    }, [count])
    useEffect(() => {
        if (id === 'debts') {
            setTotalDebt({
                usd: roundUsd(datas.reduce((prev, {debt}) => prev + debt, 0)),
                uzs: roundUzs(
                    datas.reduce((prev, {debtuzs}) => prev + debtuzs, 0)
                ),
            })
        }
    }, [datas, id])
    useEffect(() => {
        if (id === 'debts') {
            const searched = [...datas].filter((debt) => {
                return (
                    new Date(debt.createdAt) >= beginDay &&
                    new Date(debt.createdAt) <= endDay
                )
            })
            setCurrentData(searched)
        }
        setCurrentData(datas)
        setStoreData(datas)
    }, [id, datas, beginDay, endDay])
    useEffect(() => {
        if (successDebtComment) {
            let debtBody = {
                startDate: beginDay,
                endDate: endDay,
                market: _id,
            }
            dispatch(getDebts(debtBody))
            dispatch(clearSuccessDebtComment())
        }
    }, [dispatch, successDebtComment, id, _id, sendingSearch, beginDay, endDay])

    useEffect(() => {
        let body = {
            currentPage: 0,
            countPage: 10000000,
            startDate: beginDay,
            endDate: endDay,
        }
        dispatch(getExpense(body))
    }, [dispatch, beginDay, endDay])

    useEffect(() => {
        if (id === 'debts') {
            let date = new Date()
            let month = date.getMonth()
            let year = date.getFullYear()
            let day = date.getDate()
            let startDate = new Date(year, month - 3, day)
            setBeginDay(startDate)
        } else {
            if (startDate) {
                setBeginDay(new Date(startDate))
            } else {
                setBeginDay(
                    new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate()
                    ).setHours(0, 0, 0)
                )
            }
            if (endDate) {
                setEndDay(new Date(endDate))
            }
        }
    }, [id, startDate, endDate])

    return (
        <div className='relative overflow-auto '>
            {customLoading && (
                <div className='fixed backdrop-blur-[2px] z-[100] left-0 top-0 right-0 bottom-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            <div className='flex lg:justify-start mb-3 justify-between items-center pe-4'>
                <span className='lg:mt-[20px]'>
                    <LinkToBack link={'/kassa'} />
                </span>
                {isMobile ? (
                    <div className='flex justify-between items-center gap-4'>
                        <div className={'mt-12'}>
                            <SelectForm
                                key={'total_1'}
                                onSelect={filterByTotal}
                            />
                        </div>
                        {/* <button className={'mt-12 exportButton'}>
                            <ReactHTMLTableToExcel
                                id='reacthtmltoexcel'
                                table='excel-tabel'
                                sheet='Sheet'
                                buttonText='Excel'
                                filename={
                                    id === 'income'
                                        ? 'Sof foyda'
                                        : id === 'expenses'
                                          ? 'Xarajatlar'
                                          : id === 'payments'
                                            ? 'Tushumlar'
                                            : id === 'backproducts'
                                              ? 'Qaytarilganlar'
                                              : id === 'discounts'
                                                ? 'Chegirmalar'
                                                : 'Qarzlar'
                                }
                            />
                            <span className={'btn-icon bg-white-900 p-[8px]'}>
                                <img src={Excel} alt='excel icon' />
                            </span>
                        </button> */}
                        <button
                            onClick={() => setModalOpen(true)}
                            className='hover:bg-blue-200  bg-blue-400 focus-visible:outline-none w-[50px] h-[33px] lg:mt-2 lg:ms-2 mt-[50px]  createElement '
                        >
                            <GrSettingsOption />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={'mt-6'}>
                            <SelectForm
                                key={'total_1'}
                                onSelect={filterByTotal}
                            />
                        </div>
                        <SearchForm
                            filterBy={
                                id === 'debts'
                                    ? ['id', 'clientName']
                                    : id === 'income'
                                    ? ['total', 'id', 'startDate', 'endDate']
                                    : id === 'expenses'
                                    ? ['startDate', 'endDate']
                                    : id === 'payments'
                                    ? [
                                          'id',
                                          'clientName',
                                          'startDate',
                                          'endDate',
                                      ]
                                    : id === 'backproducts'
                                    ? [
                                          'id',
                                          'clientName',
                                          'startDate',
                                          'endDate',
                                      ]
                                    : [
                                          'id',
                                          'clientName',
                                          'startDate',
                                          'endDate',
                                      ]
                            }
                            filterById={searchId}
                            filterByClientName={searchClientName}
                            filterByIdWhenPressEnter={onKeySearch}
                            filterByClientNameWhenPressEnter={onKeySearch}
                            startDate={beginDay}
                            endDate={endDay}
                            setStartDate={handleBeginDay}
                            setEndDate={handleEndDay}
                        />
                        <button className={'mt-6 exportButton'}>
                            <ReactHTMLTableToExcel
                                id='reacthtmltoexcel'
                                table='excel-tabel'
                                sheet='Sheet'
                                buttonText='Excel'
                                filename={
                                    id === 'income'
                                        ? 'Sof foyda'
                                        : id === 'expenses'
                                        ? 'Xarajatlar'
                                        : id === 'payments'
                                        ? 'Tushumlar'
                                        : id === 'backproducts'
                                        ? 'Qaytarilganlar'
                                        : id === 'discounts'
                                        ? 'Chegirmalar'
                                        : 'Qarzlar'
                                }
                            />
                            <span className={'btn-icon bg-white-900 p-[8px]'}>
                                <img src={Excel} alt='excel icon' />
                            </span>
                        </button>
                    </>
                )}
            </div>
            {id === 'payments' && (
                <div className='ml-3 px-4 py-2 flex justify-end'>
                    <SessionBtn
                        text={`${t('Savdo hisoboti')}`}
                        onClick={handlePrintModal}
                    />
                </div>
            )}
            <div className='flex items-center justify-between'>
                {modalOpen ? (
                    <div className='fixed w-[100%] h-[100vh] top-0 start-0 bg-[white] z-50 '>
                        <VscClose
                            onClick={() => setModalOpen(false)}
                            className='absolute text-3xl end-[25px] top-[25px] cursor-pointer'
                        />
                        <div className='pl-[0px] flex items-center justify-between mainPadding mt-[30px]'>
                            <SearchForm
                                filterBy={
                                    id === 'debts'
                                        ? [
                                              'startDate',
                                              'endDate',
                                              'id',
                                              'clientName',
                                          ]
                                        : id === 'income'
                                        ? [
                                              'id',
                                              'client',
                                              'startDate',
                                              'endDate',
                                          ]
                                        : id === 'expenses'
                                        ? ['startDate', 'endDate']
                                        : id === 'payments'
                                        ? [
                                              'id',
                                              'clientName',
                                              'startDate',
                                              'endDate',
                                          ]
                                        : id === 'backproducts'
                                        ? [
                                              'id',
                                              'clientName',
                                              'startDate',
                                              'endDate',
                                          ]
                                        : [
                                              'id',
                                              'clientName',
                                              'startDate',
                                              'endDate',
                                          ]
                                }
                                filterById={searchId}
                                filterByClientName={searchClientName}
                                filterByIdWhenPressEnter={onKeySearch}
                                filterByClientNameWhenPressEnter={onKeySearch}
                                startDate={beginDay}
                                endDate={endDay}
                                setStartDate={handleBeginDay}
                                setEndDate={handleEndDay}
                            />
                        </div>
                        <div className='flex justify-center'>
                            <button
                                onClick={() => setModalOpen(false)}
                                className=' hover:bg-blue-200  bg-blue-400 focus-visible:outline-none w-[150px] lg:h-[33px] h=[40px] createElement '
                            >
                                <GrSettingsOption /> {t('izlash')}
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
            <div className='lg:ps-[20px] lg:tableContainerPadding '>
                {currentData.length > 0 &&
                    (!isMobile ? (
                        <Table
                            page={id === 'sale' ? 'saleslist' : id}
                            headers={ReportsTableHeaders(id)}
                            data={currentData}
                            currentPage={currentPage}
                            countPage={countPage}
                            currency={currencyType}
                            type={id}
                            Pay={handleClickPayment}
                            reports={true}
                            Print={handleClickPrint}
                            Sort={filterData}
                            sortItem={sorItem}
                            Edit={handleModalDebtComment}
                            totalDebt={totalDebt}
                        />
                    ) : (
                        <TableMobile
                            page={id === 'sale' ? 'saleslist' : id}
                            headers={ReportsTableHeaders(id)}
                            data={currentData}
                            currentPage={currentPage}
                            countPage={countPage}
                            currency={currencyType}
                            type={id}
                            Pay={handleClickPayment}
                            reports={true}
                            Print={handleClickPrint}
                            Sort={filterData}
                            sortItem={sorItem}
                            Edit={handleModalDebtComment}
                            totalDebt={totalDebt}
                        />
                    ))}
                <div className='flex justify-center mt-3'>
                    {id !== 'debts' && (
                        <Pagination
                            countPage={countPage}
                            currentPage={currentPage}
                            totalDatas={totalPage}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </div>
                {/* {id === 'debts' && (
                    <ul className='w-full grid grid-cols-12 tr'>
                        <li
                            className={`col-span-8 ${currentData.length === 0 && 'border-t-2'
                                } td py-[0.625rem] text-right`}
                        >
                            Jami:
                        </li>
                        <li
                            className={`col-span-4 ${currentData.length === 0 && 'border-t-2'
                                } td py-[0.625rem] font-bold`}
                        >
                            {currencyType === 'USD'
                                ? totalDebt.usd
                                : totalDebt.uzs}{' '}
                            {currencyType}
                        </li>
                    </ul>
                )} */}
                {id === 'payments' && totalpayment?.payment?.cash && (
                    <div className='flex items-center justify-between gap-10 mt-6 bg-white py-6 md:py-0 flex-col md:flex-row'>
                        <div className='flex flex-col items-start gap-2'>
                            <div className='text-[18px] font-bold mb-2'>
                                {t('Tushumlar')}
                            </div>
                            <div className='font-semibold w-full gap-5 flex justify-between'>
                                <div>{t('Naqt')}:</div>
                                <div>
                                    {currencyType === 'USD'
                                        ? roundUsd(
                                              totalpayment.payment.cash
                                          ).toLocaleString('ru-RU')
                                        : roundUzs(
                                              totalpayment.payment.cashuzs
                                          ).toLocaleString('ru-RU')}{' '}
                                    {currencyType}
                                </div>
                            </div>
                            <div className='font-semibold w-full gap-5 flex justify-between'>
                                <div>{t('Plastik')}:</div>
                                <div>
                                    {currencyType === 'USD'
                                        ? roundUsd(
                                              totalpayment.payment.card
                                          ).toLocaleString('ru-RU')
                                        : roundUzs(
                                              totalpayment.payment.carduzs
                                          ).toLocaleString('ru-RU')}{' '}
                                    {currencyType}
                                </div>
                            </div>
                            <div className='font-semibold w-full gap-5 flex justify-between'>
                                <div>{t("O'tkazma")}:</div>
                                <div>
                                    {currencyType === 'USD'
                                        ? roundUsd(
                                              totalpayment.payment.transfer
                                          ).toLocaleString('ru-RU')
                                        : roundUzs(
                                              totalpayment.payment.transferuzs
                                          ).toLocaleString('ru-RU')}{' '}
                                    {currencyType}
                                </div>
                            </div>
                            <div className='text-[18px] font-semibold w-full text-end'>
                                {currencyType === 'USD'
                                    ? roundUsd(
                                          totalpayment.payment.cash +
                                              totalpayment.payment.card +
                                              totalpayment.payment.transfer
                                      ).toLocaleString('ru-RU')
                                    : roundUzs(
                                          totalpayment.payment.cashuzs +
                                              totalpayment.payment.carduzs +
                                              totalpayment.payment.transferuzs
                                      ).toLocaleString('ru-RU')}{' '}
                                {currencyType}
                            </div>
                        </div>
                        <div className='flex flex-col items-start gap-2'>
                            <div className='text-[18px] font-bold mb-2'>
                                {t('Qaytarilganlar')}
                            </div>
                            <div className='font-semibold w-full gap-5 flex justify-between'>
                                <div>{t('Naqt')}:</div>{' '}
                                <span>
                                    {currencyType === 'USD'
                                        ? roundUsd(
                                              totalpayment.back.cash
                                          ).toLocaleString('ru-RU')
                                        : roundUzs(
                                              totalpayment.back.cashuzs
                                          ).toLocaleString('ru-RU')}{' '}
                                    {currencyType}
                                </span>
                            </div>
                            <div className='font-semibold w-full gap-5 flex justify-between'>
                                <div>{t('Plastik')}:</div>
                                <span>
                                    {currencyType === 'USD'
                                        ? roundUsd(
                                              totalpayment.back.card
                                          ).toLocaleString('ru-RU')
                                        : roundUzs(
                                              totalpayment.back.carduzs
                                          ).toLocaleString('ru-RU')}{' '}
                                    {currencyType}
                                </span>
                            </div>
                            <div className='font-semibold w-full gap-5 flex justify-between'>
                                <div>{t("O'tkazma")}:</div>
                                <span>
                                    {currencyType === 'USD'
                                        ? roundUsd(
                                              totalpayment.back.transfer
                                          ).toLocaleString('ru-RU')
                                        : roundUzs(
                                              totalpayment.back.transferuzs
                                          ).toLocaleString('ru-RU')}{' '}
                                    {currencyType}
                                </span>
                            </div>
                            <div className='text-[18px] font-semibold w-full text-end'>
                                {currencyType === 'USD'
                                    ? roundUsd(
                                          totalpayment.back.cash +
                                              totalpayment.back.card +
                                              totalpayment.back.transfer
                                      ).toLocaleString('ru-RU')
                                    : roundUzs(
                                          totalpayment.back.cashuzs +
                                              totalpayment.back.carduzs +
                                              totalpayment.back.transferuzs
                                      ).toLocaleString('ru-RU')}{' '}
                                {currencyType}
                            </div>
                        </div>
                        {expenses && (
                            <div className='flex flex-col items-start gap-2'>
                                <div className='text-[18px] font-bold mb-2'>
                                    {t('Xarajatlar')}
                                </div>
                                <div className='font-semibold w-full gap-5 flex justify-between'>
                                    <div>{t('Naqt')}:</div>{' '}
                                    <span>
                                        -
                                        {currencyType === 'USD'
                                            ? roundUsd(
                                                  memoizedExpenses.cash.usd
                                              ).toLocaleString('ru-RU')
                                            : roundUzs(
                                                  memoizedExpenses.cash.uzs
                                              ).toLocaleString('ru-RU')}{' '}
                                        {currencyType}
                                    </span>
                                </div>
                                <div className='font-semibold w-full gap-5 flex justify-between'>
                                    <div>{t('Plastik')}:</div>
                                    <span>
                                        -
                                        {currencyType === 'USD'
                                            ? roundUsd(
                                                  memoizedExpenses.card.usd
                                              ).toLocaleString('ru-RU')
                                            : roundUzs(
                                                  memoizedExpenses.card.uzs
                                              ).toLocaleString('ru-RU')}{' '}
                                        {currencyType}
                                    </span>
                                </div>
                                <div className='font-semibold w-full gap-5 flex justify-between'>
                                    <div>{t("O'tkazma")}:</div>
                                    <span>
                                        -
                                        {currencyType === 'USD'
                                            ? roundUsd(
                                                  memoizedExpenses.transfer.usd
                                              ).toLocaleString('ru-RU')
                                            : roundUzs(
                                                  memoizedExpenses.transfer.uzs
                                              ).toLocaleString('ru-RU')}{' '}
                                        {currencyType}
                                    </span>
                                </div>
                                <div className='text-[18px] font-semibold w-full text-end'>
                                    -
                                    {currencyType === 'USD'
                                        ? roundUsd(
                                              memoizedExpenses.cash.usd +
                                                  memoizedExpenses.card.usd +
                                                  memoizedExpenses.transfer.usd
                                          ).toLocaleString('ru-RU')
                                        : roundUzs(
                                              memoizedExpenses.cash.uzs +
                                                  memoizedExpenses.card.uzs +
                                                  memoizedExpenses.transfer.uzs
                                          ).toLocaleString('ru-RU')}{' '}
                                    {currencyType}
                                </div>
                            </div>
                        )}
                        <div className='flex flex-col items-start gap-2'>
                            <div className='text-[18px] font-bold mb-2'>
                                {t('Kassadagi qoldiq')}
                            </div>
                            <div className='font-semibold w-full gap-5 flex justify-between'>
                                <div>{t('Naqt')}:</div>
                                <span>
                                    {currencyType === 'USD'
                                        ? roundUsd(
                                              totalpayment.result.cash -
                                                  memoizedExpenses.cash.usd
                                          ).toLocaleString('ru-RU')
                                        : roundUzs(
                                              totalpayment.result.cashuzs -
                                                  memoizedExpenses.cash.uzs
                                          ).toLocaleString('ru-RU')}{' '}
                                    {currencyType}
                                </span>
                            </div>
                            <div className='font-semibold w-full gap-5 flex justify-between'>
                                <div>{t('Plastik')}:</div>
                                <span>
                                    {currencyType === 'USD'
                                        ? roundUsd(
                                              totalpayment.result.card -
                                                  memoizedExpenses.card.usd
                                          ).toLocaleString('ru-RU')
                                        : roundUzs(
                                              totalpayment.result.carduzs -
                                                  memoizedExpenses.card.uzs
                                          ).toLocaleString('ru-RU')}{' '}
                                    {currencyType}
                                </span>
                            </div>
                            <div className='font-semibold w-full gap-5 flex justify-between'>
                                <div>{t("O'tkazma")}:</div>
                                <span>
                                    {currencyType === 'USD'
                                        ? roundUsd(
                                              totalpayment.result.transfer -
                                                  memoizedExpenses.transfer.usd
                                          ).toLocaleString('ru-RU')
                                        : roundUzs(
                                              totalpayment.result.transferuzs -
                                                  memoizedExpenses.transfer.uzs
                                          ).toLocaleString('ru-RU')}{' '}
                                    {currencyType}
                                </span>
                            </div>
                            {/* <div className='text-[18px] w-full font-semibold text-end'>
                {currencyType === 'USD'
                  ? roundUsd(
                      totalpayment.result.cash +
                        totalpayment.result.card +
                        totalpayment.result.transfer,
                    ).toLocaleString('ru-RU')
                  : roundUzs(
                      totalpayment.result.cashuzs +
                        totalpayment.result.carduzs +
                        totalpayment.result.transferuzs,
                    ).toLocaleString('ru-RU')}{' '}
                {currencyType}
              </div> */}
                        </div>
                    </div>
                )}
            </div>
            <div>
                <CustomerPayment
                    returned={true}
                    type={paymentType}
                    active={paymentModalVisible}
                    togglePaymentModal={togglePaymentModal}
                    changePaymentType={handleChangePaymentType}
                    onChange={handleChangePaymentInput}
                    client={userValue}
                    allPayment={
                        currencyType === 'USD' ? allPayment : allPaymentUzs
                    }
                    card={currencyType === 'USD' ? paymentCard : paymentCardUzs}
                    cash={currencyType === 'USD' ? paymentCash : paymentCashUzs}
                    debt={currencyType === 'USD' ? paymentDebt : paymentDebtUzs}
                    discount={
                        currencyType === 'USD'
                            ? discountSelectOption.value === 'USD'
                                ? paymentDiscount
                                : paymentDiscountPercent
                            : discountSelectOption.value === 'UZS'
                            ? paymentDiscountUzs
                            : paymentDiscountPercent
                    }
                    handleChangeDiscount={handleChangeDiscount}
                    hasDiscount={hasDiscount}
                    disableInputsCashCard={true}
                    transfer={
                        currencyType === 'USD'
                            ? paymentTransfer
                            : paymentTransferUzs
                    }
                    handleClickDiscountBtn={handleClickDiscountBtn}
                    discountSelectOption={discountSelectOption}
                    handleChangeDiscountSelectOption={
                        handleChangeDiscountSelectOption
                    }
                    paid={currencyType === 'USD' ? paid : paidUzs}
                    handleClickPay={handleClickPay}
                />
            </div>
            <UniversalModal
                body={modalBody}
                toggleModal={
                    modalBody === 'sell'
                        ? toggleModal
                        : modalBody === 'complete'
                        ? handleClosePay
                        : modalBody === 'allChecks'
                        ? toggleSaleCheck
                        : modalBody === 'debtcomment'
                        ? toggleDebtCommentModal
                        : toggleCheckModal
                }
                approveFunction={handleApprovePay}
                isOpen={modalVisible}
                payment={modalData}
                printedSelling={
                    modalBody === 'dailySaleCheck' ? printBody : modalData
                }
                product={modalData}
                headers={headers}
                headerText={
                    modalBody === 'complete' &&
                    "To'lovni amalga oshirishni tasdiqlaysizmi?"
                }
                title={
                    modalBody === 'complete' &&
                    "To'lovni amalga oshirgach bu ma`lumotlarni o'zgaritirib bo'lmaydi!"
                }
            />
        </div>
    )
}
export default ReportPage
