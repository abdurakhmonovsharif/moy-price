import React from 'react'
import Excel from '../../Images/Excel.svg'
import {useTranslation} from 'react-i18next'

function ExportBtn({onClick}) {
    const {t} = useTranslation(['common'])
    return (
        <button className={'exportButton '} onClick={onClick}>
            {t('Eksport')}
            <span className={'btn-icon bg-white-900 p-[8px]'}>
                <img src={Excel} alt='excel icon' />
            </span>
        </button>
    )
}

export default ExportBtn
