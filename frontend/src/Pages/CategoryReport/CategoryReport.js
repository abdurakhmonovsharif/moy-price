import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import LinkToBack from '../../Components/LinkToBack/LinkToBack.js'
import {useDispatch, useSelector} from 'react-redux'
import {getReportOfCategory} from './CategoryReportSlice.js'
import Table from '../../Components/Table/Table.js'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import {reduce} from 'lodash'
import {roundUsd, roundUzs} from '../../App/globalFunctions.js'
import TableMobile from '../../Components/Table/TableMobile.js'
import {t} from 'i18next'

const calculateTotal = (data) => {
    return reduce(data, (sum, item) => {
        return sum + item.total
    }, 0)
}

const calculateIncomings = (data, currency) => {

    if (currency === 'UZS') {
        return reduce(data, (sum, item) => {
            return sum + roundUzs(Number(item.price.incomingpriceuzs) * item.total)
        }, 0).toLocaleString('ru-RU')
    } else {
        return reduce(data, (sum, item) => {
            return sum + roundUsd(item.price.incomingprice * item.total)
        }, 0).toLocaleString('ru-RU')
    }
}
const calculateSellings = (data, currency) => {
    if (currency === 'UZS') {
        return reduce(data, (sum, item) => {
            return sum + roundUzs(item.price.sellingpriceuzs * item.total)
        }, 0).toLocaleString('ru-RU')
    } else {
        return reduce(data, (sum, item) => {
            return sum + roundUsd(item.price.sellingprice * item.total)
        }, 0).toLocaleString('ru-RU')
    }
}

function CategoryReport() {
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
    const headers = [
        {title: '№'},
        {title: t('Kodi')},
        {title: t('Nomi')},
        {title: t('Soni')},
        {title: t('Olish')},
        {title: t('Sotish')},
        {title: t('Sotilganlar soni')},
        {title: t('Sotilganlar jami')}]
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const {code} = useParams()
    const {products, loading} = useSelector(state => state.categoryReport)
    useEffect(() => {
        if (location.state) {
            dispatch(getReportOfCategory({
                categoryId: location.state.id,
                startDate: location.state.startDate,
                endDate: location.state.endDate
            }))
        } else {
            navigate(-1)
        }
    }, [dispatch, location.state, navigate])
    return (
        <section>
            <LinkToBack link={-1} />
            <div
                className={'mainPadding flex pl-[20px] mt-[-30px] flex-col pt-12 items-center border-2 border-[green] border-t-0 border-s-0 border-e-0'}>
            <span
                className={'font-medium text-xl text-blue-400'}>{code} {location?.state?.name && `- ${location?.state?.name}`}</span>
                <h2 className={'text-base text-black-800 mt-[5px]'}>
                    {t('kategoriya bo\'yicha hisobot')}</h2>
            </div>
            <div className={'mb-4 mt-3 pl-[2.5rem] pr-[1.25rem] flex items-center  lg:justify-center gap-[1rem]'}>
                <p className={'font-medium'}></p>
                <ul className={'lg:flex lg:justify-center justify-start gap-[1rem] '}>
                    <li className={'text-sm flex items-center gap-[0.5rem]'}>
                        <div className={'w-[0.5rem] h-[0.5rem] rounded-full bg-primary-700'}></div>
                        <span className={'font-medium'}>{t('Jami')}: {products.length} </span>
                    </li>
                    <li className={'text-sm flex items-center gap-[0.5rem]'}>
                        <div className={'w-[0.5rem] h-[0.5rem] rounded-full bg-warning-400'}></div>
                        <span className={'font-medium'}>{t('Soni')}: {calculateTotal(products)}</span>
                    </li>
                    <li className={'text-sm flex items-center gap-[0.5rem]'}>
                        <div className={'w-[0.5rem] h-[0.5rem] rounded-full bg-blue-400'}></div>
                        <span
                            className={'font-medium'}>{t('Olish')}: {calculateIncomings(products, 'UZS')} UZS {' / '} {calculateIncomings(products, 'USD')} USD</span>
                    </li>
                    <li className={'text-sm flex items-center gap-[0.5rem]'}>
                        <div className={'w-[0.5rem] h-[0.5rem] rounded-full bg-success-400'}></div>
                        <span
                            className={'font-medium'}>{t('Sotish')}: {calculateSellings(products, 'UZS')} UZS {' / '} {calculateSellings(products, 'USD')} USD</span>
                    </li>
                </ul>
            </div>

            {
                !isMobile ? <div className={'tableContainerPadding'}>
                        {
                            loading ? <Spinner /> : products.length > 0 ? <Table
                                page={'categoryreport'}
                                headers={headers}
                                data={products}
                            /> : <NotFind text={t('Maxsulot topilmadi')} />
                        }
                    </div> :
                    loading ? <Spinner /> : products.length > 0 ? <TableMobile
                        page={'categoryreport'}
                        headers={headers}
                        data={products}
                    /> : <NotFind text={t('Maxsulot topilmadi')} />

            }
        </section>
    )
}

export default CategoryReport