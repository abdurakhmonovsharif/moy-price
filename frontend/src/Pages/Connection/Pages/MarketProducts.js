import React, {useEffect, useState} from 'react'
import LinkToBack from '../../../Components/LinkToBack/LinkToBack.js'
import ExportBtn from '../../../Components/Buttons/ExportBtn.js'
import Pagination from '../../../Components/Pagination/Pagination.js'
import SearchForm from '../../../Components/SearchForm/SearchForm.js'
import {useDispatch, useSelector} from 'react-redux'
import {
    clearSearchedProducts,
    getProducts,
    getProductsAll,
    getProductsByFilter
} from '../../Products/Create/productSlice.js'
import {filter, map} from 'lodash'
import {exportExcel, universalSort} from '../../../App/globalFunctions.js'
import {universalToast} from '../../../Components/ToastMessages/ToastMessages.js'
import {useTranslation} from 'react-i18next'
import Spinner from '../../../Components/Spinner/SmallLoader.js'
import SmallLoader from '../../../Components/Spinner/SmallLoader.js'
import NotFind from '../../../Components/NotFind/NotFind.js'
import Table from '../../../Components/Table/Table.js'
import {
    checkShowAllProducts,
    showAllProductsToConnectionMarket,
    showProductToConnectionMarket
} from '../connectionSlice.js'
import ProductCheckbox from '../../../Components/Checkbox/ProductCheckBox.js'
import {useParams} from 'react-router-dom'

