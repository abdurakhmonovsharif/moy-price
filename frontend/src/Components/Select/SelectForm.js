import React from 'react'
import Select from 'react-select'
import CustomStyle, {DropdownIcon} from './CustomStyle'
import { useTranslation } from 'react-i18next';
import '../../Pages/Category/Category.scss'
import {t} from 'i18next'

const SelectForm = ({onSelect, isDisabled}) => {
    const {t} = useTranslation(['common'])
    const options = [
        {value: 10, label: 10},
        {value: 20, label: 20},
        {value: 50, label: 50},
        {value: 100, label: 100},
        {value: 100000, label: t('Barchasi')}
    ]
    return (
        <div className='flex  items-center  justify-center'>
            <label
                htmlFor='select'
                className={
                    'text-[0.875rem] font-light text-blue-700 leading-[1rem]'
                }
            >
                {t(``)}
            </label>
            <Select
            
                onChange={onSelect}
                styles={CustomStyle}
                isSearchable={false}
                defaultValue={options[0]}
                options={options}
                isDisabled={isDisabled}
                id={'select'}
                components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: DropdownIcon
                }}
            />
        </div>
    )
}

export default SelectForm
