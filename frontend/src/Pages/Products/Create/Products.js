import React, {useEffect, useState} from 'react'
import ExportBtn from '../../../Components/Buttons/ExportBtn'
import ImportBtn from '../../../Components/Buttons/ImportBtn'
import * as XLSX from 'xlsx'
import Pagination from '../../../Components/Pagination/Pagination'
import Table from '../../../Components/Table/Table'
import {useDispatch, useSelector} from 'react-redux'
import Spinner from '../../../Components/Spinner/SmallLoader'
import SmallLoader from '../../../Components/Spinner/SmallLoader'
import NotFind from '../../../Components/NotFind/NotFind'
import {motion} from 'framer-motion'
import {VscChromeClose} from 'react-icons/vsc'

import {
    addProduct,
    addProductsFromExcel,
    clearSearchedProducts,
    deleteProduct,
    getCodeOfCategory,
    getProducts,
    getProductsAll,
    getProductsByFilter,
    updateProduct,
} from './productSlice'
import {getUnits} from '../../Units/unitsSlice'
import {
    universalToast,
    warningCurrencyRate,
    warningDeleteProduct,
    warningEmptyInput,
} from '../../../Components/ToastMessages/ToastMessages'
import {regexForTypeNumber} from '../../../Components/RegularExpressions/RegularExpressions'
import UniversalModal from '../../../Components/Modal/UniversalModal'
import CreateProductForm from '../../../Components/CreateProductForm/CreateProductForm'
import {getAllCategories} from '../../Category/categorySlice'
import {
    checkEmptyString,
    exportExcel,
    roundUsd,
    roundUzs,
    universalSort,
    UsdToUzs,
    UzsToUsd,
} from '../../../App/globalFunctions'
import SearchForm from '../../../Components/SearchForm/SearchForm'
import BarcodeReader from 'react-barcode-reader'
import {getBarcode} from '../../Barcode/barcodeSlice.js'
import {getCurrency} from '../../Currency/currencySlice.js'
import {useTranslation} from 'react-i18next'
import {filter, map} from 'lodash'
import {getAllProducts, getProductNotArchive} from '../../Sale/Slices/registerSellingSlice.js'
import {FaFilter} from 'react-icons/fa'
import TableMobile from '../../../Components/Table/TableMobile.js'
import SelectForm from '../../../Components/Select/SelectForm.js'

