import React, {useEffect, useMemo, useState} from 'react'
import ExportBtn from '../../../Components/Buttons/ExportBtn.js'
import Pagination from '../../../Components/Pagination/Pagination.js'
import Table from '../../../Components/Table/Table.js'
import SearchForm from '../../../Components/SearchForm/SearchForm.js'
import {useDispatch, useSelector} from 'react-redux'
import Spinner from '../../../Components/Spinner/SmallLoader.js'
import NotFind from '../../../Components/NotFind/NotFind.js'
import {motion} from 'framer-motion'
import {VscChromeClose} from 'react-icons/vsc'

import {
    addClient,
    clearSearchedSellings,
    deleteSaleConnector,
    excelAllSellings,
    getSellings,
    getSellingsByFilter,
} from '../Slices/sellingsSlice.js'
import {regexForTypeNumber} from '../../../Components/RegularExpressions/RegularExpressions.js'
import UniversalModal from '../../../Components/Modal/UniversalModal.js'
import {useTranslation} from 'react-i18next'
import {filter, map} from 'lodash'
import {exportExcel, universalSort} from './../../../App/globalFunctions'
import {universalToast} from '../../../Components/ToastMessages/ToastMessages.js'
import socket from '../../../Config/socket.js'
import {setAllProductsBySocket} from '../Slices/registerSellingSlice.js'
import SelectForm from '../../../Components/Select/SelectForm.js'
import {FaFilter} from 'react-icons/fa'
import TableMobile from '../../../Components/Table/TableMobile.js'
import {
    getReportsForTotal,
    getSaleProducts,
    getExpensesReport,
    getPaymentReport,
} from '../../Reports/reportsSlice.js'
import {getProducts} from '../../Incomings/incomingSlice.js'
import SessionBtn from '../../../Components/Buttons/SessionBtn.js'

