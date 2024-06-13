import React, {forwardRef} from 'react'
import {map, uniqueId} from 'lodash'
import {useSelector} from 'react-redux'
import {t} from 'i18next'

export const SaleCheckAll2 = forwardRef((props, ref) => {
    const {
        selled,
        returned,
        selledDiscounts,
        returnedDiscounts,
        selledPayments,
        returnedPayments,
        product,
        userInfo
    } = props
    const {market} = useSelector((state) => state.login)
    const {currencyType} = useSelector((state) => state.currency)
    const calculateAllSum = (data) => {
        return data
            ? data.reduce((acc, pr) => {
                return (
                    acc +
                    pr[
                        currencyType === 'USD'
                            ? 'totalprice'
                            : 'totalpriceuzs'
                        ]
                )
            }, 0)
            : 0
    }
    const calculateAllFilialSum = (data) => {
        if (currencyType === 'USD') {
            return data.reduce((prev, el) => prev + ((el.fromFilial || 0) * el.unitprice), 0)
        } else {
            return data.reduce((prev, el) => prev + ((el.fromFilial || 0) * el.unitpriceuzs), 0)
        }
    }
    const calculateAllDiscounts = (data) => {
        return data
            ? data.reduce((acc, pr) => {
                return (
                    acc +
                    pr[currencyType === 'USD' ? 'discount' : 'discountuzs']
                )
            }, 0)
            : 0
    }
    const calculateAllPayments = (data) => {
        return data
            ? data.reduce((acc, pr) => {
                return (
                    acc +
                    pr[currencyType === 'USD' ? 'payment' : 'paymentuzs']
                )
            }, 0)
            : 0
    }

    return (
        <div ref={ref} className={'bg-white-900 p-4 rounded-md'}>
            <div className='flex pb-2 justify-between border-b-[0.8px] border-black-700'>
                <ul className='w-[35%]'>
                    <li className='check-ul-li'>
                        {t('Do\'kon')}:
                        <span className='check-ul-li-span font-bold'>{market.name}</span>
                    </li>
                    <li className='check-ul-li'>
                        {t('Telefon')}:
                        <span className='check-ul-li-span font-bold'>
                            {market.phone1}
                        </span>
                    </li>
                    <li className='check-ul-li'>
                        {t('Manzil')}:
                        <span className='check-ul-li-span font-bold'>
                            {market?.address}
                        </span>
                    </li>
                    <li className='check-ul-li'>
                        {t('Sana')}:
                        <span className='check-ul-li-span'>
                            {new Date(product?.createdAt).toLocaleDateString()}{' '}
                            <span className='ml-3 font-bold'>
                                {new Date(
                                    product?.createdAt
                                ).toLocaleTimeString()}
                            </span>
                        </span>
                    </li>
                    <li className='check-ul-li font-bold'>
                        {t('Mijoz')}:{' '}
                        <span className='check-ul-li-span font-bold'>
                            {product?.client?.name ||
                                product?.packman?.name ||
                                ''}
                        </span>
                    </li>
                </ul>
                <div>
                    <img className='w-[200px]' src={market?.image} alt='logo' />
                </div>
                <div className='check-ul-li flex-col'>
                    <div className={'grow text-center'}>
                        <h2 className='check-text-style mb-5'>
                            {t('Sotuv')}: <span className={'ml-2 font-bold'}>{product?.id}</span>
                        </h2>
                    </div>
                    <div className='check-ul-li justify-end'>
                        <p>
                            {t('Sotuvchi')}:{' '}
                            <span className='check-ul-li-span font-bold'>
                                {userInfo?.firstname} {userInfo?.lastname}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            {selled?.length > 0 && (
                <div className='mt-5'>
                    <h3 className='text-[1.3rem] text-black-900 mb-5 font-bold'>
                        {t('Sotilganlar')} :
                    </h3>
                    {
                        selled.map((item,index)=>{
                            if (
                                item.more_parameters1.length != 0 &&
                                item.more_parameters1.size != 0 &&
                                item.more_parameters1.piece != 0
                            ) {
                                return (
                                    <div>
                                        <div className='text-left text-[12px] text-black-900 font-bold'>
                                            {index + 1}.{' '}
                                            {item?.product?.productdata?.name}
                                        </div>
                                        <table className='border-collapse border border-slate-400 w-full break-inside-auto'>
                                            <thead>
                                                <tr
                                                    className={
                                                        'break-inside-avoid break-after-auto'
                                                    }
                                                >
                                                    <th className='check-table-rtr'>
                                                        {t('Uzunligi')}
                                                    </th>
                                                    <th className='check-table-rtr'>
                                                        {t('O`lchami')}
                                                    </th>
                                                    <th className='check-table-rtr'>
                                                        {t('Bo`lak')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='check-table-body text-center'>
                                                        {
                                                            item
                                                                .more_parameters1
                                                                ?.length
                                                        }  
                                                    </td>
                                                    <td className='check-table-body text-center'>
                                                        {
                                                            item
                                                                .more_parameters1
                                                                ?.size 
                                                        }{" "} sm
                                                    </td>
                                                    <td className='check-table-body text-center'>
                                                        {
                                                            item
                                                                .more_parameters1
                                                                ?.piece
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className='text-end text-[12px] border font-bold border-t-0 !text-black-900 p-1 pr-3 border-slate-400'>
                                            Umumiy: {item?.pieces} {"metr"} *{' '}
                                            {currencyType === 'USD'
                                                ? item?.unitprice.toLocaleString(
                                                      'ru-Ru'
                                                  )
                                                : item?.unitpriceuzs.toLocaleString(
                                                      'ru-Ru'
                                                  )}{' '}
                                            ={' '}
                                            {currencyType === 'USD'
                                                ? item?.totalprice.toLocaleString(
                                                      'ru-Ru'
                                                  )
                                                : item?.totalpriceuzs.toLocaleString(
                                                      'ru-Ru'
                                                  )}{' '}
                                            {currencyType}
                                        </div>
                                    </div>
                                )
                            }else if(item.more_parameters2.length!==0){
                                return <div>
                                <div className='text-left  text-[12px] text-black-900 font-bold'>
                                    {index + 1}.{' '}
                                    {item?.product?.productdata?.name}
                                </div>
                                <table className='border-collapse border border-slate-400 w-full break-inside-auto'>
                                    <thead>
                                        <tr
                                            className={
                                                'break-inside-avoid break-after-auto'
                                            }
                                        >
                                            <th className='check-table-rtr'>
                                                {t('1 qator')} 
                                            </th>
                                            <th className='check-table-rtr'>
                                                {t('2 qator')}
                                            </th>
                                            <th className='check-table-rtr'>
                                                {t('Umumiy')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            item.more_parameters2.map((column)=>  <tr>
                                            <td className='check-table-body text-center'>
                                                {
                                                  column.col1
                                                }
                                            </td>
                                            <td className='check-table-body text-center'>
                                                {
                                                    column.col2
                                                }
                                            </td>
                                            <td className='check-table-body text-center'>
                                                {
                                                    column.result   
                                                }
                                            </td>
                                        </tr>)
                                        }
                                    </tbody>
                                </table>
                                <div className='text-end text-[12px] border border-t-0 !text-black-900 p-1 pr-3 font-bold border-slate-400'>
                                    Umumiy: {item.more_parameters2.reduce((el,prev)=>{
                                        return el+prev.result
                                    },0)}
                                </div>
                                <div className='text-end mt-4 font-bold'>
                                <h1>{item.more_parameters2.reduce((el,prev)=>{
                                        return el+prev.result
                                    },0)} {" "}
                                   * {' '}
                                            {currencyType === 'USD'
                                                ? item?.unitprice.toLocaleString(
                                                      'ru-Ru'
                                                  )
                                                : item?.unitpriceuzs.toLocaleString(
                                                      'ru-Ru'
                                                  )}{' '}
                                            ={' '}
                                            {currencyType === 'USD'
                                                ? item?.totalprice.toLocaleString(
                                                      'ru-Ru'
                                                  )
                                                : item?.totalpriceuzs.toLocaleString(
                                                      'ru-Ru'
                                                  )}{' '}
                                            {currencyType}
                                    </h1>
                                </div>
                            </div>
                            }
                        })
                    }
                  {
                    selled.some((item)=> item.more_parameters1.length == 0 &&
                    item.more_parameters1.size == 0 &&
                    item.more_parameters1.piece == 0 &&
                    item.more_parameters2.length===0)&&
                     <table className='border-collapse border border-slate-400 w-full'>
                     <thead>
                     <tr>
                         <td className='check-table-rtr'>№</td>
                         <td className='check-table-rtr'>{t('Sana')}</td>
                         <td className='check-table-rtr'>{t('Kodi')}</td>
                         <td className='check-table-rtr'>{t('Maxsulot')}</td>
                         <td className='check-table-rtr'>{t('Soni')}</td>
                         {selled.some(el => el.fromFilial > 0) &&
                             <td style={{backgroundColor: 'grey'}} className='check-table-rtr'>{t('Ombordan')}</td>}
                         <td className='check-table-rtr'>{t('Narxi')}({t('Dona')})</td>
                         <td className='check-table-rtr'>{t('Jami')}</td>
                         <td className='check-table-rtr'>{t('Sotuvchi')}</td>
                     </tr>
                     </thead>
                     <tbody>
                     {map([...selled].sort((a, b) => Number(a?.product?.category?.code) - Number(b?.product?.category?.code)), (item, index) => {
                         if(
                             item.more_parameters1.length == 0 &&
                             item.more_parameters1.size == 0 &&
                             item.more_parameters1.piece == 0 &&
                             item.more_parameters2.length===0
                         ){
                         return (
                             <tr key={uniqueId('selled-row')}>
                                 <td className='p-1 border text-center text-[0.875rem] font-bold'>
                                     {index + 1}
                                 </td>
                                 <td className='check-table-body'>
                                     {new Date(
                                         item?.createdAt
                                     ).toLocaleDateString()}
                                 </td>
                                 <td className='check-table-body text-center'>
                                     {item?.product?.category?.code} {item?.product?.productdata?.code}
                                 </td>
                                 <td className='check-table-body text-start'>
                                     {item?.product?.productdata?.name}
                                 </td>
                                 <td className='check-table-body'>
                                     {item?.pieces}
                                 </td>
                                 {selled.some(el => el.fromFilial > 0) &&
                                     <td style={{backgroundColor: item?.fromFilial ? 'grey' : 'white'}}
                                         className='check-table-body'>
                                         {item?.fromFilial}
                                     </td>}
                                 <td className='check-table-body'>
                                     {currencyType === 'USD'
                                         ? item?.unitprice.toLocaleString(
                                             'ru-Ru'
                                         )
                                         : item?.unitpriceuzs.toLocaleString(
                                             'ru-Ru'
                                         )}{' '}
                                     {currencyType}
                                 </td>
                                 <td className='check-table-body'>
                                     {currencyType === 'USD'
                                         ? item?.totalprice.toLocaleString(
                                             'ru-Ru'
                                         )
                                         : item?.totalpriceuzs.toLocaleString(
                                             'ru-Ru'
                                         )}{' '}
                                     {currencyType}
                                 </td>
                                 <td className='check-table-body'>
                                     {item?.user
                                         ? item.user.firstname +
                                         ' ' +
                                         item.user.lastname[0]
                                         : ''}
                                 </td>
                             </tr>
                         )
                     }})}
                     </tbody>
                 </table>
                  }
                </div>
            )}
            <div className='border-t-[0.8px] border-black-700 w-full mt-4 mb-4 text-end'>
                <h3 className='text-black-900 text-[1.1rem] text-black-700 font-bold pt-4'>
                    {t('Sotilganlar jami')} :{' '}
                    <span className='text-black-900 font-bold'>
                        {calculateAllSum(selled).toLocaleString('ru-Ru')}{' '}
                        {currencyType}
                    </span>
                </h3>
                {selled.some(el => el.fromFilial > 0) &&
                    <h3 className='text-black-900 text-[14px] text-black-700 font-bold pt-4'>
                        {t('Ombordagi jami')} :{' '}
                        <span className=' text-black-900 font-bold'>
                        {calculateAllFilialSum(selled).toLocaleString('ru-Ru')}{' '}
                            {currencyType}
                    </span>
                    </h3>}
            </div>
            {returned?.length > 0 && (
                <>
                    <div className='mt-5'>
                        <h3 className='text-[1.3rem] text-black-700 mb-5 font-bold'>
                            {t('Qaytarilganlar')} :
                        </h3>
                        <table className='border-collapse border border-slate-400 w-full'>
                            <thead>
                            <tr>
                                <td className='check-table-rtr'>№</td>
                                <td className='check-table-rtr'>{t('Sana')}</td>
                                <td className='check-table-rtr'>{t('Kodi')}</td>
                                <td className='check-table-rtr'>
                                    {t('Maxsulot')}
                                </td>
                                <td className='check-table-rtr'>{t('Soni')}</td>
                                <td className='check-table-rtr'>
                                    {t('Narxi')}({t('Dona')})
                                </td>
                                <td className='check-table-rtr'>{t('Jami')}</td>
                            </tr>
                            </thead>
                            <tbody>
                            {map(returned, (item, index) => {
                                return (
                                    <tr key={uniqueId('selled-row')}>
                                        <td className='p-1 border text-center text-[0.875rem] font-bold'>
                                            {index + 1}
                                        </td>
                                        <td className='check-table-body'>
                                            {new Date(
                                                item?.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className='check-table-body'>
                                            {
                                                item?.product?.productdata
                                                    ?.code
                                            }
                                        </td>
                                        <td className='check-table-body'>
                                            {
                                                item?.product?.productdata
                                                    ?.name
                                            }
                                        </td>
                                        <td className='check-table-body'>
                                            {item?.pieces}
                                        </td>
                                        <td className='check-table-body'>
                                            {currencyType === 'USD'
                                                ? item?.unitprice.toLocaleString(
                                                    'ru-Ru'
                                                )
                                                : item?.unitpriceuzs.toLocaleString(
                                                    'ru-Ru'
                                                )}{' '}
                                            {currencyType}
                                        </td>
                                        <td className='check-table-body'>
                                            {currencyType === 'USD'
                                                ? item?.totalprice.toLocaleString(
                                                    'ru-Ru'
                                                )
                                                : item?.totalpriceuzs.toLocaleString(
                                                    'ru-Ru'
                                                )}{' '}
                                            {currencyType}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className='border-t-[0.8px] border-black-700 w-full mt-4 mb-4 text-end'>
                        <h3 className='text-black-900 text-[1.1rem] text-black-700 font-bold pt-4'>
                            {t('Qaytarilganlar jami')} :{' '}
                            <span className='text-black-900 font-bold'>
                                {calculateAllSum(returned).toLocaleString(
                                    'ru-Ru'
                                )}{' '}
                                {currencyType}
                            </span>
                        </h3>
                    </div>
                </>
            )}
            <div className='border-t-[0.8px] border-black-700 w-full my-[1.5rem]'></div>
            <ul>
                <li className='text-black-900 check-ul-li-foot border-t-0'>
                    {' '}
                    {t('Jami')}:{' '}
                    <span className='text-black-900 font-bold'>
                        {(
                            calculateAllSum(selled) + calculateAllSum(returned)
                        ).toLocaleString('ru-Ru')}{' '}
                        {currencyType}
                    </span>
                </li>
                <li className='text-black-900 check-ul-li-foot'>
                    {' '}
                    {t('Chegirma')}:{' '}
                    <span className='text-black-900 font-bold'>
                        {(
                            calculateAllDiscounts(selledDiscounts) +
                            calculateAllDiscounts(returnedDiscounts)
                        ).toLocaleString('ru-Ru')}{' '}
                        {currencyType}
                    </span>
                </li>
                <li className='text-black-900 check-ul-li-foot'>
                    {' '}
                    {t('To\'langan')}:{' '}
                    <span className='text-black-900 font-bold'>
                        {(
                            calculateAllPayments(selledPayments) +
                            calculateAllPayments(returnedPayments)
                        ).toLocaleString('ru-Ru')}{' '}
                        {currencyType}
                    </span>
                </li>
                <li className='text-black-900 check-ul-li-foot'>
                    {' '}
                    {t('Qarz')}:{' '}
                    <span className=' text-black-900 font-bold'>
                        {(
                            calculateAllSum(selled) +
                            calculateAllSum(returned) -
                            (calculateAllPayments(selledPayments) +
                                calculateAllPayments(returnedPayments)) -
                            (calculateAllDiscounts(selledDiscounts) +
                                calculateAllDiscounts(returnedDiscounts))
                        ).toLocaleString('ru-Ru')}{' '}
                        {currencyType}
                    </span>
                </li>
                <li className='text-black-900 check-ul-li-foot'>
                    {' '}
                    {t('Umumiy qarz')}:{' '}
                    <span className=' text-black-900 font-bold'>
                        {currencyType === 'USD' ? product?.totaldebtusd || 0 : product?.totaldebtuzs || 0}
                        {currencyType}
                    </span>
                </li>
            </ul>
        </div>
    )
})
