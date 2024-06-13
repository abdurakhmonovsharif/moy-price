import React from 'react'

const CheckboxCard = ({text, onchange, market, value}) => {
    return (
        <div className='checkbox-card'>
            <div className='checkbox-card-paragraf'><p>{text} :</p></div>
            <input type='checkbox' checked={value}
                   onChange={(e) => onchange(market, text === 'Aloqa' ? 1 : 2, e.target.checked)} />
        </div>
    )
}

export default CheckboxCard