const MarketProducts = () => {
    const partner = useParams().id
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()
    const {
        products,
        total,
        loading,
        searchedProducts,
        totalSearched,
        loadingExcel,
    } = useSelector((state) => state.products)
    const {loading: connectionLoading, checkShowAll} = useSelector(
        (state) => state.connections
    )
    const {currencyType} = useSelector((state) => state.currency)
    const [data, setData] = useState(products)
    const [searchedData, setSearchedData] = useState(searchedProducts)
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [searchByCode, setSearchByCode] = useState('')
    const [searchByName, setSearchByName] = useState('')
    const [searchByCategory, setSearchByCategory] = useState('')
    const [barCode, setBarCode] = useState('')
    const [sorItem, setSorItem] = useState({
        filter: '',
        sort: '',
        count: 0,
    })

    // table headers
    const headers = [
        {title: t('№')},
        {
            filter: 'productdata.barcode',
            title: t('Shtrix kodi'),
        },
        {
            title: t('Kategoriyasi'),
            filter: t('category.code'),
        },
        {title: t('Kodi'), filter: 'productdata.code'},
        {title: t('Nomi'), filter: 'productdata.name'},
        {
            title: t('Ruxsat'),
        },
    ]

    const exportData = () => {
        let fileName = 'Dukonlar-hamkorlar-maxsulotlar'
        const exportHeader = [
            t('№'),
            t('Shtrix kodi'),
            t('Mahsulot kategoriyasi'),
            t('Mahsulot kodi'),
            t('Mahsulot nomi'),
        ]
        const body = {
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim(),
                code: searchByCode.replace(/\s+/g, ' ').trim(),
                category: searchByCategory.replace(/\s+/g, ' ').trim(),
            },
        }
        dispatch(getProductsAll(body)).then(({error, payload}) => {
            if (!error) {
                if (payload?.length > 0) {
                    const newData = map(payload, (item, index) => ({
                        nth: index + 1,
                        barcode: item?.productdata?.barcode || '',
                        category: item?.category?.code || '',
                        code: item?.productdata?.code || '',
                        name: item?.productdata?.name || '',
                    }))
                    exportExcel(newData, fileName, exportHeader)
                } else {
                    universalToast("Jadvalda ma'lumot mavjud emas !", 'warning')
                }
            }
        })
    }

    // handle change of search inputs
    const filterByCode = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setSearchByCode(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedProducts())
        if (valForSearch === '') {
            setData(products)
            setFilteredDataTotal(total)
        } else {
            const filteredProducts = filter(products, (product) => {
                return product.productdata.code.includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const filterByBarcode = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setBarCode(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedProducts())
        if (valForSearch === '') {
            setData(products)
            setFilteredDataTotal(total)
        } else {
            const filteredProducts = filter(products, (product) => {
                return product.productdata?.barcode.includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const filterByCategory = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setSearchByCategory(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedProducts())
        if (valForSearch === '') {
            setData(products)
            setFilteredDataTotal(total)
        } else {
            const filteredProducts = filter(products, (product) => {
                return product.category.code.includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const filterByName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setSearchByName(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedProducts())
        if (valForSearch === '') {
            setData(products)
            setFilteredDataTotal(total)
        } else {
            const filteredProducts = filter(products, (product) => {
                return product.productdata.name
                    .toLowerCase()
                    .includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
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
                    category: searchByCategory.replace(/\s+/g, ' ').trim(),
                },
            }
            dispatch(getProductsByFilter(body))
        }
    }
    const filterByBarcodeWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0)
            const body = {
                currentPage: 0,
                countPage: showByTotal,
                search: {
                    barcode: barCode.replace(/\s+/g, ' ').trim(),
                },
            }
            dispatch(getProductsByFilter(body))
        }
    }

    // filter by total
    const filterByTotal = ({value}) => {
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
                        count: 2,
                    })
                    universalSort(
                        searchedData.length > 0 ? searchedData : data,
                        searchedData.length > 0 ? setSearchedData : setData,
                        filterKey,
                        1,
                        searchedData.length > 0 ? searchedProducts : products
                    )
                    break
                case 2:
                    setSorItem({
                        filter: filterKey,
                        sort: '',
                        count: 0,
                    })
                    universalSort(
                        searchedData.length > 0 ? searchedData : data,
                        searchedData.length > 0 ? setSearchedData : setData,
                        filterKey,
                        '',
                        searchedData.length > 0 ? searchedProducts : products
                    )
                    break
                default:
                    setSorItem({
                        filter: filterKey,
                        sort: '-1',
                        count: 1,
                    })
                    universalSort(
                        searchedData.length > 0 ? searchedData : data,
                        searchedData.length > 0 ? setSearchedData : setData,
                        filterKey,
                        -1,
                        searchedData.length > 0 ? searchedProducts : products
                    )
            }
        } else {
            setSorItem({
                filter: filterKey,
                sort: '-1',
                count: 1,
            })
            universalSort(
                searchedData.length > 0 ? searchedData : data,
                searchedData.length > 0 ? setSearchedData : setData,
                filterKey,
                -1,
                searchedData ? searchedProducts : products,
                searchedData.length > 0
            )
        }
    }

    const handleShowProduct = (e, productId, connectionMarket, index) => {
        const body = {
            productId,
            connectionMarket,
            add: e.target.checked,
        }
        dispatch(showProductToConnectionMarket(body)).then(
            ({error, payload}) => {
                if (!error) {
                    if (searchedData.length > 0 || totalSearched > 0) {
                        let products = [...searchedData]
                        products[index] = payload
                        setSearchedData(products)
                    } else {
                        let products = [...data]
                        products[index] = payload
                        setData(products)
                    }
                    dispatch(checkShowAllProducts({connectionMarket}))
                }
            }
        )
    }
    const handleShowAllProducts = (e) => {
        const body = {
            connectionMarket: partner,
            add: e.target.checked,
        }
        dispatch(showAllProductsToConnectionMarket(body)).then(
            ({error, payload}) => {
                if (!error) {
                    const body = {
                        currentPage,
                        countPage: showByTotal,
                        search: {
                            name: searchByName.replace(/\s+/g, ' ').trim(),
                            code: searchByCode.replace(/\s+/g, ' ').trim(),
                            category: searchByCategory
                                .replace(/\s+/g, ' ')
                                .trim(),
                        },
                    }
                    dispatch(getProducts(body))
                    dispatch(checkShowAllProducts({connectionMarket: partner}))
                }
            }
        )
    }

    useEffect(() => {
        const body = {
            connectionMarket: partner,
        }
        dispatch(checkShowAllProducts(body))
    }, [dispatch, partner])
    useEffect(() => {
        const body = {
            currentPage,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim(),
                code: searchByCode.replace(/\s+/g, ' ').trim(),
                category: searchByCategory.replace(/\s+/g, ' ').trim(),
            },
        }
        dispatch(getProducts(body))
        //    eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, showByTotal, dispatch])
    useEffect(() => {
        setData(products)
    }, [products])
    useEffect(() => {
        setSearchedData(searchedProducts)
    }, [searchedProducts])
    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])

    return (
        <div className='mainPadding'>
            {loadingExcel && (
                <div className='fixed backdrop-blur-[2px] z-[100] left-0 top-0 right-0 bottom-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            <LinkToBack link={'/dukonlar/hamkorlar'} />
            <div className={'flex justify-between items-center mainPadding'}>
                <div className={'flex gap-[1.5rem]'}>
                    <ExportBtn onClick={exportData} />
                </div>
                <h3 className={'text-blue-900 text-[xl] leading-[1.875rem]'}>
                    {t('Maxsulotlar')}
                </h3>
                {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                    <Pagination
                        countPage={Number(showByTotal)}
                        totalDatas={totalSearched || filteredDataTotal}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
            <SearchForm
                filterBy={[
                    'total',
                    'barcode',
                    'category',
                    'code',
                    'name',
                    'doubleDate',
                ]}
                filterByCode={filterByCode}
                filterByCodeAndNameAndCategoryWhenPressEnter={
                    filterByCodeAndNameAndCategoryWhenPressEnter
                }
                filterByName={filterByName}
                filterByTotal={filterByTotal}
                searchByCode={searchByCode}
                searchByName={searchByName}
                searchByCategory={searchByCategory}
                filterByCategory={filterByCategory}
                barCode={barCode}
                filterByBarcode={filterByBarcode}
                filterByBarcodeWhenPressEnter={filterByBarcodeWhenPressEnter}
            />
            <div className={'mainPadding flex justify-end pr-12'}>
                <p className='pr-3'>Umumiy ruxsat:</p>{' '}
                <ProductCheckbox
                    onChange={handleShowAllProducts}
                    value={checkShowAll}
                />
            </div>
            <div className='tableContainerPadding'>
                {loading || connectionLoading ? (
                    <Spinner />
                ) : data.length === 0 && searchedData.length === 0 ? (
                    <NotFind text={'Maxsulot mavjud emas'} />
                ) : (
                    <Table
                        handleShowProduct={handleShowProduct}
                        currencyType={currencyType}
                        headers={headers}
                        page={'marketProducts'}
                        data={searchedData.length > 0 ? searchedData : data}
                        Sort={filterData}
                        sortItem={sorItem}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        currency={currencyType}
                    />
                )}
            </div>
        </div>
    )
}

export default MarketProducts
