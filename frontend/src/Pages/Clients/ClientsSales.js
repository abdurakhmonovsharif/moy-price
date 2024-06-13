import React, {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import UniversalModal from '../../Components/Modal/UniversalModal'
import Table from '../../Components/Table/Table'
import TableMobile from '../../Components/Table/TableMobile'
import {universalSort, UsdToUzs, UzsToUsd} from './../../App/globalFunctions'
import {t} from 'i18next'
import SmallLoader from '../../Components/Spinner/SmallLoader.js'
import {getClientsSales, payClientSalesDebt} from './clientsSlice'
import {useLocation} from 'react-router-dom'
import CustomerPayment from '../../Components/Payment/CustomerPayment.js'
import {warningMorePayment} from '../../Components/ToastMessages/ToastMessages.js'

export const convertToUsd = (value) => Math.round(value * 1000) / 1000
export const convertToUzs = (value) => Math.round(value)
const ClientsSales = () => {
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

    const dispatch = useDispatch()

    const location = useLocation()

    const {market: _id, user} = useSelector((state) => state.login)
    const {clients_info} = useSelector((state) => state.clients)
    const {sellings} = useSelector((state) => state.sellings)
    const {currencyType, currency} = useSelector((state) => state.currency)
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)
    const [sendingSearch, setSendingSearch] = useState({
        id: '',
        client: '',
    })
    const [currentData, setCurrentData] = useState(clients_info)
    // Payments STATES
    const [modalVisible, setModalVisible] = useState(false)
    const [sorItem, setSorItem] = useState({
        filter: '',
        sort: '',
        count: 0,
    })
    const [storeData, setStoreData] = useState(clients_info)
    const [modalBody, setModalBody] = useState('')
    const [modalData, setModalData] = useState(null)
    const [totalDebt, setTotalDebt] = useState({
        usd: 0,
        uzs: 0,
    })
    const [customLoading, setCustomLoading] = useState(false)
    const [printBody, setPrintBody] = useState({})
    // sale state
    const [paymentModalVisible, setPaymentModalVisible] = useState(false)
    const [paymentType, setPaymentType] = useState('cash')
    const [paymentCash, setPaymentCash] = useState('')
    const [paymentCashUzs, setPaymentCashUzs] = useState('')
    const [paymentCard, setPaymentCard] = useState('')
    const [paymentCardUzs, setPaymentCardUzs] = useState('')
    const [paymentTransfer, setPaymentTransfer] = useState('')
    const [paymentTransferUzs, setPaymentTransferUzs] = useState('')
    const [paymentDebt, setPaymentDebt] = useState(0)
    const [paymentDebtUzs, setPaymentDebtUzs] = useState(0)
    const [allPayment, setAllPayment] = useState(0)
    const [allPaymentUzs, setAllPaymentUzs] = useState(0)
    const [paid, setPaid] = useState(0)
    const [paidUzs, setPaidUzs] = useState(0)
    const [currentId, setCurrentId] = useState('')
    const [exchangerate, setExchangerate] = useState(currency)
    const [comment, setComment] = useState('')
    const [products, setProducts] = useState([])
    const [saleConnectorId, setSaleConnectorId] = useState('')
    let delay = null
    const headers = [
        {
            title: '№',
        },
        {
            title: t('Sana'),
            filter: 'createdAt',
        },
        {
            title: t('Mijoz'),
        },
        {
            title: t('Jami'),
        },
        {
            title: t('Chegirma'),
        },
        {
            title: t('Qarz'),
        },
        {
            title: t(`Qarzdan to'lov`),
        },
        {
            title: '',
            styles: 'w-[7rem]',
        },
    ]

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

    const toggleModal = () => {
        setModalBody('')
        setModalVisible(!modalVisible)
        setTimeout(() => {
            // setCurrentProduct(null)
        }, 500)
    }

    const handleClosePay = () => {
        setModalVisible(false)
        setTimeout(() => {
            setModalBody('')
        }, 500)
    }

    const handleClickPrint = (saleconnector, key) => {
        if (key === 'firstPay') {
            setModalBody('checkSell')
            setModalData(saleconnector)
            setModalVisible(!modalVisible)
        } else if (key === 'oneAllPay') {
            setModalBody('oneSaleDebtPayments')
            setModalData(saleconnector)
            setModalVisible(!modalVisible)
        } else {
            setModalBody('allSaleDebtPayments')
            setModalData(saleconnector[0])
            setModalVisible(!modalVisible)
        }
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
    const getClientSales = () => {
        const data = location.state
        let body = {
            market: _id,
            clientId: data,
        }
        dispatch(getClientsSales(body))
    }
    useEffect(() => {
        getClientSales()
    }, [dispatch, _id])

    useEffect(() => {
        setCurrentData(clients_info)
    }, [clients_info])
    // Mock functions
    const togglePaymentModal = () => {
        setPaymentModalVisible(false)
    }

    const handleChangePaymentType = (type) => {
        if (paymentType !== type) {
            setPaymentType(type)
            switch (type) {
                case 'cash':
                    setPaymentCash(allPayment)
                    setPaymentCashUzs(allPaymentUzs)
                    setPaymentCard('')
                    setPaymentCardUzs('')
                    setPaymentTransfer('')
                    setPaymentTransferUzs('')
                    setPaid(allPayment)
                    setPaidUzs(allPaymentUzs)
                    setPaymentDebt(0)
                    setPaymentDebtUzs(0)
                    break
                case 'card':
                    setPaymentCard(allPayment)
                    setPaymentCardUzs(allPaymentUzs)
                    setPaymentCash('')
                    setPaymentCashUzs('')
                    setPaymentTransfer('')
                    setPaymentTransferUzs('')
                    setPaid(allPayment)
                    setPaidUzs(allPaymentUzs)
                    setPaymentDebt(0)
                    setPaymentDebtUzs(0)
                    break
                case 'transfer':
                    setPaymentTransfer(allPayment)
                    setPaymentTransferUzs(allPaymentUzs)
                    setPaymentCash('')
                    setPaymentCashUzs('')
                    setPaymentCard('')
                    setPaymentCardUzs('')
                    setPaid(allPayment)
                    setPaidUzs(allPaymentUzs)
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
                    setPaymentDebt(allPayment)
                    setPaymentDebtUzs(allPaymentUzs)
                    break
            }
        }
    }

    const handleChangePaymentInput = (value, key) => {
        writePayment(value, key)
    }
    const writePayment = (value, type) => {
        const maxSum = Math.abs(allPayment)
        const maxSumUzs = Math.abs(allPaymentUzs)
        if (currencyType === 'USD') {
            if (type === 'cash') {
                const all =
                    Number(value) +
                    Number(paymentCard) +
                    Number(paymentTransfer)
                const allUzs =
                    Number(UsdToUzs(value, exchangerate)) +
                    Number(paymentCardUzs) +
                    Number(paymentTransferUzs)
                if (all <= maxSum) {
                    setPaymentCash(value)
                    setPaymentCashUzs(UsdToUzs(value, exchangerate))
                    setPaymentDebt(convertToUsd(maxSum - all))
                    setPaymentDebtUzs(convertToUzs(maxSumUzs - allUzs))
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
                    Number(UsdToUzs(value, exchangerate)) +
                    Number(paymentTransferUzs)
                if (all <= maxSum) {
                    setPaymentCard(value)
                    setPaymentCardUzs(UsdToUzs(value, exchangerate))
                    setPaymentDebt(convertToUsd(maxSum - all))
                    setPaymentDebtUzs(convertToUzs(maxSumUzs - allUzs))
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
                    Number(UsdToUzs(value, exchangerate))
                if (all <= maxSum) {
                    setPaymentTransfer(value)
                    setPaymentTransferUzs(UsdToUzs(value, exchangerate))
                    setPaymentDebt(convertToUsd(maxSum - all))
                    setPaymentDebtUzs(convertToUzs(maxSumUzs - allUzs))
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
                    Number(UzsToUsd(value, exchangerate)) +
                    Number(paymentCard) +
                    Number(paymentTransfer)
                if (all <= maxSumUzs) {
                    setPaymentCashUzs(value)
                    setPaymentCash(UzsToUsd(value, exchangerate))
                    setPaymentDebt(convertToUsd(maxSum - allUsd))
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
                const allUsd =
                    Number(paymentCash) +
                    Number(UzsToUsd(value, exchangerate)) +
                    Number(paymentTransfer)
                if (all <= maxSumUzs) {
                    setPaymentCard(UzsToUsd(value, exchangerate))
                    setPaymentCardUzs(value)
                    setPaymentDebt(convertToUsd(maxSum - allUsd))
                    setPaymentDebtUzs(convertToUzs(maxSumUzs - all))
                    setPaid(UzsToUsd(all, exchangerate))
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
                    Number(UzsToUsd(value, exchangerate))
                if (all <= maxSumUzs) {
                    setPaymentTransfer(UzsToUsd(value, exchangerate))
                    setPaymentTransferUzs(value)
                    setPaymentDebt(convertToUsd(maxSum - allUsd))
                    setPaymentDebtUzs(convertToUzs(maxSumUzs - all))
                    setPaid(allUsd)
                    setPaidUzs(all)
                } else {
                    warningMorePayment()
                }
            }
        }
    }
    const handleChangeDiscount = (discount) => {
        console.log('Discount changed:', discount)
    }

    const handleClickDiscountBtn = () => {
        console.log('Discount button clicked')
    }

    const handleChangeDiscountSelectOption = (option) => {
        console.log('Discount select option changed to:', option)
    }

    const handleClickPay = () => {
        if (delay === null) {
            delay = window.setTimeout(() => {
                delay = null
                setModalBody('complete')
                setModalVisible(true)
            }, 300)
        }
    }

    const discountSelectOption = {
        value: 'USD',
        label: 'USD',
    }
    const handlePayButtonClick = (data) => {
        setPaymentModalVisible(true)
        const {debt: debts, saleconnector, products} = data
        setProducts(products)
        setSaleConnectorId(saleconnector._id)
        const all = debts.debt
        const allUzs = debts.debtuzs
        setCurrentId(debts._id)
        setAllPayment(all)
        setAllPaymentUzs(allUzs)
        setPaymentCash(all)
        setPaymentCashUzs(allUzs)
        setPaid(all)
        setPaidUzs(allUzs)
        setPaymentModalVisible(true)
        setPaymentModalVisible(true)
    }
    const handleApprovePay = () => {
        handleClosePay()
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
            products,
            debt_id: currentId,
        }
        dispatch(payClientSalesDebt(body)).then(({payload}) => {
            setModalData(payload)
            console.log(payload);
            setTimeout(() => {
                setModalBody('checkPayment')
                setModalVisible(true)
                getClientSales()
            }, 500)
        })
    }
    return (
        <div className='relative overflow-auto '>
            {customLoading && (
                <div className='fixed backdrop-blur-[2px] z-[100] left-0 top-0 right-0 bottom-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            <div className='lg:ps-[20px] lg:tableContainerPadding '>
                {currentData.length > 0 &&
                    (!isMobile ? (
                        <Table
                            page={'clientssales'}
                            headers={headers}
                            data={currentData}
                            currentPage={currentPage}
                            countPage={countPage}
                            currency={currencyType}
                            reports={true}
                            Print={handleClickPrint}
                            Sort={filterData}
                            sortItem={sorItem}
                            Pay={handlePayButtonClick}
                            totalDebt={totalDebt}
                        />
                    ) : (
                        <TableMobile
                            page={'clientssales'}
                            headers={headers}
                            data={currentData}
                            currentPage={currentPage}
                            countPage={countPage}
                            currency={currencyType}
                            reports={true}
                            Print={handleClickPrint}
                            Sort={filterData}
                            sortItem={sorItem}
                        />
                    ))}
            </div>
            <CustomerPayment
                returned={false}
                type={paymentType}
                active={paymentModalVisible}
                togglePaymentModal={togglePaymentModal}
                changePaymentType={handleChangePaymentType}
                onChange={handleChangePaymentInput}
                client={null}
                allPayment={currencyType === 'USD' ? allPayment : allPaymentUzs}
                card={currencyType === 'USD' ? paymentCard : paymentCardUzs}
                cash={currencyType === 'USD' ? paymentCash : paymentCashUzs}
                debt={currencyType === 'USD' ? paymentDebt : paymentDebtUzs}
                discount={null}
                handleChangeDiscount={handleChangeDiscount}
                hasDiscount={false}
                changeComment={() => setComment('')}
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
            <UniversalModal
                body={modalBody}
                toggleModal={
                    modalBody === 'sell'
                        ? toggleModal
                        : modalBody === 'complete'
                        ? handleClosePay
                        : modalBody === 'allChecks'
                        ? toggleSaleCheck
                        : toggleCheckModal
                }
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
                approveFunction={handleApprovePay}
            />
        </div>
    )
}
export default ClientsSales
