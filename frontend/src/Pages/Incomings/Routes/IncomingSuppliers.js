import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom'
import ExportBtn from '../../../Components/Buttons/ExportBtn'
import CardBtn from '../../../Components/Card/CardBtn'
import LinkToBack from '../../../Components/LinkToBack/LinkToBack'
import Pagination from '../../../Components/Pagination/Pagination'
import ResultIncomings from '../Components/ResultIncomings'
import {
    clearSuccesDelete,
    clearSuccessUpdate,
    deleteIncoming,
    excelIncomings,
    getIncomingConnectors,
    getIncomings,
    payDebt,
    updateIncoming,
} from '../incomingSlice'
import {
    exportExcel,
    universalSort,
    UsdToUzs,
    UzsToUsd,
} from '../../../App/globalFunctions'
import SearchForm from '../../../Components/SearchForm/SearchForm'
import {filter, map, uniqueId} from 'lodash'
import UniversalModal from '../../../Components/Modal/UniversalModal'
import {useTranslation} from 'react-i18next'
import CustomerPayment from '../../../Components/Payment/CustomerPayment.js'
import {
    universalToast,
    warningMorePayment,
} from '../../../Components/ToastMessages/ToastMessages.js'
import NotFind from '../../../Components/NotFind/NotFind.js'
import Table from '../../../Components/Table/Table.js'
import SmallLoader from '../../../Components/Spinner/SmallLoader'

