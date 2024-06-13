import React from 'react'
import {components} from 'react-select'
import {IoCaretDown} from 'react-icons/io5'

export const DropdownIcon = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <IoCaretDown size={'0.625rem'} color={'#86A7E9'} />
        </components.DropdownIndicator>
    )
}

const DropdownIndicator = (styles, {isFocused}) => ({
    ...styles,
    padding: 0,
    paddingRight: '.625rem',
    color: isFocused ? '#193F8A' : '#071F45',
})
const Menu = (styles) => ({
    ...styles,
})
const Option = (styles, {isDisabled}) => ({
    ...styles,
    fontSize: '.875rem',
    fontWeight: '400',
    padding: '5px 8px',
    color: isDisabled ? '#DBDEDC' : '#071F45',
    backgroundColor: '#fff',
    '&:hover': {
        backgroundColor: !isDisabled && '#EAEAEA',
    },
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    cursor: !isDisabled && 'pointer',
})
const SingleValue = (styles) => ({
    ...styles,
    color: '#1c1c1c',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    fontWeight: '400',
    margin: 0,
})
const ValueContainer = (styles) => ({
    ...styles,
    padding: 0,
})

const Placeholder = (styles, {isDisabled}) => ({
    ...styles,
    margin: 0,
    color: isDisabled ? 'rgba(28, 28, 28, 0.2)' : '#86A7E9',
})
const Control = (styles, {isDisabled}) => ({
    ...styles,
    width: '100%',
    height: '100%',
    padding: '.3rem .58rem',
    borderRadius: '.25rem',
    fontSize: '.875rem',
    fontWeight: '400',
    color: '#86A7E9',
    outline: 'none',
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#EAEAEA',
    },
    '&:focus-within': {
        outline: '4px solid #A9C0EF',
        backgroundColor: '#ffffff',
    },
    backgroundColor: isDisabled ? 'rgba(28, 28, 28, 0.2)' : '#fff',
    border: isDisabled ? 'none' : '1px solid #86A7E9',
})

const inputStyles = (styles) => ({
    ...styles,
    padding: 0,
    display: 'flex',
    lineHeight: '1.25rem',
    margin: 0,
})

const CustomStyle = {
    container: (styles) => ({
        ...styles,
        width: '100%',
    }),
    control: Control,
    option: Option,
    menu: Menu,
    singleValue: SingleValue,
    valueContainer: ValueContainer,
    dropdownIndicator: DropdownIndicator,
    placeholder: Placeholder,
    input: inputStyles,
}

export default CustomStyle
