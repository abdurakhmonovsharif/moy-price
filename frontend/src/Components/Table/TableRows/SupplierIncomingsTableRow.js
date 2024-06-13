import {map} from 'lodash'
import React from 'react'
import {IoCheckmark} from 'react-icons/io5'
import TableBtn from '../../Buttons/TableBtn'

const SupplierIncomingsTableRow = ({
    data,
    currentPage,
    countPage,
    currency,
    Pay,
}) => {
    const reducer = (arr, key) =>
        arr.reduce((prev, item) => prev + item[key], 0)
    const changeCurrency = (item, key) =>
        currency === 'USD' ? item[key] : item[key + 'uzs']

    return (
        <>
            {map(data, (connector, index) => (
                <tr key={connector._id} className='tr'>
                    <td className='td'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-right'>
                        {new Date(connector.createdAt).toLocaleDateString()}
                    </td>
                    <td className='td text-right'>
                        {new Date(connector.createdAt).toLocaleTimeString()}
                    </td>
                    <td className='td text-right'>{connector.id}</td>
                    <td className='td text-right'>
                        {connector.incoming.length}
                    </td>
                    <td className='td text-right'>
                        {reducer(connector.incoming, 'pieces')}
                    </td>
                    <td className='td text-right font-medium text-primary-700'>
                        {changeCurrency(connector, 'total').toLocaleString(
                            'ru-RU'
                        )}{' '}
                        {currency}
                    </td>
                    <td className='td text-right font-medium text-success-500'>
                        {changeCurrency(
                            connector,
                            'totalpayment'
                        ).toLocaleString('ru-RU')}{' '}
                        {currency}
                    </td>
                    <td
                        className={`td text-right font-medium ${
                            connector.debt !== 0
                                ? 'text-error-500'
                                : 'text-black-900'
                        }`}
                    >
                        {changeCurrency(connector, 'debt').toLocaleString(
                            'ru-RU'
                        )}{' '}
                        {currency}
                    </td>
                    <td className='py-[0.375rem] td border-r-0 text-center'>
                        <div className='flex items-center justify-center gap-[0.625rem]'>
                            {connector.debt !== 0 ? (
                                <TableBtn
                                    type={'pay'}
                                    bgcolor={'bg-error-500'}
                                    onClick={() => Pay(connector)}
                                />
                            ) : (
                                <div
                                    className={`w-[24px] h-[24px] flex justify-center items-center rounded-full bg-success-500`}
                                >
                                    <IoCheckmark color='white' />
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}

export default SupplierIncomingsTableRow