const IncomingSuppliers = () => {
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()
    const {
        market: {_id},
        user,
    } = useSelector((state) => state.login)
    const {
        incomings,
        incomingscount,
        incomingconnectors,
        successUpdate,
        successDelete,
        loadingExcel,
    } = useSelector((state) => state.incoming)
    const {currencyType, currency} = useSelector((state) => state.currency)

    const {
        state: {date, supplier},
    } = useLocation()

    let beginDay = new Date(new Date(date).setHours(3, 0, 0, 0)).toISOString()
    let endDay = new Date(new Date(date).setHours(26, 59, 59, 59)).toISOString()

    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)
    const [sendingSearch, setSendingSearch] = useState({
        name: '',
        code: '',
        supplier: supplier,
    })
    const [localSearch, setLocalSearch] = useState({
        name: '',
        code: '',
        supplier: supplier,
    })
    const [sortItem, setSortItem] = useState({
        filter: '',
        sort: '',
        count: 0,
    })

    const [incomingCard, setIncomingCard] = useState([])
    const [incomingsData, setIncomingsData] = useState([])
    const [currentData, setCurrentData] = useState([])
    const [currentDataStorage, setCurrentDataStorage] = useState([])
    const [editedIncoming, setEditedIncoming] = useState({})
    const [deletedIncoming, setDeletedIncoming] = useState('')

    // sale states
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
    const [client, setClient] = useState('')
    const [currentId, setCurrentId] = useState('')
    let delay = null

    const changeCardData = useCallback((data) => {
        let groups = []
        let pieces = (arr) => arr.reduce((prev, el) => prev + el.pieces, 0)
        for (let incoming of data) {
            let obj = {
                _id: incoming._id,
                createdAt: new Date(incoming.createdAt).toLocaleDateString(),
                time: new Date(incoming.createdAt).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hourCycle: 'h24',
                }),
                supplier: {...incoming.supplier},
                products: incoming.incoming.length,
                pieces: pieces(incoming.incoming),
                totalprice: incoming.total,
                totalpriceuzs: incoming.totaluzs,
                totalpayment: incoming.totalpayment,
                totalpaymentuzs: incoming.totalpaymentuzs,
                debt: incoming.debt,
                debtuzs: incoming.debtuzs,
            }
            groups.push(obj)
        }
        setIncomingCard(groups)
    }, [])

    // click supplier card and show the table
    const changeCurrentData = (value) => {
        const filteredData = filter(incomingsData, (item) => {
            return item.incomingconnector === value
        })
        setCurrentData(filteredData)
        setCurrentDataStorage(filteredData)
    }

    const getCurrentData = (data) => {
        let current = map(data, (incoming) => {
            return {
                ...incoming,
                sellingprice: incoming.product.price.sellingprice,
                sellingpriceuzs: incoming.product.price.sellingpriceuzs,
            }
        })
        setIncomingsData(current)
        setCurrentData(current)
        setCurrentDataStorage(current)
    }

    // add product to edit
    const addToEditedIncoming = (product) => {
        setEditedIncoming(product)
    }

    // change editing product
    const changeEditedIncoming = (e, key) => {
        let target = Number(e.target.value)
        let obj = {
            ...editedIncoming,
        }

        const check = (prop) => key === prop

        const countUsd =
            currencyType === 'USD' ? target : UzsToUsd(target, currency)
        const countUzs =
            currencyType === 'UZS' ? target : UsdToUzs(target, currency)

        const changePieces = () => {
            obj.pieces = target
            obj.totalprice = target * obj.unitprice
            obj.totalpriceuzs = target * obj.unitpriceuzs
        }
        const changeUnitprice = () => {
            obj.unitprice = countUsd
            obj.unitpriceuzs = countUzs
            obj.totalprice = countUsd * obj.pieces
            obj.totalpriceuzs = countUzs * obj.pieces
        }
        const changeSellingprice = () => {
            obj.sellingprice = countUsd
            obj.sellingpriceuzs = countUzs
        }

        check('pieces') && changePieces()
        check('unitprice') && changeUnitprice()
        check('sellingprice') && changeSellingprice()

        setEditedIncoming(obj)
    }

    const updateEditedIncoming = () => {
        let isChanged = currentData.some((product) => {
            return (
                product.pieces === editedIncoming.pieces &&
                product.unitprice === editedIncoming.unitprice &&
                product.sellingprice === editedIncoming.sellingprice
            )
        })
        if (!isChanged) {
            dispatch(
                updateIncoming({
                    market: _id,
                    startDate: beginDay,
                    endDate: endDay,
                    product: {...editedIncoming},
                })
            )
        } else {
            setEditedIncoming({})
        }
    }

    const onKeyUpdate = (e) => {
        if (e.key === 'Enter') {
            updateEditedIncoming()
        }
    }

    const openDeleteModal = (incoming) => {
        setDeletedIncoming(incoming)
        setModalVisible(true)
        setModalBody('approve')
    }

    // search by name
    const searchName = (e) => {
        let target = e.target.value.toLowerCase()
        setCurrentData([
            ...filter([...currentDataStorage], ({product}) =>
                product.productdata.name.toLowerCase().includes(target)
            ),
        ])
        setLocalSearch({
            ...localSearch,
            name: target,
        })
    }

    // search by code
    const searchCode = (e) => {
        let target = e.target.value.toLowerCase()
        setCurrentData([
            ...filter([...currentDataStorage], ({product}) =>
                product.productdata.code.includes(target)
            ),
        ])
        setLocalSearch({
            ...localSearch,
            code: target,
        })
    }

    // search when key press
    const searchOnKeyUp = (e) => {
        if (e.key === 'Enter') {
            setSendingSearch(localSearch)
        }
    }

    const getIncomingsData = useCallback(() => {
        dispatch(
            getIncomings({
                market: _id,
                beginDay,
                endDay,
                currentPage,
                countPage,
                search: sendingSearch,
            })
        )
    }, [dispatch, _id, beginDay, endDay, currentPage, countPage, sendingSearch])

    const getConnectors = useCallback(() => {
        dispatch(
            getIncomingConnectors({
                market: _id,
                beginDay,
                endDay,
            })
        )
    }, [dispatch, _id, beginDay, endDay])

    const removeIncoming = () => {
        dispatch(
            deleteIncoming({
                market: _id,
                beginDay,
                endDay,
                product: {...deletedIncoming},
            })
        )
        toggleModal()
    }

    // Sort
    const filterData = (filterKey) => {
        if (filterKey === sortItem.filter) {
            switch (sortItem.count) {
                case 1:
                    setSortItem({
                        filter: filterKey,
                        sort: '1',
                        count: 2,
                    })
                    universalSort(
                        currentData,
                        setCurrentData,
                        filterKey,
                        1,
                        currentDataStorage
                    )
                    break
                case 2:
                    setSortItem({
                        filter: filterKey,
                        sort: '',
                        count: 0,
                    })
                    universalSort(
                        currentData,
                        setCurrentData,
                        filterKey,
                        '',
                        currentDataStorage
                    )
                    break
                default:
                    setSortItem({
                        filter: filterKey,
                        sort: '-1',
                        count: 1,
                    })
                    universalSort(
                        currentData,
                        setCurrentData,
                        filterKey,
                        -1,
                        currentDataStorage
                    )
            }
        } else {
            setSortItem({
                filter: filterKey,
                sort: '-1',
                count: 1,
            })
            universalSort(
                currentData,
                setCurrentData,
                filterKey,
                -1,
                currentDataStorage
            )
        }
    }

    // sales functions
    const toggleModal = () => {
        setModalVisible(!modalVisible)
        setTimeout(() => {
            setModalBody('')
            setDeletedIncoming({})
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
        const allUzs = debts.debtUzs
        setClient(debts.deliver)
        setCurrentId(debts.id)
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
                comment: saleComment,
            },
            user: user._id,
            incomingconnectorid: currentId,
        }
        dispatch(payDebt(body)).then(({error}) => {
            if (!error) {
                dispatch(
                    getIncomingConnectors({
                        market: _id,
                        beginDay,
                        endDay,
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
        getIncomingsData()
    }, [getIncomingsData])

    useEffect(() => {
        if (successUpdate) {
            getIncomingsData()
            getConnectors()
            setEditedIncoming({})
            dispatch(clearSuccessUpdate())
        }
    }, [dispatch, getIncomingsData, getConnectors, successUpdate])

    useEffect(() => {
        if (successDelete) {
            getIncomingsData()
            dispatch(clearSuccesDelete())
        }
    }, [dispatch, getIncomingsData, successDelete])

    useEffect(() => {
        getConnectors()
    }, [getConnectors])

    useEffect(() => {
        changeCardData(incomingconnectors)
    }, [incomingconnectors, changeCardData])

    useEffect(() => {
        getCurrentData(incomings)
    }, [incomings])

    const headers = [
        {
            title: '№',
        },
        {
            title: t('Yetkazuvchi'),
            styles: 'w-[10%]',
        },
        {
            title: t('Kodi'),
            filter: 'product.productdata.code',
            styles: 'w-[7%]',
        },
        {
            title: t('Nomi'),
            filter: 'product.productdata.name',
        },
        {
            title: t('Soni'),
            styles: 'w-[10%]',
        },
        {
            title: t('Kelish'),
            styles: 'w-[10%]',
        },
        {
            title: t('Jami'),
            styles: 'w-[15%]',
        },
        {
            title: t('Sotish'),
            styles: 'w-[10%]',
        },
        {
            title: '',
            styles: 'w-[5%]',
        },
    ]

    const exportData = () => {
        let fileName = `Maxsulotlar-qabul-qabullar - ${new Date().toLocaleDateString()}`
        const incomingSupplierHeaders = [
            //- new Date().toLocaleDateString()
            '№',
            t('Yetkazuvchi'),
            t('Kodi'),
            t('Nomi'),
            t('Soni'),
            t('Kelish UZS'),
            t('Kelish USD'),
            t('Jami UZS'),
            t('Jami USD'),
        ]
        const body = {
            beginDay,
            endDay,
        }
        dispatch(excelIncomings(body)).then(({error, payload}) => {
            if (!error) {
                if (payload?.length > 0) {
                    const IncomingSupplierData = map(
                        payload,
                        (item, index) => ({
                            nth: index + 1,
                            supplier: item?.supplier?.name || '',
                            code: item?.product?.productdata?.code || '',
                            name: item?.product?.productdata?.name || '',
                            count: item?.pieces + ' ' + item?.unit?.name || '',
                            unit: item?.unitpriceuzs || '',
                            unitusd: item?.unitprice || '',
                            all: item?.totalpriceuzs || '',
                            allusd: item?.totalprice || '',
                        })
                    )
                    exportExcel(
                        IncomingSupplierData,
                        fileName,
                        incomingSupplierHeaders
                    )
                } else {
                    universalToast("Jadvalda ma'lumot mavjud emas !", 'warning')
                }
            }
        })
    }
    return (
        <div className={`relative grow overflow-hidden`}>
            {loadingExcel && (
                <div className='fixed backdrop-blur-[2px] z-[100] left-0 top-0 right-0 bottom-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            <CustomerPayment
                returned={true}
                type={paymentType}
                active={paymentModalVisible}
                togglePaymentModal={togglePaymentModal}
                changePaymentType={handleChangePaymentType}
                onChange={handleChangePaymentInput}
                client={client}
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
            <div className='absolute left-0 right-0 top-0 bottom-0 overflow-auto'>
                <div className='flex items-center justify-between mainPadding'>
                    <LinkToBack link={'/maxsulotlar/qabul/qabullar'} />
                    <ResultIncomings
                        connectors={incomingCard}
                        currencyType={currencyType}
                    />
                </div>
                <div className='flex flex-wrap gap-[2.5rem_2%] mainPadding'>
                    {incomingCard.length > 0 &&
                        map(incomingCard, (incoming) => (
                            <CardBtn
                                date={incoming.createdAt}
                                time={incoming.time}
                                deliver={incoming.supplier.name}
                                products={incoming.products}
                                pieces={incoming.pieces}
                                debt={incoming.debt}
                                debtUzs={incoming.debtuzs}
                                paid={incoming.totalpayment}
                                paidUzs={incoming.totalpaymentuzs}
                                all={incoming.totalprice}
                                allUzs={incoming.totalpriceuzs}
                                onClickPayDebt={onClickPayDebt}
                                id={incoming._id}
                                onClick={() => changeCurrentData(incoming._id)}
                                key={uniqueId('card')}
                            />
                        ))}
                </div>
                {currentData.length ? (
                    <>
                        <div className='mainPadding flex items-center justify-between'>
                            <ExportBtn onClick={exportData} />
                            <span>{t('Ro`yxat')}</span>
                            <Pagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                countPage={countPage}
                                totalDatas={incomingscount}
                            />
                        </div>
                        <SearchForm
                            filterBy={['total', 'code', 'name']}
                            filterByName={searchName}
                            filterByTotal={(e) => setCountPage(e.value)}
                            filterByCode={searchCode}
                            filterByCodeAndNameAndCategoryWhenPressEnter={
                                searchOnKeyUp
                            }
                        />
                        <div className='tableContainerPadding'>
                            <Table
                                page={'incomings'}
                                headers={headers}
                                data={currentData}
                                currentPage={currentPage}
                                countPage={countPage}
                                currency={currencyType}
                                editedIncoming={editedIncoming}
                                Edit={addToEditedIncoming}
                                changeHandler={changeEditedIncoming}
                                saveEditIncoming={updateEditedIncoming}
                                Delete={(incoming) => openDeleteModal(incoming)}
                                Sort={filterData}
                                onKeyUp={onKeyUpdate}
                                sortItem={sortItem}
                            />
                        </div>
                    </>
                ) : (
                    <NotFind text={`${t('Qabullar mavjud emas...')}`} />
                )}
                <UniversalModal
                    body={modalBody}
                    isOpen={modalVisible}
                    headerText={
                        modalBody === 'complete'
                            ? t("To'lovni amalga oshirishni tasdiqlaysizmi ?")
                            : t('Mahsulotni o`chirishni tasdiqlaysizmi?')
                    }
                    title={
                        modalBody === 'complete'
                            ? t(
                                  "To'lovni amalga oshirgach bu ma`lumotlarni o`zgaritirb bo`lmaydi !"
                              )
                            : t(
                                  'O`chirilgan mahsulotni tiklashning imkoni mavjud emas!'
                              )
                    }
                    approveFunction={
                        modalBody === 'complete'
                            ? handleApprovePay
                            : removeIncoming
                    }
                    toggleModal={toggleModal}
                />
            </div>
        </div>
    )
}

export default IncomingSuppliers
