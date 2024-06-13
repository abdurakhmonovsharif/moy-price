import { t } from 'i18next'
import React from 'react'

const TotalReportTable = ({number, currency, cost, plastic, transfer}) => {
    return (
        <table className='w-full'>
            <tbody>
                <tr className='tr-div'>
                    <td className='td-page'>{t("Sotish soni")}</td>
                    <td className='td-page-two font-bold'>{number}</td>
                </tr>
                <tr className='tr-div'>
                    <td className='td-page'>{t("Naqd")}</td>
                    <td className='td-page-two font-bold'>
                        {cost} {currency}
                    </td>
                </tr>
                <tr className='tr-div'>
                    <td className='td-page'>{t('Plastik')}</td>
                    <td className='td-page-two font-bold'>
                        {plastic} {currency}
                    </td>
                </tr>
                <tr className='tr-div'>
                    <td className='td-page'>{t("O`tkazma")}</td>
                    <td className='td-page-two font-bold'>
                        {transfer} {currency}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default TotalReportTable
