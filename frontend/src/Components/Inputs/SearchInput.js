import {IoSearchOutline} from 'react-icons/io5'

function SearchInput({
                         placeholder,
                         value,
                         onChange,
                         someClasses,
                         onKeyUp,
                         disabled
                     }) {
    return (
        <div
            className={`${
                disabled ? 'disabled-class' : 'searchInput-container'
            }  ${someClasses ? someClasses : ''}`}
        >
            <IoSearchOutline className='searchIcon text-[1.31rem] text-blue-200' />
            <input
                className={'search-input lg:w-[100%] w-[55vw]'}
                placeholder={placeholder}
                type={'search'}
                value={value}
                onChange={onChange}
                onKeyUp={onKeyUp}
                disabled={disabled}
                onWheel={(e) => e.target.blur()}
                min={0}
            />
        </div>
    )
}

export default SearchInput
