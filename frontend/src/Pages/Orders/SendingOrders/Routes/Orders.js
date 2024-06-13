import React, {useEffect, useState} from 'react'
import Table from '../../../../Components/Table/Table'
import {useDispatch, useSelector} from 'react-redux'
import Pagination from '../../../../Components/Pagination/Pagination'
import SearchForm from '../../../../Components/SearchForm/SearchForm'
import {clearSearchedOrders, getOrders, getOrdersByFilter} from '../Slices/ordersSlice.js'
import Spinner from '../../../../Components/Spinner/SmallLoader.js'
import NotFind from '../../../../Components/NotFind/NotFind.js'
import {filter} from 'lodash'
import UniversalModal from '../../../../Components/Modal/UniversalModal.js'
import {t} from 'i18next'

function Orders() {
    const {currencyType} = useSelector((state) => state.currency)
    const {orders, searchedOrders, count, searchedTotal, loading} = useSelector(
        (state) => state.orders
    )
    const [data, setData] = useState(orders)

    const dispatch = useDispatch()
    const headers = [
        {title: '№'},
        {title: 'Sana'},
        {
            title: 'Do\'kon nomi'
        },
        {
            title: 'INN',
            filter: ''
        },
        {title: 'ID', filter: ''},
        {title: 'Maxsulot turi', filter: ''},
        {
            title: 'Umumiy narxi',
            filter: ''
        },
        {title: 'Tahrirlash'},
        {
            title: 'Holati',
            filter: ''
        }
    ]
    const [filteredDataTotal, setFilteredDataTotal] = useState(count)
    const [searchedData, setSearchedData] = useState(searchedOrders)
    const [searchedtotal, setSearchedtotal] = useState(searchedTotal)
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [searchByName, setSearchByName] = useState('')
    const [searchById, setSearchById] = useState('')
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0)
    )
    const [endDate, setEndDate] = useState(new Date())
    const [printedOrder, setPrintedOrder] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalBody, setModalBody] = useState(null)

    const toggleModal = () => {
        setModalVisible(!modalVisible)
        setPrintedOrder(null)
    }

    // filter by total
    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }

    const filterByMarketName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setSearchByName(val)
        ;(searchedData.length > 0 || searchedtotal > 0) &&
        dispatch(clearSearchedOrders())
        if (valForSearch === '') {
            setData(orders)
            setFilteredDataTotal(count)
        } else {
            const filteredProducts = filter(orders, (market) => {
                return market.sender.name.toLowerCase().includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const filterById = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setSearchById(val)
        ;(searchedData.length > 0 || searchedtotal > 0) &&
        dispatch(clearSearchedOrders())
        if (valForSearch === '') {
            setData(orders)
            setFilteredDataTotal(count)
        } else {
            const filteredProducts = filter(orders, (market) => {
                return market.id.toString().includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }

    const filterByMarketNameAndInnWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0)
            const body = {
                currentPage,
                countPage: showByTotal,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                search: {
                    id: searchById,
                    inn: '',
                    name: searchByName
                }
            }
            dispatch(getOrdersByFilter(body))
        }
    }

    const handleClickPrint = (order) => {
        setModalBody('checkOrder')
        setPrintedOrder(order)
        setModalVisible(true)
    }

    useEffect(() => {
        const body = {
            currentPage,
            countPage: showByTotal,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            search: {
                id: '',
                inn: '',
                name: ''
            }
        }
        dispatch(getOrders(body))
    }, [currentPage, showByTotal, startDate, endDate, dispatch])
    useEffect(() => {
        setData(orders)
    }, [orders])
    useEffect(() => {
        setFilteredDataTotal(count)
    }, [count])
    useEffect(() => {
        setSearchedData(searchedOrders)
    }, [searchedOrders])
    useEffect(() => {
        setSearchedtotal(searchedTotal)
    }, [searchedTotal])

    return (
        <section>
            <div className='pagination mainPadding'>
                <p className='flex items-center'>{t("Ro'yxatlar")}</p>
                {(filteredDataTotal !== 0 || searchedtotal !== 0) && (
                    <Pagination
                        countPage={Number(showByTotal)}
                        totalDatas={searchedtotal || filteredDataTotal}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
            <UniversalModal
                order={printedOrder}
                currency={currencyType}
                body={modalBody}
                isOpen={modalVisible}
                toggleModal={toggleModal}
            />
            <SearchForm
                filterBy={['total', 'startDate', 'endDate', 'id', 'marketName']}
                endDate={endDate}
                startDate={startDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                filterByTotal={filterByTotal}
                filterByMarketName={filterByMarketName}
                filterById={filterById}
                filterByIdWhenPressEnter={
                    filterByMarketNameAndInnWhenPressEnter
                }
                filterByMarketNameWhenPressEnter={
                    filterByMarketNameAndInnWhenPressEnter
                }
            />
            <div className='tablePadding'>
                {loading ? (
                    <Spinner />
                ) : data.length === 0 && searchedData.length === 0 ? (
                    <NotFind text={`${t("Ro'yxat mavjud emas...")}`} />
                ) : (
                    <Table
                        data={searchedData.length > 0 ? searchedData : data}
                        currentPage={currentPage}
                        currency={currencyType}
                        countPage={showByTotal}
                        page={'registerOrder'}
                        headers={headers}
                        Print={handleClickPrint}
                        // addPlus={addPlus}
                        // Sort={filterData}
                        // sortItem={sorItem}
                    />
                )}
            </div>
        </section>
    )
}

export default Orders
