import React from 'react'

function FilterButtons({label, element, grow}) {
    return (
        <div
            className={` ${grow ? 'grow ' : ''}`}
        >
            {label && (
                <h3
                    className={
                        ' font-light mb-[10px]  text-blue-700 leading-[1rem] text-sm'
                    }
                >
                    {label}:
                </h3>
            )}
            {element}
        </div>
    )
}

export default FilterButtons
