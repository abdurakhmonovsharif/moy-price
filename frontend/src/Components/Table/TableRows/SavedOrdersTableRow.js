import React from 'react'
import {map} from 'lodash'
import TableBtn from '../../Buttons/TableBtn'
import {useNavigate} from 'react-router-dom'

export const SavedOrdersTableRow = ({data, Delete, handlePrint}) => {
    const navigate = useNavigate()
    const linkToSale = (temporary) => {
        navigate('/dukonlar/buyurtma_berish/buyurtmalar', {
            state: {...temporary},
        })
    }

    return (
        <>
            {map(data, (item, index) => (
                <tr key={index} className='tr'>
                    <td className='td py-2'>{1 + index}</td>
                    <td className='td text-end'>
                        {new Date(item?.createdAt).toLocaleDateString()}
                    </td>
                    <td className='td text-end'>
                        {new Date(item?.createdAt).toLocaleTimeString()}
                    </td>
                    <td className='td text-left'>
                        {item?.temporary?.partner?.label}
                    </td>
                    <td className='td text-end'>
                        {item?.temporary?.tableProducts?.length}
                    </td>
                    <td className='td text-end font-bold'>
                        {item?.temporary?.totalPrice?.toLocaleString('ru-RU')}{' '}
                        USD
                    </td>
                    <td className='td text-end font-bold'>
                        {item?.temporary?.totalPriceUzs?.toLocaleString(
                            'ru-RU'
                        )}{' '}
                        UZS
                    </td>
                    <td className='td border-r-0'>
                        <div className='flex items-center justify-center gap-[0.625rem]'>
                            <TableBtn
                                onClick={() => handlePrint(item.temporary)}
                                type={'print'}
                                bgcolor={'bg-primary-800'}
                            />
                            <TableBtn
                                type={'edit'}
                                bgcolor={'bg-warning-500'}
                                onClick={() => linkToSale(item)}
                            />
                            <TableBtn
                                onClick={() => Delete(item._id)}
                                type={'delete'}
                                bgcolor={'bg-error-500'}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
