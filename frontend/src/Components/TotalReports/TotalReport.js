import React from 'react'

const TotalReport = ({
    label1,
    label2,
    text1,
    text2,
    text3,
    currencycost,
    number1,
    currency,
    number2,
    number3,
    redText,
    head,
    all,
    end,
}) => {
    return (
        <div className='mainPadding'>
            <div className={`admin-report-label`}>
                <p className='number-paragraf'>{label1}</p>
                <p className='text-xl'>
                    {label2} <span className='font-bold'>{currencycost}</span>
                </p>
            </div>
            <div className={`report-card ${redText ? 'text-xl' : 'text-lg'}`}>
                <div className='cards-number'>
                    <p className='number-paragraf'>
                        {number1} {all ? currency : ''}
                    </p>
                    <p className='text'>{text1}</p>
                </div>
                <div className='cards-number'>
                    <p className='number-paragraf'>
                        {number2} {head ? currency : ''}
                    </p>
                    <p>{text2}</p>
                </div>
                <div className='cards-number'>
                    <p
                        className={`number-paragraf ${
                            redText ? 'text-[red]' : ''
                        }`}
                    >
                        {number3} {end ? currency : ''}
                    </p>
                    <p>{text3}</p>
                </div>
            </div>
        </div>
    )
}

export default TotalReport
