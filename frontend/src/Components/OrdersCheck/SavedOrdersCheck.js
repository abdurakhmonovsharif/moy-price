import React, {forwardRef, useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {useReactToPrint} from 'react-to-print'
import PrintBtn from '../Buttons/PrintBtn'
import {uniqueId, map} from 'lodash'
import { t } from 'i18next'

export const SavedOrdersCheck = forwardRef((props, ref) => {
    const {order} = props
    const {currencyType} = useSelector((state) => state.currency)
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
        documentTitle: 'All Checks',
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
        <>
            <div ref={saleCheckRef} className={'bg-white-900 p-4 rounded-md'}>
                <div className='flex pb-2 justify-between border-b-[0.8px] border-black-700'>
                    <ul className='w-[35%]'>
                        <li className='check-ul-li'>
                            {t("Do'kon")}:
                            <span className='check-ul-li-span'>
                                {order?.sender?.name}
                            </span>
                        </li>
                    </ul>
                    <div className='check-ul-li flex-col'></div>
                </div>
                <div className='mt-4'>
                    <table className='border-collapse border border-slate-400 w-full break-inside-auto'>
                        <thead>
                            <tr
                                className={
                                    'break-inside-avoid break-after-auto'
                                }
                            >
                                <td className='check-table-rtr'>№</td>
                                <td className='check-table-rtr'>{t("Kodi")}</td>
                                <td className='check-table-rtr'>{t('Maxsulot')}</td>
                                <td className='check-table-rtr'>{t('Soni')}</td>
                                <td className='check-table-rtr'>{t('Jami')}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {map(order?.tableProducts, (item, index) => {
                                return (
                                    <tr key={uniqueId('saleCheck')}>
                                        <td className='p-1 border text-center text-[0.875rem] font-bold'>
                                            {index + 1}
                                        </td>
                                        <td className='check-table-body text-center'>
                                            {item?.product?.code}
                                        </td>
                                        <td className='check-table-body text-start'>
                                            {item?.product?.name}
                                        </td>
                                        <td className='check-table-body'>
                                            {item?.pieces?.toLocaleString(
                                                'ru-RU'
                                            )}{' '}
                                            {item?.unit?.name}
                                        </td>
                                        <td className='check-table-body'>
                                            {currencyType === 'USD'
                                                ? item?.totalprice
                                                : item?.totalpriceuzs}{' '}
                                            {currencyType}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='border-t-[0.8px] border-black-700 w-full my-[1rem]'></div>
                <ul>
                    <li className='check-ul-li-foot border-t-0'>
                        Jami:{' '}
                        <span>
                            {currencyType === 'USD'
                                ? order?.totalPrice
                                : order?.totalPriceUzs}{' '}
                            {currencyType}
                        </span>
                    </li>
                </ul>
            </div>
            <div className='flex justify-center items-center mt-6'>
                <PrintBtn onClick={print} isDisabled={loadContent} />
            </div>
        </>
    )
})
