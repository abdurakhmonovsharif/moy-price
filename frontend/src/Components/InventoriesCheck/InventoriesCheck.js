import React, {forwardRef} from 'react'
import {useSelector} from 'react-redux'
import {uniqueId, map} from 'lodash'
import { t } from 'i18next'
const InventoriesCheck = forwardRef((props, ref) => {

    const {currencyType} = useSelector(state => state.currency)
    const {data} = props
    let initial = 0
    let count = 0
    let differences = 0
    let differencescurrent = 0

    {
        data? map(data, (item) => {
            initial += item?.productcount
            count += item?.inventorycount
            differences += (item?.inventorycount - item?.productcount)
            currencyType === 'UZS' ?
                differencescurrent += (item?.inventorycount * item?.price.incomingpriceuzs - item?.productcount * item?.price.incomingpriceuzs) :
                differencescurrent += (item?.inventorycount * item?.price.incomingprice - item?.productcount * item?.price.incomingprice)
        }) : []
    }

    return (
        <div ref={ref} className={'bg-white-900 p-4 rounded-md'}>
            <div className='check-inventory-head'>
                <div className='flex text-[0.875rem] font-bold'>
                {t('Sana')}:
                    {data ?
                        <span className='check-ul-li-span ml-2'>{new Date(data[0]?.createdAt).toLocaleDateString()}
                            <span className='ml-3'>{new Date(data[0]?.createdAt).toLocaleTimeString()}</span></span>
                        : ''}
                </div>
                <h3 className='text-[1.2rem] font-bold'>{t('Inventarizatsiya')} : <span>INV-4</span></h3>
                <h2 className='text-[1.4rem] font-bold'>PIPE HOUSE</h2>
            </div>
            <table className='border-collapse border border-slate-400 w-full'>
                <thead>
                <tr>
                    <td className='check-table-rtr'>№</td>
                    <td className='check-table-rtr'>{t('Sana')}</td>
                    <td className='check-table-rtr'>{t('Kodi')}</td>
                    <td className='check-table-rtr'>{t('Maxsulot')}</td>
                    <td className='check-table-rtr'>{t('Dastlabki')}</td>
                    <td className='check-table-rtr'>{t('Sanoq')}</td>
                    <td className='check-table-rtr'>{t('Farqi')}</td>
                    <td className='check-table-rtr'>{t('Farqi')} {currencyType}</td>
                    <td className='check-table-rtr'>{t('Izoh')}</td>
                </tr>
                </thead>
                <tbody>
                {data ?
                    map(data, (item, index) => {
                        return (
                            <tr key={uniqueId('inventoriesCheck')}>
                                <td className='p-1 border text-center text-[0.875rem] font-bold'>{index + 1}</td>
                                <td className='check-table-body'>{new Date(item?.createdAt).toLocaleDateString()}</td>
                                <td className='check-table-body text-center'>{item?.productdata?.code}</td>
                                <td className='check-table-body text-left'>{item?.productdata?.name}</td>
                                <td className='check-table-body'>{item?.productcount}</td>
                                <td className='check-table-body'>{item?.inventorycount}</td>
                                <td className='check-table-body'>{item?.inventorycount - item?.productcount}</td>
                                <td className='check-table-body'>{currencyType === 'UZS' ? (item?.inventorycount * item?.price.incomingpriceuzs - item?.productcount * item?.price.incomingpriceuzs).toLocaleString('ru-Ru') : (item?.inventorycount * item?.price.incomingprice - item?.productcount * item?.price.incomingprice).toLocaleString('ru-Ru')}</td>
                                <td className='check-table-body'>{item.commit}</td>
                            </tr>
                        )
                    }) : []
                }

                {/* {   data ?
                        data.map((item, index) => {
                            initial += item?.productcount;
                            count += item?.inventorycount;
                            differences += (item?.inventorycount - item?.productcount)
                            currencyType === "UZS" ? 
                            differencescurrent += (item?.inventorycount * item?.price.incomingpriceuzs - item?.productcount * item?.price.incomingpriceuzs)  :   
                            differencescurrent += (item?.inventorycount * item?.price.incomingprice - item?.productcount * item?.price.incomingprice)              
                        }) : []
                        } */}
                <tr>
                    <td className='p-1 border text-end text-[0.875rem] font-bold' colSpan={4}>Jami:</td>
                    <td className='check-table-body'>{initial}</td>
                    <td className='check-table-body'>{count}</td>
                    <td className='check-table-body'>{differences}</td>
                    <td className='check-table-body'>{differencescurrent.toLocaleString('ru-Ru')}</td>
                    <td className='check-table-body'></td>
                </tr>
                </tbody>
            </table>

        </div>
    )
})

export default InventoriesCheck