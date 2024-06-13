import React, {useEffect, useState} from 'react'
import TableBtn from '../../Buttons/TableBtn'
import {map} from 'lodash'

export const UnitTableRow = ({data, currentPage, countPage, Edit, Delete}) => {
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
            {map(data,(unit, index) => (
                !isMobile? <tr key={unit._id} className='tr'>
                    <td className='td'>
                        {currentPage * countPage + 1 + index}
                    </td>
                    <td className='td text-left'>{unit.name}</td>
                    <td className='py-[0.375rem] td border-r-0 text-center max-w-[50px]'>
                        <div className='flex items-center justify-center'>
                            <TableBtn
                                type={'edit'}
                                bgcolor='bg-warning-500'
                                onClick={() => Edit(unit)}
                            />
                      
                        </div>
                    </td>
                </tr>:
                <li className='text-1xl w-[90vw]  bg-[white] rounded-lg m-1 list-none'>
                    <li className='flex justify-between p-[10px] items-center'><p>{unit.name}</p> <p className='text-[blue]'>
                    <div className='flex items-center justify-end w-[100px]'>
                            <TableBtn
                                type={'edit'}
                                bgcolor='bg-warning-500'
                                onClick={() => Edit(unit)}
                            />
                            <TableBtn
                                type={'delete'}
                                bgcolor='bg-error-500 ml-2.5'
                                onClick={() => Delete(unit)}
                            />
                        </div>
                        </p></li>
                    
                </li>
                
            ))}
        </>
    )
}
