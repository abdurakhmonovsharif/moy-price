import React from 'react'
import {components} from 'react-select'
import {IoCaretDown} from 'react-icons/io5'

export const DropdownIcon = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <IoCaretDown size={'0.625rem'} color='86A7E9' />
        </components.DropdownIndicator>
    )
}
const Container = (styles) => ({
    ...styles,
    height: '100%',
    width: 'max-content',
    marginLeft: '0.75rem'
})
const DropdownIndicator = (styles, {isFocused, isDisabled}) => ({
    ...styles,
    padding: 0,
    color: isFocused
        ? '#193F8A'
        : '#071F45' || isDisabled
            ? 'rgba(28, 28, 28, 0.2)'
            : '#071F45'
})

const IndicatorsContainer = (styles) => ({
    ...styles,
    marginLeft: '5px'
})
const Menu = (styles) => ({
    ...styles,
    width:"5rem",
    overflow: 'hidden'
})
const Option = (styles, {isFocused, isSelected}) => ({
    ...styles,
    fontSize: '.875rem',
    fontWeight: '400',
    color: isSelected || isFocused ? '#ffffff' : '#071F45',
    backgroundColor: isSelected ? '#0090A3' : isFocused ? '#00B4CC' : '#ffffff',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    cursor: 'pointer'
})
const SingleValue = (styles, {isDisabled}) => ({
    ...styles,
    fontSize: '.875rem',
    fontWeight: '400',
    margin: 0,
    color: isDisabled ? 'rgba(28, 28, 28, 0.2)' : '#071F45'
})
const ValueContainer = (styles) => ({
    ...styles,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
})
const Control = (styles, {isDisabled}) => ({
    ...styles,
    borderRadius: '.5rem',
    fontSize: '.875rem',
    fontWeight: '400',
    padding: '0.6875rem 0.625rem',
    color: '#071F45',
    outline: 'none',
    border: 'none',
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    height: '100%',
    '&:hover': {
        backgroundColor: '#EAEAEA'
    },
    backgroundColor: isDisabled ? 'rgba(28, 28, 28, 0.2)' : '#fff'
})

const CustomStyle = {
    control: Control,
    container: Container,
    option: Option,
    menu: Menu,
    singleValue: SingleValue,
    valueContainer: ValueContainer,
    indicatorsContainer: IndicatorsContainer,
    dropdownIndicator: DropdownIndicator
}

export default CustomStyle
