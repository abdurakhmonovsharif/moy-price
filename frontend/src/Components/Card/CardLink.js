import {t} from 'i18next'
import React from 'react'
import {Link} from 'react-router-dom'

const CardLink = ({
    totalprice,
    pieces,
    suppliers,
    createdAt,
    currencyType,
    path,
    totalpriceuzs,
    state,
    debt,
    debtUzs,
    paid,
    paidUzs,
}) => {
    return (
        <Link to={path} className='flex-[0_0_23.5%]' state={state}>
            <div className='w-full h-full cardStyle'>
                <h1 className='headerStyle'>
                    {(currencyType === 'USD'
                        ? totalprice
                        : totalpriceuzs
                    ).toLocaleString('ru-Ru')}
                    <span className='cardSpan'>{currencyType}</span>
                </h1>

                <div className='text-[.875rem] mt-[1rem]'>
                    <div className='numberCard'>
                        <p className='paragrafCard'>{t('Maxsulot')}:</p>
                        <p>{pieces.toLocaleString('ru-Ru')}</p>
                    </div>
                    <div className='numberCard'>
                        <p className='paragrafCard'>{t('Yetkazuvchilar')}</p>
                        <p>{suppliers.toLocaleString('ru-Ru')}</p>
                    </div>
                    <div className='numberCard'>
                        <p className='paragrafCard'>{t('Sana')}:</p>
                        <p>{new Date(createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <span
                        className={'block h-[1px] bg-white-400 my-[0.5rem]'}
                    ></span>
                    <div className='numberCard items-center'>
                        <p className='paragrafCard'>{t("To'langan")} :</p>
                        <span
                            className={
                                'block p-[0.1rem_0.5rem] rounded-[4px] bg-success-500'
                            }
                        >
                            {currencyType === 'UZS'
                                ? paidUzs.toLocaleString('ru-Ru')
                                : paid.toLocaleString('ru-Ru')}{' '}
                            <span>{currencyType}</span>
                        </span>
                    </div>
                    {debt > 0 && (
                        <div className='numberCard items-center'>
                            <p className='paragrafCard'>{t('Qarzlar')} :</p>
                            <span
                                className={
                                    'block p-[0.1rem_0.5rem] rounded-[4px] bg-error-500'
                                }
                            >
                                {currencyType === 'UZS'
                                    ? debtUzs.toLocaleString('ru-Ru')
                                    : debt.toLocaleString('ru-Ru')}{' '}
                                <span>{currencyType}</span>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CardLink
