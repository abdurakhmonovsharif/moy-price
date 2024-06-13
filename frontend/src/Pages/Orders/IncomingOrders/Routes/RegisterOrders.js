import React, {useEffect, useState} from 'react'
import FieldContainer from '../../../../Components/FieldContainer/FieldContainer'
import Table from '../../../../Components/Table/Table'
import {useDispatch, useSelector} from 'react-redux'
import SearchInput from '../../../../Components/Inputs/SearchInput.js'
import Spinner from '../../../../Components/Spinner/SmallLoader.js'
import {filter, map} from 'lodash'
import CategoryCard from '../../../../Components/CategoryCard/CategoryCard.js'
import NotFind from '../../../../Components/NotFind/NotFind.js'
import {IoAttach} from 'react-icons/io5'
import {useTranslation} from 'react-i18next'
import socket from '../../../../Config/socket.js'
import {
    universalToast,
    warningCurrencyRate,
    warningSaleProductsEmpty,
} from '../../../../Components/ToastMessages/ToastMessages.js'
import {
    sendingOrderProducts,
    setAllProductsPartner,
    setCategoriesPartner,
} from '../Slices/registerOrdersSlice.js'
import {roundUsd, roundUzs} from '../../../../App/globalFunctions.js'
import UniversalModal from '../../../../Components/Modal/UniversalModal.js'
import {useLocation, useNavigate} from 'react-router-dom'
import {
    createTemporaryOrder,
    deleteSavedOrder,
} from '../Slices/savedOrdersSlice.js'

