import {map, uniqueId} from 'lodash'
import React, {useEffect, useState} from 'react'
import TableBtn from '../../Buttons/TableBtn'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {t} from 'i18next'

export const TemporarySaleTableRow = ({data, Delete, currency, Print}) => {
    const navigate = useNavigate()
    const {user} = useSelector((state) => state.login)
    const link = user?.type?.toLowerCase() === 'seller' ? '/' : '/sotuv/sotish'
    const linkToSale = (temporary) => {
        navigate(link, {state: {temporary: {...temporary}}})
    }
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <>
            {map(data, ({_id, temporary, createdAt, user}, index) =>
                !isMobile ? (
                    <tr className='tr' key={uniqueId('sale')}>
                        <td className='td'>{1 + index}</td>
                        <td className='td text-left'>
                            {user?.firstname} {user?.lastname}
                        </td>
                        <td className='td text-left'>
                            {temporary.userValue ||
                                temporary.clientValue.label ||
                                temporary.packmanValue.label ||
                                `${t('Mijoz ismi kiritilmagan')}`}
                        </td>
                        <td className='td text-right'>
                            {temporary.tableProducts.length}
                        </td>
                        <td className='text-success-500 td text-right'>
                            {currency === 'USD'
                                ? (temporary?.totalPrice || 0).toLocaleString(
                                      'ru-RU'
                                  )
                                : (
                                      temporary?.totalPriceUzs || 0
                                  ).toLocaleString('ru-RU')}
                            {currency}
                        </td>
                        <td className='td text-right'>
                            {new Date(createdAt).toLocaleDateString()}
                        </td>
                        <td className='td text-right'>
                            {new Date(createdAt).toLocaleTimeString()}
                        </td>
                        <td className='td py-[6px] border-r-0'>
                            <div className='flex items-center justify-center gap-[0.625rem]'>
                                <TableBtn
                                    type={'print'}
                                    bgcolor={'bg-primary-800'}
                                    onClick={() =>
                                        Print({_id, temporary, createdAt, user})
                                    }
                                />
                                <TableBtn
                                    type={'edit'}
                                    bgcolor={'bg-warning-500'}
                                    onClick={() =>
                                        linkToSale({...temporary, _id, user})
                                    }
                                />
                                <TableBtn
                                    type={'delete'}
                                    bgcolor={'bg-error-500'}
                                    onClick={() => Delete(_id)}
                                />
                            </div>
                        </td>
                    </tr>
                ) : (
                    <li className='w-[90vw] p bg-white list-none mb-[10px] rounded-md'>
                        <li className='flex p-3 justify-between border border-s-0 border-t-0 border-e-0 text-[blue]'>
                            <p>
                                {1 + index}-
                                {new Date(createdAt).toLocaleDateString()}
                            </p>
                            <p>
                                <span>{t('Vaqti: ')}</span>
                                {new Date(createdAt).toLocaleTimeString()}
                            </p>
                        </li>
                        <li className='flex p-3 justify-between border border-s-0 border-t-0 border-e-0 text-[green]'>
                            <p>{t('Sotuvchi')}:</p>
                            <p className='text-[blue]'>
                                {user?.firstname} {user?.lastname}
                            </p>
                        </li>
                        <li className='flex p-3 justify-between border border-s-0 border-t-0 border-e-0 text-[green]'>
                            <p>{t('Mijoz')}:</p>
                            <p className='text-[blue]'>
                                {temporary.userValue ||
                                    temporary.clientValue.label ||
                                    temporary.packmanValue.label ||
                                    `${t('Mijoz ismi kiritilmagan')}`}
                            </p>
                        </li>
                        <li className='flex p-3 justify-between border border-s-0 border-t-0 border-e-0 text-[green]'>
                            <p>{t('Maxsulotlar')}:</p>
                            <p>{temporary.tableProducts.length}</p>
                        </li>
                        <li className='flex p-3 justify-between border border-s-0 border-t-0 border-e-0 text-[green]'>
                            <p>{t('Jami')}:</p>
                            <p>
                                {currency === 'USD'
                                    ? (
                                          temporary?.totalPrice || 0
                                      ).toLocaleString('ru-RU')
                                    : (
                                          temporary?.totalPriceUzs || 0
                                      ).toLocaleString('ru-RU')}
                                {currency}
                            </p>
                        </li>
                        <li className='flex p-3 justify-end  text-[green]'>
                            .
                            <div className='flex items-center justify-center gap-[0.625rem]'>
                                <TableBtn
                                    type={'print'}
                                    bgcolor={'bg-primary-800'}
                                    onClick={() =>
                                        Print({_id, temporary, createdAt, user})
                                    }
                                />
                                <TableBtn
                                    type={'edit'}
                                    bgcolor={'bg-warning-500'}
                                    onClick={() =>
                                        linkToSale({...temporary, _id})
                                    }
                                />
                                <TableBtn
                                    type={'delete'}
                                    bgcolor={'bg-error-500'}
                                    onClick={() => Delete(_id)}
                                />
                            </div>
                        </li>
                    </li>
                )
            )}
        </>
    )
}
