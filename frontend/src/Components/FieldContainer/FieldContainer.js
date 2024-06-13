import Input from '../Inputs/Input'
import SelectInput from '../SelectInput/SelectInput'

function FieldContainer({
    star,
    maxWidth,
    value,
    onChange,
    label,
    placeholder,
    type,
    select,
    disabled,
    options,
    border,
    onKeyUp,
    autoComplete,
    step,
}) {
    return (
        <div
            className={maxWidth ? `${maxWidth}   ${border ? '' : ''}` : 'grow'}
        >
            {select ? (
                <SelectInput
                    placeholder={placeholder}
                    onSelect={onChange}
                    label={label}
                    isDisabled={disabled}
                    options={options}
                    value={value}
                />
            ) : (
                <Input
                    step={step}
                    star={star}
                    type={type || 'text'}
                    value={value}
                    onChange={onChange}
                    label={label}
                    placeholder={placeholder}
                    onKeyUp={onKeyUp}
                    disabled={disabled}
                    autoComplete={autoComplete}
                />
            )}
        </div>
    )
}

export default FieldContainer