function Products() {
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()
    const {
        market: {_id},
    } = useSelector((state) => state.login)
    const {units} = useSelector((state) => state.units)
    const {allcategories} = useSelector((state) => state.category)
    const {currency, currencyType} = useSelector((state) => state.currency)
    const {
        products,
        total,
        loading,
        lastProductCode,
        searchedProducts,
        totalSearched,
        loadingExcel,
    } = useSelector((state) => state.products)
    const {barcode} = useSelector((state) => state.barcode)
    const [data, setData] = useState(products)
    const [searchedData, setSearchedData] = useState(searchedProducts)
    const [checkOfProduct, setCheckOfProduct] = useState('')
    const [codeOfProduct, setCodeOfProduct] = useState('')
    const [nameOfProduct, setNameOfProduct] = useState('')
    const [numberOfProduct, setNumberOfProduct] = useState('')
    const [unitOfProduct, setUnitOfProduct] = useState('')
    const [priceOfProduct, setPriceOfProduct] = useState('')
    const [sellingPriceOfProduct, setSellingPriceOfProduct] = useState('')
    const [sellingPriceOfProcient, setSellingPriceOfProcient] = useState('')
    const [priceOfProductUsd, setPriceOfProductsUsd] = useState('')
    const [sellingPriceOfProductUsd, setSellingPriceOfProductUsd] = useState('')
    const [categoryOfProduct, setCategoryOfProduct] = useState('')
    const [searchByCode, setSearchByCode] = useState('')
    const [searchByName, setSearchByName] = useState('')
    const [searchByCategory, setSearchByCategory] = useState('')
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [stickyForm, setStickyForm] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [deletedProduct, setDeletedProduct] = useState(null)
    const [modalBody, setModalBody] = useState(null)
    const [unitOptions, setUnitOptions] = useState([])
    const [categoryOptions, setCategoryOptions] = useState([])
    const [excelData, setExcelData] = useState([])
    const [createdData, setCreatedData] = useState([])
    const [barCode, setBarCode] = useState('')
    const [sorItem, setSorItem] = useState({
        filter: '',
        sort: '',
        count: 0,
    })
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [importLoading, setImportLoading] = useState(false)
    const [minimumCount, setMinimumCount] = useState('')
    const [tradePrice, setTradePrice] = useState('')
    const [tradePriceUzs, setTradePriceUzs] = useState('')
    const [tradePriceProcient, setTradePriceProcient] = useState('')

    const [tableRowId, setTableRowId] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [filterModal, setFilterModal] = useState(false)
    const [productWidth, setProductWidth] = useState(0)
    // modal toggle
    const toggleModal = () => setModalVisible(!modalVisible)

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
            title: t('Soni'),
            filter: 'total',
        },
        {
            title: t('Olish'),
            filter:
                currencyType === 'UZS'
                    ? 'price.incomingpriceuzs'
                    : 'price.incomingprice',
        },
        {
            title: t('Sotish'),
            filter:
                currencyType === 'UZS'
                    ? 'price.sellingpriceuzs'
                    : 'price.sellingprice',
        },
        {
            title: t('Optom'),
            filter:
                currencyType === 'UZS'
                    ? 'price.tradeprice'
                    : 'price.tradepriceuzs',
        },
        {
            title: t('Minimum qiymat'),
            filter: 'minimumcount',
            styles: 'w-[5%]',
        },
        {title: ''},
    ]

    const importHeaders = [
        {name: 'Shtrix kodi', value: 'barcode'},
        {name: 'Kategoriyasi', value: 'category'},
        {name: 'Kodi', value: 'code'},
        {name: 'Nomi', value: 'name'},
        {name: 'Soni', value: 'total'},
        {name: "O'lchov birligi", value: 'unit'},
        {name: 'Kelish narxi USD', value: 'incomingprice'},
        {name: 'Kelish narxi UZS', value: 'incomingpriceuzs'},
        {name: 'Sotish narxi USD', value: 'sellingprice'},
        {name: 'Sotish narxi UZS', value: 'sellingpriceuzs'},
        {name: 'Optom narxi USD', value: 'tradeprice'},
        {name: 'Optom narxi UZS', value: 'tradepriceuzs'},
        {name: 'Minimum qiymat', value: 'minimumcount'},
    ]
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    // handle change of inputs
    const handleChangeCheckOfProduct = (e) => {
        let val = e.target.value
        if (regexForTypeNumber.test(val)) {
            setCheckOfProduct(e.target.value)
        }
    }
    const handleChangeCodeOfProduct = (e) => {
        let val = e.target.value
        if (regexForTypeNumber.test(val)) {
            setCodeOfProduct(val)
        }
    }
    const handleChangeNameOfProduct = (e) => {
        setNameOfProduct(e.target.value)
    }
    const handleChangeNumberOfProduct = (e) => {
        let val = Number(e.target.value)
        if (regexForTypeNumber.test(val)) {
            setNumberOfProduct(val)
        }
    }
    const setProcient = (datausd, datauzs, procient) => {
        if (procient && data) {
            setSellingPriceOfProduct(
                roundUzs(datauzs + (datauzs * procient) / 100)
            )
            setSellingPriceOfProductUsd(
                roundUsd(datausd + (datausd * procient) / 100)
            )
        } else {
            setSellingPriceOfProduct('')
            setSellingPriceOfProductUsd('')
        }
    }
    const setProcientTradePrice = (datausd, datauzs, procient) => {
        if (procient && data) {
            setTradePriceUzs(roundUzs(datauzs + (datauzs * procient) / 100))
            setTradePrice(roundUsd(datausd + (datausd * procient) / 100))
        } else {
            setTradePriceUzs('')
            setTradePrice('')
        }
    }
    const handleChangePriceOfProduct = (e) => {
        let val = e.target.value
        if (regexForTypeNumber.test(val)) {
            if (currencyType === 'UZS') {
                setPriceOfProduct(val)
                setPriceOfProductsUsd(UzsToUsd(val, currency))
                setProcient(
                    UzsToUsd(val, currency),
                    Number(val),
                    Number(sellingPriceOfProcient)
                )
            } else {
                setPriceOfProductsUsd(val)
                setPriceOfProduct(UsdToUzs(val, currency))
                setProcient(
                    Number(val),
                    UsdToUzs(val, currency),
                    Number(sellingPriceOfProcient)
                )
            }
        }
    }
    const handleChangeSellingPriceOfProduct = (e) => {
        let val = e.target.value
        if (regexForTypeNumber.test(val)) {
            if (currencyType === 'UZS') {
                setSellingPriceOfProduct(val)
                setSellingPriceOfProductUsd(UzsToUsd(val, currency))
            } else {
                setSellingPriceOfProductUsd(val)
                setSellingPriceOfProduct(UsdToUzs(val, currency))
            }
        }
    }
    const handleChangeSellingPriceOfProcient = (e) => {
        let val = e.target.value
        setSellingPriceOfProcient(val)
        setProcient(
            Number(priceOfProductUsd),
            Number(priceOfProduct),
            Number(val)
        )
    }
    const handleChangeUnitOfProduct = (option) => {
        setUnitOfProduct(option)
    }
    const handleChangeCategoryOfProduct = (option) => {
        setCategoryOfProduct(option)
        const body = {
            categoryId: option.value,
        }
        dispatch(getCodeOfCategory(body))
    }
    const handleChangeMinimumCount = (e) => {
        let val = e.target.value
        if (regexForTypeNumber.test(val)) {
            setMinimumCount(val)
        }
    }
    const handleChangeTradePrice = (e) => {
        let val = e.target.value
        if (regexForTypeNumber.test(val)) {
            if (currencyType === 'UZS') {
                setTradePriceUzs(val)
                setTradePrice(UzsToUsd(val, currency))
            } else {
                setTradePrice(val)
                setTradePriceUzs(UsdToUzs(val, currency))
            }
        }
    }
    const handleChangeTradePriceProcient = (e) => {
        let val = e.target.value
        setTradePriceProcient(val)
        setProcientTradePrice(
            Number(priceOfProductUsd),
            Number(priceOfProduct),
            Number(val)
        )
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
                product: {
                    code: codeOfProduct,
                    name: nameOfProduct.replace(/\s+/g, ' ').trim(),
                    unit: unitOfProduct.value,
                    market: _id,
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
                product: {
                    code: codeOfProduct,
                    name: nameOfProduct.replace(/\s+/g, ' ').trim(),
                    unit: unitOfProduct.value,
                    market: _id,
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

    // handle submit of inputs
    const searchBarcode = (e) => {
        if (e.key === 'Enter') {
            const body = {
                code: e.target.value,
            }
            dispatch(getBarcode(body))
        }
    }

    const addNewProduct = (e) => {
        e.preventDefault()
        if (currency) {
            const {failed, message} = checkEmptyString([
                {
                    value: checkOfProduct,
                    message: t('Maxsulot shtrix kodi'),
                },
                {
                    value: codeOfProduct,
                    message: t('Maxsulot kodi'),
                },
                {
                    value: nameOfProduct,
                    message: t('Maxsulot nomi'),
                },
                {
                    value: unitOfProduct,
                    message: t("Maxsulot o'lchov birligi"),
                },
                {
                    value: categoryOfProduct,
                    message: t('Maxsulot kategoriyasi'),
                },
                {
                    value: priceOfProduct,
                    message: t('Maxsulot kelish narxi'),
                },
                {
                    value: sellingPriceOfProduct,
                    message: t('Maxsulot sotish narxi'),
                },
                {
                    value: tradePrice,
                    message: t('Maxsulot optom narxi'),
                },
                {
                    value: minimumCount,
                    message: t('Maxsulot minimal miqdori'),
                },
            ])
            if (failed) {
                warningEmptyInput(message)
            } else {
                const body = {
                    currentPage,
                    countPage: showByTotal,
                    category: categoryOfProduct.value,
                    search: {
                        name: searchByName.replace(/\s+/g, ' ').trim(),
                        code: searchByCode.replace(/\s+/g, ' ').trim(),
                        category: searchByCategory.replace(/\s+/g, ' ').trim(),
                    },
                    product: {
                        code: codeOfProduct,
                        name: nameOfProduct.replace(/\s+/g, ' ').trim(),
                        total: numberOfProduct,
                        unit: unitOfProduct.value,
                        category: categoryOfProduct.value,
                        market: _id,
                        incomingprice: priceOfProductUsd,
                        sellingprice: sellingPriceOfProductUsd,
                        incomingpriceuzs: priceOfProduct,
                        sellingpriceuzs: sellingPriceOfProduct,
                        barcode: checkOfProduct,
                        tradeprice: tradePrice,
                        tradepriceuzs: tradePriceUzs,
                        minimumcount: minimumCount,
                        width: productWidth,
                    },
                }
                dispatch(addProduct(body)).then(({error}) => {
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
                        clearForm()
                        handleClickCancelToImport()
                    }
                })
            }
        } else {
            warningCurrencyRate()
        }
    }
    const clearForm = (e) => {
        e && e.preventDefault()
        setCodeOfProduct('')
        setNameOfProduct('')
        setCheckOfProduct('')
        setNumberOfProduct('')
        setPriceOfProduct('')
        setSellingPriceOfProduct('')
        setPriceOfProductsUsd('')
        setSellingPriceOfProductUsd('')
        setUnitOfProduct('')
        setCategoryOfProduct('')
        setTradePrice('')
        setTradePriceUzs('')
        setMinimumCount('')
        setCurrentProduct(null)
        setStickyForm(false)
        setSellingPriceOfProcient('')
        setTradePriceProcient('')
        setProductWidth(0)
    }
    const handleEdit = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString([
            {
                value: checkOfProduct,
                message: t('Maxsulot shtrix kodi'),
            },
            {
                value: codeOfProduct,
                message: t('Maxsulot kodi'),
            },
            {
                value: nameOfProduct,
                message: t('Maxsulot nomi'),
            },
            {
                value: unitOfProduct,
                message: t("Maxsulot o'lchov birligi"),
            },
            {
                value: categoryOfProduct,
                message: t('Maxsulot kategoriyasi'),
            },
            {
                value: priceOfProduct,
                message: t('Maxsulot kelish narxi'),
            },
            {
                value: sellingPriceOfProduct,
                message: t('Maxsulot sotish narxi'),
            },
            {
                value: tradePrice,
                message: t('Maxsulot optom narxi'),
            },
            {
                value: minimumCount,
                message: t('Maxsulot minimal miqdori'),
            },
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                product: {
                    ...currentProduct,
                    name: nameOfProduct.replace(/\s+/g, ' ').trim(),
                    code: codeOfProduct,
                    category: categoryOfProduct.value,
                    unit: unitOfProduct.value,
                    priceid: currentProduct.price._id,
                    productdata: currentProduct.productdata._id,
                    incomingprice: priceOfProductUsd,
                    sellingprice: sellingPriceOfProductUsd,
                    incomingpriceuzs: priceOfProduct,
                    sellingpriceuzs: sellingPriceOfProduct,
                    total: numberOfProduct,
                    barcode: checkOfProduct,
                    tradeprice: tradePrice,
                    tradepriceuzs: tradePriceUzs,
                    minimumcount: minimumCount,
                    width: productWidth,
                },
                currentPage,
                countPage: showByTotal,
                search: {
                    name: searchByName.replace(/\s+/g, ' ').trim(),
                    code: searchByCode.replace(/\s+/g, ' ').trim(),
                    category: searchByCategory.replace(/\s+/g, ' ').trim(),
                },
            }
            dispatch(updateProduct(body)).then(({error}) => {
                if (!error) {
                    clearForm()
                    setStickyForm(false)
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
                    dispatch(getProducts(body)).then(() => {
                        document
                            .querySelector(`#${tableRowId}`)
                            .scrollIntoView({block: 'center'})
                    })
                }
            })
        }
    }

    // excel
    const readExcel = (file) => {
        const fileTypes = ['xls', 'xlsx']
        if (fileTypes.includes(file.name.split('.').pop())) {
            setImportLoading(true)
            new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.readAsArrayBuffer(file)

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result

                    const wb = XLSX.read(bufferArray, {
                        type: 'buffer',
                    })

                    const wsname = wb.SheetNames[0]

                    const ws = wb.Sheets[wsname]

                    const data = XLSX.utils.sheet_to_json(ws)

                    resolve(data)
                }

                fileReader.onerror = (error) => {
                    universalToast('Ошибка при загрузке файла', 'error')
                    reject(error)
                }
            }).then((data) => {
                if (data.length > 0) {
                    setExcelData(data)
                    setModalBody('import')
                    toggleModal()
                } else {
                    universalToast('Jadvalda ma`lumot mavjud emas', 'error')
                }
                setImportLoading(false)
            })
        } else {
            universalToast("Fayl formati noto'g'ri", 'error')
        }
    }

    // table edit and delete
    const handleEditProduct = (ident, product) => {
        setTableRowId(ident)
        setCurrentProduct(product)
        setStickyForm(true)
    }
    const handleDeleteProduct = (product) => {
        const body = {
            ...product,
            currentPage,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim(),
                code: searchByCode.replace(/\s+/g, ' ').trim(),
                category: searchByCategory.replace(/\s+/g, ' ').trim(),
            },
            name: nameOfProduct.replace(/\s+/g, ' ').trim(),
            productdata: product.productdata._id,
        }
        // warningDeleteProduct()
        setDeletedProduct(body)
        setModalBody('approve')
        toggleModal()
    }
    const handleClickApproveToDelete = () => {
        dispatch(deleteProduct(deletedProduct)).then(({error}) => {
            if (!error) {
                handleClickCancelToDelete()
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
            }
        })
    }
    const handleClickCancelToDelete = () => {
        setModalVisible(false)
        setDeletedProduct(null)
        setTimeout(() => {
            setModalBody(null)
        }, 500)
    }
    const handleClickApproveToImport = () => {
        const oldKeys = Object.keys(excelData[0])
        const newData = map(createdData, (item) => {
            const newItem = {}
            for (const key in item) {
                newItem[key] = item[key]
            }
            return newItem
        })
        newData.forEach((item) =>
            oldKeys.forEach(
                (key) => item.hasOwnProperty(key) && delete item[key]
            )
        )
        const body = {
            products: [...newData],
            currentPage,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim(),
                code: searchByCode.replace(/\s+/g, ' ').trim(),
                category: searchByCategory.replace(/\s+/g, ' ').trim(),
            },
        }
        dispatch(addProductsFromExcel(body)).then(({error}) => {
            if (!error) {
                handleClickCancelToImport()
                dispatch(getAllProducts())
            }
        })
    }
    const handleClickCancelToImport = () => {
        setModalVisible(false)
        setTimeout(() => {
            setModalBody(null)
        }, 500)
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
    const handleChangeProductWidth = ({target}) => {
        setProductWidth(Number(target.value))
    }
    const handleError = () => {
        universalToast(`${t("Mahsulot kodi o'qilmadi!")}`, 'warning')
    }
    const handleScan = (data) => {
        setCheckOfProduct(data.toString())
        const body = {
            code: data,
        }
        dispatch(getBarcode(body)).then(({error}) => {
            if (error) {
                return setNameOfProduct('')
            }
        })
    }

    const exportData = () => {
        let fileName = 'Maxsulotlar'
        const exportHeader = [
            t('№'),
            t('Shtrix kodi'),
            t('Mahsulot kategoriyasi'),
            t('Mahsulot kodi'),
            t('Mahsulot nomi'),
            t('Soni'),
            t("O'lchov birligi"),
            t('Kelish narxi USD'),
            t('Kelish narxi UZS'),
            t('Sotish narxi USD'),
            t('Sotish narxi UZS'),
            t('Optom narxi USD'),
            t('Optom narxi UZS'),
            t('Minimum qiymat'),
            t('ID'),
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
                        total: item?.total || '',
                        unit: item?.unit?.name || '',
                        incomingprice: item?.price?.incomingprice || '',
                        incomingpriceuzs: item?.price?.incomingpriceuzs || '',
                        sellingprice: item?.price?.sellingprice || '',
                        sellingpriceuzs: item?.price?.sellingpriceuzs || '',
                        tradeprice: item?.price?.tradeprice || '',
                        tradepriceuzs: item?.price?.tradepriceuzs || '',
                        minimumcount: item?.minimumcount || '',
                        id: item?._id || '',
                    }))
                    exportExcel(newData, fileName, exportHeader)
                } else {
                    universalToast("Jadvalda ma'lumot mavjud emas !", 'warning')
                }
            }
        })
    }

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
        dispatch(getUnits())
        dispatch(getAllCategories())
        dispatch(getCurrency())
    }, [dispatch])
    useEffect(() => {
        setData(products)
    }, [products])
    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])
    useEffect(() => {
        if (currentProduct) {
            const {
                productdata: {name, code, barcode},
                unit,
                total,
                category,
                minimumcount,
                width,
                price: {
                    sellingprice,
                    incomingprice,
                    sellingpriceuzs,
                    incomingpriceuzs,
                    tradeprice,
                    tradepriceuzs,
                },
            } = currentProduct
            setCodeOfProduct(code)
            setNameOfProduct(name)
            setProductWidth(width)
            setNumberOfProduct(total)
            setUnitOfProduct({
                value: unit._id,
                label: unit.name,
            })
            setCategoryOfProduct({
                value: category._id,
                label: `${category.code} - ${category.name}`,
            })
            setPriceOfProduct(incomingpriceuzs)
            setSellingPriceOfProduct(sellingpriceuzs)
            setPriceOfProductsUsd(incomingprice)
            setSellingPriceOfProductUsd(sellingprice)
            setCheckOfProduct(barcode ? barcode : '')
            setMinimumCount(minimumcount || 0)
            setTradePrice(tradeprice || 0)
            setTradePriceUzs(tradepriceuzs || 0)
        }
    }, [currentProduct])
    useEffect(() => {
        setUnitOptions(
            map(units, (unit) => ({
                value: unit._id,
                label: unit.name,
            }))
        )
    }, [units])
    useEffect(() => {
        setCategoryOptions(
            map(allcategories, (category) => ({
                value: category._id,
                label:
                    category.code +
                    `${category.name ? ` - ${category.name}` : ''}`,
            }))
        )
    }, [allcategories])
    useEffect(() => {
        if (lastProductCode) {
            setCodeOfProduct(lastProductCode)
            if (checkOfProduct.length === 0)
                categoryOfProduct?.label &&
                    setCheckOfProduct(
                        '47800' +
                            categoryOfProduct.label.slice(0, 3) +
                            lastProductCode
                    )
        }
        //    eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastProductCode])
    useEffect(() => {
        setSearchedData(searchedProducts)
    }, [searchedProducts])
    useEffect(() => {
        if (barcode) {
            setNameOfProduct(barcode.name)
        }
    }, [barcode])
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
            {importLoading && (
                <div className='fixed backdrop-blur-[2px] z-[50] top-0 left-0 right-0 bottom-0 bg-white-700 flex flex-col items-center justify-center w-full'>
                    <SmallLoader />
                </div>
            )}
            {loadingExcel && (
                <div className='fixed backdrop-blur-[2px] z-[100] left-0 top-0 right-0 bottom-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            {/* Modal */}
            <UniversalModal
                toggleModal={toggleModal}
                body={modalBody}
                headerText={
                    modalBody === 'approve' &&
                    t('Mahsulotni o`chirishni tasdiqlaysizmi?')
                }
                title={
                    modalBody === 'approve' &&
                    t('O`chirilgan mahsulotni tiklashning imkoni mavjud emas!')
                }
                approveFunction={
                    modalBody === 'approve'
                        ? handleClickApproveToDelete
                        : handleClickApproveToImport
                }
                closeModal={
                    modalBody === 'approve'
                        ? handleClickCancelToDelete
                        : handleClickCancelToImport
                }
                isOpen={modalVisible}
                excelData={excelData}
                headers={importHeaders}
                createdData={createdData}
                setCreatedData={setCreatedData}
            />
            {isMobile && (
                <button
                    onClick={() => setModalOpen(true)}
                    className='hover:bg-green-200 lg:ms-[20px] lg:mt-[10px] lg:mb-[60px] mt-[60px] bg-green-300 focus-visible:outline-none w-[90%]  m-auto lg:w-[200px] lg:h-[33px] h=[40px] createElement'
                >
                    {t("Yangi maxsulot qo'shish")}
                </button>
            )}
            {/* Form */}
            {!isMobile ? (
                <CreateProductForm
                    productWidth={productWidth}
                    handleChangeProductWidth={handleChangeProductWidth}
                    nameOfProduct={nameOfProduct}
                    unitOfProduct={unitOfProduct}
                    categoryOfProduct={categoryOfProduct}
                    codeOfProduct={codeOfProduct}
                    checkOfProduct={checkOfProduct}
                    tradePriceProcient={tradePriceProcient}
                    handleChangeTradePriceProcient={
                        handleChangeTradePriceProcient
                    }
                    handleChangeCheckOfProduct={handleChangeCheckOfProduct}
                    priceOfProduct={
                        currencyType === 'UZS'
                            ? priceOfProduct
                            : priceOfProductUsd
                    }
                    sellingPriceOfProduct={
                        currencyType === 'UZS'
                            ? sellingPriceOfProduct
                            : sellingPriceOfProductUsd
                    }
                    sellingPriceOfProcient={sellingPriceOfProcient}
                    numberOfProduct={numberOfProduct}
                    handleChangeSellingPriceOfProduct={
                        handleChangeSellingPriceOfProduct
                    }
                    handleChangeSellingPriceOfProcient={
                        handleChangeSellingPriceOfProcient
                    }
                    handleChangePriceOfProduct={handleChangePriceOfProduct}
                    handleChangeNumberOfProduct={handleChangeNumberOfProduct}
                    stickyForm={stickyForm}
                    clearForm={clearForm}
                    handleEdit={handleEdit}
                    addNewProduct={addNewProduct}
                    handleChangeCodeOfProduct={handleChangeCodeOfProduct}
                    handleChangeNameOfProduct={handleChangeNameOfProduct}
                    handleChangeUnitOfProduct={handleChangeUnitOfProduct}
                    handleChangeCategoryOfProduct={
                        handleChangeCategoryOfProduct
                    }
                    pageName={'products'}
                    unitOptions={unitOptions}
                    categoryOptions={categoryOptions}
                    searchBarcode={searchBarcode}
                    minimumCount={minimumCount}
                    handleChangeMinimumCount={handleChangeMinimumCount}
                    tradePrice={
                        currencyType === 'USD' ? tradePrice : tradePriceUzs
                    }
                    handleChangeTradePrice={handleChangeTradePrice}
                />
            ) : (
                modalOpen && (
                    <section className='absolute lg:h-[100vh]  w-[100%] bg-[white] z-50 top-0 left-0'>
                        <div className='flex justify-end p-[25px]'>
                            <VscChromeClose
                                onClick={() => setModalOpen(false)}
                                className='cursor-pointer text-3xl'
                            />
                        </div>
                        <CreateProductForm
                            nameOfProduct={nameOfProduct}
                            unitOfProduct={unitOfProduct}
                            categoryOfProduct={categoryOfProduct}
                            codeOfProduct={codeOfProduct}
                            checkOfProduct={checkOfProduct}
                            productWidth={productWidth}
                            handleChangeProductWidth={handleChangeProductWidth}
                            tradePriceProcient={tradePriceProcient}
                            handleChangeTradePriceProcient={
                                handleChangeTradePriceProcient
                            }
                            handleChangeCheckOfProduct={
                                handleChangeCheckOfProduct
                            }
                            priceOfProduct={
                                currencyType === 'UZS'
                                    ? priceOfProduct
                                    : priceOfProductUsd
                            }
                            sellingPriceOfProduct={
                                currencyType === 'UZS'
                                    ? sellingPriceOfProduct
                                    : sellingPriceOfProductUsd
                            }
                            sellingPriceOfProcient={sellingPriceOfProcient}
                            numberOfProduct={numberOfProduct}
                            handleChangeSellingPriceOfProduct={
                                handleChangeSellingPriceOfProduct
                            }
                            handleChangeSellingPriceOfProcient={
                                handleChangeSellingPriceOfProcient
                            }
                            handleChangePriceOfProduct={
                                handleChangePriceOfProduct
                            }
                            handleChangeNumberOfProduct={
                                handleChangeNumberOfProduct
                            }
                            stickyForm={stickyForm}
                            clearForm={clearForm}
                            handleEdit={handleEdit}
                            addNewProduct={addNewProduct}
                            handleChangeCodeOfProduct={
                                handleChangeCodeOfProduct
                            }
                            handleChangeNameOfProduct={
                                handleChangeNameOfProduct
                            }
                            handleChangeUnitOfProduct={
                                handleChangeUnitOfProduct
                            }
                            handleChangeCategoryOfProduct={
                                handleChangeCategoryOfProduct
                            }
                            pageName={'products'}
                            unitOptions={unitOptions}
                            categoryOptions={categoryOptions}
                            searchBarcode={searchBarcode}
                            minimumCount={minimumCount}
                            handleChangeMinimumCount={handleChangeMinimumCount}
                            tradePrice={
                                currencyType === 'USD'
                                    ? tradePrice
                                    : tradePriceUzs
                            }
                            handleChangeTradePrice={handleChangeTradePrice}
                        />
                    </section>
                )
            )}

            {isMobile ? (
                <div
                    className={
                        'flex lg:mt-[-113px] pl-[20px] mt-0 flex-wrap lg:justify-start justify-center lg:ms-[200px] items-center mainPadding'
                    }
                >
                    <div className={'flex gap-[1rem] ms-[1rem]  mb-[15px] '}>
                        <ExportBtn onClick={exportData} />
                        <ImportBtn readExcel={readExcel} />
                        {isMobile ? (
                            <button
                                onClick={() => setFilterModal(true)}
                                className='hover:bg-blue-200  bg-blue-400 focus-visible:outline-none w-[90px] h-[33px]  createElement'
                            >
                                <FaFilter /> {t('izlash')}
                            </button>
                        ) : null}
                    </div>
                </div>
            ) : (
                <div className={'flex px-4 py-2 gap-2'}>
                    <ExportBtn onClick={exportData} />
                    <ImportBtn readExcel={readExcel} />
                    {isMobile ? (
                        <button
                            onClick={() => setFilterModal(true)}
                            className='hover:bg-blue-200  bg-blue-400 focus-visible:outline-none w-[90px] h-[33px]  createElement'
                        >
                            <FaFilter /> {t('izlash')}
                        </button>
                    ) : null}
                </div>
            )}
            {filterModal ? (
                <div className='absolute lg:p-[50px] w-[100vw]  h-[100vh]  flex justify-evenly flex-wrap items-center  top-0	left-0 z-50 bg-[white]	'>
                    <VscChromeClose
                        onClick={() => setFilterModal(false)}
                        className=' absolute right-[20px]  top-[20px]  text-4xl cursor-pointer'
                    />
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
                        filterByBarcodeWhenPressEnter={
                            filterByBarcodeWhenPressEnter
                        }
                    />
                    <button
                        onClick={() => {
                            setFilterModal(false)
                        }}
                        className='d-block  hover:bg-green-200  bg-green-400 mt-[-200px] lg:mt-[25px] focus-visible:outline-none w-[150px] h-[40px] createElement '
                    >
                        <FaFilter /> {t('izlash')}
                    </button>
                </div>
            ) : null}
            <span className='flex items-center  mb-3 ml-2 '>
                <div className='lg:mt-[30px]'>
                    <SelectForm
                        label={'mas'}
                        key={'total_1'}
                        onSelect={filterByTotal}
                    />
                </div>
                {!isMobile ? (
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
                        filterByBarcodeWhenPressEnter={
                            filterByBarcodeWhenPressEnter
                        }
                    />
                ) : null}
            </span>

            <div className='lg:p-[20px] p-0'>
                {loading ? (
                    <Spinner />
                ) : data.length === 0 && searchedData.length === 0 ? (
                    <NotFind text={'Maxsulot mavjud emas'} />
                ) : isMobile ? (
                    <TableMobile
                        currencyType={currencyType}
                        headers={headers}
                        Edit={handleEditProduct}
                        Delete={handleDeleteProduct}
                        page={'product'}
                        data={searchedData.length > 0 ? searchedData : data}
                        Sort={filterData}
                        sortItem={sorItem}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        currency={currencyType}
                        modalOpen={setModalOpen}
                    />
                ) : (
                    <Table
                        currencyType={currencyType}
                        headers={headers}
                        Edit={handleEditProduct}
                        Delete={handleDeleteProduct}
                        page={'product'}
                        data={searchedData.length > 0 ? searchedData : data}
                        Sort={filterData}
                        sortItem={sorItem}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        currency={currencyType}
                        modalOpen={setModalOpen}
                    />
                )}
            </div>
            <div className='flex justify-center mb-[10px] mt-[20px]'>
                {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                    <Pagination
                        countPage={Number(showByTotal)}
                        totalDatas={totalSearched || filteredDataTotal}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
            <BarcodeReader onError={handleError} onScan={handleScan} />
        </motion.section>
    )
}

export default Products
