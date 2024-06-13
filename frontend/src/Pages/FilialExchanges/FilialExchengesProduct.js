import React, {useEffect, useState} from 'react'
import Table from '../../Components/Table/Table'
import {useDispatch, useSelector} from 'react-redux'
import {
    changeEndDate,
    changeStartDate,
    clearSearchedExchanges,
    getExchangesFilterId,
    getFilialShopData
} from './filialExchengesSlice.js'
import {motion} from 'framer-motion'
import SearchForm from '../../Components/SearchForm/SearchForm'
import ExportBtn from '../../Components/Buttons/ExportBtn'
import Pagination from '../../Components/Pagination/Pagination'
import {filter, map} from 'lodash'
import NotFind from '../../Components/NotFind/NotFind'
import SmallLoader from '../../Components/Spinner/SmallLoader'
import {exportExcel} from '../../App/globalFunctions'
import {universalToast} from '../../Components/ToastMessages/ToastMessages'
import {t} from 'i18next'

function FilialExchangesProduct({id, currency}) {
    const dispatch = useDispatch()
    const {
        shops,
        loading,
        total,
        totalSearched,
        searchedExchanges,
        startDate,
        endDate,
    } = useSelector((state) => state.filialData)

    const headers = [
        {styles: 'w-[10%] text-start', title: '№'},
        {styles: 'w-[10%] text-start', filter: 'createdAt', title: 'Sana'},
        {styles: 'w-[10%] text-start', filter: 'id', title: 'ID'},
        {styles: 'text-start', title: 'Maxsulot turi'},
        {styles: 'text-start', title: 'Maxsulot soni'},
        {styles: 'text-start', title: 'Qabul qilish'},
        {styles: 'text-start', title: 'Sotish'},
        {styles: 'w-[10%]', title: ' '},
    ]

    const [currentPage, setCurrentPage] = useState(0)
    const [showByTotal, setShowByTotal] = useState('10')
    const [data, setData] = useState([])
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [searchById, setSearchById] = useState('')
    const [searchedData, setSearchedData] = useState(searchedExchanges)

    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }

    const filterById = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setSearchById(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedExchanges())
        if (valForSearch === '') {
            setData(shops)
            setFilteredDataTotal(total)
        } else {
            const filteredExchanges = filter(shops, (item) => {
                return item._id.includes(valForSearch)
            })
            setData(filteredExchanges)
            setFilteredDataTotal(filteredExchanges.length)
        }
    }

    const filterByIdWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            const body = {
                currentPage,
                countPage: showByTotal,
                search: {
                    name: searchById.replace(/\s+/g, ' ').trim(),
                },
            }
            dispatch(getExchangesFilterId(body))
        }
    }

    const exportData = () => {
        let fileName = `${t("Almashinilgan tovarlar")}`
        const headersExcel = [
            '№',
            t('Sana'),
            t('Id'),
            t('Maxsulot turi'),
            t('Maxsulot Soni'),
            t('Jami olish summasi'),
            t('Jami sotish summasi'),
        ]
        if (data?.length > 0) {
            const ExchangesDatas = map(data, (item, index) => ({
                nth: index + 1,
                date: new Date(item?.createdAt).toLocaleDateString() || '',
                product_id: item?._id || '',
                product_type: item?.products.length || '',
                product_number: item?.pieces || '',
                all_get_product:
                    currency === 'UZS'
                        ? (
                              Math.round(item.totalincomingpriceuzs * 1) / 1
                          ).toLocaleString('ru-RU')
                        : (
                              Math.round(item.totalincomingprice * 1000) / 1000
                          ).toLocaleString('ru-RU'),
                all_sell_product:
                    currency === 'UZS'
                        ? (
                              Math.round(item?.totalsellingpriceuzs * 1) / 1
                          ).toLocaleString('ru-RU')
                        : (
                              Math.round(item?.totalsellingprice * 1000) / 1000
                          ).toLocaleString('ru-RU'),
            }))
            exportExcel(ExchangesDatas, fileName, headersExcel)
        } else {
            universalToast("Jadvalda ma'lumot mavjud emas !", 'warning')
        }
    }

    const handleStartDate = (e) => {
        dispatch(changeStartDate({start: e.toISOString()}))
    }
    const handleEndDate = (e) => {
        dispatch(changeEndDate({end: e.toISOString()}))
    }

    useEffect(() => {
        const body = {
            currentPage,
            countPage: showByTotal,
            startDate: new Date(
                new Date(startDate).getFullYear(),
                new Date(startDate).getMonth(),
                new Date(startDate).getDate()
            ).toISOString(),
            endDate: endDate,
            filial: id,
        }
        dispatch(getFilialShopData(body))
    }, [dispatch, id, startDate, endDate, currentPage, showByTotal])
    useEffect(() => {
        setData(shops)
    }, [dispatch, shops, startDate, endDate])

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
                <ExportBtn onClick={exportData} />
                <p className='supplier-title'>`${t("Almashinilgan tovarlar")}`</p>
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
                filterBy={['total', 'id', 'startDate', 'endDate']}
                filterByTotal={filterByTotal}
                searchById={searchById}
                filterById={filterById}
                filterByIdWhenPressEnter={filterByIdWhenPressEnter}
                startDate={new Date(startDate)}
                endDate={new Date(endDate)}
                setStartDate={handleStartDate}
                setEndDate={handleEndDate}
            />
            <div className='pl-[2.5rem] pr-[1.25rem] pb-[1.25rem]'>
                {loading ? (
                    <SmallLoader />
                ) : data.length === 0 ? (
                    <NotFind text={`${t("Tovarlar mavjud emas")}`} />
                ) : (
                    <Table
                        data={data}
                        page={'filialShop'}
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

export default FilialExchangesProduct
