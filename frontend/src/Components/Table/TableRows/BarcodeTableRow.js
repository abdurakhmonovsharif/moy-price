import React from 'react'
import {map, uniqueId} from 'lodash'
import TableBtn from '../../Buttons/TableBtn.js'

export const BarcodeTableRow = (
    {
        data,
        currentPage,
        countPage,
        Edit,
        Delete
    }) => {
    return (<>
        {
            map(data,(item, index) =>
                <tr className='tr' key={uniqueId('sales')}>
                    <td className='text-left td'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td'>{item.barcode}</td>
                    <td className='td'>{item.name}</td>
                    <td className='td border-r-0 text-center max-w-[50px] py-[0.375rem]'>
                        <div className='flex items-center justify-center'>
                            <TableBtn
                                type={'edit'}
                                bgcolor='bg-warning-500'
                                onClick={() => Edit(item)}
                            />
                            <TableBtn
                                type={'delete'}
                                bgcolor='bg-error-500 ml-2.5'
                                onClick={() => Delete(item)}
                            />
                        </div>
                    </td>
                </tr>
            )
        }
    </>)
}