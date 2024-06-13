import React, {useEffect} from 'react'
import LineChart from '../../Components/LineChart/LineChart.js'
import DailyCircle from '../../Components/DailyCircle/DailyCircle.js'
import {useDispatch, useSelector} from 'react-redux'
import {getMonthlyReport, getReports} from '../Reports/reportsSlice.js'
import {getCurrency} from '../Currency/currencySlice.js'
import {useTranslation} from 'react-i18next'
import {map} from 'lodash'
import PieChart from '../../Components/PieChart/PieChart.js'
import './MainPage.scss'

function MainPage() {
    const {t} = useTranslation(['common'])
    const months = [
        t('Yanvar'),
        t('Fevral'),
        t('Mart'),
        t('Aprel'),
        t('May'),
        t('Iyun'),
        t('Iyul'),
        t('Avgust'),
        t('Sentabr'),
        t('Oktabr'),
        t('Noyabr'),
        t('Dekabr'),
    ]
    const dispatch = useDispatch()
    const {reports, monthlyReport} = useSelector((state) => state.reports)
    const {currencyType} = useSelector((state) => state.currency)
    const filterMonthlyReport = () => {
        return monthlyReport
            ? currencyType === 'USD'
                ? map(monthlyReport.salesSum, (item) => item.usd)
                : map(monthlyReport.salesSum, (item) => item.uzs)
            : []
    }
    const filterMonthlyReportCount = () => {
        const arr = filterMonthlyReport()
        return arr.length > 0 ? arr[arr.length - 1].toLocaleString('ru-Ru') : 0
    }
    useEffect(() => {
        const body = {
            startDate: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
            ).toISOString(),
            endDate: new Date().toISOString(),
        }
        dispatch(getReports(body))
        dispatch(getCurrency())
        dispatch(getMonthlyReport())
    }, [dispatch])
    return (
        <section
            className={
                ' mt-[30px]  flex  flex-col gap-[5rem] overflow-y-auto '
            }
        >
            <div className={'circle-mobile flex lg:justify-center p-[30px]  gap-[3.1rem]'}>
                <DailyCircle
                    text={reports?.sale?.salecount}
                    label={t('Sotuvlar soni')}
                />
                <DailyCircle
                    nth={1}
                    text={
                        currencyType === 'UZS'
                            ? reports?.sale?.saleuzs?.toLocaleString('ru-Ru')
                            : reports?.sale?.sale?.toLocaleString('ru-Ru')
                    }
                    label={t('Sotuv summasi')}
                />
                <DailyCircle
                    nth={2}
                    text={
                        currencyType === 'UZS'
                            ? reports?.income?.incomeuzs?.toLocaleString(
                                  'ru-Ru'
                              )
                            : reports?.income?.income?.toLocaleString('ru-Ru')
                    }
                    label={t('Sof foyda')}
                />
                <DailyCircle
                    nth={3}
                    text={
                        currencyType === 'UZS'
                            ? reports?.expenses?.expensesuzs?.toLocaleString(
                                  'ru-Ru'
                              )
                            : reports?.expenses?.expenses?.toLocaleString(
                                  'ru-Ru'
                              )
                    }
                    label={t('Xarajatlar')}
                />
            </div>
            <div className={'h-[25rem] p-[20px]  mt-[-100px]  lg:mt-[0px]'}>
                <LineChart
                    label={[
                        t('Oylik sotuvlar soni'),
                        `${months[new Date().getMonth()]} : ${
                            monthlyReport?.sales.length > 0
                                ? monthlyReport.sales[
                                      monthlyReport.sales.length - 1
                                  ]
                                : 0
                        }`,
                    ]}
                    arr={monthlyReport?.sales}
                />
            </div>
            <div className={'flex p-[20px] lg:flex-nowrap flex-wrap gap-[5%] h-[25rem]'}>
                <div className={'lg:w-[60%] w-[100%] h-[25rem] mb-8'}>
                    <LineChart
                        label={[
                            t('Oylik sotuvlar summasi'),
                            `${
                                months[new Date().getMonth()]
                            } : ${filterMonthlyReportCount()} ${currencyType}`,
                        ]}
                        arr={filterMonthlyReport()}
                    />
                </div>
                <div className={'lg:w-[30%] w-[50rem] h-[25rem]  pb-5'}>
                    <PieChart
                        arr={[
                            currencyType === 'UZS'
                                ? monthlyReport?.monthExpense?.uzs
                                : monthlyReport?.monthExpense?.usd,
                            currencyType === 'UZS'
                                ? monthlyReport?.monthProfit?.uzs
                                : monthlyReport?.monthProfit?.usd,
                        ]}
                    />
                </div>
            </div>
        </section>
    )
}

export default MainPage
