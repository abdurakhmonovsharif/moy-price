function TableInput({
                        placeholder,
                        type,
                        value,
                        onChange,
                        label,
                        disabled,
                        onKeyUp,
                    }) {
    return (
        <div className={'w-full'}>
            <label>
                {label}
                <input
                    disabled={disabled}
                    className='tableInput lg:h-[auto]  h-[30px]'
                    placeholder={placeholder}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    onWheel={(e) => e.target.blur()}
                    min={0}
                    
                />
            </label>
        </div>
    )
}

export default TableInput
