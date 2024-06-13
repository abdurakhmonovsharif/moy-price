//    {/*.discountselect {
//         @apply py-[5px] px-[10px] text-sm outline-none bg-warning-500 text-white-900 rounded-r cursor-pointer;
//     }*/}
import {components} from 'react-select'
import {IoCaretDown} from 'react-icons/io5'

export const DropdownIcon = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <IoCaretDown size={'0.625rem'} />
        </components.DropdownIndicator>
    )
}
const Container = (styles) => ({
    ...styles,
    height: '100%',
    position: 'absolute',
    right: 0,
    width: '3rem',
    top: 0,
    bottom: 0
})
const DropdownIndicator = (styles) => ({
    ...styles,
    padding: 0,
    color: '#ffffff'
})
const IndicatorsContainer = (styles) => ({
    ...styles
})
const Menu = (styles) => ({
    ...styles,
    overflow: 'hidden'
})
const Option = (styles, {isFocused, isSelected}) => ({
    ...styles,
    fontSize: '.75rem',
    fontWeight: '400',
    color: isSelected || isFocused ? '#ffffff' : '#071F45',
    backgroundColor: isSelected ? '#0090A3' : isFocused ? '#00B4CC' : '#ffffff',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    cursor: 'pointer',
    textAlign: 'center'
})
const SingleValue = (styles) => ({
    ...styles,
    fontSize: '.75rem',
    fontWeight: '400',
    color: '#ffffff',
    margin: 0,
    textAlign: 'center'
})
const ValueContainer = (styles) => ({
    ...styles,
    padding: 0
})
const Control = (styles) => ({
    ...styles,
    borderTopRightRadius: '.125rem',
    borderBottomRightRadius: '.125rem',
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    fontSize: '0.75rem',
    fontWeight: '400',
    padding: '0.375rem 0.3125rem',
    color: '#071F45',
    outline: 'none',
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
    height: '100%',
    backgroundColor: '#F79009',
    minHeight: '100%',
    '&:hover': {
        backgroundColor: '#DC6803'
    }
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