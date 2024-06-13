import React, {useEffect, useState} from 'react'
import Exchanges from '../../Components/Card/Exchanges'
import LabelSearchInput from '../../Components/Inputs/LabelSearchInput'
import FilialCard from '../../Components/Card/FilialCard'
import {IoPaperPlane} from 'react-icons/io5'
import UniversalModal from '../../Components/Modal/UniversalModal'
import NotFind from '../../Components/NotFind/NotFind'
import {filter, map} from 'lodash'
import {
    emptyProductExchanges,
    productExchangesFilial,
    productNumberExchanges,
    productNumberMinusExchanges,
    universalToast,
    warningSellingExchanges
} from '../../Components/ToastMessages/ToastMessages'
import {sendingFilial, setFilialDatas} from './productExchangesSlice'
import {useDispatch, useSelector} from 'react-redux'
import {getProducts} from './../Incomings/incomingSlice'
import SmallLoader from '../../Components/Spinner/SmallLoader'
import {motion} from 'framer-motion'
import socket from '../../Config/socket.js'
import SelectInput from '../../Components/SelectInput/SelectInput'
import {t} from 'i18next'

function ProductExchanges() {
    const dispatch = useDispatch()

    const {filialDatas, loading} = useSelector((state) => state.exchanges)

    const {products} = useSelector((state) => state.incoming)

    const {currencyType} = useSelector((state) => state.currency)

    const {market} = useSelector((state) => state.login)

    const [filialNameSearch, setFilialNameSearch] = useState('')
    const [filialProductNameSearch, setFilialProductNameSearch] = useState('')
    const [filialProductCodeSearch, setFilialProductCodeSearch] = useState('')
    const [productData, setProductData] = useState([])
    const [filialData, setFilialData] = useState([])
    const [filialInformation, setFilialInformation] = useState('')
    const [activeFilial, setActiveFilial] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [dataObject, setDataObject] = useState('')
    const [sellingProductData, setSellingProductData] = useState([])
    const [arrAdded, setArrAdded] = useState([])
    const [approveModal, setApproveModal] = useState('')
    const [filteredFilials, setFilteredFilials] = useState([
        ...sellingProductData
    ])
    const [filteredFilialNames, setFilteredFilialNames] = useState([
        ...filialData
    ])
    const [selectProductValue, setSelectProductValue] = useState('')

    const handleFilial = (e) => {
        setFilialInformation(e)
        setActiveFilial(e.id)
    }

    const toggleModal = () => setModalVisible(!modalVisible)

    const productModal = (e) => {
        let obj = {...e}
        setSelectProductValue({
            label: e.label,
            value: e.label
        })
        setApproveModal('modal1')
        delete obj.label
        delete obj.value
        setDataObject(obj)
        toggleModal()
    }

    const productModal2 = (e) => {
        setApproveModal('modal2')
        setDataObject(e)
        toggleModal()
    }

    const handleClickCancelToDelete = () => {
        setModalVisible(false)
    }

    const approveFilialData = (e, numberError) => {
        if (e.number > 0 && e.get !== '' && e.sell !== '') {
            setProductData(
                (current) =>
                    current &&
                    map(current, (obj) => {
                        if (obj.id === e.id && numberError) {
                            return {
                                ...obj,
                                number: obj.number - Number(e.number)
                            }
                        }
                        return obj
                    })
            )
        }

        const foundProduct = sellingProductData.findIndex(
            (product) => product.id === e.id
        )
        if (
            foundProduct === -1 &&
            e.get < e.sell &&
            e.number > 0 &&
            e.get !== '' &&
            e.sell !== '' &&
            numberError
        ) {
            arrAdded.push(e.id)
            sellingProductData.push(e)
            handleClickCancelToDelete()
        } else if (e.get >= e.sell) {
            warningSellingExchanges()
        } else if (e?.number === '' || e?.get === '' || e?.sell === '') {
            emptyProductExchanges()
        } else if (!numberError) {
            productNumberExchanges()
        } else if (e.number < 0) {
            productNumberMinusExchanges()
        } else {
            setSellingProductData((current) => {
                return map(current, (obj) => {
                    if (obj?.id === e.id) {
                        return {
                            ...obj,
                            get: e.get,
                            sell: e.sell,
                            number: obj.number + Number(e.number),
                            getUSD: e.getUSD,
                            sellUSD: e.sellUSD
                        }
                    }
                    return obj
                })
            })
            handleClickCancelToDelete()
        }
    }

    const deletedProducts = (e) => {
        setProductData(
            (current) =>
                current &&
                map(current, (obj) => {
                    if (obj.id === e.id) {
                        return {
                            ...obj,
                            number: obj.number + Number(e.number)
                        }
                    }
                    return obj
                })
        )
        const arrSelling = filter(sellingProductData, (obj) => {
            return obj !== e
        })
        setSellingProductData(arrSelling)
        const deletedCode = filter(arrAdded, (obj) => {
            return obj !== e.id
        })
        setArrAdded(deletedCode)
    }

    const returnedDatas = (e, numberError) => {
        if (e.number > 0 && e.get !== '' && e.sell !== '') {
            setProductData(
                (current) =>
                    current &&
                    map(current, (obj) => {
                        if (obj.id === e.id && numberError) {
                            return {
                                ...obj,
                                number: obj.number + Number(e.number)
                            }
                        }
                        return obj
                    })
            )
        }

        setSellingProductData(
            (current) =>
                current &&
                map(current, (obj) => {
                    if (obj.number === Number(e.number)) {
                        const SellingNumberIndex = filter(arrAdded, (info) => {
                            return info !== e.id
                        })
                        setArrAdded(SellingNumberIndex)
                    }
                    if (obj.id === e.id && numberError) {
                        return {
                            ...obj,
                            get: e.get,
                            getUSD: e.getUSD,
                            sell: e.sell,
                            sellUSD: e.sellUSD,
                            number: obj.number - Number(e.number)
                        }
                    }
                    return obj
                })
        )

        handleClickCancelToDelete()
    }

    const filteredFilialName = (value) => {
        setFilialNameSearch(value)
        if (isNaN(value)) {
            return setFilteredFilialNames(
                filter(filialData, (item) =>
                    item.filialName.toLowerCase().includes(value.toLowerCase())
                )
            )
        } else {
            setFilteredFilialNames(filialData)
        }
    }

    const filterFilialProducts = (key, value) => {
        if (key === 'name') {
            setFilialProductNameSearch(value)
            if (isNaN(value)) {
                if (filialProductCodeSearch.trim() !== '') {
                    return setFilteredFilials(
                        filter(
                            sellingProductData,
                            (item) =>
                                item.name
                                    .toLowerCase()
                                    .includes(value.toLowerCase().trim()) &&
                                item.code.includes(
                                    filialProductCodeSearch.trim()
                                )
                        )
                    )
                } else {
                    return setFilteredFilials(
                        filter(sellingProductData, (item) =>
                            item.name
                                .toLowerCase()
                                .includes(value.toLowerCase())
                        )
                    )
                }
            } else {
                setFilteredFilials(sellingProductData)
            }
        } else {
            let searchedVal = value.trim()
            setFilialProductCodeSearch(value)
            if (searchedVal) {
                if (isNaN(filialProductNameSearch)) {
                    return setFilteredFilials(
                        filter(
                            sellingProductData,
                            (item) =>
                                item.code.includes(value) &&
                                item.name
                                    .toLowerCase()
                                    .includes(
                                        filialProductNameSearch
                                            .toLowerCase()
                                            .trim()
                                    )
                        )
                    )
                } else {
                    return setFilteredFilials(
                        filter(sellingProductData, (item) =>
                            item.code.includes(value)
                        )
                    )
                }
            } else {
                setFilteredFilials(sellingProductData)
            }
        }
    }

    const sendingFilialProduct = () => {
        const sendData =
            sellingProductData &&
            map(sellingProductData, (item) => {
                return {
                    _id: item.id,
                    total: item.number,
                    minimumcount: item.minimumcount,
                    productdata: {
                        _id: item.productDataId,
                        name: item.name,
                        code: item.code,
                        barcode: item.barcode
                    },
                    unit: {
                        _id: item.unidId,
                        name: item.unitName
                    },
                    category: {
                        _id: item.categoryId,
                        code: item.categoryCode
                    },
                    price: {
                        incomingprice: item.getUSD,
                        incomingpriceuzs: item.get,
                        sellingprice: item.sellUSD,
                        sellingpriceuzs: item.sell,
                        tradeprice: item.tradeprice,
                        tradepriceuzs: item.tradepriceuzs
                    }
                }
            })
        const body = {
            filial: filialInformation.id,
            products: sendData
        }
        if (filialInformation && sendData.length > 0) {
            dispatch(sendingFilial(body)).then((data) => {
                if (data.meta.requestStatus === 'fulfilled') {
                    universalToast(
                        'Maxsulot muvaffaqiyatli o\'tkazildi!',
                        'success'
                    )
                    setSellingProductData([])
                    setArrAdded([])
                    setFilialInformation('')
                    setActiveFilial('')
                    setSelectProductValue('')
                }
            })
        } else {
            productExchangesFilial()
        }
    }
    useEffect(() => {
        market &&
        socket.emit('getAllFilials', {
            market: market._id
        })
        market &&
        socket.on('getAllFilials', ({id, filials}) => {
            id === market._id && dispatch(setFilialDatas(filials))
        })
        market &&
        socket.on('error', ({id, err}) => {
            id === market._id && universalToast(err.message, 'error')
        })
    }, [market, dispatch])
    useEffect(() => {
        dispatch(getProducts())
    }, [dispatch])
    useEffect(() => {
        const newUpdateProduct =
            products &&
            map(products, (item) => {
                return {
                    value: item._id,
                    label:
                        item.productdata.code + ' - ' + item.productdata.name,
                    id: item._id,
                    categoryId: item.category._id,
                    categoryCode: item.category.code,
                    get: item.price.incomingpriceuzs,
                    getUSD: item.price.incomingprice,
                    sell: item.price.sellingpriceuzs,
                    sellUSD: item.price.sellingprice,
                    unidId: item.unit._id,
                    unitName: item.unit.name,
                    code: item.productdata.code,
                    number: item.total,
                    name: item.productdata.name,
                    productDataId: item.productdata._id,
                    barcode: item.productdata?.barcode,
                    tradeprice: item.price?.tradeprice || 0,
                    tradepriceuzs: item.price?.tradepriceuzs || 0,
                    minimumcount: item.minimumcount || 0
                }
            })
        setProductData(newUpdateProduct)
    }, [products])
    useEffect(() => {
        setFilteredFilials(sellingProductData)
    }, [sellingProductData])
    useEffect(() => {
        const newUpdateFilialProduct = map(filialDatas, (obj) => {
            return {
                id: obj?._id,
                image: obj?.image,
                filialName: obj?.name,
                directorName: obj?.director?.firstname,
                directorLastName: obj?.director?.lastname
            }
        })
        setFilialData(newUpdateFilialProduct)
        setFilteredFilialNames(newUpdateFilialProduct)
    }, [filialDatas])
    useEffect(() => {
        const newSellingsData = filter(sellingProductData, (item) => {
            return item?.number !== 0
        })
        setSellingProductData(newSellingsData)
    }, [productData, sellingProductData])

    return (
        <>
            <UniversalModal
                toggleModal={toggleModal}
                body={'exchanges'}
                approveFunction={
                    approveModal === 'modal1'
                        ? approveFilialData
                        : approveModal === 'modal2'
                            ? returnedDatas
                            : ''
                }
                closeModal={handleClickCancelToDelete}
                isOpen={modalVisible}
                dataObject={dataObject}
            />
            {loading && (
                <div
                    className='fixed backdrop-blur-[2px] z-[100] left-0 top-0 right-0 bottom-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            <section className='flex h-full'>
                <div className='basis-2/3 border-r-[1px] border-r-[#A9C0EF] flex flex-col'>
                    <div className='mainPadding'>
                        <LabelSearchInput
                            labelText={t(`Filiallar`)}
                            placeholder={t('qidirish...')}
                            value={filialNameSearch}
                            onChange={(e) => filteredFilialName(e.target.value)}
                        />
                    </div>
                    <div className='grow relative'>
                        <div
                            className='absolute left-0 right-0 top-0 bottom-[1rem] overflow-auto pl-[2.5rem] pr-[1.25rem] pt-[1.25rem]'>
                            {filteredFilialNames.length === 0 ? (
                                <NotFind text={`${t('Filiallar mavjud emas!')}`} />
                            ) : (
                                map(filteredFilialNames, (item, index) => {
                                    return (
                                        <motion.div
                                            initial={{y: '100%'}}
                                            animate={{y: '0%'}}
                                            transition={{
                                                delay: 0,
                                                ease: 'linear'
                                            }}
                                            key={index}
                                            className='pb-[0.675rem] '
                                        >
                                            <FilialCard
                                                market={item}
                                                onClick={handleFilial}
                                                activeFilial={activeFilial}
                                            />
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
                <div className='basis-1/3 bg-white-700 flex flex-col'>
                    <div className='p-[1.25rem]'>
                        <div className='mb-[1.25rem] pt-[0.5rem]'>
                            <SelectInput
                                label={t('Mahsulotlar')}
                                placeholder={t('Mahsulotlar')}
                                options={productData}
                                onSelect={productModal}
                                value={selectProductValue}
                            />
                        </div>
                        <div className='flex justify-between gap-[1.25rem]'>
                            <div className='w-full'>
                                <LabelSearchInput
                                    labelText={t(`Kodi`)}
                                    placeholder={t('qidirish...')}
                                    value={filialProductCodeSearch}
                                    onChange={(e) =>
                                        filterFilialProducts(
                                            'code',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className='w-full'>
                                <LabelSearchInput
                                    labelText={t(`Nomi`)}
                                    placeholder={t('qidirish...')}
                                    value={filialProductNameSearch}
                                    onChange={(e) =>
                                        filterFilialProducts(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className='grow relative'>
                        <div
                            className='absolute left-0 right-0 top-0 bottom-[1rem] pl-[2rem] pr-[2rem] pb-[0.25rem] pt-[1.25rem] overflow-auto'>
                            {filteredFilials.length === 0 ? (
                                <NotFind text={`${t('Maxsulot o\'tkazilmagan')}`} />
                            ) : (
                                map(filteredFilials, (item, index) => {
                                    return (
                                        <motion.div
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            transition={{duration: 0.5}}
                                            key={index}
                                            className='pb-[0.675rem] '
                                        >
                                            <Exchanges
                                                dataObject={item}
                                                type='closeProduct'
                                                centerIcon={true}
                                                closeActive={true}
                                                onClick={deletedProducts}
                                                returnedFunction={productModal2}
                                                currency={currencyType}
                                                open={true}
                                            />
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                    <div className='p-[1.25rem] border-t-[0.3125rem] border-[#EFF4F2]'>
                        <div className={'flex gap-[0.625rem]'}>
                            <button
                                type={'button'}
                                className={'register-selling-right-accept-btn'}
                                onClick={sendingFilialProduct}
                            >
                                <IoPaperPlane
                                    size={'1.5rem'}
                                    className='text-white-900 mr-[0.675rem]'
                                />
                                {t("Jo'natish")}
                            </button>
                            {/* <button
                                type={'button'}
                                onClick={() => {}}
                                className={'register-selling-right-deny-btn'}
                            >
                                <IoAttach size={'1.5rem'} />
                            </button> */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProductExchanges
