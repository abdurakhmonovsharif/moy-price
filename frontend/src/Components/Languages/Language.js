import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import Select from 'react-select'
import CustomStyle, {DropdownIcon} from './CustomStyled'
import {BsGlobe2} from 'react-icons/bs'
import UZBflag from '../../Images/yes.svg'
import RUFlag from '../../Images/Russia.svg'

const options = [
    {
        value: 'lot',
        label: <span className='flex items-center gap-[10px] justify-start'><div
            className='p-[2px] rounded-[2px] bg-white-900'><img src={UZBflag}
                                                                alt={'uzbekistan'} /></div>UZ (Lotin)</span>
    },
    {
        value: 'uz',
        label: <span className='flex items-center gap-[10px] justify-start'><div
            className='p-[2px] rounded-[2px] bg-white-900'><img src={UZBflag}
                                                                alt={'uzbekistan'} /></div>UZ (Kiril)</span>
    },
    {
        value: 'ru',
        label: <span className='flex items-center gap-[10px] justify-start'><div
            className='p-[2px] rounded-[2px] bg-white-900'><img src={RUFlag} alt={'russian'} /></div>RU</span>
    }
]
const Language = () => {
    const {i18n} = useTranslation(['common'])
    const [selected, setSelected] = useState('')

    // select language function

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.value)
        setSelected(e)
    }

    useEffect(() => {
        const l = localStorage.getItem('i18nextLng')
        setSelected(options.find(item => item.value === l))
    }, [])

    return (
        <div className='relative'>
            <div>
                <BsGlobe2 className='absolute z-10 translate-y-[-50%] top-[50%] ml-[.75rem]'
                          color='rgba(28, 28, 28, 0.5)' size={'1.25rem'} />
            </div>
            <Select
                options={options}
                isSearchable={false}
                styles={CustomStyle}
                onChange={handleLanguageChange}
                value={selected || options[0]}
                components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: DropdownIcon
                }}
            />
        </div>
    )
}

export default Language