import React from 'react'
import PrintBtn from '../../Buttons/PrintBtn'
import BtnAddRemove from '../../Buttons/BtnAddRemove'
import {map, uniqueId} from 'lodash'

function CheckInventory() {

    const data = [
        {
            id: 1,
            date: '07.08.2022',
            code: '101010',
            product: 'otvod 90 (40)',
            initial: 75,
            count: 6,
            difference: -67,
            difference_usd: '-483 000',
            commit: ''
        },
        {
            id: 1,
            date: '07.08.2022',
            code: '101010',
            product: 'otvod 90 (40)',
            initial: 75,
            count: 6,
            difference: -67,
            difference_usd: '-483 000',
            commit: ''
        }
    ]

    const data2 = [
        {product: 'otvod 90 (40)', initial: 75, count: 6, difference: -67, difference_usd: '-483 000', commit: ''}
    ]


    return (
        <section className='w-[63.78rem] bg-white-900'>
            <div className='check-inventory-head'>
                <div className='flex text-[0.875rem] font-bold'>
                    {t("Sana")}:
                    <span className='check-ul-li-span ml-2'>07.08.2022</span>
                </div>
                <h3 className='text-[1.2rem] font-bold'>{t("Inventarizatsiya")} : <span>INV-4</span></h3>
                <h2 className='text-[1.4rem] font-bold'>PIPE HOUSE</h2>
            </div>
            <table className='border-collapse border border-slate-400 w-full'>
                <thead>
                <tr>
                    <td className='check-table-rtr'>{t("№")}</td>
                    <td className='check-table-rtr'>{t("Sana")}</td>
                    <td className='check-table-rtr'>{t("Kodi")}</td>
                    <td className='check-table-rtr'>{t("Maxsulot")}</td>
                    <td className='check-table-rtr'>{t("Dastlabki")}</td>
                    <td className='check-table-rtr'>{t("Sanoq")}</td>
                    <td className='check-table-rtr'>{t("Farqi")}</td>
                    <td className='check-table-rtr'>{t("Farqi USD")}</td>
                    <td className='check-table-rtr'>{t("Izoh")}</td>
                </tr>
                </thead>
                <tbody>
                {
                    map(data, (item, index) => {
                        return (
                            <tr key={uniqueId('checkInventory')}>
                                <td className='p-1 border text-center text-[0.875rem] font-bold'>{item.id}</td>
                                <td className='check-table-body'>{item.date}</td>
                                <td className='check-table-body'>{item.code}</td>
                                <td className='check-table-body'>{item.product}</td>
                                <td className='check-table-body'>{item.initial}</td>
                                <td className='check-table-body'>{item.count}</td>
                                <td className='check-table-body'>{item.difference}</td>
                                <td className='check-table-body'>{item.difference_usd}</td>
                                <td className='check-table-body'>{item.commit}</td>
                            </tr>
                        )
                    })
                }
                {
                    map(data2, (item) => {
                        return (
                            <tr key={uniqueId('checkData2')}>
                                <td className='p-1 border text-end text-[0.875rem] font-bold' colSpan={3}>{t("Jami")}:</td>
                                <td className='check-table-body text-start'>{item.product}</td>
                                <td className='check-table-body'>{item.initial}</td>
                                <td className='check-table-body'>{item.count}</td>
                                <td className='check-table-body'>{item.difference}</td>
                                <td className='check-table-body'>{item.difference_usd}</td>
                                <td className='check-table-body'>{item.commit}</td>
                            </tr>
                        )
                    })
                }

                </tbody>
            </table>
            <div className='flex justify-around items-center mt-[3rem]'>
                <div>
                    <PrintBtn />
                </div>
                <div className='w-[10rem]'>
                    <BtnAddRemove />
                </div>
            </div>
        </section>
    )
}

export default CheckInventory