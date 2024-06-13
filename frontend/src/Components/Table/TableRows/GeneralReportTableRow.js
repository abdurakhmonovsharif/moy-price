import React, {useEffect, useState} from 'react'
import {uniqueId} from 'lodash'
import {t} from 'i18next'

export const GeneralReportTableRow = ({data, currency}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <>  
            {
                !isMobile?<tr className='tr' key={uniqueId('sales')}>
                <td className='text-center td py-2'>
                    {data?.salesCount?.toLocaleString()}
                </td>
                <td className='td text-center'>
                    {data?.saleProducts?.toLocaleString()}
                </td>
                <td className='td text-right font-bold'>
                    {currency === 'UZS'
                        ? data?.totalpriceuzs?.toLocaleString()
                        : data?.totalprice?.toLocaleString()}{' '}
                    {currency}
                </td>
            </tr>:
                <li className='text-sm w-[90vw]   bg-[white] rounded-lg m-2 list-none'>
                <li className='flex justify-between p-[10px] '>
                <p>{t('Sotuvlar soni')}</p>
                <p className='text-[green]'>
                    {data?.salesCount?.toLocaleString()}
                </p>
                </li><li className='flex justify-between p-[10px] '>
                <p>{t('Sotilgan maxsulotlar')}</p>
                <p className='text-[green]'>
                {data?.saleProducts?.toLocaleString()}
                </p>
                </li>
                <li className='flex justify-between p-[10px] '>
                <p>{t('Jami tushum')}</p>
                <p className='text-[green]'>
                {currency === 'UZS'
                        ? data?.totalpriceuzs?.toLocaleString()
                        : data?.totalprice?.toLocaleString()}{' '}
                    {currency}
                </p>
                </li>
                </li>
                
            }
        </>
    )
}
