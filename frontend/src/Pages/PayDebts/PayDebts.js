import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {UsdToUzs, UzsToUsd} from '../../App/globalFunctions'
import UniversalModal from '../../Components/Modal/UniversalModal'
import CustomerPayment from '../../Components/Payment/CustomerPayment'
import SearchForm from '../../Components/SearchForm/SearchForm'
import Table from '../../Components/Table/Table'
import {warningMoreDiscount, warningMorePayment} from '../../Components/ToastMessages/ToastMessages'
import {getDebts, payDebt} from '../Reports/reportsSlice'
import {filter} from 'lodash'

const PayDebts = () => {
    const dispatch = useDispatch()

    const { datas } = useSelector((state) => state.reports)
    const { currencyType, currency } = useSelector((state) => state.currency)
    const { user } = useSelector((state) => state.login)

    const [storageData, setStorageData] = useState([])
    const [currentData, setCurrentData] = useState([])

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
    const [discountSelectOption, setDiscountSelectOption] = useState({
        label: '%',
        value: '%',
    })
    const [paymentDebt, setPaymentDebt] = useState(0)
    const [paymentDebtUzs, setPaymentDebtUzs] = useState(0)
    const [allPayment, setAllPayment] = useState(0)
    const [allPaymentUzs, setAllPaymentUzs] = useState(0)
    const [paid, setPaid] = useState(0)
    const [paidUzs, setPaidUzs] = useState(0)
    const [modalBody, setModalBody] = useState('')
    const [modalData, setModalData] = useState(null)

    const [printedSelling, setPrintedSelling] = useState(null)

    const headers = [
        { title: '№' },
        { title: 'Kodi' },
        { title: 'Nomi' },
        { title: 'Soni' },
        { title: 'Narxi' },
        { title: 'Jami', styles: 'w-[10rem]' },
        { title: '' },
    ]

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
        setDiscountSelectOption({ label: '%', value: '%' })
    }
    const toggleCheckModal = () => {
        setModalVisible(!modalVisible)
        setModalBody('')
        setModalData(null)
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
                discount: Number(paymentDiscount),
                discountuzs: Number(paymentDiscountUzs),
            },
            user: user._id,
            saleconnectorid: saleConnectorId,
        }
        dispatch(payDebt(body)).then(({ payload }) => {
            const startDate = new Date(
                new Date().setMonth(new Date().getMonth() - 3)
            )
            const endDate = new Date()
            setModalData(payload)
            dispatch(
                getDebts({
                    startDate,
                    endDate,
                })
            )
            setTimeout(() => {
                setModalBody('checkPayment')
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

    const searchId = (e) => {
        setCurrentData([
            ...filter([...storageData], (debt) =>
                debt.id.includes(e.target.value)
            ),
        ])
    }

    const searchClientName = (e) => {
        setCurrentData([
            ...filter(
                [...storageData],
                (debt) =>
                    debt.client &&
                    debt.client.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
            ),
        ])
    }

    const handleClickPrint = (selling) => {
        setModalBody('allChecks')
        setPrintedSelling(selling)
        setModalVisible(true)
    }

    //====================================================
    //====================================================

    const [startDate, setStartDate] = useState(new Date(
        new Date().setMonth(new Date().getMonth() - 3)
    ))
    const [endDate, setEndDate] = useState(new Date());

    const handleBeginDay = (e) => {
        setStartDate(new Date(e.setHours(0, 0, 0)))
    }
    const handleEndDay = (e) => {
        setEndDate(new Date(e.setHours(23, 59, 59)))
    }

    //====================================================
    //====================================================

    useEffect(() => {
        dispatch(
            getDebts({
                startDate,
                endDate,
            })
        )
    }, [dispatch, startDate, endDate])

    useEffect(() => {
        setCurrentData(datas)
        setStorageData(datas)
    }, [datas])

    const debtHeader = [
        {
            title: '№',
        },
        {
            title: 'Sana',
        },
        {
            title: 'ID',
        },
        {
            title: 'Mijoz',
        },
        {
            title: 'Izoh',
        },
        {
            title: 'Jami',
        },
        {
            title: 'Qarz',
        },
        {
            title: '',
        },
    ]

    return (
        <div className='relative overflow-auto h-full pt-[10px]'>
            <div className='flex items-center justify-between'>
                <SearchForm
                    filterBy={['startDate', 'endDate', 'id', 'clientName']}
                    filterById={searchId}
                    filterByClientName={searchClientName}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={handleBeginDay}
                    setEndDate={handleEndDay}
                />
            </div>
            <div className='tableContainerPadding'>
                {currentData.length > 0 && (
                    <Table
                        page={'debts'}
                        headers={debtHeader}
                        data={currentData}
                        currency={currencyType}
                        Pay={handleClickPayment}
                        Print={handleClickPrint}
                    />
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
                            : toggleCheckModal
                }
                approveFunction={handleApprovePay}
                isOpen={modalVisible}
                payment={modalData}
                headers={headers}
                printedSelling={printedSelling}
                headerText={
                    modalBody === 'complete' &&
                    "To'lovni amalga oshirishni tasdiqlaysizmi ?"
                }
                title={
                    modalBody === 'complete' &&
                    "To'lovni amalga oshirgach bu ma`lumotlarni o`zgaritirb bo`lmaydi !"
                }
            />
        </div>
    )
}

export default PayDebts
