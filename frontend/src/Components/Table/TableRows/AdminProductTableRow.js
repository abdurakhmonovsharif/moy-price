import React from 'react'
import TableBtn from '../../Buttons/TableBtn'
import {map} from 'lodash'

export const AdminProductTableRow = ({
    currentPage,
    countPage,
    data,
    Edit,
    onClickTableRow,
    handleDelete,
}) => {
    return (
        <>
            {map(data, (market, index) => (
                <tr
                    key={market._id}
                    className='tr cursor-pointer'
                    onClick={() => onClickTableRow(market)}
                >
                    <td className='td text-left'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-center p-[0.625rem_0.875rem]'>
                        <div
                            className={
                                'w-[2.5rem] h-[2.5rem] mx-auto rounded-full border-[2px] border-primary-700 flex items-center justify-center p-[2px]'
                            }
                        >
                            {market?.image ? (
                                <img
                                    src={market.image}
                                    alt={market.name}
                                    className={'rounded-full'}
                                />
                            ) : (
                                `${market?.name[0].toUpperCase()}`
                            )}
                        </div>
                    </td>
                    <td className='td text-left'>{market?.name}</td>
                    <td className='td text-left'>
                        {market?.director?.firstname}{' '}
                        {market?.director?.lastname}
                    </td>
                    <td className='td text-right'>{market?.phone1}</td>
                    <td className='td text-right'>{new Date(market?.createdAt).toLocaleDateString()}</td>
                    <td className='td text-center'>
                        {market?.mainmarket ? (
                            <div className='w-[24px] h-[24px] mx-auto bg-[#F79009] rounded-[50%]'></div>
                        ) : (
                            <div className='w-[24px] h-[24px] mx-auto bg-[#12B76A] rounded-[50%]'></div>
                        )}
                    </td>
                    <td className='td '>
                        <div className='flex items-center justify-center'>
                            <TableBtn
                                type={'edit'}
                                bgcolor='bg-warning-500'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    Edit(market)
                                }}
                            />
                        </div>
                    </td>
                    <td className='td border-r-0'>
                        <TableBtn
                            type={'delete'}
                            bgcolor='bg-error-500 ml-2.5'
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(market)
                            }}
                        />
                    </td>
                </tr>
            ))}
        </>
    )
}
