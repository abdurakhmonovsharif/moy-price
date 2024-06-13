import React, {useEffect, useState} from 'react'
import Table from '../../Components/Table/Table'
import Pagination from '../../Components/Pagination/Pagination'
import SearchForm from '../../Components/SearchForm/SearchForm.js'
import {motion} from 'framer-motion'
import {
    clearCompleteSuccessInventory,
    clearErrorInventories,
    clearSearchedInventories,
    clearSuccessUpdateInventory,
    complateInventory,
    getInventories,
    getInventoriesByFilter,
    updateInventory
} from './inventorySlice'
import {universalSort} from '../../App/globalFunctions.js'
import {useDispatch, useSelector} from 'react-redux'
import {
    successCompleteInventoryMessage,
    successUpdateInventoryMessage,
    universalToast
} from '../../Components/ToastMessages/ToastMessages.js'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import UniversalModal from '../../Components/Modal/UniversalModal.js'
import {useNavigate} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {filter} from 'lodash'

function Inventory() {
    const { t } = useTranslation(['common'])
    const headers = [
        { styles: 'w-[10%]', filter: '', title: '№' },
        { styles: 'w-[10%]', filter: 'category.code', title: t('Kategoriyasi') },
        { styles: 'w-[10%]', filter: 'productdata.code', title: t('Kodi') },
        { styles: 'w-[20%]', filter: 'productdata.name', title: t('Nomi') },
        { styles: 'w-[10%] text-center', title: t('Dastlabki') },
        { styles: 'w-[10%] text-center', filter: '', title: t('Sanoq') },
        { styles: 'w-[10%] text-center', filter: '', title: t('Farq') },
        { styles: '', filter: '', title: t('Izoh') },
        { styles: '', filter: '', title: ' ' }
    ]

    const dispatch = useDispatch()
    const {
        inventories,
        total,
        searchedInventories,
        totalSearched,
        errorInventories,
        loading,
        successUpdateInventory,
        successComplateInventory
    } = useSelector((state) => state.inventories)
    const navigate = useNavigate()
    const [data, setData] = useState(inventories)
    const [searchedData, setSearchedData] = useState(searchedInventories)
    const [searchByCategory, setSearchByCategory] = useState('')
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [searchByCode, setSearchByCode] = useState('')
    const [searchByName, setSearchByName] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [sorItem, setSorItem] = useState({
        filter: '',
        sort: '',
        count: 0
    })

    // modal toggle
    const toggleModal = () => setModalVisible(!modalVisible)

    // handle change of search inputs
    const filterByCategory = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setSearchByCategory(val)
            ; (searchedData.length > 0 || totalSearched > 0) &&
                dispatch(clearSearchedInventories())
        if (valForSearch === '') {
            setData(inventories)
            setFilteredDataTotal(total)
        } else {
            const filteredInventories = filter(inventories,(inventory) => {
                return inventory.category.code.includes(valForSearch)
            })
            setData(filteredInventories)
            setFilteredDataTotal(filteredInventories.length)
        }
    }
    const filterByCode = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setSearchByCode(val)
            ; (searchedData.length > 0 || totalSearched > 0) &&
                dispatch(clearSearchedInventories())
        if (valForSearch === '') {
            setData(inventories)
            setFilteredDataTotal(total)
        } else {
            const filteredInventories = filter(inventories,(inventory) => {
                return inventory.productdata.code.includes(valForSearch)
            })
            setData(filteredInventories)
            setFilteredDataTotal(filteredInventories.length)
        }
    }
    const filterByName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setSearchByName(val)
            ; (searchedData.length > 0 || totalSearched > 0) &&
                dispatch(clearSearchedInventories())
        if (valForSearch === '') {
            setData(inventories)
            setFilteredDataTotal(total)
        } else {
            const filteredInventories = filter(inventories,(inventory) => {
                return inventory.productdata.name
                    .toLowerCase()
                    .includes(valForSearch)
            })
            setData(filteredInventories)
            setFilteredDataTotal(filteredInventories.length)
        }
    }

    // filter by total
    const filterByTotal = ({ value }) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }
    const filterData = (filterKey) => {
        if (filterKey === sorItem.filter) {
            switch (sorItem.count) {
                case 1:
                    setSorItem({
                        filter: filterKey,
                        sort: '1',
                        count: 2
                    })
                    universalSort(
                        searchedData.length > 0 ? searchedData : data,
                        searchedData.length > 0 ? setSearchedData : setData,
                        filterKey,
                        1,
                        searchedData.length > 0
                            ? searchedInventories
                            : inventories
                    )
                    break
                case 2:
                    setSorItem({
                        filter: filterKey,
                        sort: '',
                        count: 0
                    })
                    universalSort(
                        searchedData.length > 0 ? searchedData : data,
                        searchedData.length > 0 ? setSearchedData : setData,
                        filterKey,
                        '',
                        searchedData.length > 0
                            ? searchedInventories
                            : inventories
                    )
                    break
                default:
                    setSorItem({
                        filter: filterKey,
                        sort: '-1',
                        count: 1
                    })
                    universalSort(
                        searchedData.length > 0 ? searchedData : data,
                        searchedData.length > 0 ? setSearchedData : setData,
                        filterKey,
                        -1,
                        searchedData.length > 0
                            ? searchedInventories
                            : inventories
                    )
            }
        } else {
            setSorItem({
                filter: filterKey,
                sort: '-1',
                count: 1
            })
            universalSort(
                searchedData.length > 0 ? searchedData : data,
                searchedData.length > 0 ? setSearchedData : setData,
                filterKey,
                -1,
                searchedData ? searchedInventories : inventories,
                searchedData.length > 0
            )
        }
    }
    const filterByCodeAndNameAndCategoryWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0)
            const body = {
                currentPage: 0,
                countPage: showByTotal,
                search: {
                    name: searchByName.replace(/\s+/g, ' ').trim(),
                    code: searchByCode.replace(/\s+/g, ' ').trim(),
                    category: searchByCategory.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(getInventoriesByFilter(body))
        }
    }
    const changeOfInventoryCount = (e, index, product, type) => {
        let currentInventories = searchedData.length
            ? [...searchedData]
            : [...data]
        const val = e.target.value
        let inventory = {
            ...currentInventories[index]
        }
        if (type === 'count') {
            inventory.inventory = {
                ...inventory.inventory,
                inventorycount: parseInt(val),
                productcount: product.total
            }
        } else {
            inventory.inventory = {
                ...inventory.inventory,
                comment: val
            }
        }
        currentInventories[index] = { ...inventory }
        searchedData.length
            ? setSearchedData([...currentInventories])
            : setData([...currentInventories])
    }
    const saveInventory = (index) => {
        const body = {
            inventory: searchedData.length
                ? { ...searchedData[index].inventory }
                : { ...data[index].inventory },
            currentPage: 0,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim(),
                code: searchByCode.replace(/\s+/g, ' ').trim(),
                category: searchByCategory.replace(/\s+/g, ' ').trim()
            }
        }
        dispatch(updateInventory(body))
    }
    const saveOnEnter = (e, index) => {
        if (e.key === 'Enter') saveInventory(index)
    }
    const approveCompleteInventory = () => {
        dispatch(complateInventory())
    }

    useEffect(() => {
        if (errorInventories) {
            universalToast(errorInventories, 'error')
            dispatch(clearErrorInventories())
        }
        if (successUpdateInventory) {
            successUpdateInventoryMessage()
            dispatch(clearSuccessUpdateInventory())
        }
        if (successComplateInventory) {
            successCompleteInventoryMessage()
            dispatch(clearCompleteSuccessInventory())
            navigate('/maxsulotlar/inventarizatsiya/inventarizatsiyalar')
        }
    }, [
        errorInventories,
        dispatch,
        successUpdateInventory,
        successComplateInventory,
        navigate
    ])
    useEffect(() => {
        const body = {
            currentPage,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim(),
                code: searchByCode.replace(/\s+/g, ' ').trim(),
                category: searchByCategory.replace(/\s+/g, ' ').trim()
            }
        }
        dispatch(getInventories(body))
        //    eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, showByTotal, dispatch])
    useEffect(() => {
        setData(inventories)
    }, [inventories])
    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])
    useEffect(() => {
        setSearchedData(searchedInventories)
    }, [searchedInventories])

    return (
        <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}>
            <UniversalModal
                body='complete'
                toggleModal={toggleModal}
                closeModal={toggleModal}
                isOpen={modalVisible}
                headerText={
                    t('Diqqat! Inventarizatsiya yakunlanishini tasdiqlaysizmi?')
                }
                approveFunction={approveCompleteInventory}
            />
            <div className='inverterizationHead mainPadding'>
                <div className='inverterizationText'>{t("Inventarizatsiya")}</div>
                <div>
                    {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                        <Pagination
                            countPage={Number(showByTotal)}
                            totalDatas={totalSearched || filteredDataTotal}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </div>
            </div>
            <SearchForm
                filterBy={["total", 'category', 'code', 'name', 'confirmBtn']}
                searchByCategory={searchByCategory}
                filterByCategory={filterByCategory}
                filterByCode={filterByCode}
                filterByName={filterByName}
                searchByCode={searchByCode}
                searchByName={searchByName}
                filterByTotal={filterByTotal}
                filterByCodeAndNameAndCategoryWhenPressEnter={
                    filterByCodeAndNameAndCategoryWhenPressEnter
                }
                clickConfirmBtn={toggleModal}
            />

            <div className='tableContainerPadding'>
                {loading ? (
                    <Spinner />
                ) : data.length === 0 && searchedData.length === 0 ? (
                    <NotFind text={'Maxsulotlar mavjud emas'} />
                ) : (
                    <Table
                        sortItem={sorItem}
                        Sort={filterData}
                        page='inventory'
                        currentPage={currentPage}
                        countPage={showByTotal}
                        data={searchedData.length > 0 ? searchedData : data}
                        headers={headers}
                        changeHandler={changeOfInventoryCount}
                        Save={saveInventory}
                        onKeyUp={saveOnEnter}
                    />
                )}
            </div>
        </motion.section>
    )
}

export default Inventory
