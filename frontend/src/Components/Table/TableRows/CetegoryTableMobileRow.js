import React from 'react'
import TableBtn from '../../Buttons/TableBtn'
import { map } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { roundUsd, roundUzs } from '../../../App/globalFunctions'
import { useTranslation } from 'react-i18next'

export const CategoryTableMobileRow = ({
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
    const {t} = useTranslation(['common'])
    return (
        <>
            {map(data, (category, index) => (
               
                <li   className='text-sm w-[90vw]  bg-[white] rounded-lg m-1 list-none'>
                    <li onClick={() => navigate(category.code, {
                    state: {
                        id: category._id,
                        name: category.name,
                        startDate,
                        endDate
                    }
                })}  className='flex justify-between p-[10px] border border-b-1 border-s-0 border-t-0 border-e-0'><p>{category.code}-{category.name}</p> <p className='text-[blue]'>{t("Sotilganlar soni")}: {category?.totalproducts}</p></li>
                    <li onClick={() => navigate(category.code, {
                    state: {
                        id: category._id,
                        name: category.name,
                        startDate,
                        endDate
                    }
                })}  className='text-[#19737A] flex justify-between p-[10px] border border-b-1 border-s-0 border-t-0 border-e-0'>
                    <p className=' '>{t('Sotilganlar Jami')}: {currencyType === 'USD' ? roundUsd(category?.totalsales).toLocaleString('ru-RU') : roundUzs(category?.totalsalesuzs).toLocaleString('ru-RU')} {currencyType} </p>
                    </li>
                    <li onClick={() => navigate(category.code, {
                    state: {
                        id: category._id,
                        name: category.name,
                        startDate,
                        endDate
                    }
                })}  className='text-[green] flex justify-between p-[10px] border border-b-1 border-s-0 border-t-0 border-e-0'>
                    <p className='  '>{t('Sof foyda')}: {currencyType === 'USD' ? roundUsd(category?.profit).toLocaleString('ru-RU') : roundUzs(category?.profituzs).toLocaleString('ru-RU')} {currencyType}</p>
                    </li>
                    
                    <li className='flex items-center justify-end p-[10px] '>
                    
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
                    </li>
                </li>
            
            ))}
        </>
    )
}
