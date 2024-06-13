import React from 'react'
import TableBtn from '../../Buttons/TableBtn'
import {map} from 'lodash'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {roundUsd, roundUzs} from '../../../App/globalFunctions'

export const CategoryTableRow = ({
    data,
    currentPage,
    countPage,
    Edit,
    Delete,
    startDate, 
    endDate
}) => {
    const navigate = useNavigate()
    const { currencyType } = useSelector((state) => state.currency)
    return (
        <>
            {map(data, (category, index) => (
                <tr key={category._id} className='tr'>
                    <td className='td'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td'>{category.code}</td>
                    <td className='td'>{category.name}</td>
                    <td className='td'>{category?.totalproducts}</td>
                    <td className='td'>{currencyType === 'USD' ? roundUsd(category?.totalsales).toLocaleString('ru-RU') : roundUzs(category?.totalsalesuzs).toLocaleString('ru-RU')} {currencyType}</td>
                    <td className='td'>{currencyType === 'USD' ? roundUsd(category?.profit).toLocaleString('ru-RU') : roundUzs(category?.profituzs).toLocaleString('ru-RU')} {currencyType}</td>
                    <td className='td border-r-0 text-center max-w-[50px] py-[0.375rem]'>
                        <div className='flex items-center justify-center'>
                            <TableBtn
                                type={'report'}
                                bgcolor='bg-primary-800 mr-2.5'
                                onClick={() => navigate(category.code, {
                                    state: {
                                        id: category._id,
                                        name: category.name,
                                        startDate,
                                        endDate
                                    }
                                })}
                            />
                            <TableBtn
                                type={'edit'}
                                bgcolor='bg-warning-500'
                                onClick={() => Edit(category)}
                            />
                            <TableBtn
                                type={'delete'}
                                bgcolor='bg-error-500 ml-2.5'
                                onClick={() => Delete(category)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
