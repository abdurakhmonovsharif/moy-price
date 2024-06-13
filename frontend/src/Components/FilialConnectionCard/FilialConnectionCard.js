import React from 'react'
import FilialButtons from '../FilialButtons/FilialButtons'
import ConnectionAvatar from '../Avatar/ConnectionAvatar'
import {Link} from 'react-router-dom'
import { t } from 'i18next'
const FilialConnectionCard = ({active, market}) => {
    return (
        <section>
            <div
                className={`shops_card flex gap-[1.25rem] ${
                    active ? 'active_shop' : ''
                }`}
            >
                <ConnectionAvatar border={true} director={market?.director} />
                <div className='product-cost'>
                    <div
                        className={'flex flex-col items-center justify-center'}
                    >
                        <p className='product'>{t('Do\'kon')} INN</p>
                        <p className='product-number'>{market?.name}</p>
                    </div>
                    <div
                        className={'flex flex-col items-center justify-center'}
                    >
                        <p className='product'>{t('Direktor')}</p>
                        <div className='flex gap-[5px]'>
                            <p className='product-number'>
                                {market?.director?.firstname}
                            </p>
                            <p className='product-number'>
                                {market?.director?.lastname}
                            </p>
                        </div>
                    </div>
                    <div
                        className={'flex flex-col items-center justify-center'}
                    >
                        <p className='product'>{t('Telefon')}</p>
                        <p className='product-number'>{market?.phone}</p>
                    </div>
                </div>
                <div className='shop-name flex flex-col w-[13.4375rem]'>
                    <div className='shop-title'>
                        <p>INN: {market?.inn.toLocaleString('ru-RU')}</p>
                    </div>
                    <div className={'filial-btn'}>
                        <Link
                            to={`/dukonlar/hamkorlar/mahsulotlar/${market._id}`}
                        >
                            <FilialButtons type={'product'} />
                        </Link>
                        <Link
                            to={`/dukonlar/hamkorlar/hamkormahsulotlari/${market._id}`}
                        >
                            <FilialButtons type={'selling'} />
                        </Link>
                        <Link to={'/dukonlar/hamkorlar/buyurtma'}>
                            <FilialButtons type={'payments'} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FilialConnectionCard
