import React, {forwardRef} from 'react'
import {useSelector} from 'react-redux'
import {uniqueId,map} from 'lodash'
import { t } from 'i18next'

export const SaleCheckPosReturn = forwardRef((props, ref) => {
    const {product} = props
    const {user, market} = useSelector((state) => state.login)
    const {currencyType} = useSelector((state) => state.currency)
    const totalprice = (datas, property) => {
        return datas.reduce((summ, data) => summ + data[property], 0)
    }
    return (
        <div
            ref={ref}
            className={
                'bg-white-900 p-4 rounded-md reciept w-full uppercase text-[7pt]'
            }
        >
            <div className='flex justify-between'>
                <span>{t("Do'kon")}:</span>
                <span>{market.name}</span>
            </div>
            <div className='flex justify-between'>
                <span>{t('Sotuvchi')}:</span>
                <span>
                    {user.firstname} {user.lastname}
                </span>
            </div>
            <div className='flex justify-between'>
                <span>{t('Mijoz')}:</span>
                <span>
                    {product?.client?.name || product?.packman?.name || ''}
                </span>
            </div>
            <div className='flex justify-between'>
                <span>{t('ID')}:</span>
                <span>{product?.saleconnector?.id}</span>
            </div>
            <div className='flex justify-between'>
                <span>{t('Chek')}:</span>
                <span> {product?.id}</span>
            </div>
            <div className='flex justify-between'>
                <span>
                    {t('Chek')}: {new Date(product?.createdAt).toLocaleTimeString()}
                </span>
                <span>
                    {t('Sana')}: {new Date(product?.createdAt).toLocaleDateString()}
                </span>
            </div>
            <br />
            <hr className='text-opacity-50' />
            <br />
            {map(product?.products,(item, index) => {
                return (
                    <div key={uniqueId('sale-check-pos-return')}>
                        <div className='text-[7pt] font-bold'>
                            {index + 1}. {item?.product?.category?.code}{' '}
                            {item?.product?.productdata?.code}{' '}
                            {item?.product?.productdata?.name}
                        </div>
                        <div className='flex justify-between text-[7pt]'>
                            <span>
                                {item?.pieces}*
                                {currencyType === 'USD'
                                    ? item?.unitprice?.toLocaleString('ru-RU')
                                    : item?.unitpriceuzs?.toLocaleString(
                                          'ru-RU'
                                      )}{' '}
                                {currencyType}
                            </span>
                            <span>
                                {currencyType === 'USD'
                                    ? item?.totalprice?.toLocaleString('ru-RU')
                                    : item?.totalpriceuzs?.toLocaleString(
                                          'ru-RU'
                                      )}{' '}
                                {currencyType}
                            </span>
                        </div>
                    </div>
                )
            })}
            <br />
            <ul>
                <li className='flex justify-between text-[7pt] border-b border-b-black-300'>
                    {t('Jami')}:{' '}
                    <span>
                        {totalprice(
                            product.products,
                            currencyType === 'UZS'
                                ? 'totalpriceuzs'
                                : 'totalprice'
                        ).toLocaleString('ru-RU')}{' '}
                        {currencyType}
                    </span>
                </li>
                <li className='flex justify-between text-[7pt] border-b border-b-black-300'>
                    {' '}
                    {t("To'langan")}:{' '}
                    <span>
                        {(currencyType === 'USD'
                            ? product?.payment?.payment || 0
                            : product?.payment?.paymentuzs || 0
                        ).toLocaleString('ru-RU')}{' '}
                        {currencyType}
                    </span>
                </li>
            </ul>
        </div>
    )
})
