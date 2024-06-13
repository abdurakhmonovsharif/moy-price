import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'
import {UsdToUzs, UzsToUsd} from '../../App/globalFunctions'
import LinkToBack from '../../Components/LinkToBack/LinkToBack'
import UniversalModal from '../../Components/Modal/UniversalModal'
import Pagination from '../../Components/Pagination/Pagination'
import CustomerPayment from '../../Components/Payment/CustomerPayment'
import SearchForm from '../../Components/SearchForm/SearchForm'
import Table from '../../Components/Table/Table'
import {warningMorePayment} from '../../Components/ToastMessages/ToastMessages'
import {payDebt} from '../Incomings/incomingSlice'
import {getIncomingConnectorsBySupplier} from './suppliersSlice'
import {t} from 'i18next'

const SupplierReport = () => {
    const {id} = useParams()
    const dispatch = useDispatch()

    const {user} = useSelector((state) => state.login)
    const {currencyType, currency} = useSelector((state) => state.currency)
    const {incomingconnectors, connectorscount} = useSelector(
        (state) => state.suppliers
    )

    const [currentData, setCurrentData] = useState([])

    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)
    const [startDate, setStartDate] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        ).toISOString()
    )
    const [endDate, setEndDate] = useState(
        new Date(new Date().setHours(23, 59, 59, 0)).toISOString()
    )

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
    const [modalBody, setModalBody] = useState('approve')
    const [modalVisible, setModalVisible] = useState(false)
    const [exchangerate, setExchangerate] = useState(currency)
    const [saleComment, setSaleComment] = useState('')
    const [currentId, setCurrentId] = useState('')
    let delay = null

    const toggleModal = () => {
        setModalVisible(!modalVisible)
        setTimeout(() => {
            setModalBody('')
        }, 500)
    }
    const convertToUsd = (value) => Math.round(value * 1000) / 1000
    const convertToUzs = (value) => Math.round(value)
    const currentEchangerate = (uzs, usd) => {
        setExchangerate(convertToUzs(uzs / usd))
    }

    // payment
    const togglePaymentModal = (bool) => {
        bool
            ? setPaymentModalVisible(!paymentModalVisible)
            : setPaymentModalVisible(bool)
        setPaymentType('cash')
        setPaymentDebt(0)
        setPaymentDebtUzs(0)
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
    const handleClickPay = () => {
        if (delay === null) {
            delay = window.setTimeout(() => {
                delay = null
                setModalBody('complete')
                setModalVisible(true)
            }, 300)
        }
    }
    const handleDoubleClick = () => {
        window.clearTimeout(delay)
        delay = null
        handleApprovePay()
    }
    const onClickPayDebt = (debts) => {
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
        currentEchangerate(allUzs, all)
        setPaymentModalVisible(true)
    }
    const handleApprovePay = () => {
        const isMinus = (num) => (num < 0 && num) || -1 * num
        const body = {
            payment: {
                payment:
                    Number(
                        allPayment < 0 ? isMinus(paymentCash) : paymentCash
                    ) +
                    Number(
                        allPayment < 0 ? isMinus(paymentCard) : paymentCard
                    ) +
                    Number(
                        allPayment < 0
                            ? isMinus(paymentTransfer)
                            : paymentTransfer
                    ),
                paymentuzs:
                    Number(
                        allPayment < 0
                            ? isMinus(paymentCashUzs)
                            : paymentCashUzs
                    ) +
                    Number(
                        allPayment < 0
                            ? isMinus(paymentCardUzs)
                            : paymentCardUzs
                    ) +
                    Number(
                        allPayment < 0
                            ? paymentTransfer < 0 && isMinus(paymentTransferUzs)
                            : paymentTransferUzs
                    ),
                type: paymentType,
                cash: Number(
                    allPayment < 0 ? isMinus(paymentCash) : paymentCash
                ),
                cashuzs: Number(
                    allPaymentUzs < 0 ? isMinus(paymentCashUzs) : paymentCashUzs
                ),
                card: Number(
                    allPayment < 0 ? isMinus(paymentCard) : paymentCard
                ),
                carduzs: Number(
                    allPayment < 0 ? isMinus(paymentCardUzs) : paymentCardUzs
                ),
                transfer: Number(
                    allPayment < 0 ? isMinus(paymentTransfer) : paymentTransfer
                ),
                transferuzs: Number(
                    allPayment < 0
                        ? isMinus(paymentTransferUzs)
                        : paymentTransferUzs
                ),
                comment: saleComment
            },
            user: user._id,
            incomingconnectorid: currentId
        }
        dispatch(payDebt(body)).then(({error}) => {
            if (!error) {
                dispatch(
                    getIncomingConnectorsBySupplier({
                        supplierid: id,
                        startDate,
                        endDate,
                        currentPage,
                        countPage
                    })
                )
                setModalVisible(false)
                setModalBody('')
                togglePaymentModal()
            }
        })
    }
    const changeComment = (e) => {
        setSaleComment(e)
    }

    useEffect(() => {
        let body = {
            supplierid: id,
            startDate,
            endDate,
            currentPage,
            countPage
        }
        dispatch(getIncomingConnectorsBySupplier(body))
    }, [dispatch, startDate, endDate, currentPage, countPage, id])

    useEffect(() => {
        setCurrentData(incomingconnectors)
    }, [incomingconnectors])

    const headers = [
        {
            title: '№'
        },
        {
            title: t('Sana')
        },
        {
            title: t('Vaqti')
        },
        {
            title: t('ID')
        },
        {
            title: t('Mahsulot turi')
        },
        {
            title: t('Soni')
        },
        {
            title: t('Umumiy')
        },
        {
            title: t('To\'langan')
        },
        {
            title: t('Qarz')
        },
        {
            title: ''
        }
    ]

    return (
        <div className='relative grow overflow-hidden h-full'>
            <div className='mainPadding'>
                <LinkToBack link={'/hamkorlar/yetkazuvchilar'} />
            </div>
            <div className='flex items-center'>
                <SearchForm
                    filterBy={['total', 'startDate', 'endDate']}
                    filterByTotal={(e) => setCountPage(e.value)}
                    startDate={new Date(startDate)}
                    endDate={new Date(endDate)}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    countPage={countPage}
                    totalDatas={connectorscount || 1}
                />
            </div>
            <div className='tableContainerPadding'>
                {currentData.length > 0 && (
                    <Table
                        page={'incomingsupplier'}
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currencyType}
                        headers={headers}
                        data={currentData}
                        Pay={onClickPayDebt}
                    />
                )}
            </div>
            <CustomerPayment
                returned={true}
                type={paymentType}
                active={paymentModalVisible}
                togglePaymentModal={togglePaymentModal}
                changePaymentType={handleChangePaymentType}
                onChange={handleChangePaymentInput}
                allPayment={currencyType === 'USD' ? allPayment : allPaymentUzs}
                card={currencyType === 'USD' ? paymentCard : paymentCardUzs}
                cash={currencyType === 'USD' ? paymentCash : paymentCashUzs}
                debt={currencyType === 'USD' ? paymentDebt : paymentDebtUzs}
                hasDiscount={false}
                transfer={
                    currencyType === 'USD'
                        ? paymentTransfer
                        : paymentTransferUzs
                }
                paid={currencyType === 'USD' ? paid : paidUzs}
                handleClickPay={handleClickPay}
                changeComment={changeComment}
                saleComment={saleComment}
                onDoubleClick={handleDoubleClick}
            />
            <UniversalModal
                body={modalBody}
                isOpen={modalVisible}
                headerText={'To\'lovni amalga oshirishni tasdiqlaysizmi ?'}
                title={
                    'To\'lovni amalga oshirgach bu ma`lumotlarni o`zgaritirb bo`lmaydi !'
                }
                approveFunction={handleApprovePay}
                toggleModal={toggleModal}
            />
        </div>
    )
}

export default SupplierReport
