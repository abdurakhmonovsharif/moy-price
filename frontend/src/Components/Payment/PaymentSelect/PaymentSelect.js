import {useSelector} from 'react-redux'
import Select from 'react-select'
import CustomStyle, {DropdownIcon} from './CustomStyle.js'
import {t} from 'i18next'

function PaymentSelect({value, onChange, option, onSelect}) {
    const {currencyType} = useSelector((state) => state.currency)
    const options = [
        {value: currencyType, label: currencyType},
        {value: '%', label: '%'},
    ]
    return (
        <div
            className={`flex w-[11.75rem] border border-warning-500 rounded-[0.25rem] outline outline-transparent outline-0 focus-within:outline-2 focus-within:outline-warning-500 transition-all ease-in-out duration-100 relative`}
        >
            <input
                className='w-[8.6875rem] placeholder-blue-200 py-[0.3125rem] px-[.3125rem] rounded-l-[0.25rem] outline-0 text-sm text-right transition-all ease-in-out duration-100'
                placeholder={`${t('misol')}: 100 000 000`}
                type={'number'}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value)
                }}
                onWheel={(e) => e.target.blur()}
                min={0}
            />
            <Select
                onChange={onSelect}
                styles={CustomStyle}
                isSearchable={false}
                value={option}
                options={options}
                components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: DropdownIcon,
                }}
            />
        </div>
    )
}

export default PaymentSelect
