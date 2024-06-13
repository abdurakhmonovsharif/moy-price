import React from 'react'

const ProductCheckbox = ({value, onChange}) => {
    return (
        <div className={'checkbox-card sale-toggle-container'}>
            <input
                className={'cursor-pointer'}
                type='checkbox'
                checked={value}
                onChange={onChange}
            />
        </div>
    )
}

export default ProductCheckbox
