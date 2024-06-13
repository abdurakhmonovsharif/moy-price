import React, { useEffect, useState } from 'react'
import TableBtn from '../../Buttons/TableBtn'
import {map} from 'lodash'

export const ExchangenerateTableRow = ({
                                           data,
                                           currentPage,
                                           countPage,
                                           Edit,
                                           Delete
                                       }) => {
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
            {map(data,(exchange, index) => (
                !isMobile?<tr className='tr' key={exchange._id}>
                    <td className='text-left td'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='text-left td'>
                        {new Date(exchange.createdAt).toLocaleDateString()}
                    </td>
                    <td className='text-left td'>
                        1 USD - {exchange.exchangerate.toLocaleString('ru-Ru')} UZS
                    </td>
                    <td className='border-r-0 td py-[0.375rem]'>
                        <div className='flex items-center justify-center gap-[0.625rem]'>
                            <TableBtn
                                type={'edit'}
                                bgcolor={'bg-warning-500'}
                                onClick={() => Edit(exchange)}
                            />
                            <TableBtn
                                type={'delete'}
                                bgcolor={'bg-error-500'}
                                onClick={() => Delete(exchange)}
                            />
                        </div>
                    </td>
                </tr>:
                <li className='w-[90vw]  bg-white list-none mb-[10px]  rounded-md'>
                    <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                    <p className='text-[blue]'>
                    {new Date(exchange.createdAt).toLocaleDateString()}
                    </p>
                    <p className='text-[green]'>
                    1 USD - {exchange.exchangerate.toLocaleString('ru-Ru')} UZS
                    </p>
                    </li>

                    <li className=' p-[10px] text-sm flex justify-end '>
                    <p className='text-[blue]'>
                    <div className='flex items-center justify-center gap-[0.625rem]'>
                            <TableBtn
                                type={'edit'}
                                bgcolor={'bg-warning-500'}
                                onClick={() => Edit(exchange)}
                            />
                            <TableBtn
                                type={'delete'}
                                bgcolor={'bg-error-500'}
                                onClick={() => Delete(exchange)}
                            />
                        </div>
                    </p>
                    </li>
                </li>
            ))}
        </>
    )
}
