import { t } from 'i18next'
import React from 'react'
import {useSelector} from 'react-redux'

const TotalReportDate = () => {
    const {market} = useSelector((state) => state.login)
    return (
        <div className='flex justify-between items-center mainPadding'>
            <p className='text-2xl font-bold'>{t("Moliyaviy hisobot")}</p>
            <div className='max-w-[100px] max-h-[100px]'>
                {market.image && <img src={market?.image} alt='logo' />}
            </div>
            <div className='flex flex-col text-center leading-[2rem] text-[#00B4CC] font-bold'>
                <p className='text-4xl '>{t("Hisobot")}</p>
                <div className='text-2xl'>
                    {new Date(
                        new Date().setMonth(new Date().getMonth() - 3)
                    ).toLocaleDateString()}{' '}
                    - {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    )
}

export default TotalReportDate
