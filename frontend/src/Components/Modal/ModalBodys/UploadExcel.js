import React, {useEffect, useState} from 'react'
import SelectInput from '../../SelectInput/SelectInput'
import {useSelector} from 'react-redux'
import SmallLoader from '../../Spinner/SmallLoader.js'
import {map, uniqueId} from 'lodash'
import {t} from 'i18next'

function UploadExcel({
                         excelData,
                         headers,
                         createdData,
                         setCreatedData,
                         approveFunction,
                         toggleModal
                     }) {
    const {loading} = useSelector((state) => state.products)
    const [cols, setCols] = useState([])
    const [values, setValues] = useState([])
    const clone = (obj) => Object.assign({}, obj)
    const renameKey = (object, key, newKey) => {
        const clonedObj = clone(object)
        clonedObj[newKey] = clonedObj[key]
        return clonedObj
    }
    const handleSelect = (idx, key, option) => {
        values[idx] = {label: option.label, value: option.value}
        setValues([...values])
        setCols([...cols])
        const newData = map(createdData, (item) =>
            renameKey(item, option.value, key)
        )
        setCreatedData([...newData])
    }
    useEffect(() => {
        const newValues = []
        let len = headers.length
        while (len--) {
            newValues.push('')
        }
        setValues([...newValues])
        setCreatedData([...excelData])
        const newOptions = map(Object.keys(excelData[0]), (obj) => ({
            label: obj,
            value: obj
        }))
        setCols(newOptions)
        //    eslint-disable-next-line react-hooks/exhaustive-deps
    }, [excelData])
    return (
        <div className={'modalContent mt-10'}>
            {loading && (
                <div
                    className='fixed backdrop-blur-[2px] z-[50] top-0 left-0 right-0 bottom-0 bg-white-700 flex flex-col items-center justify-center w-full'>
                    <SmallLoader />
                </div>
            )}
            <table className='overflow-x-auto w-full'>
                <thead className='rounded-t-lg'>
                <tr className='bg-primary-900 rounded-t-lg'>
                    {map(headers, (header, index) => (
                        <th
                            key={uniqueId('header')}
                            scope='col'
                            className={'th w-[6rem]'}
                        >
                            <div className='ml-1'>
                                    <span className={'mb-4 block text-xs'}>
                                        {header.name}
                                    </span>
                                <SelectInput
                                    onSelect={(option) =>
                                        handleSelect(
                                            index,
                                            header.value,
                                            option
                                        )
                                    }
                                    options={cols}
                                    value={values[index]}
                                    placeholder={'Bo`limni tanlang ...'}
                                />
                            </div>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                <tr className='tr'>
                    {map(values, (option, index) => (
                        <td
                            key={uniqueId('column')}
                            className='td text-center py-4'
                        >
                            {
                                option ? excelData[0][
                                    option?.value
                                    ] : excelData[0][cols[values.length > cols.length ? index - 1 : values.length < cols.length ? index + 1 : index]?.value]
                            }
                        </td>
                    ))}
                </tr>
                </tbody>
            </table>
            <div className={'flex mt-12 items-center justify-end gap-[1.5rem]'}>
                <button
                    className={'approveBtn bg-black-500 hover:bg-black-700'}
                    onClick={toggleModal}
                >
                    {t('Bekor qilish')}
                </button>
                <button
                    className={'approveBtn bg-success-500 hover:bg-success-700'}
                    onClick={approveFunction}
                >
                    {t('Tasdiqlash')}
                </button>
            </div>
        </div>
    )
}

export default UploadExcel
