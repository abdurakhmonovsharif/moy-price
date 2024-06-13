import React from 'react'
import {uniqueId, map} from 'lodash'
import TableBtn from '../../Buttons/TableBtn'

export const TemporaryIncomingsTableRow = ({
                                               data,
                                               Print,
                                               Edit,
                                               Delete,
                                               currency
                                           }) => {
    return (
        <>
            {map(data,(temporary, index) => (
                <tr className='tr' key={uniqueId('temporary')}>
                    <td className='td'>{1 + index}</td>
                    <td className='td text-left'>{temporary.supplier.name}</td>
                    <td className='td text-right'>
                        {temporary.incomings.pieces}
                    </td>
                    <td className='text-success-500 td text-right'>
                        {(currency === 'USD'
                                ? temporary.incomings.totalprice
                                : temporary.incomings.totalpriceuzs
                        ).toLocaleString('ru-RU')}{' '}
                        {currency}
                    </td>
                    <td className='td text-right'>
                        {new Date(temporary.createdAt).toLocaleDateString()}
                    </td>
                    <td className='td text-right'>
                        {new Date(temporary.createdAt).toLocaleTimeString()} PM
                    </td>
                    <td className='td py-[6px] border-r-0'>
                        <div className='flex items-center justify-center gap-[0.625rem]'>
                            <TableBtn
                                type={'print'}
                                bgcolor={'bg-primary-800'}
                                onClick={() => Print(temporary)}
                            />
                            <TableBtn
                                type={'edit'}
                                bgcolor={'bg-warning-500'}
                                onClick={() => Edit(temporary)}
                            />
                            <TableBtn
                                type={'delete'}
                                bgcolor={'bg-error-500'}
                                onClick={() => Delete(temporary)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
