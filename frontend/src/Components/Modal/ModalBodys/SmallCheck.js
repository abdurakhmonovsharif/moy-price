import React, {forwardRef} from 'react'
import {map} from 'lodash'
import {useSelector} from 'react-redux'
import {t} from 'i18next'

export const SmallCheck =   forwardRef((props, ref) => {
    const {
        selled,
        returned,
        selledDiscounts,
        returnedDiscounts,
        selledPayments,
        returnedPayments,
        product,
        userInfo,
    } = props
    const { market } = useSelector((state) => state.login)
    const { currencyType } = useSelector((state) => state.currency)
    const calculateAllSum = (data) => {
        return data
            ? data.reduce((acc, pr) => {
                return (
                    acc +
                    pr[
                    currencyType === 'USD'
                        ? 'totalprice'
                        : 'totalpriceuzs'
                    ]
                )
            }, 0)
            : 0
    }
    const calculateAllFilialSum = (data) => {
        if (currencyType === 'USD') {
            return data.reduce((prev, el) => prev + ((el.fromFilial || 0) * el.unitprice), 0)
        } else {
            return data.reduce((prev, el) => prev + ((el.fromFilial || 0) * el.unitpriceuzs), 0)
        }
    }
    const calculateAllDiscounts = (data) => {
        return data
            ? data.reduce((acc, pr) => {
                return (
                    acc +
                    pr[currencyType === 'USD' ? 'discount' : 'discountuzs']
                )
            }, 0)
            : 0
    }
    const calculateAllPayments = (data) => {
        return data
            ? data.reduce((acc, pr) => {
                return (
                    acc +
                    pr[currencyType === 'USD' ? 'payment' : 'paymentuzs']
                )
            }, 0)
            : 0
    }
    return (
        <div ref={ref} className={'px-2'}>
            <div className='flex pb-2 flex-col text-center justify-center border-b-[0.8px] border-black-700'>
                <div>
                    <img src={market?.image} alt="logo" />
                </div>
                {/* <h2 className='text-[16px] mb-4 font-bold'>{market.name}</h2> */}
                <div className='flex justify-between items-center py-1 text-[12px] font-bold'>
                    {t('Telefon')}:
                    <span className='text-[12px] text-black-900 font-bold'>
                        {market.phone1}
                    </span>
                </div>
                <div className='flex justify-between items-center py-1 text-[12px] font-bold'>
                    {t('Manzil')}:
                    <span className='text-[12px] text-black-900 font-bold' >
                        {market?.address}
                    </span>
                </div>
                <div className='flex justify-between items-center py-1 text-[12px] font-bold'>
                    {t('Sana')}:
                    <span className='text-[12px] text-black-900 font-bold'>
                        {new Date(product?.createdAt).toLocaleDateString()}
                        {/* <span className='ml-3 font-bold'>
                                {new Date(
                                    product?.createdAt
                                ).toLocaleTimeString()}
                            </span> */}
                    </span>
                </div>
                <div className='flex justify-between items-center py-1 text-[12px] font-bold'>
                    {t('Mijoz')}:{' '}
                    <span className='text-[12px] text-black-900 font-bold'>
                        {product?.client?.name ||
                            product?.packman?.name ||
                            ''}
                    </span>
                </div>
                <div className={'flex justify-between items-center py-1 text-[12px] font-bold'}>
                    {t('Sotuv')}{' '}
                    <span className='text-[12px] text-black-900 font-bold'>
                        {product?.id}
                    </span>
                </div>
                <div className={'flex justify-between items-center py-1 text-[12px] font-bold'}>
                    {t('Sotuvchi')}:{' '}
                    <span className='text-[12px] text-black-900 font-bold'>
                        {userInfo?.firstname} {userInfo?.lastname}
                    </span>
                </div>
                {/* <div className='check-ul-li flex-col'>
                    <div className={'grow text-center'}>
                        <h2 className='check-text-style mb-5'>
                            Sotuv: <span className={'ml-2 font-bold'}>{product?.id}</span>
                        </h2>
                    </div>
                    <div className='check-ul-li justify-end'>
                        <p>
                            Sotuvchi:{' '}
                            <span className='check-ul-li-span font-bold'>
                                {userInfo?.firstname} {userInfo?.lastname}
                            </span>
                        </p>
                    </div>
                </div> */}
            </div>
            {selled?.length > 0 && (
                <div className='mt-5'>
                    <h3 className='text-[14px] text-black-900 mb-5 font-bold'>
                        {t('Sotilganlar')} :
                    </h3>
                    <div>
                        {map(selled, (item, index) => (
                            <div className=''>
                                <div className='text-left text-[12px] text-black-900 font-bold'>
                                    {index + 1}. {item?.product?.productdata?.name}
                                </div>
                                <div className='text-right text-[12px] text-black-900 font-bold'>
                                    {item?.pieces} * {currencyType === 'USD' ? item?.unitprice.toLocaleString('ru-Ru') : item?.unitpriceuzs.toLocaleString('ru-Ru')} = {currencyType === 'USD' ? item?.totalprice.toLocaleString('ru-Ru') : item?.totalpriceuzs.toLocaleString('ru-Ru')}{' '}{currencyType}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}
            {returned?.length > 0 && (
                <div className='mt-5'>
                    <h3 className='text-[14px] text-black-900 mb-5 font-bold'>
                        {t('Qaytarilganlar')} :
                    </h3>
                    <div>
                        {map(returned, (item, index) => (
                            <div className=''>
                                <div className='text-left text-[12px] text-black-900 font-bold'>
                                    {index + 1}. {item?.product?.productdata?.name}
                                </div>
                                <div className='text-right text-[12px] text-black-900 font-bold'>
                                    {item?.pieces} * {currencyType === 'USD' ? item?.unitprice.toLocaleString('ru-Ru') : item?.unitpriceuzs.toLocaleString('ru-Ru')} = {currencyType === 'USD' ? item?.totalprice.toLocaleString('ru-Ru') : item?.totalpriceuzs.toLocaleString('ru-Ru')}{' '}{currencyType}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}
            <div className='text-black-900  check-ul-li-foot mt-4'>
                {t('Jami')} :{' '}
                <span style={{ fontWeight: "bolder" }} className='text-black-900 text-[12px] font-bold'>
                    {calculateAllSum(selled).toLocaleString('ru-Ru')}{' '}
                    {currencyType}
                </span>
            </div>
            <div className='text-black-900 border-none check-ul-li-foot'>
                {' '}
                {t('Chegirma')}:{' '}
                <span className='text-black-900 text-[12px] font-bold'>
                    {(
                        calculateAllDiscounts(selledDiscounts) +
                        calculateAllDiscounts(returnedDiscounts)
                    ).toLocaleString('ru-Ru')}{' '}
                    {currencyType}
                </span>
            </div>
            <div className='text-black-900 border-none check-ul-li-foot'>
                {' '}
                {t('To\'langan')}:{' '}
                <span className='text-black-900 text-[12px] font-bold'>
                    {(
                        calculateAllPayments(selledPayments) +
                        calculateAllPayments(returnedPayments)
                    ).toLocaleString('ru-Ru')}{' '}
                    {currencyType}
                </span>
            </div>
            <div className='text-black-900 border-none check-ul-li-foot'>
                {' '}
                {t('Qarz')}:{' '}
                <span className='text-black-900 text-[12px] font-bold'>
                    {(
                        calculateAllSum(selled) +
                        calculateAllSum(returned) -
                        (calculateAllPayments(selledPayments) +
                            calculateAllPayments(returnedPayments)) -
                        (calculateAllDiscounts(selledDiscounts) +
                            calculateAllDiscounts(returnedDiscounts))
                    ).toLocaleString('ru-Ru')}{' '}
                    {currencyType}
                </span>
            </div>
            <div className='text-black-900 border-none check-ul-li-foot'>
                {' '}
                {t('Umumiy qarz')}:{' '}
                <span className='text-black-900 text-[12px] font-bold'>
                    {currencyType === 'USD' ? product?.totaldebtusd || 0 : product?.totaldebtuzs || 0}{' '}
                    {currencyType}
                </span>
            </div>
            {market.qrcode && <div className='w-[120px] h-[120px] mx-auto'>
                <img src={market.qrcode} alt="qrcode" />
            </div>}
        </div>
    )
})