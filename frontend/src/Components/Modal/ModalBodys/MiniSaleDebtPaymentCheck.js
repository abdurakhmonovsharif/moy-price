import {t} from 'i18next'
import {map} from 'lodash'
import React, {useEffect, useState, useRef} from 'react'
import {useSelector} from 'react-redux'
import ReactToPrint, {useReactToPrint} from 'react-to-print'
import TableBtn from '../../Buttons/TableBtn'
import SmallLoader from '../../Spinner/SmallLoader'
import {IoPrint} from 'react-icons/io5'
import PrintBtn from '../../Buttons/PrintBtn'

const MiniSaleDebtPaymentCheck = ({data, type}) => {
    const [totalCard, setTotalCard] = useState(0)
    const [totalCash, setTotalCash] = useState(0)
    const [totalTransfer, setTotalTransfer] = useState(0)
    const {user, market} = useSelector((state) => state.login)
    const {currencyType} = useSelector((state) => state.currency)
    const componentRef = useRef()
    const [loadContent, setLoadContent] = useState(false)
    const onBeforeGetContentResolve = useRef(null)

    useEffect(() => {
        calcTotalPayments()
    }, [])

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
        return componentRef.current
    }, [componentRef.current])

    const print = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: 'Mini Sale Debt Payment Check',
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
    }, [onBeforeGetContentResolve.current, loadContent])

    const calcTotalPayments = () => {
        setTotalCard(
            type === 'all'
                ? (data?.saleconnector || data)?.payments?.reduce((prev, el) => {
                      return (
                          prev + el[currencyType === 'USD' ? 'card' : 'carduzs']
                      )
                  }, 0)
                : type === 'debtPayed'
                ? data[
                    currencyType === 'USD'
                        ? 'card'
                        : 'carduzs'
                ]
                : (data?.saleconnector || data)?.payments?.reduce(
                      (prev, payment) => {
                          return (
                              prev +
                              payment.products?.reduce((sum, productId) => {
                                  const product = data.products.find(
                                      (p) => p._id === productId
                                  )
                                  if (product) {
                                      return (
                                          sum +
                                          payment[
                                              currencyType === 'USD'
                                                  ? 'card'
                                                  : 'carduzs'
                                          ]
                                      )
                                  }
                                  return sum
                              }, 0)
                          )
                      },
                      0
                  )
        )
        setTotalCash(
            type === 'all'
                ? (data?.saleconnector || data)?.payments?.reduce((prev, el) => {
                      return (
                          prev + el[currencyType === 'USD' ? 'cash' : 'cashuzs']
                      )
                  }, 0)
                : type === 'debtPayed'
                ? data[
                    currencyType === 'USD'
                        ? 'cash'
                        : 'cashuzs'
                ]
                : (data?.saleconnector || data)?.payments?.reduce(
                      (prev, payment) => {
                          return (
                              prev +
                              payment.products?.reduce((sum, productId) => {
                                  const product = data.products.find(
                                      (p) => p._id === productId
                                  )
                                  if (product) {
                                      return (
                                          sum +
                                          payment[
                                              currencyType === 'USD'
                                                  ? 'cash'
                                                  : 'cashuzs'
                                          ]
                                      )
                                  }
                                  return sum
                              }, 0)
                          )
                      },
                      0
                  )
        )

        setTotalTransfer(
            type === 'all'
                ? (data?.saleconnector || data)?.payments?.reduce((prev, el) => {
                      return (
                          prev +
                          el[
                              currencyType === 'USD'
                                  ? 'transfer'
                                  : 'transferuzs'
                          ]
                      )
                  }, 0)
                : type === 'debtPayed'
                ? data[
                    currencyType === 'USD'
                        ? 'transfer'
                        : 'transferuzs'
                ]
                : (data?.saleconnector || data)?.payments?.reduce(
                      (prev, payment) => {
                          return (
                              prev +
                              payment.products?.reduce((sum, productId) => {
                                  const product = data.products.find(
                                      (p) => p._id === productId
                                  )
                                  if (product) {
                                      return (
                                          sum +
                                          payment[
                                              currencyType === 'USD'
                                                  ? 'transfer'
                                                  : 'transferuzs'
                                          ]
                                      )
                                  }
                                  return sum
                              }, 0)
                          )
                      },
                      0
                  )
        )
    }

    return (
        <div>
            {loadContent && (
                <div className='fixed backdrop-blur-[2px] left-0 top-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            <div className='w-full min-h-[600px] grid'>
                <div
                    className='w-[50%] py-10 bg-white-900 h-full mx-auto'
                    ref={componentRef}
                >
                    <div className='w-36 border rounded-full h-36 mx-auto'>
                        <img
                            src={market?.image}
                            className='w-full h-full rounded-full object-cover'
                            alt='logo'
                        />
                    </div>
                    <div className='mx-auto px-3'>
                        <ul className='w-full '>
                            <li className='check-ul-li'>
                                {t("Do'kon")}:
                                <span className='check-ul-li-span'>
                                    {market.name}
                                </span>
                            </li>
                            <li className='check-ul-li'>
                                {t('Telefon')}:
                                <span className='check-ul-li-span'>
                                    {market.phone1}
                                </span>
                            </li>
                            <li className='check-ul-li'>
                                {t('Sana')}:
                                <span className='check-ul-li-span'>
                                    {new Date(
                                        data?.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </li>
                        </ul>
                        <hr />
                        <h2 className='text-center text-lg mt-2 font-medium'>
                            Qarzdan to'lov
                        </h2>
                        <ul className='my-4'>
                            {type === 'all' ? (
                                map(
                                    (data?.saleconnector || data)?.payments,
                                    (payment, index) => (
                                        <li className='border-b' key={index}>
                                            <p className='text-center mt-1 font-semibold'>
                                                {new Date(
                                                    payment?.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                            <span className='check-ul-li'>
                                                <span> № {index + 1}</span>{' '}
                                                <span>
                                                    {payment[
                                                        currencyType === 'USD'
                                                            ? 'payment'
                                                            : 'paymentuzs'
                                                    ].toLocaleString(
                                                        'ru-RU'
                                                    )}{' '}
                                                    {currencyType}
                                                </span>
                                            </span>
                                        </li>
                                    )
                                )
                            ) : type === 'debtPayed' ? (
                                <li className='check-ul-li text-lg'>
                                  <span className='font-semibold'>Umumiy: </span>
                                  <span>  {
                                        data[
                                            currencyType === 'USD'
                                                ? 'payment'
                                                : 'paymentuzs'
                                        ]
                                    } {currencyType}</span>
                                </li>
                            ) : (
                                (data?.saleconnector || data)?.payments.flatMap(
                                    (payment, index) =>
                                        payment.products.map((productId) => {
                                            let product = data.products.find(
                                                (p) => p._id === productId
                                            )?._id

                                            if (productId === product) {
                                                return (
                                                    <li
                                                        className='border-b'
                                                        key={index}
                                                    >
                                                        <p className='text-center mt-1 font-semibold'>
                                                            {new Date(
                                                                payment?.createdAt
                                                            ).toLocaleDateString()}
                                                        </p>
                                                        <span className='check-ul-li'>
                                                            <span>
                                                                {' '}
                                                                № {index + 1}
                                                            </span>{' '}
                                                            <span>
                                                                {payment[
                                                                    currencyType ===
                                                                    'USD'
                                                                        ? 'payment'
                                                                        : 'paymentuzs'
                                                                ].toLocaleString(
                                                                    'ru-RU'
                                                                )}{' '}
                                                                {currencyType}
                                                            </span>
                                                        </span>
                                                    </li>
                                                )
                                            }
                                        })
                                )
                            )}
                        </ul>
                       
                        <div className={`${type==="debtPayed"?'border-t':''} space-y-1 mt-1  pt-4`}>
                            <div className='font-semibold flex justify-between items-center'>
                                <span>Naqt:</span>
                                <span>
                                    {totalCash} {currencyType}
                                </span>
                            </div>
                            <div className='font-semibold flex justify-between items-center'>
                                <span>Karta:</span>
                                <span>
                                    {totalCard} {currencyType}
                                </span>
                            </div>
                            <div className='font-semibold flex justify-between items-center pb-4'>
                                <span>Plastik:</span>
                                <span>
                                    {totalTransfer} {currencyType}
                                </span>
                            </div>
                            <div className='font-semibold flex justify-between items-center border-t pt-4'>
                                <span>To'lov bo'lmagan savdolar:</span>
                                <span>
                                    {0}
                                </span>
                            </div>
                            <div className='font-semibold flex justify-between items-center'>
                                <span>Umumiy qarz:</span>
                                <span>
                                    {0}
                                </span>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-end'>
                <ReactToPrint
                    trigger={() => <PrintBtn onClick={() => {}} />}
                    content={() => componentRef.current}
                />
            </div>
        </div>
    )
}

export default MiniSaleDebtPaymentCheck
