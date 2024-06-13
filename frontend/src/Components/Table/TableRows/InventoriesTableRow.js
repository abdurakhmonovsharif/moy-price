import React from 'react'
import {StatusIcon} from '../TableIcons/StatusIcon'
import TableBtn from '../../Buttons/TableBtn'
import {map} from 'lodash'

export const InventoriesTableRow = ({
                                        data,
                                        currentPage,
                                        countPage,
                                        Print,
                                        Excel,
                                        isDisabled
                                    }) => {
    return (
        <>
            {map(data, (inventory, index) => (
                <tr key={inventory._id} className='tr'>
                    <td className='td text-left'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-right'>
                        {new Date(inventory.createdAt).toLocaleDateString()}
                    </td>
                    <td className='td text-right'>{inventory.id}</td>
                    <td className='td text-left'>
                        {inventory.inventories.length}
                    </td>
                    <td className='py-[0.375rem] td text-center'>
                        <div className='flex items justify-center'>
                            <StatusIcon status={inventory.completed} />
                        </div>
                    </td>
                    <td className='td border-r-0 text-center max-w-[50px]'>
                        <div className='flex items-center justify-center gap-[5px]'>
                            <TableBtn
                                type={'print'}
                                bgcolor={'bg-primary-800'}
                                onClick={() => Print(inventory)}
                            />
                            <TableBtn
                                isDisabled={isDisabled}
                                type={'excel'}
                                bgcolor={'bg-success-500'}
                                onClick={() => Excel(inventory)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
