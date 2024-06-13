import React, {useEffect, useState} from 'react'
import Table from '../../Components/Table/Table'
import {useDispatch, useSelector} from 'react-redux'
import {clearSearchedExchanges, getExchangesFilter, getFilialIdProducts} from './productIdExchangesSlice.js'
import {motion} from 'framer-motion'
import SearchForm from '../../Components/SearchForm/SearchForm'
import ExportBtn from '../../Components/Buttons/ExportBtn'
import Pagination from '../../Components/Pagination/Pagination'
import {filter, map} from 'lodash'
import NotFind from '../../Components/NotFind/NotFind'
import SmallLoader from '../../Components/Spinner/SmallLoader'
import {useLocation, useNavigate} from 'react-router-dom'
import {exportExcel} from '../../App/globalFunctions'
import {universalToast} from '../../Components/ToastMessages/ToastMessages'
import {IoChevronBack} from 'react-icons/io5'
import {t} from 'i18next'

function ProductIdExchanges({currency}) {
    const navigate = useNavigate()
    const location = useLocation()
    const dataId = location?.state?.id
    const dispatch = useDispatch()
    const {idProducts, loading, total, totalSearched, searchedExchanges} =
        useSelector((state) => state.exchangesIdData)
    const headers = [
        {styles: 'w-[10%] text-start', title: '№'},
        {
            styles: 'w-[10%] text-start',
            filter: 'category.code',
            title: 'Kategoriyasi',
        },
        {
            styles: 'w-[10%] text-start',
            filter: 'productdata.code',
            title: 'Kodi',
        },
        {styles: 'text-start', title: 'Maxsulot nomi'},
        {styles: 'text-start', filter: 'pieces', title: 'Maxsulot soni'},
        {styles: 'text-start', title: 'Kelgan narxi'},
        {styles: 'text-start', title: 'Jami summasi'},
    ]
    const [searchedData, setSearchedData] = useState(searchedExchanges)
    const [currentPage, setCurrentPage] = useState(0)
    const [showByTotal, setShowByTotal] = useState('10')
    const [data, setData] = useState([])
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [searchByCategory, setSearchByCategory] = useState('')
    const [searchByCode, setSearchByCode] = useState('')
    const [searchByName, setSearchByName] = useState('')

    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }

    const filterByCategory = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setSearchByCategory(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedExchanges())
        if (valForSearch === '') {
            setData(idProducts)
            setFilteredDataTotal(total)
        } else {
            const filteredExchanges = filter(idProducts, (item) => {
                return item?.category?.code.includes(valForSearch)
            })
            setData(filteredExchanges)
            setFilteredDataTotal(filteredExchanges.length)
        }
    }

    const filterByCode = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setSearchByCode(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedExchanges())
        if (valForSearch === '') {
            setData(idProducts)
            setFilteredDataTotal(total)
        } else {
            const filteredExchanges = filter(idProducts, (item) => {
                return item?.productdata?.code.includes(valForSearch)
            })
            setData(filteredExchanges)
            setFilteredDataTotal(filteredExchanges.length)
        }
    }

    const filterByName = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setSearchByName(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedExchanges())
        if (valForSearch === '') {
            setData(idProducts)
            setFilteredDataTotal(total)
        } else {
            const filteredExchanges = filter(idProducts, (item) => {
                return item?.productdata?.name
                    .toLowerCase()
                    .includes(valForSearch)
            })
            setData(filteredExchanges)
            setFilteredDataTotal(filteredExchanges.length)
        }
    }

    const filterWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0)
            const body = {
                currentPage: currentPage,
                countPage: showByTotal,
                search: {
                    codeofproduct: searchByCode.replace(/\s+/g, ' ').trim(),
                    nameofproduct: searchByName.replace(/\s+/g, ' ').trim(),
                    categoryofproduct: searchByCategory
                        .replace(/\s+/g, ' ')
                        .trim(),
                },
            }
            dispatch(getExchangesFilter(body))
        }
    }

    const exportData = () => {
        let fileName = 'Barcha almashinilgan maxsulotlar'
        const exportHeader = [
            '№',
            'Kategoriyasi',
            'Kodi',
            'Maxsulot Nomi',
            'Maxsulot Soni',
            'Kelgan Narxi UZS',
            'Jami Summasi UZS',
        ]
        if (data?.length > 0) {
            const BarcodeData = map(data, (item, index) => ({
                nth: index + 1,
                Category_code: item?.category?.code || '',
                Product_code: item?.productdata?.code || '',
                Product_name: item?.productdata?.name || '',
                Product_number: item?.pieces || '',
                incomingprice:
                    currency === 'UZS'
                        ? (
                              Math.round(item?.price?.incomingpriceuzs * 1) / 1
                          ).toLocaleString('ru-RU')
                        : (
                              Math.round(item?.price?.incomingprice * 1000) /
                              1000
                          ).toLocaleString('ru-RU'),
                allIncomingPrice:
                    currency === 'UZS'
                        ? Math.round(
                              item?.price?.incomingpriceuzs +
                                  item?.price?.sellingpriceuzs
                          ).toLocaleString('ru-RU')
                        : Math.round(
                              item?.price?.incomingprice +
                                  item?.price?.sellingprice
                          ).toLocaleString('ru-RU'),
            }))
            exportExcel(BarcodeData, fileName, exportHeader)
        } else {
            universalToast("Jadvalda ma'lumot mavjud emas !", 'warning')
        }
    }
    useEffect(() => {
        const body = {
            currentPage: 0,
            countPage: showByTotal,
            transfer: dataId,
        }
        dispatch(getFilialIdProducts(body))
    }, [dispatch, dataId, currentPage, showByTotal])

    useEffect(() => {
        setData(idProducts)
    }, [idProducts])

    useEffect(() => {
        setSearchedData(searchedExchanges)
    }, [searchedExchanges])

    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])

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
            <div className='pagination-supplier mainPadding'>
                <div className='flex gap-[1rem] items-center'>
                    <span className='linktoback' onClick={() => navigate(-1)}>
                        <IoChevronBack />
                    </span>
                    <ExportBtn onClick={exportData} />
                </div>
                <p className='supplier-title'>Barcha tovarlar ro'yxati</p>
                <div>
                    {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                        <Pagination
                            countPage={Number(showByTotal)}
                            totalDatas={totalSearched || filteredDataTotal}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                        />
                    )}
                </div>
            </div>
            <SearchForm
                filterBy={['total', 'category', 'code', 'name']}
                filterByTotal={filterByTotal}
                searchByCategory={searchByCategory}
                filterByCategory={filterByCategory}
                searchByCode={searchByCode}
                filterByCode={filterByCode}
                searchByName={searchByName}
                filterByName={filterByName}
                filterByCodeAndNameAndCategoryWhenPressEnter={
                    filterWhenPressEnter
                }
            />
            <div className='pl-[2.5rem] pr-[1.25rem] pb-[1.25rem]'>
                {loading ? (
                    <SmallLoader />
                ) : data.length === 0 ? (
                    <NotFind text={`${t("Tovarlar mavjud emas")}`} />
                ) : (
                    <Table
                        data={data}
                        page={'filialShopDataId'}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        headers={headers}
                        currency={currency}
                    />
                )}
            </div>
        </motion.section>
    )
}

export default ProductIdExchanges
