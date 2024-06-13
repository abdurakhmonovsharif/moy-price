import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {exportExcel, universalSort, UsdToUzs, UzsToUsd} from '../../../App/globalFunctions'
import ExportBtn from '../../../Components/Buttons/ExportBtn'
import Dates from '../../../Components/Dates/Dates'
import UniversalModal from '../../../Components/Modal/UniversalModal'
import Pagination from '../../../Components/Pagination/Pagination'
import SearchForm from '../../../Components/SearchForm/SearchForm'
import Table from '../../../Components/Table/Table'
import {filter, map} from 'lodash'
import {
    clearSuccesDelete,
    clearSuccessUpdate,
    deleteIncoming,
    excelIncomings,
    getIncomings,
    updateIncoming
} from '../incomingSlice'
import {useTranslation} from 'react-i18next'
import SmallLoader from '../../../Components/Spinner/SmallLoader'
import {universalToast} from '../../../Components/ToastMessages/ToastMessages'
import { useReactToPrint } from 'react-to-print'
import {BarCode} from '../../../Components/BarCode/BarCode.js'


const IncomingsList = () => {
    const dispatch = useDispatch()
    const {t} = useTranslation(['common'])
    const {
        market: {_id, name}
    } = useSelector((state) => state.login)
    const {incomings, incomingscount, successUpdate, successDelete, loadingExcel} =
        useSelector((state) => state.incoming)
    const {currencyType, currency} = useSelector((state) => state.currency)


    const componentRef = useRef()
    const onBeforeGetContentResolve = useRef()

    const handleOnBeforeGetContent = () => {
        setDataLoaded(true)
        return new Promise((resolve) => {
            onBeforeGetContentResolve.current = resolve
            setTimeout(() => {
                setDataLoaded(false)
                resolve()
            }, 2000)
        })
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onBeforeGetContent: handleOnBeforeGetContent,
    })

    const [beginDay, setBeginDay] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        ).toISOString()
    )

    const [endDay, setEndDay] = useState(
        new Date(new Date().setHours(23, 59, 59, 0)).toISOString()
    )
    const [sendingSearch, setSendingSearch] = useState({
        name: '',
        code: '',
        supplier: ''
    })
    const [localSearch, setLocalSearch] = useState({
        name: '',
        code: '',
        supplier: ''
    })
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)
    const [modal, setModal] = useState(false)
    const [sortItem, setSortItem] = useState({
        filter: '',
        sort: '',
        count: 0
    })

    const [editedIncoming, setEditedIncoming] = useState({})
    const [deletedIncoming, setDeletedIncoming] = useState({})
    const [currentIncoming, setCurrentIncoming] = useState([])
    const [storageCurrentIncoming, setStorageCurrentIncoming] = useState([])
    const [printedData, setPrintedData] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false)

    const getCurrentData = (data) => {
        let current = map(data, (incoming) => {
            return {
                ...incoming,
                sellingprice: incoming.product.price.sellingprice,
                sellingpriceuzs: incoming.product.price.sellingpriceuzs
            }
        })
        setCurrentIncoming(current)
        setStorageCurrentIncoming(current)
    }

    // add product to edit
    const addToEditedIncoming = (product) => {
        setEditedIncoming(product)
    }

    ///////////////////
    const handleChequeCount = (e, product) => {
        const prevIndex = printedData.findIndex(
            (item) => item.product._id === product._id
        )
        if (prevIndex !== -1) {
            if (e.target.value.trim() !== '') {
                printedData[prevIndex].numberOfChecks = Number(e.target.value)
            } else {
                printedData.splice(prevIndex, 1)
            }
            setPrintedData([...printedData])
        } else {
            console.log(product);
            setPrintedData([
                ...printedData,
                {product: {
                    ...product,
                    productdata: product.product.productdata,
                    price: product.product.price
                },
                 numberOfChecks: Number(e.target.value)},
            ])
        }
    }

    // change editing product
    const changeEditedIncoming = (e, key) => {
        let target = Number(e.target.value)
        let obj = {
            ...editedIncoming
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
        let isChanged = currentIncoming.some((product) => {
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
                    product: {...editedIncoming}
                })
            )
        } else {
            setEditedIncoming({})
        }
    }

    // onkeyup when update
    const onKeyUpdate = (e) => {
        if (e.key === 'Enter') {
            updateEditedIncoming()
        }
    }

    // change date func
    const changeDate = (value, name) => {
        name === 'beginDay' && setBeginDay(new Date(value).toISOString())
        name === 'endDay' && setEndDay(new Date(value).toISOString())
    }

    // search by name
    const searchName = (e) => {
        let target = e.target.value.toLowerCase()
        setCurrentIncoming([
            ...filter([...storageCurrentIncoming], ({product}) =>
                product.productdata.name.toLowerCase().includes(target)
            )
        ])
        setLocalSearch({
            ...localSearch,
            name: target
        })
    }

    // search by code
    const searchCode = (e) => {
        let target = e.target.value.toLowerCase()
        setCurrentIncoming([
            ...filter([...storageCurrentIncoming], ({product}) =>
                product.productdata.code.includes(target)
            )
        ])
        setLocalSearch({
            ...localSearch,
            code: target
        })
    }

    // search supplier
    const searchSupplier = (e) => {
        let target = e.target.value.toLowerCase()
        setCurrentIncoming([
            ...filter([...storageCurrentIncoming], (product) =>
                product.supplier.name.toLowerCase().includes(target)
            )
        ])
        setLocalSearch({
            ...localSearch,
            supplier: target
        })
    }

    // sort
    const filterData = (filterKey) => {
        if (filterKey === sortItem.filter) {
            switch (sortItem.count) {
                case 1:
                    setSortItem({
                        filter: filterKey,
                        sort: '1',
                        count: 2
                    })
                    universalSort(
                        currentIncoming,
                        setCurrentIncoming,
                        filterKey,
                        1,
                        storageCurrentIncoming
                    )
                    break
                case 2:
                    setSortItem({
                        filter: filterKey,
                        sort: '',
                        count: 0
                    })
                    universalSort(
                        currentIncoming,
                        setCurrentIncoming,
                        filterKey,
                        '',
                        storageCurrentIncoming
                    )
                    break
                default:
                    setSortItem({
                        filter: filterKey,
                        sort: '-1',
                        count: 1
                    })
                    universalSort(
                        currentIncoming,
                        setCurrentIncoming,
                        filterKey,
                        -1,
                        storageCurrentIncoming
                    )
            }
        } else {
            setSortItem({
                filter: filterKey,
                sort: '-1',
                count: 1
            })
            universalSort(
                currentIncoming,
                setCurrentIncoming,
                filterKey,
                -1,
                storageCurrentIncoming
            )
        }
    }

    // search when key press
    const searchOnKeyUp = (e) => {
        if (e.key === 'Enter') {
            setSendingSearch(localSearch)
        }
    }

    const openDeleteModal = (incoming) => {
        setDeletedIncoming(incoming)
        setModal(true)
    }

    const closeModal = () => {
        setDeletedIncoming({})
        setModal(false)
    }

    const removeIncoming = () => {
        dispatch(
            deleteIncoming({
                market: _id,
                beginDay,
                endDay,
                product: {...deletedIncoming}
            })
        )
        setModal(false)
    }

    const getIncomingsData = useCallback(() => {
        dispatch(
            getIncomings({
                market: _id,
                beginDay,
                endDay,
                currentPage,
                countPage,
                search: sendingSearch
            })
        )
    }, [dispatch, _id, beginDay, endDay, currentPage, countPage, sendingSearch])

    const exportData = () => {
        let fileName = 'Maxsulotlar-qabul' - new Date().toLocaleDateString()
        const incomingHeaders = [
            '№',
            t('Yetkazuvchi'),
            t('Kodi'),
            t('Nomi'),
            t('Soni'),
            t('Kelish UZS'),
            t('Kelish USD'),
            t('Jami UZS'),
            t('Jami USD'),
            t('Sotish UZS'),
            t('Sotish USD')
        ]
        const body = {
            beginDay,
            endDay
        }
        dispatch(excelIncomings(body)).then(({error, payload}) => {
            if(!error){
                if(payload?.length > 0){
                    const IncomingData = map(payload, (item, index) => ({
                        nth: index + 1,
                        supplier: item.supplier?.name || "",
                        code: item.product?.productdata?.code || "",
                        name: item.product?.productdata?.name || "",
                        count: (item.pieces + ' ' + item.unit?.name) || "",
                        unit: item?.unitpriceuzs || "",
                        unitusd: item?.unitprice || "",
                        all: item?.totalpriceuzs || "",
                        allusd: item?.totalprice || "",
                    }))
                    exportExcel(IncomingData, fileName, incomingHeaders)
                }
                else {
                    universalToast("Jadvalda ma'lumot mavjud emas !","warning" )
                }
            }
        })

    }
    useEffect(() => {
        getCurrentData(incomings)
    }, [incomings])

    useEffect(() => {
        getIncomingsData()
    }, [
        getIncomingsData,
        beginDay,
        endDay,
        currentPage,
        countPage,
        sendingSearch
    ])

    useEffect(() => {
        if (successUpdate) {
            getIncomingsData()
            setEditedIncoming({})
            dispatch(clearSuccessUpdate())
        }
    }, [dispatch, getIncomingsData, successUpdate])

    useEffect(() => {
        if (successDelete) {
            getIncomingsData()
            setEditedIncoming({})
            dispatch(clearSuccesDelete())
        }
    }, [dispatch, getIncomingsData, successDelete])

    const headers = [
        {
            title: '№'
        },
        {
            title: t('Yetkazuvchi'),
            filter: 'supplier.name',
            styles: 'w-[10%]'
        },
        {
            title: t('Kodi'),
            filter: 'product.productdata.code',
            styles: 'w-[7%]'
        },
        {
            title: t('Nomi'),
            filter: 'product.productdata.name'
        },
        {
            title: t('Soni'),
            styles: 'w-[10%]'
        },
        {
            title: t('Kelish'),
            styles: 'w-[10%]'
        },
        {
            title: t('Jami'),
            styles: 'w-[15%]'
        },
        {
            title: t('Sotish'),
            styles: 'w-[10%]'
        },
        {
            title: t('Cheklar soni'),
            styles: 'w-[10%]'
        },
        {
            title: '',
            styles: 'w-[5%]'
        }
    ]
    useEffect(() => {
        if (
            dataLoaded &&
            typeof onBeforeGetContentResolve.current === 'function'
        ) {
            onBeforeGetContentResolve.current()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onBeforeGetContentResolve.current, dataLoaded])
    

    return (
        <div className={'grow overflow-auto'}>
            {loadingExcel && (
                <div
                    className='fixed backdrop-blur-[2px] z-[100] left-0 top-0 right-0 bottom-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            <div className='mainPadding text-center'>
                <p>{t('Ro\'yxat')}</p>
            </div>
            <div className='mainPadding flex items-center justify-between'>
                <ExportBtn
                    onClick={exportData}
                />
                <div className='flex gap-[10px]'>
                    <Dates
                        label={t('dan')}
                        value={new Date(beginDay)}
                        onChange={(value) => changeDate(value, 'beginDay')}
                        maxWidth={'max-w-[9.6875rem]'}
                    />
                    <Dates
                        label={t('gacha')}
                        value={new Date(endDay)}
                        onChange={(value) => changeDate(value, 'endDay')}
                        maxWidth={'max-w-[9.6875rem]'}
                    />
                </div>
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    countPage={countPage}
                    totalDatas={incomingscount}
                />
            </div>
            <div>
                <SearchForm
                    filterBy={['total', 'code', 'delivererName', 'name']}
                    filterByName={searchName}
                    filterByTotal={(e) => setCountPage(e.value)}
                    filterByCode={searchCode}
                    filterByCodeAndNameAndCategoryWhenPressEnter={searchOnKeyUp}
                    filterByDelivererName={searchSupplier}
                />
            </div>
            <div className='tableContainerPadding'>
                <Table
                    page={'incomings'}
                    headers={headers}
                    data={currentIncoming}
                    changeNumberHandler={handleChequeCount}
                    currentPage={currentPage}
                    printedData={printedData}
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
                    Print={handlePrint}
                />
            </div>
            <UniversalModal
                body={'approve'}
                isOpen={modal}
                headerText={t('Mahsulotni o`chirishni tasdiqlaysizmi?')}
                title={t('O`chirilgan mahsulotni tiklashning imkoni mavjud emas!')}
                approveFunction={removeIncoming}
                closeModal={closeModal}
                toggleModal={closeModal}
            />
            <div className='hidden'>
                <BarCode
                    currency={currencyType}
                    componentRef={componentRef}
                    printedData={printedData}
                    marketName={name}
                    isShowPrice={true}
                />
            </div>
        </div>
    )
}

export default IncomingsList
