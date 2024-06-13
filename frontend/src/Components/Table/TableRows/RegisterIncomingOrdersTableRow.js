import React from 'react'
import {map} from 'lodash'
import TableBtn from '../../Buttons/TableBtn.js'
import {useNavigate} from 'react-router-dom'
import {
    IoCheckmarkCircleSharp,
    IoCloseCircleSharp,
    IoHourglass,
} from 'react-icons/io5'
import SelectTable from '../../SelectTable/SelectTable.js'

export const RegisterIncomingOrdersTableRow = ({
    data,
    currentPage,
    countPage,
    currency,
    Print,
    updatePosition,
}) => {
    const navigate = useNavigate()
    const linkToSale = (order, position) => {
        navigate('/dukonlar/buyurtma_olish/buyurtmalar', {
            state: {order: {...order}, position},
        })
    }
    const positions = [
        {name: "so'ralgan", position: 'requested'},
        {name: 'tasdiqlash', position: 'accepted'},
        {name: 'rad etish', position: 'rejected'},
        {name: "jo'natish", position: 'send'},
        {name: 'yetkazilgan', position: 'delivered'},
        {name: 'yakunlash', position: 'completed'},
    ]

    const createOptions = (currentPosition) => {
        let hasEqual = false
        const check = (position, index) => {
            if (currentPosition === 'delivered' && index === 5) return false
            if (currentPosition === 'send' && index === 3) return false
            if (
                currentPosition === 'accepted' &&
                (index === 3 || index === 2 || index === 1)
            )
                return false
            if (
                (currentPosition === 'requested' ||
                    currentPosition === 'rejected') &&
                (index === 1 || index === 2)
            ) {
                return false
            }
            return true
        }
        const checkPosition = ({position, index}) => {
            if (position.position === currentPosition) {
                hasEqual = true
            }
            return {
                label: (
                    <span className='flex'>
                        {position.position === 'rejected' ? (
                            <IoCloseCircleSharp size={17} color={'red'} />
                        ) : position.position === currentPosition ||
                          !hasEqual ? (
                            <IoCheckmarkCircleSharp size={17} color={'green'} />
                        ) : (
                            <IoHourglass size={17} color='#F89009' />
                        )}
                        <span className='pl-2'>
                            {currentPosition === 'completed' && index === 5
                                ? 'yakunlangan'
                                : position.name}
                        </span>
                    </span>
                ),
                value: position.position,
                isDisabled: check(position.position, index),
            }
        }
        return map(positions, (position, index) =>
            checkPosition({position, index})
        )
    }
    const createValue = (currentPosition) => {
        const check = currentPosition === 'rejected'
        const val = positions.find((pos) => pos.position === currentPosition)
        return {
            value: val?.position,
            label: (
                <span className='flex'>
                    {check ? (
                        <IoCloseCircleSharp size={17} color={'red'} />
                    ) : (
                        <IoCheckmarkCircleSharp size={17} color='green' />
                    )}{' '}
                    <span className='pl-2'>
                        {check
                            ? 'red etilgan'
                            : currentPosition === 'completed'
                            ? 'yakunlangan'
                            : val?.name}
                    </span>
                </span>
            ),
            isDisabled: true,
        }
    }
    const handleChange = (e, order, index) => {
        const val = e.value
        if (val === 'rejected' || val === 'accepted' || val === 'completed') {
            updatePosition(e.value, order._id, index)
        }
        if (val === 'send') {
            linkToSale(order, val)
        }
    }

    return (
        <>
            {map(data, (item, index) => (
                <tr key={index} className='tr'>
                    <td className='td py-2'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-end '>
                        <div className='flex justify-between'>
                            <span>
                                {new Date(item?.createdAt).toLocaleTimeString()}
                            </span>
                            <span>
                                {new Date(item?.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </td>
                    <td className='td text-end'>{item?.market?.name}</td>
                    <td className='td text-start'>{item?.market?.inn}</td>
                    <td className='td text-end'>{item?.id}</td>
                    <td className='td text-end'>{item?.products?.length}</td>
                    <td className='td text-end font-bold'>
                        {currency === 'UZS'
                            ? item?.totalpriceuzs?.toLocaleString('ru-Ru')
                            : item?.totalprice?.toLocaleString('ru-Ru')}{' '}
                        {currency}
                    </td>
                    <td className='td text-center'>
                        <div className='flex items-center justify-center gap-[0.625rem]'>
                            <TableBtn
                                type={'print'}
                                bgcolor={'bg-primary-800'}
                                onClick={() => Print(item)}
                            />
                            {
                                <TableBtn
                                    type={'edit'}
                                    bgcolor={'bg-warning-500'}
                                    onClick={() => linkToSale(item)}
                                    isDisabled={item?.position !== 'delivered'}
                                />
                            }
                        </div>
                    </td>
                    <td className='td border-r-0'>
                        <SelectTable
                            options={createOptions(item.position)}
                            value={createValue(item.position)}
                            onSelect={(e) => handleChange(e, item, index)}
                        />
                    </td>
                </tr>
            ))}
        </>
    )
}
