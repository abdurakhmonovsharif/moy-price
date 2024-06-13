import React from 'react'
import TotalReportDate from './TotalReportDate'
import TotalReportTable from './TotalReportTable'
import TotalReport from './TotalReport'
import PrintBtn from '../Buttons/PrintBtn'
import {useRef} from 'react'
import {useReactToPrint} from 'react-to-print'
import {useEffect} from 'react'
import {useState} from 'react'
import {roundUsd, roundUzs} from '../../App/globalFunctions'

const TotalReports = ({
    totalreports,
    productreport,
    incomingreport,
    saleproductsreport,
    currencyType,
}) => {
    const [loadContent, setLoadContent] = useState(false)
    const saleCheckRef = useRef(null)
    const onBeforeGetContentResolve = useRef(null)
    const handleOnBeforeGetContent = React.useCallback(() => {
        setLoadContent(true)
        return new Promise((resolve) => {
            onBeforeGetContentResolve.current = resolve

            setTimeout(() => {
                setLoadContent(false)
                resolve()
            }, 2000)
        })
    }, [setLoadContent])
    const reactToPrintContent = React.useCallback(() => {
        return saleCheckRef.current
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleCheckRef.current])
    const print = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: 'Total',
        onBeforeGetContent: handleOnBeforeGetContent,
        removeAfterPrint: true,
    })
    useEffect(() => {
        if (
            loadContent &&
            typeof onBeforeGetContentResolve.current === 'function'
        ) {
            onBeforeGetContentResolve.current()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onBeforeGetContentResolve.current, loadContent])
    return (
        <div>
            <div className='flex justify-center items-center mb-6'>
                <PrintBtn onClick={print} isDisabled={loadContent} />
            </div>
            <div className='lg:w-[100%] w-[90vw] '>
            <section className='a4 w-[27cm] bg-[white]' ref={saleCheckRef}>
                <TotalReportDate date1={'13.09.22'} date2={'13.10.22'} />
                <div className='mt-[-3rem]'>
                    <TotalReport
                        text1={'Sotilganlar soni'}
                        text2={'Umumiy savdo'}
                        text3={'Umumiy xarajatlar'}
                        redText={true}
                        number1={saleproductsreport?.totalpieces}
                        number2={
                            currencyType === 'USD'
                                ? (
                                      (totalreports.sale.sale * 1000) /
                                      1000
                                  ).toLocaleString('ru-RU')
                                : (
                                      (totalreports.sale.saleuzs * 1) /
                                      1
                                  ).toLocaleString('ru-RU')
                        }
                        number3={
                            currencyType === 'USD'
                                ? (
                                      (totalreports.expenses.expenses * 1000) /
                                      1000
                                  ).toLocaleString('ru-RU')
                                : (
                                      (totalreports.expenses.expensesuzs * 1) /
                                      1
                                  ).toLocaleString('ru-RU')
                        }
                        currency={currencyType}
                        head={true}
                        end={true}
                    />
                </div>
                <div className='flex mainPadding'>
                    <div className='flex-[0_0_60%]'>
                        <TotalReportTable
                            number={totalreports?.sale?.salecount}
                            cost={
                                currencyType === 'USD'
                                    ? (
                                          Math.round(
                                              totalreports?.cash?.cash * 1000
                                          ) / 1000
                                      ).toLocaleString('ru-RU')
                                    : (
                                          Math.round(
                                              totalreports?.cash?.cashuzs * 1
                                          ) / 1
                                      ).toLocaleString('ru-RU')
                            }
                            plastic={
                                currencyType === 'USD'
                                    ? (
                                          Math.round(
                                              totalreports?.card?.card * 1000
                                          ) / 1000
                                      ).toLocaleString('ru-RU')
                                    : (
                                          Math.round(
                                              totalreports?.card?.carduzs * 1
                                          ) / 1
                                      ).toLocaleString('ru-RU')
                            }
                            transfer={
                                currencyType === 'USD'
                                    ? (
                                          Math.round(
                                              totalreports?.transfer?.transfer *
                                                  1000
                                          ) / 1000
                                      ).toLocaleString('ru-RU')
                                    : (
                                          Math.round(
                                              totalreports?.transfer
                                                  ?.transferuzs * 1
                                          ) / 1
                                      ).toLocaleString('ru-RU')
                            }
                            currency={currencyType}
                        />
                    </div>
                    <div className='flex flex-[0_0_40%] flex-col justify-center items-center leading-[2.1rem]'>
                        <p className='text-[36px] text-[#61BD7B] font-bold'>
                            {currencyType === 'USD'
                                ? (
                                      Math.round(
                                          totalreports.income.income * 1000
                                      ) / 1000
                                  ).toLocaleString('ru-RU')
                                : (
                                      Math.round(
                                          totalreports.income.incomeuzs * 1
                                      ) / 1
                                  ).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                        <p className='text-2xl font-medium text-[#00B4CC]'>
                            Sof foyda
                        </p>
                    </div>
                </div>
                <TotalReport
                    label1={'Sotilgan maxsulotlar hisoboti'}
                    number1={totalreports?.sale?.salecount}
                    number2={saleproductsreport.producttypes}
                    number3={saleproductsreport.totalpieces}
                    text1={'Sotish soni'}
                    text2={'Tovar turlarining umumiy soni'}
                    text3={'Tovarlarning umumiy soni'}
                />
                <TotalReport
                    label1={'Keltirilgan maxsulotlar hisoboti'}
                    label2={'Tushumlar miqdori'}
                    currencycost={incomingreport?.totalincomings}
                    number1={
                        currencyType === 'USD'
                            ? (
                                  Math.round(
                                      incomingreport?.totalprice * 1000
                                  ) / 1000
                              ).toLocaleString('ru-RU')
                            : (
                                  Math.round(
                                      incomingreport?.totalpriceuzs * 1
                                  ) / 1
                              ).toLocaleString('ru-RU')
                    }
                    number2={incomingreport?.producttypes}
                    number3={incomingreport?.totalpieces}
                    text1={'Jami tushumlar'}
                    text2={'Tovar turlarining umumiy soni'}
                    text3={'Tovarlarning umumiy soni'}
                    currency={currencyType}
                    all={true}
                />
                <TotalReport
                    label1={'Omborxona hisoboti'}
                    number1={productreport?.producttypes}
                    number2={Math.round(productreport?.totalpieces)}
                    number3={
                        currencyType === 'USD'
                            ? roundUsd(
                                  productreport?.totalprice
                              ).toLocaleString('ru-RU')
                            : roundUzs(
                                  productreport?.totalpriceuzs
                              ).toLocaleString('ru-RU')
                    }
                    text1={'Tovar turlarining umumiy soni'}
                    text2={'Tovarlarning umumiy soni'}
                    text3={'Ombordagi tovarlarning umumiy miqdori'}
                    currency={currencyType}
                    end={true}
                />
            </section>
            </div>
        </div>
    )
}

export default TotalReports
