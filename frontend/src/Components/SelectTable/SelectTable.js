import React from 'react'
import Select from 'react-select'
import CustomStyle, {DropdownIcon} from '../SelectTable/CustomStyle.js'

const SelectTable = ({
    onSelect,
    options,
    isDisabled,
    label,
    placeholder,
    value,
    defaultValue,
}) => {
    return (
        <div className='grow'>
            {label && (
                <label
                    className={
                        'text-blue-700 block leading-[1.125rem] mb-[.625rem]'
                    }
                >
                    {label}
                </label>
            )}
            <Select
                onChange={onSelect}
                styles={CustomStyle}
                value={value}
                defaultValue={defaultValue}
                options={options}
                isDisabled={isDisabled}
                placeholder={placeholder}
                components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: DropdownIcon,
                }}
                isSearchable={false}
            />
        </div>
    )
}

export default SelectTable
