import React from 'react'
import {IoDownloadOutline} from 'react-icons/io5'
import {useTranslation} from 'react-i18next'

function ImportBtn({readExcel}) {
    const {t} = useTranslation(['common'])
    const handleChange = (e) => {
        const file = e.target.files[0]
        readExcel(file)
    }
    return (
        <>
            <button>
                <label htmlFor='import-field' className='importButton'>
                    {t('Import')}
                    <span
                        className={
                            'btn-icon bg-white-900 p-[8px] text-primary-800'
                        }
                    >
                        <IoDownloadOutline size={'1rem'} />
                    </span>
                </label>
            </button>
            <input
                type='file'
                className={'hidden '}
                id={'import-field'}
                onClick={(e) => (e.target.value = null)}
                onChange={handleChange}
            />
        </>
    )
}

export default ImportBtn
