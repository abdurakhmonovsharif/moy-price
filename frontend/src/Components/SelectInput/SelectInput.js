import React from 'react'
import Select from 'react-select'
import CustomStyle, {DropdownIcon} from './CustomStyle'

const SelectInput = ({
    onSelect,
    options,
    isDisabled,
    label,
    placeholder,
    value,
}) => {
    return (
        <div className='grow '>
            {label && (
                <label
                    className={
                        'w-[90%] text-blue-700 block leading-[1.125rem] mb-[.625rem]'
                    }
                >
                    {label}
                </label>
            )}
            <Select
                onChange={onSelect}
                styles={CustomStyle}
                value={value}
                defaultValue={''}
                options={options}
                isDisabled={isDisabled}
                placeholder={placeholder}
                components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: DropdownIcon,
                }}
            />
        </div>
    )
}

export default SelectInput
