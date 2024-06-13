import {t} from 'i18next'
import React from 'react'
import {useSelector} from 'react-redux'

const CardBtn = ({
    products,
    deliver,
    date,
    pieces,
    onClick,
    debt = 0,
    debtUzs = 0,
    paid = 0,
    paidUzs = 0,
    all = 0,
    allUzs = 0,
    onClickPayDebt,
    id,
    time,
}) => {
    const {currencyType} = useSelector((state) => state.currency)
    return (
        <div onClick={onClick} className='flex-[0_0_23.5%] cardStyle'>
            <h1 className='headerStyle'>{deliver}</h1>
            <div className='text-[.875rem] mt-[1rem] text-center'>
                <div className='numberCard'>
                    <p className='paragrafCard'>{t('Maxsulot turlari')}:</p>
                    <p>{products.toLocaleString('ru-Ru')}</p>
                </div>
                <div className='numberCard'>
                    <p className='paragrafCardBtn'>{t('Maxsulotlar soni')}</p>
                    <p>{pieces.toLocaleString('ru-Ru')}</p>
                </div>
                <div className='numberCard'>
                    <p className='paragrafCard'>{t('Sana')}:</p>
                    <p>{date}</p>
                </div>
                <div className='numberCard'>
                    <p className='paragrafCard'>{t('Vaqti')}:</p>
                    <p className={'text-warning-200'}>{time}</p>
                </div>
                <span
                    className={'block h-[1px] bg-white-400 my-[0.5rem]'}
                ></span>
                <div className='numberCard items-center'>
                    <p className='paragrafCard'>{t('Umumiy')} :</p>
                    <span
                        className={
                            'block p-[0.1rem_0.5rem] rounded-[4px] bg-primary-700'
                        }
                    >
                        {currencyType === 'UZS' ? allUzs : all}{' '}
                        <span>{currencyType}</span>
                    </span>
                </div>
                <div className='numberCard items-center'>
                    <p className='paragrafCard'>{t('To\'langan')} :</p>
                    <span
                        className={
                            'block p-[0.1rem_0.5rem] rounded-[4px] bg-success-500'
                        }
                    >
                        {currencyType === 'UZS' ? paidUzs : paid}{' '}
                        <span>{currencyType}</span>
                    </span>
                </div>
                {debt !== 0 && (
                    <div className='numberCard items-center'>
                        <p className='paragrafCard'>{t('Qarzlar')} :</p>
                        <span
                            className={
                                'block p-[0.2rem_0.5rem] rounded-[4px] bg-error-500'
                            }
                        >
                            {currencyType === 'UZS'
                                ? debtUzs.toLocaleString('ru-Ru')
                                : debt.toLocaleString('ru-Ru')}{' '}
                            <span>{currencyType}</span>
                        </span>
                    </div>
                )}
                {debt !== 0 && (
                    <button
                        className={
                            'mt-[1rem] p-[.5rem_1rem] rounded-[1rem] text-center bg-error-500 text-white-900 hover:bg-warning-500 duration-200 active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.2)] active:shadow-none'
                        }
                        onClick={(e) => {
                            onClickPayDebt({
                                debt,
                                debtUzs,
                                deliver,
                                id,
                            })
                            e.stopPropagation()
                        }}
                    >
                        {t('Qarzni to\'lash')}
                    </button>
                )}
            </div>
        </div>
    )
}

export default CardBtn