const Sellings = ({id}) => {
    const {t} = useTranslation(['common'])
    const headers = [
        {
            title: '№',
        },
        {
            title: t('Sana'),
            filter: 'createdAt',
        },
        {
            title: t('ID'),
            filter: 'id',
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
            title: t('Izoh'),
        },
        {
            title: '',
            styles: 'w-[7rem]',
        },
    ]
    const dispatch = useDispatch()
    const {currencyType} = useSelector((state) => state.currency)
    const {user, market} = useSelector((state) => state.login)
    const {totalpayment} = useSelector((state) => state.reports)
    const [FilterModal, setFilterModal] = useState(false)
    const {
        sellings,
        searchedSellings,
        getSellingsLoading,
        total,
        totalSearched,
    } = useSelector((state) => state.sellings)
    const {expenses} = useSelector((state) => state.expense)
    const [chooseBody, setChooseBody] = useState('')
    const [data, setData] = useState(sellings)
    const [storeData, setStoreData] = useState(sellings)
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [searchedData, setSearchedData] = useState(searchedSellings)
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [search, setSearch] = useState({
        id: '',
        client: '',
        product: '',
    })
    const [sorItem, setSorItem] = useState({
        filter: '',
        sort: '',
        count: 0,
    })
    const [startDate, setStartDate] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
        )
    )
    const [endDate, setEndDate] = useState(new Date())
    const [printedSelling, setPrintedSelling] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [deletetModalVisible, setDeleteModalVisible] = useState(false)
    const [saleConnectorId, setSaleConnectorId] = useState(null)
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState('')
    const [deletingProduct, setDeleteProduct] = useState(null)
    // filter by total
    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }

    // ================================

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
                await dispatch(getPaymentReport(numberofsellingsbody)).unwrap(),
                await dispatch(
                    getExpensesReport(numberofsellingsbody)
                ).unwrap(),
            ])
            setPrintedSelling({
                boshsana: startDate,
                tugashsana: endDate,
                sotuvlarsoni: saleconnectors.length,
                tushumlar: {
                    naqt: {
                        sum: totalpayment?.payment?.cashuzs,
                        dollar: totalpayment?.payment?.cash,
                    },
                    plastik: {
                        sum: totalpayment?.payment?.carduzs,
                        dollar: totalpayment?.payment?.card,
                    },
                    utkazma: {
                        sum: totalpayment?.payment?.transferuzs,
                        dollar: totalpayment?.payment?.transfer,
                    },
                },
                qaytarilganlar: {
                    naqt: {
                        sum: totalpayment?.back?.cashuzs,
                        dollar: totalpayment?.back?.cash,
                    },
                    plastik: {
                        sum: totalpayment?.back?.carduzs,
                        dollar: totalpayment?.back?.card,
                    },
                    utkazma: {
                        sum: totalpayment?.back?.transferuzs,
                        dollar: totalpayment?.back?.transfer,
                    },
                },
                xarajatlar: {
                    naqt: {
                        sum: memoizedExpenses?.cash?.uzs,
                        dollar: memoizedExpenses?.cash?.usd,
                    },
                    plastik: {
                        sum: memoizedExpenses?.card?.uzs,
                        dollar: memoizedExpenses?.card?.usd,
                    },
                    utkazma: {
                        sum: memoizedExpenses?.transfer?.uzs,
                        dollar: memoizedExpenses?.transfer?.usd,
                    },
                },
                foyda: {
                    sum: income?.incomeuzs,
                    dollar: income?.income,
                },
                qarzlar: {
                    sum: debts?.debtsuzs,
                    dollar: debts?.debts,
                },
                chegirmalar: {
                    sum: discounts?.discountsuzs,
                    dollar: discounts?.discounts,
                },
                kassaqoldiq: {
                    naqt: {
                        sum:
                            totalpayment?.result?.cashuzs -
                            memoizedExpenses?.cash?.uzs,
                        dollar:
                            totalpayment?.result?.cash -
                            memoizedExpenses?.cash?.usd,
                    },
                    plastik: {
                        sum:
                            totalpayment?.result?.carduzs -
                            memoizedExpenses?.card?.uzs,
                        dollar:
                            totalpayment?.result?.card -
                            memoizedExpenses?.card?.usd,
                    },
                    utkazma: {
                        sum:
                            totalpayment?.result?.transferuzs -
                            memoizedExpenses?.transfer?.uzs,
                        dollar:
                            totalpayment?.result?.transfer -
                            memoizedExpenses?.transfer?.usd,
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
            setChooseBody('dailySaleCheck')
            setModalVisible(true)
        } catch (e) {
            return console.error(e)
        }
    }

    // handle change client and id
    const handleChangeId = (e) => {
        const val = e.target.value
        const valForSearch = val.replace(/\s+/g, ' ').trim()
        regexForTypeNumber.test(val) && setSearch({...search, id: val})
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedSellings())
        if (valForSearch === '') {
            setData(sellings)
            setFilteredDataTotal(total)
        } else {
            const filteredProducts = filter(sellings, (selling) => {
                return selling.id.includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const handleChangeClient = (e) => {
        const val = e.target.value
        const valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setSearch({...search, client: val})
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedSellings())
        if (valForSearch === '') {
            setData(sellings)
            setFilteredDataTotal(total)
        } else {
            const filteredProducts = filter(sellings, (selling) => {
                return (
                    selling?.client?.name
                        .toLowerCase()
                        .includes(valForSearch) ||
                    selling?.packman?.name.toLowerCase().includes(valForSearch)
                )
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const handleChangeIdAndClientWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0)
            const body = {
                filialId: id,
                currentPage,
                countPage: showByTotal,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                search: search,
            }
            dispatch(getSellingsByFilter(body))
        }
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible)
        setPrintedSelling(null)
        const body = {
            filialId: id,
            currentPage,
            countPage: showByTotal,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            search: {
                id: '',
                client: '',
                product: selectedProduct?.label,
            },
        }
        dispatch(getSellings(body))
    }
    const toggleDeleteModal = () => {
        setDeleteModalVisible(!deletetModalVisible)
    }
    const handleClickCancelToDelete = () => {
        setDeleteProduct(null)
        setDeleteModalVisible(false)
    }
    const exportData = () => {
        let fileName = 'Sotuvlar' - new Date().toLocaleDateString()
        const sellingHeaders = [
            '№',
            t('ID'),
            t('Mijoz'),
            t('Jami UZS'),
            t('Jami USD'),
            t('Chegirma UZS'),
            t('Chegirma USD'),
            t('Qarz UZS'),
            t('Qarz USD'),
        ]
        if (data?.length > 0) {
            const SellingData = map(data, (item, index) => ({
                nth: index + 1,
                id: item?.id || '',
                client: item?.client?.name || item?.packman?.name,
                alluzs: item?.products[0]?.totalpriceuzs || '',
                allusd: item?.products[0]?.totalprice || '',
                discount:
                    item.discounts.length > 0
                        ? item.discounts.map((discount) => {
                              return discount
                          })
                        : 0,
                discountusd:
                    item.discounts.length > 0
                        ? item.discounts.map((discount) => {
                              return discount
                          })
                        : 0,
                debd:
                    item?.products[0]?.totalpriceuzs -
                        item?.payments[0]?.paymentuzs -
                        item?.discounts.length >
                    0
                        ? item.discounts.map((discount) => {
                              return discount.discount
                          })
                        : 0,
                debdusd:
                    item.products[0].totalprice -
                        item.payments[0].payment -
                        item.discounts.length >
                    0
                        ? item.discounts.map((discount) => {
                              return discount.discount
                          })
                        : 0,
            }))
            exportExcel(SellingData, fileName, sellingHeaders)
        } else {
            universalToast("Jadvalda ma'lumot mavjud emas !", 'warning')
        }
    }

    const handleClickPrint = (selling) => {
        setChooseBody('allChecksWithDetails')
        setPrintedSelling(selling)
        setModalVisible(true)
    }

    const addPlus = (id) => {
        setChooseBody('addPlus')
        setModalVisible(true)
        setSaleConnectorId(id)
    }

    const [commentText, setCommentText] = useState('')
    const [dailyId, setDailyId] = useState(null)

    const editComment = (daily, text) => {
        setCommentText(text)
        setDailyId(daily._id)
        setChooseBody('changeComment')
        setModalVisible(true)
    }

    // effects
    useEffect(() => {
        setData(sellings)
        setStoreData(sellings)
    }, [sellings])
    useEffect(() => {
        setSearchedData(searchedSellings)
    }, [searchedSellings])
    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])

    const handleDeleteProduct = (item) => {
        setDeleteProduct(item)
        toggleDeleteModal()
    }
    const handleClickApproveToDelete = async () => {
        try {
            await dispatch(deleteSaleConnector({saleconnectorId: deletingProduct._id}))
            await fetchSellings()
            handleClickCancelToDelete()
        } catch (error) {
            console.error('Error deleting sale connector:', error)
        }
    }

    const fetchSellings = async () => {
        const body = {
            filialId: id,
            currentPage,
            countPage: showByTotal,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            search: {
                id: '',
                client: '',
            },
        }
        dispatch(getSellings(body))

        const exportBody = {
            startDate,
            endDate,
            search,
        }
        dispatch(excelAllSellings(exportBody))
    }

    useEffect(() => {
        fetchSellings()
    }, [dispatch, id, currentPage, showByTotal, startDate, endDate, search])
    const handleAddClient = (client) => {
        dispatch(
            addClient({
                ...client,
                saleconnectorid: saleConnectorId,
            })
        ).then(() => {
            const body = {
                filialId: id,
                currentPage,
                countPage: showByTotal,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                search: {
                    id: '',
                    client: '',
                },
            }
            dispatch(getSellings(body))
        })
        setModalVisible(false)
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
                    universalSort(data, setData, filterKey, 1, storeData)
                    break
                case 2:
                    setSorItem({
                        filter: filterKey,
                        sort: '',
                        count: 0,
                    })
                    universalSort(data, setData, filterKey, '', storeData)
                    break
                default:
                    setSorItem({
                        filter: filterKey,
                        sort: '-1',
                        count: 1,
                    })
                    universalSort(data, setData, filterKey, -1, storeData)
            }
        } else {
            setSorItem({
                filter: filterKey,
                sort: '-1',
                count: 1,
            })
            universalSort(data, setData, filterKey, -1, storeData)
        }
    }
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
    //
    useEffect(() => {
        let allProductsReducer = []
        let productsForSearch = [
            {
                label: 'Xammasi',
                value: '',
            },
        ]
        market &&
            socket.emit('getProductsOfCount', {
                market: market._id,
            })
        market &&
            socket.on('getProductsOfCount', ({id, products}) => {
                if (id === market._id) {
                    productsForSearch = [
                        ...productsForSearch,
                        ...map(products, (product) => ({
                            value: product._id,
                            label: product.productdata.name,
                        })),
                    ]
                    setFilteredProducts(productsForSearch)
                    allProductsReducer.push(...products)
                    dispatch(setAllProductsBySocket(allProductsReducer))
                }
            })
        market &&
            socket.on('error', ({id, message}) => {
                id === market._id && universalToast(message, 'error')
            })

        //    eslint-disable-next-line react-hooks/exhaustive-deps
    }, [market, dispatch])

    const handleChangeSelectedProduct = (option) => {
        setSelectedProduct(option)
        const body = {
            filialId: id,
            currentPage,
            countPage: showByTotal,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            search: {
                id: '',
                client: '',
                product: option.label,
            },
        }
        dispatch(getSellingsByFilter(body))
    }

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
            <UniversalModal
                printedSelling={printedSelling}
                currency={currencyType}
                body={chooseBody}
                isOpen={modalVisible}
                toggleModal={toggleModal}
                approveFunction={handleAddClient}
                commentText={commentText}
                dailyid={dailyId}
                isSalesList={true}
            />
            <div className='pagination lg:m-3 flex lg:justify-start items-center justify-evenly'>
                <span className='ms-[-10px] lg:ms-3'>
                    {/* <SelectForm key={'total_1'} onSelect={filterByTotal} /> */}
                </span>
                <ExportBtn onClick={exportData} />
                {isMobile && (
                    <button
                        onClick={() => setFilterModal(true)}
                        className='hover:bg-blue-200  bg-blue-400 focus-visible:outline-none w-[90px] h-[33px]  createElement'
                    >
                        <FaFilter /> {t('izlash')}
                    </button>
                )}
                <div className='ml-3 px-4 py-2 flex justify-end'>
                    <SessionBtn
                        text={`${t('Savdo hisoboti')}`}
                        onClick={handlePrintModal}
                    />
                </div>
            </div>
            {!isMobile ? (
                <div className='mt-2'>
                    <SearchForm
                        filterBy={[
                            'total',
                            'startDate',
                            'endDate',
                            'id',
                            'clientName',
                            'product_name',
                        ]}
                        filterByTotal={filterByTotal}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        searchById={search.id}
                        searchByClientName={search.client}
                        filterByClientName={handleChangeClient}
                        filterById={handleChangeId}
                        filterByClientNameWhenPressEnter={
                            handleChangeIdAndClientWhenPressEnter
                        }
                        filterByIdWhenPressEnter={
                            handleChangeIdAndClientWhenPressEnter
                        }
                        filteredProducts={filteredProducts}
                        handleChangeSelectedProduct={
                            handleChangeSelectedProduct
                        }
                        selectedProduct={selectedProduct}
                    />
                </div>
            ) : (
                FilterModal && (
                    <div className='absolute lg:p-[50px] w-[100vw]  h-[100vh]  flex justify-evenly flex-wrap   top-0	left-0 z-50 bg-[white]	'>
                        <VscChromeClose
                            onClick={() => setFilterModal(false)}
                            className=' absolute right-[20px]  top-[20px]  text-4xl cursor-pointer'
                        />
                        <div className='mt-[100px]'>
                            <SearchForm
                                filterBy={[
                                    'total',
                                    'startDate',
                                    'endDate',
                                    'id',
                                    'clientName',
                                    'product_name',
                                ]}
                                filterByTotal={filterByTotal}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                searchById={search.id}
                                searchByClientName={search.client}
                                filterByClientName={handleChangeClient}
                                filterById={handleChangeId}
                                filterByClientNameWhenPressEnter={
                                    handleChangeIdAndClientWhenPressEnter
                                }
                                filterByIdWhenPressEnter={
                                    handleChangeIdAndClientWhenPressEnter
                                }
                                filteredProducts={filteredProducts}
                                handleChangeSelectedProduct={
                                    handleChangeSelectedProduct
                                }
                                selectedProduct={selectedProduct}
                            />
                            <div className='flex justify-center'>
                                <button
                                    onClick={() => setFilterModal(false)}
                                    className='hover:bg-blue-200  bg-blue-400 focus-visible:outline-none w-[150px] h-[40px]  createElement'
                                >
                                    <FaFilter /> {t('izlash')}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            )}

            <div className='lg:tableContainerPadding'>
                {getSellingsLoading ? (
                    <Spinner />
                ) : data.length === 0 && searchedData.length === 0 ? (
                    <NotFind text={`${t("Ro'yxat mavjud emas")}`} />
                ) : !isMobile ? (
                    <Table
                        data={searchedData.length > 0 ? searchedData : data}
                        currentPage={currentPage}
                        currency={currencyType}
                        countPage={showByTotal}
                        page={'saleslist'}
                        headers={headers}
                        Print={handleClickPrint}
                        addPlus={addPlus}
                        Sort={filterData}
                        sortItem={sorItem}
                        sellers={user?.type === 'Seller' ? true : false}
                        editComment={editComment}
                        handleDelete={handleDeleteProduct}
                    />
                ) : (
                    <TableMobile
                        data={searchedData.length > 0 ? searchedData : data}
                        currentPage={currentPage}
                        currency={currencyType}
                        countPage={showByTotal}
                        page={'saleslist'}
                        headers={headers}
                        Print={handleClickPrint}
                        addPlus={addPlus}
                        Sort={filterData}
                        sortItem={sorItem}
                        sellers={user?.type === 'Seller' ? true : false}
                        editComment={editComment}
                    />
                )}
                {/* <div className='m-4  flex justify-center'>
                    {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                        <Pagination
                            countPage={Number(showByTotal)}
                            totalDatas={totalSearched || filteredDataTotal}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </div> */}
                <UniversalModal
                    body='approve'
                    toggleModal={toggleDeleteModal}
                    headerText={`${t(
                        'Maxsulotni o`chirishni tasdiqlaysizmi?'
                    )}`}
                    title={t(
                        'O`chirilgan maxsulotlarni tiklashning imkoni mavjud emas!'
                    )}
                    approveFunction={handleClickApproveToDelete}
                    closeModal={handleClickCancelToDelete}
                    isOpen={deletetModalVisible}
                />
            </div>
        </motion.section>
    )
}

export default Sellings
