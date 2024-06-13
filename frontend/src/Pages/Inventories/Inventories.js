import React, {useCallback, useEffect, useState} from 'react'
import * as XLSX from 'xlsx'
import Table from '../../Components/Table/Table'
import Pagination from '../../Components/Pagination/Pagination'
import SearchForm from '../../Components/SearchForm/SearchForm.js'
import {useDispatch, useSelector} from 'react-redux'
import {universalToast} from '../../Components/ToastMessages/ToastMessages.js'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import SmallLoader from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import {motion} from 'framer-motion'
import {getConnectors, postInventoriesId} from './inventorieSlice.js'
import UniversalModal from '../../Components/Modal/UniversalModal'
import {useTranslation} from 'react-i18next'
import {roundUzs, universalSort} from './../../App/globalFunctions'

function Inventories() {
    const { t } = useTranslation(['common'])
    const headers = [
        { styles: 'w-[10%] text-start', title: '№' },
        { styles: 'w-[10%] text-start', filter: 'createdAt', title: t('Sana') },
        { styles: 'w-[10%] text-start', filter: 'id', title: t('ID') },
        { styles: 'text-start', title: t('Maxsulotlar') },
        { styles: 'w-[10%]', title: t('Holati') },
        { styles: 'w-[10%]', title: ' ' },
    ]

    const dispatch = useDispatch()

    const {
        connectors,
        errorConnectors,
        clearErrorConnectors,
        loading,
        dataLoading,
        total,
    } = useSelector((state) => state.inventoryConnectors)
    const [sorItem, setSorItem] = useState({
        filter: '',
        sort: '',
        count: 0,
    })
    const [storeData, setStoreData] = useState(connectors)
    const [data, setData] = useState(connectors)
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    )
    const [endDate, setEndDate] = useState(new Date())
    const [printedInventories, setPrintedInventories] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    // filter by total
    const filterByTotal = ({ value }) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }

    // excel function
    const headersInventories = [
        '№',
        t('Sana'),
        t('Kodi'),
        t('Maxsulot'),
        t('Narxi UZS'),
        t('Dastlabki'),
        t('Sanoq'),
        t('Farqi'),
        t('Farqi UZS'),
    ]

    const toggleModal = () => {
        setModalVisible(!modalVisible)
        setPrintedInventories(null)
    }

    const handleClickPrint = (e) => {
        const body = {
            id: e._id,
        }
        dispatch(postInventoriesId(body)).then(({ payload: { inventories } }) => {
            if (inventories.length > 0) {
                setPrintedInventories(inventories)
            }
        })
        setModalVisible(true)
    }

    const autoFillColumnWidth = (json) => {
        const cols = Object.keys(json[0])
        const maxLength = cols.reduce((acc, curr) => {
            return acc > curr.length ? acc : curr.length
        }, 0)
        return cols.map((col) => ({
            wch: maxLength,
        }))
    }
    const continueHandleClick = useCallback(
        (data) => {
            const wscols = autoFillColumnWidth(data)
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.json_to_sheet([])
            ws['!cols'] = wscols
            XLSX.utils.sheet_add_aoa(ws, [headersInventories])
            XLSX.utils.sheet_add_json(ws, data, {
                origin: 'A2',
                skipHeader: true,
            })
            XLSX.utils.book_append_sheet(wb, ws, 'Inventorizatsiyalar')
            XLSX.writeFile(
                wb,
                `${t(
                    'Invertarizatsiyalar'
                )}-${new Date().toLocaleDateString()}.xlsx`
            )
        },
        [headersInventories, t]
    )

    const handleClick = (e, idx) => {
        const body = {
            id: e._id,
        }
        dispatch(postInventoriesId(body)).then(({ payload: { inventories } }) => {
            if (inventories.length > 0) {
                const newData = [...inventories].map((item, index) => ({
                    nth: index + 1,
                    data: new Date(item?.createdAt).toLocaleDateString(),
                    code: item.productdata.code,
                    name: item.productdata.name,
                    incomingprice: roundUzs(item.price.incomingpriceuzs * item.productcount),
                    initial: item.productcount,
                    count: item.inventorycount,
                    difference: item.inventorycount - item.productcount,
                    differenceUZS:
                        item.inventorycount * item.price.incomingpriceuzs -
                        item.productcount * item.price.incomingpriceuzs,
                }))
                newData.push(
                    {
                    nth: "",
                    data: "",
                    code: "",
                    name: "",
                    incomingprice: [...inventories].reduce(((prev, el) => prev + roundUzs(el.price.incomingpriceuzs * el.productcount)), 0),
                    initial: [...inventories].reduce(((prev, el) => prev + el.productcount), 0),
                    count: [...inventories].reduce(((prev, el) => prev + el.inventorycount), 0),
                    difference: [...inventories].reduce(((prev, el) => prev + (el.inventorycount - el.productcount)), 0),
                    differenceUZS:
                    [...inventories].reduce(((prev, el) => prev + (el.inventorycount * el.price.incomingpriceuzs -
                        el.productcount * el.price.incomingpriceuzs)), 0),
                    }
                )
                continueHandleClick(newData, idx)
            }
        })
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

    // excel function

    useEffect(() => {
        setData(connectors)
        setStoreData(connectors)
    }, [connectors])
    useEffect(() => {
        if (errorConnectors) {
            universalToast(errorConnectors, 'error')
            dispatch(clearErrorConnectors())
        }
    }, [dispatch, clearErrorConnectors, errorConnectors])
    useEffect(() => {
        const body = {
            currentPage,
            countPage: showByTotal,
            startDate: new Date(
                new Date(startDate).getFullYear(),
                new Date(startDate).getMonth(),
                new Date(startDate).getDate()
            ).toISOString(),
            endDate: endDate.toISOString(),
        }
        dispatch(getConnectors(body))
    }, [currentPage, showByTotal, dispatch, startDate, endDate])
    useEffect(() => {
        setData(connectors)
    }, [connectors])
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
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
            <UniversalModal
                printedInventories={printedInventories}
                body={'checkInventory'}
                isOpen={modalVisible}
                toggleModal={toggleModal}
            />

            {dataLoading && (
                <div className='fixed z-[50] backdrop-blur-[2px] left-0 right-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}

            <div className='inventoriesHead mainPadding'>
                <div className='font-[400] text-[1.25rem] text-blue-900'>
                    {t('Inventarizatsiyalar')}
                </div>
                <div>
                    {filteredDataTotal !== 0 && (
                        <Pagination
                            countPage={Number(showByTotal)}
                            totalDatas={filteredDataTotal}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </div>
            </div>
            <SearchForm
                filterBy={["total", 'startDate', 'endDate']}
                filterByTotal={filterByTotal}
                setEndDate={setEndDate}
                setStartDate={setStartDate}
                startDate={startDate}
                endDate={endDate}
            />
            <div className='tableContainerPadding'>
                {loading ? (
                    <Spinner />
                ) : data.length === 0 ? (
                    <NotFind text={'Invnentarizatsiyalar mavjud emas!'} />
                ) : (
                    <Table
                        isDisabled={dataLoading}
                        page='inventories'
                        currentPage={currentPage}
                        countPage={showByTotal}
                        data={data}
                        headers={headers}
                        Excel={handleClick}
                        Print={handleClickPrint}
                        Sort={filterData}
                        sortItem={sorItem}
                    />
                )}
            </div>
        </motion.section>
    )
}

export default Inventories
