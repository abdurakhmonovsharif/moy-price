import React from 'react'

const Currency = ({currency, onClick}) => {
    return (
        <div className='currency'>
            <button className='currency-btn-selected' disabled>
                {currency}
            </button>
            <button className='currency-btn-unselected' onClick={onClick}>
                {currency === 'UZS' ? 'USD' : 'UZS'}
            </button>
        </div>
    )
}

export default Currency
