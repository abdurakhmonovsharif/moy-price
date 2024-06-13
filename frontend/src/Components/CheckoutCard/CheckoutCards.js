import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutCards = ({
    type,
    onClick,
    name,
    active,
    currency,
    report,
    path,
}) => {
    const chooseCardName = `cardContainer ${type === 'sale' ||
            type === 'income' ||
            type === 'payments'
            ? 'tradeCard'
            : type === 'expenses' || type === 'debts'
                ? 'debts'
                : type === 'backproducts'
                    ? 'returnedCard'
                    : type === 'discounts'
                        ? 'discountCard'
                        : ''
        } ${active ? 'activeCard' : ''}`

    return (
        <Link to={`/kassa/${path}`} onClick={onClick}>
            <span className={chooseCardName}>
                <span className='tradeIn'>
                    <span
                        className={
                            type === 'income' ? 'hidden' : 'parcentageWidth'
                        }
                    >
                        <span
                            className={
                                type === 'income'
                                    ? 'hidden'
                                    : 'percentageCircle'
                            }
                        >
                            <span> {report[type + 'count']} </span>
                        </span>
                    </span>
                    <span className='w-full'>
                        <span
                            className={
                                type === 'income' ? 'checkName' : 'checkoutName'
                            }
                        >
                            <p className='text-[1.5rem]'>{name}</p>
                            <p className='text-[1.25rem] '>{currency}</p>
                        </span>
                        <div>
                            <p className='costCard float-right'>
                                {currency === 'UZS'
                                    ? report[type + 'uzs'].toLocaleString(
                                        'ru-Ru'
                                    )
                                    : report[type].toLocaleString('ru-Ru')}
                            </p>
                        </div>
                    </span>
                </span>
            </span>
        </Link>
    )
}

export default CheckoutCards
