import {t} from 'i18next'
import {map} from 'lodash'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {exportExcel, universalSort} from '../../App/globalFunctions'
import ExportBtn from '../../Components/Buttons/ExportBtn'
import SelectInput from '../../Components/SelectInput/SelectInput'
import Table from '../../Components/Table/Table'
import TableMobile from '../../Components/Table/TableMobile'
import {universalToast} from '../../Components/ToastMessages/ToastMessages'
import {getMinimumProducts} from './productreportSlice'

const ProductMinimum = () => {
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
    const dispatch = useDispatch()
    const {currencyType} = useSelector((state) => state.currency)
    const {minimumproducts} = useSelector((state) => state.productReport)

    const [currentData, setCurrentData] = useState([])
    const [storageData, setStorageData] = useState([])
    const [categories, setCategories] = useState([])
    const [sorItem, setSorItem] = useState({
        filter: '',
        sort: '',
        count: 0
    })

    const headers = [
        {title: t('№')},
        {
            filter: 'productdata.barcode',
            title: t('Shtrix kodi')
        },
        {
            title: t('Kategoriyasi'),
            filter: t('category.code')
        },
        {title: t('Kodi'), filter: 'productdata.code'},
        {title: t('Nomi'), filter: 'productdata.name'},
        {
            title: t('Soni'),
            filter: 'total'
        },
        {
            title: t('Olish'),
            filter:
                currencyType === 'UZS'
                    ? 'price.incomingpriceuzs'
                    : 'price.incomingprice'
        },
        {
            title: t('Sotish'),
            filter:
                currencyType === 'UZS'
                    ? 'price.sellingpriceuzs'
                    : 'price.sellingprice'
        },
        {
            title: t('Optom'),
            filter:
                currencyType === 'UZS'
                    ? 'price.tradeprice'
                    : 'price.tradepriceuzs'
        },
        {
            title: t('Minimum qiymat'),
            filter: 'minimumcount',
            styles: 'w-[5%]'
        }
    ]

    const exportData = () => {
        let fileName = 'Kam qolgan mahsulotlar'
        const exportHeader = [
            t('№'),
            t('Shtrix kodi'),
            t('Mahsulot kategoriyasi'),
            t('Mahsulot kodi'),
            t('Mahsulot nomi'),
            t('Soni'),
            t('O\'lchov birligi'),
            t('Kelish narxi USD'),
            t('Kelish narxi UZS'),
            t('Sotish narxi USD'),
            t('Sotish narxi UZS'),
            t('Optom narxi USD'),
            t('Optom narxi UZS'),
            t('Minimum qiymat')
        ]
        if (minimumproducts?.length > 0) {
            const newData = map(minimumproducts, (item, index) => ({
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
                minimumcount: item?.minimumcount || ''
            }))
            exportExcel(newData, fileName, exportHeader)
        } else {
            universalToast('Jadvalda ma\'lumot mavjud emas !', 'warning')
        }
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
                        currentData,
                        setCurrentData,
                        filterKey,
                        1,
                        storageData
                    )
                    break
                case 2:
                    setSorItem({
                        filter: filterKey,
                        sort: '',
                        count: 0
                    })
                    universalSort(
                        currentData,
                        setCurrentData,
                        filterKey,
                        '',
                        storageData
                    )
                    break
                default:
                    setSorItem({
                        filter: filterKey,
                        sort: '-1',
                        count: 1
                    })
                    universalSort(
                        currentData,
                        setCurrentData,
                        filterKey,
                        -1,
                        storageData
                    )
            }
        } else {
            setSorItem({
                filter: filterKey,
                sort: '-1',
                count: 1
            })
            universalSort(
                currentData,
                setCurrentData,
                filterKey,
                -1,
                storageData
            )
        }
    }

    const selectCategory = (e) => {
        if (e.value === 'all') {
            setCurrentData(minimumproducts)
            setStorageData(minimumproducts)
        } else {
            const data = minimumproducts.filter(
                (product) => product.category._id === e.value
            )
            setStorageData(data)
            setCurrentData(data)
        }
    }

    useEffect(() => {
        dispatch(getMinimumProducts())
    }, [dispatch])

    useEffect(() => {
        setStorageData(minimumproducts)
        setCurrentData(minimumproducts)
        let categoriesData = []
        minimumproducts.forEach((product) => {
            const {category} = product
            const obj = {
                label: category.code + ' - ' + category.name,
                value: category._id
            }
            if (categoriesData.length > 0) {
                if (
                    !categoriesData.some(
                        (categ) => categ.value === category._id
                    )
                ) {
                    categoriesData.push(obj)
                }
            } else {
                categoriesData.push(obj)
            }
        })
        setCategories([
            {
                label: `${t('Hammasi')}`,
                value: 'all'
            },
            ...categoriesData
        ])
    }, [minimumproducts])

    return minimumproducts.length > 0 ? (
        <div className='pt-[1rem]'>
            <div className='flex items-center justify-center mainPadding'>

            </div>
            {currentData.length && (
                <div className='flex lg:justify-start items-center lg:ps-[20px] justify-evenly gap-3 '>
                    <ExportBtn onClick={exportData} />
                    <span className=''>
                    <SelectInput
                        placeholder={t('Kategoriya')}
                        options={categories}
                        onSelect={selectCategory}
                    />
                    </span>
                </div>
            )}

            {currentData.length > 0 && (
                <div className='mt-3 lg:p-4'>{
                    !isMobile ? <Table
                            currencyType={currencyType}
                            headers={headers}
                            page={'product'}
                            data={currentData}
                            Sort={filterData}
                            sortItem={sorItem}
                            currency={currencyType}
                            productminimumpage={true}
                        /> :
                        <TableMobile
                            currencyType={currencyType}
                            headers={headers}
                            page={'productMinimum'}
                            data={currentData}
                            Sort={filterData}
                            sortItem={sorItem}
                            currency={currencyType}
                            productminimumpage={true}
                        />
                }
                </div>
            )}
        </div>
    ) : (
        <div className='flex items-center justify-center pt-[2rem]'>
            <p className='product_name text-center'>
               `${t("Kam qolgan mahsulotlar mavjud emas...")}`
            </p>
        </div>
    )
}

export default ProductMinimum