function RegisterOrders() {
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const {currencyType, currency} = useSelector((state) => state.currency)
    const {loading} = useSelector((state) => state.connections)
    const {market} = useSelector((state) => state.login)
    const {categoriesPartner, allProductsPartner} = useSelector(
        (state) => state.registerIncomingOrders
    )

    const [currentPartner, setCurrentPartner] = useState(null)
    const [filteredCategories, setFilteredCategories] =
        useState(categoriesPartner)
    const headers = [
        {title: '№'},
        {
            title: 'Kodi',
        },
        {
            title: 'Nomi',
        },
        {title: 'Soni'},
        {title: 'Buyurtma'},
        {
            title: 'Yuborish',
            styles: 'w-[15%]',
        },
        {title: 'Narxi'},
        {title: 'Jami'},
        {
            styles: 'w-[10%]',
        },
        {},
    ]
    const [filteredProducts, setFilteredProducts] = useState([])
    const [activeCategory, setActiveCategory] = useState(null)
    const [searchCategory, setSearchCategory] = useState('')
    const [tableProducts, setTableProducts] = useState([])
    const [modalBody, setModalBody] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [temporary, setTemporary] = useState(null)
    const [sendingOrder, setSendingOrder] = useState(null)
    const [editOrder, setEditOrder] = useState(null)
    const [tableBody, setTableBody] = useState(null)

    const handleSearchCategory = (e) => {
        const str = e.target.value
        setSearchCategory(str)
        const searchedStr = str.replace(/\s+/g, ' ').trim()
        const filterData = filter(categoriesPartner, (obj) =>
            obj.name
                ? obj.name.toLowerCase().includes(searchedStr) ||
                  obj.code.includes(searchedStr)
                : obj.code.includes(searchedStr)
        )
        setFilteredCategories(str !== '' ? filterData : categoriesPartner)
    }
    const handleClickCategory = (id) => {
        if (activeCategory === id) {
            setActiveCategory(null)
        } else {
            setActiveCategory(id)
            setSearchCategory('')
            setFilteredCategories(categoriesPartner)
        }
    }
    const handleChangeSelectedProduct = (option) => {
        const hasProduct = option.barcode
            ? filter(
                  tableProducts,
                  (obj) => obj.product.barcode === option.barcode
              ).length > 0
            : filter(tableProducts, (obj) => obj.product._id === option.value)
                  .length > 0
        if (!hasProduct) {
            const product = option.barcode
                ? allProductsPartner.find(
                      (obj) => obj.productdata.barcode === option.barcode
                  )
                : allProductsPartner.find((obj) => obj._id === option.value)

            // if (product.total === 0) return warningCountSellPayment()
            const currentProduct = {
                market: currentPartner.value,
                product: {
                    _id: product._id,
                    code: product.productdata.code,
                    name: product.productdata.name,
                    barcode: product.productdata.barcode,
                },
                productdata: product.productdata._id,
                category: product.category._id,
                totalprice: product.price.sellingprice,
                totalpriceuzs: product.price.sellingpriceuzs,
                pieces: {revived: 0, send: 1, delivered: 0, returned: 0},
                total: product.total,
                unitprice: product.price.sellingprice,
                unitpriceuzs: product.price.sellingpriceuzs,
                incomingprice: product.price.incomingprice,
                incomingpriceuzs: product.price.incomingpriceuzs,
                unit: product.unit,
            }
            setTableProducts([...tableProducts, currentProduct])
        } else {
            universalToast(t("Maxsulot ro'yxatda mavjud !"), 'error')
        }
    }
    const increment = (id) => {
        const newRelease = map(tableProducts, (prevProduct) =>
            prevProduct.product._id === id
                ? {
                      ...prevProduct,
                      pieces: {
                          ...prevProduct.pieces,
                          send: Number(prevProduct.pieces.send) + 1,
                      },
                      totalprice: roundUsd(
                          (Number(prevProduct.pieces.send) + 1) *
                              prevProduct.unitprice
                      ),
                      totalpriceuzs: roundUzs(
                          (Number(prevProduct.pieces.send) + 1) *
                              prevProduct.unitpriceuzs
                      ),
                  }
                : prevProduct
        )
        setTableProducts(newRelease)
    }
    const decrement = (id) => {
        const newRelease = map(tableProducts, (prevProduct) =>
            prevProduct.product._id === id
                ? {
                      ...prevProduct,
                      pieces: {
                          ...prevProduct.pieces,
                          send:
                              Number(prevProduct.pieces.send) > 0
                                  ? Number(prevProduct.pieces.send) - 1
                                  : 0,
                      },
                      totalprice: roundUsd(
                          (Number(prevProduct.pieces.send) > 0
                              ? Number(prevProduct.pieces.send) - 1
                              : 0) * prevProduct.unitprice
                      ),
                      totalpriceuzs: roundUzs(
                          (Number(prevProduct.pieces.send) > 0
                              ? Number(prevProduct.pieces.send) - 1
                              : 0) * prevProduct.unitpriceuzs
                      ),
                  }
                : prevProduct
        )
        setTableProducts(newRelease)
    }
    const handleCountProduct = (e, id) => {
        const val = Number(e.target.value)
        const newRelease = map(tableProducts, (prevProduct) =>
            prevProduct.product._id === id
                ? {
                      ...prevProduct,
                      pieces: {
                          ...prevProduct.pieces,
                          send: val,
                      },
                      totalprice: roundUsd(val * prevProduct.unitprice),
                      totalpriceuzs: roundUzs(val * prevProduct.unitpriceuzs),
                  }
                : prevProduct
        )
        setTableProducts(newRelease)
    }
    const handleUnitPrice = (e, id) => {
        const val = Number(e.target.value)
        const unitprice = currencyType === 'USD' ? val : val / currency
        const unitpriceuzs = currencyType === 'UZS' ? val : val * currency
        const newRelease = map(tableProducts, (prevProduct) =>
            prevProduct.product._id === id
                ? {
                      ...prevProduct,
                      unitprice,
                      unitpriceuzs,
                      totalprice: roundUsd(prevProduct.pieces.send * unitprice),
                      totalpriceuzs: roundUzs(
                          prevProduct.pieces.send * unitpriceuzs
                      ),
                  }
                : prevProduct
        )
        setTableProducts(newRelease)
    }
    const handleDelete = (index) => {
        tableProducts.splice(index, 1)
        setTableProducts([...tableProducts])
    }
    const handleCloseModal = () => {
        setModalVisible(false)
        setTimeout(() => {
            setModalBody('')
        }, 500)
    }
    const handleClickOrder = () => {
        if (tableProducts.length) {
            setModalVisible(true)
            setModalBody('complete')
        } else {
            !currency ? warningCurrencyRate() : warningSaleProductsEmpty()
        }
    }
    const handleClickSave = () => {
        if (tableProducts.length > 0) {
            const all = tableProducts.reduce(
                (acc, cur) => roundUsd(acc + cur.totalprice),
                0
            )
            const allUzs = tableProducts.reduce(
                (acc, cur) => roundUzs(acc + cur.totalpriceuzs),
                0
            )
            const body = {
                temporary: {
                    partner: currentPartner,
                    tableProducts,
                    totalPrice: all,
                    totalPriceUzs: allUzs,
                },
            }
            dispatch(createTemporaryOrder(body)).then(({error}) => {
                if (!error) {
                    clearAll()
                    navigate('/dukonlar/buyurtma_berish/saqlanganlar')
                }
            })
            if (temporary) {
                dispatch(deleteSavedOrder({temporaryId: temporary._id}))
                setTemporary(null)
            }
        } else {
            universalToast(t("Maxsulotlar ro'yxati bo'sh!"), 'warning')
        }
    }
    const handleSendOrder = () => {
        if (tableProducts.length > 0) {
            const body = {
                products: tableProducts,
                orderId: editOrder?._id,
            }
            dispatch(sendingOrderProducts(body)).then(({error, payload}) => {
                if (!error) {
                    editOrder && setEditOrder(null)
                    setSendingOrder(payload)
                    setTimeout(() => {
                        setModalBody('checkOrder')
                        setModalVisible(true)
                        clearAll()
                    }, 500)
                    if (temporary) {
                        dispatch(deleteSavedOrder({temporaryId: temporary._id}))
                        setTemporary(null)
                    }
                }
            })
        } else {
            universalToast(t("Maxsulotlar ro'yxati bo'sh!"), 'warning')
        }
    }
    const clearAll = () => {
        setTableProducts([])
        setCurrentPartner(null)
    }

    useEffect(() => {
        let allProductsReducer = []
        let productsForSearch = []
        if (market && currentPartner) {
            socket.emit('getPartnerProducts', {
                market: currentPartner.value,
                partner: market._id,
            })
            socket.on('partnerCategories', ({id, categories}) => {
                if (id === currentPartner.value) {
                    dispatch(setCategoriesPartner(categories))
                    setFilteredCategories(categories)
                }
            })
            socket.on('setPartnerProducts', ({id, products}) => {
                if (id === currentPartner.value) {
                    productsForSearch = [
                        ...productsForSearch,
                        ...map(products, (product) => ({
                            value: product._id,
                            label: `(${product.total}) ${product.category.code}${product.productdata.code} - ${product.productdata.name}`,
                        })),
                    ]
                    setFilteredProducts(productsForSearch)
                    allProductsReducer.push(...products)
                    dispatch(setAllProductsPartner(allProductsReducer))
                }
            })
            socket.on('error', ({id, message}) => {
                id === market._id && universalToast(message, 'error')
            })
        }
    }, [market, dispatch, currentPartner])
    useEffect(() => {
        if (activeCategory) {
            const filteredData = filter(
                allProductsPartner,
                (product) => product.category._id === activeCategory
            )
            setFilteredProducts(
                map(filteredData, (product) => ({
                    value: product._id,
                    label: `(${product.total}) ${product.category.code}${product.productdata.code} - ${product.productdata.name}`,
                }))
            )
        } else {
            setFilteredProducts(
                map(allProductsPartner, (product) => ({
                    value: product._id,
                    label: `(${product.total}) ${product.category.code}${product.productdata.code} - ${product.productdata.name}`,
                }))
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory, allProductsPartner])
    useEffect(() => {
        const data = location.state
        if (data && data.order) {
            data.position === 'send' && setTableBody('incomingOrderSendProduct')
            setEditOrder(data?.order)
            setCurrentPartner({
                label:
                    data?.order?.market?.name +
                    ' - ' +
                    data?.order?.market?.inn,
                value: data?.order?.market?._id,
            })
            const products = map(data.order.products, (product) => {
                const hasSend = !!product?.pieces?.send
                return {
                    market: product?.market,
                    product: {
                        _id: product?.product?._id,
                        code: product?.product?.productdata?.code,
                        name: product?.product?.productdata?.name,
                        barcode: product?.product?.productdata?.barcode,
                    },
                    productdata: product.product?.productdata._id,
                    category: product.product?.category._id,
                    totalprice: hasSend
                        ? product?.totalprice
                        : product?.pieces?.recived * product?.unitprice,
                    totalpriceuzs: hasSend
                        ? product?.totalpriceuzs
                        : product?.pieces?.recived * product?.unitpriceuzs,
                    pieces: {
                        ...product?.pieces,
                        send: hasSend
                            ? product?.pieces?.send
                            : product?.pieces?.recived,
                    },
                    total: product.product?.total,
                    unitprice: product?.unitprice,
                    unitpriceuzs: product?.unitpriceuzs,
                    incomingprice: product?.product?.price?.incomingprice,
                    incomingpriceuzs: product?.product?.price?.incomingpriceuzs,
                    unit: product?.product?.unit,
                }
            })
            setTableProducts(products)
        }
        window.history.replaceState({}, document.title)
    }, [location.state])

    return (
        <section className={'flex grow relative overflow-auto'}>
            <UniversalModal
                body={modalBody}
                isOpen={modalVisible}
                headerText={
                    modalBody === 'complete'
                        ? 'Buyurtmani yuborishni tasdiqlaysizmi?'
                        : ''
                }
                toggleModal={handleCloseModal}
                approveFunction={handleSendOrder}
                order={sendingOrder}
            />
            <div className='flex flex-col grow gap-[1.25rem] overflow-auto'>
                <div className='mainPadding flex flex gap-[1.25rem]'>
                    <FieldContainer
                        select={true}
                        placeholder={''}
                        value={currentPartner || ''}
                        label={t('Do`kon nomi')}
                        onChange={(e) => setCurrentPartner(e)}
                        border={true}
                        disabled={true}
                    />
                    <FieldContainer
                        disabled={!currentPartner}
                        select={true}
                        placeholder={t('misol: kompyuter')}
                        value={''}
                        label={t('Maxsulotlar')}
                        onChange={handleChangeSelectedProduct}
                        options={filteredProducts}
                    />
                </div>
                <div className='tableContainerPadding'>
                    {!tableProducts.length ? (
                        <NotFind
                            text={t("Buyurtmaga mahsulotlar qo'shilmagan!...")}
                        />
                    ) : (
                        <Table
                            page={tableBody}
                            data={tableProducts}
                            headers={headers}
                            currency={currencyType}
                            increment={increment}
                            decrement={decrement}
                            handleDelete={handleDelete}
                            footer={'registersale'}
                            handleCountProduct={handleCountProduct}
                            handleUnitPrice={handleUnitPrice}
                        />
                    )}
                </div>
            </div>
            <div className='register-selling-right min-w-[20.25rem] bg-white-400 backdrop-blur-[3.125rem] rounded-[0.25rem] flex flex-col gap-[1.25rem]'>
                <div className='flex flex-col grow gap-[1.25rem]'>
                    <SearchInput
                        placeholder={t('kategoriyani qidirish...')}
                        value={searchCategory}
                        onChange={handleSearchCategory}
                        onKeyUp={() => {}}
                    />
                    <div className='grow relative overflow-auto'>
                        <div className='cards-container absolute left-0 right-[0.125rem] top-0 bottom-0'>
                            {loading ? (
                                <div className='tableContainerPadding'>
                                    <Spinner />
                                </div>
                            ) : filteredCategories.length > 0 ? (
                                map(filteredCategories, (category) => (
                                    <CategoryCard
                                        key={category._id}
                                        id={category._id}
                                        activeCategory={
                                            category._id === activeCategory
                                        }
                                        title={category.name}
                                        code={category.code}
                                        products={category.products.length}
                                        onClick={handleClickCategory}
                                    />
                                ))
                            ) : (
                                <NotFind text={t('Kategoriya mavjud emas')} />
                            )}
                        </div>
                    </div>
                </div>
                <div className={'flex gap-[0.625rem]'}>
                    <button
                        type={'button'}
                        className={'register-selling-right-accept-btn'}
                        onClick={handleClickOrder}
                    >
                        {t('Buyurtmani yuborish')}
                    </button>
                    {
                        <button
                            type={'button'}
                            onClick={handleClickSave}
                            className={'register-selling-right-deny-btn'}
                        >
                            <IoAttach size={'1.5rem'} />
                        </button>
                    }
                </div>
            </div>
        </section>
    )
}

export default RegisterOrders
