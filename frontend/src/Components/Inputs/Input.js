import {useState} from 'react'
import {IoEye, IoEyeOff} from 'react-icons/io5'

function Input({
    star,
    placeholder,
    type,
    value,
    onChange,
    password,
    label,
    onKeyUp,
    disabled,
    autoComplete,
    step
}) {
    const [currentShow, setCurrentShow] = useState(false)
    const changeType = () => {
        setCurrentShow(!currentShow)
    }

    return (
        <div className={'input-container'}>
            {label && (
                <label
                    className={`labelClass leading-[1.125rem] ${
                        star
                            ? " after:content-['*'] after:text-[#F04438] after:pl-[0.25rem]"
                            : ''
                    }`}
                >
                    {label}
                </label>
            )}
            <div className='relative'>
                <input
                    placeholder={placeholder}
                    type={currentShow ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    disabled={disabled}
                    className={`${
                        disabled ? 'disabled-class' : ''
                    } inputClass shadow-[0_10px_10px_rgba(0,0,0,0.05)] leading-[1.125rem]`}
                    onWheel={(e) => e.target.blur()}
                    min={0}
                    autoComplete={autoComplete || 'off'}
                    step={step}
                />
                {password && (
                    <button
                        className={'iconButton'}
                        type={'button'}
                        onClick={changeType}
                    >
                        {currentShow ? (
                            <IoEye className='iconClass' />
                        ) : (
                            <IoEyeOff className='iconClass' />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Input
