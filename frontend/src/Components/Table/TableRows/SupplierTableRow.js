import React, {useEffect, useState} from 'react'
import TableBtn from '../../Buttons/TableBtn'
import {map} from 'lodash'

export const SupplierTableRow = ({
    data,
    currentPage,
    countPage,
    Edit,
    Delete,
    linkToSupplierReport,
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
            {map(data, (supplier, index) => (
                !isMobile?<tr key={supplier._id} className='tr'>
                    <td className='td'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-left'>{supplier.name}</td>
                    <td className='py-[0.375rem] td border-r-0 text-center'>
                        <div className='flex items-center justify-center gap-[0.625rem]'>
                            <TableBtn
                                type={'info'}
                                bgcolor={'bg-primary-800'}
                                onClick={() =>
                                    linkToSupplierReport(supplier._id)
                                }
                            />
                            <TableBtn
                                type={'edit'}
                                bgcolor='bg-warning-500'
                                onClick={() => Edit(supplier)}
                            />
                            <TableBtn
                                type={'delete'}
                                bgcolor='bg-error-500'
                                onClick={() => Delete(supplier)}
                            />
                        </div>
                    </td>
                </tr>:
                <li className='text-sm w-[90vw]  bg-[white] rounded-lg m-2 list-none'>
                    <li className='flex justify-between p-[10px] border border-b-1 border-s-0 border-t-0 border-e-0'>
                        <p>{currentPage * countPage + 1 + index}</p> 
                        <p className='text-[green]'>{supplier.name}</p>
                    </li>
                    <li className='flex justify-end p-[10px] '>
                    <div className='flex items-center justify-center gap-[0.625rem]'>
                            
                            <TableBtn
                                type={'edit'}
                                bgcolor='bg-warning-500'
                                onClick={() => Edit(supplier)}
                            />
                            <TableBtn
                                type={'delete'}
                                bgcolor='bg-error-500'
                                onClick={() => Delete(supplier)}
                            />
                        </div>
                    </li>
                </li>
            ))}
        </>
    )
}
