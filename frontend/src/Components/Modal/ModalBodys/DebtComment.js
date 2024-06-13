import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {changeDebtComment} from '../../../Pages/Reports/reportsSlice'
import FieldContainer from '../../FieldContainer/FieldContainer'
import {universalToast} from '../../ToastMessages/ToastMessages'

const DebtComment = ({toggleModal}) => {
    const dispatch = useDispatch()
    const {debtid, debtcomment} = useSelector((state) => state.reports)
    const [value, setValue] = useState('')

    const handleEditComment = () => {
        dispatch(changeDebtComment({comment: value, debtid})).then(
            ({error}) => {
                if (!error) {
                    setValue('')
                    toggleModal()
                    universalToast('Izoh uzgarildi', 'success')
                }
            }
        )
    }

    useEffect(() => {
        if (debtcomment) {
            setValue(debtcomment)
        }
    }, [debtcomment])

    return (
        <div>
            <div className=''>
                <div
                    className={
                        'flex gap-[1.25rem] mx-auto mt-[1rem] max-w-[500px]'
                    }
                >
                    <FieldContainer
                        placeholder={t('Izoh')}
                        label={t('Qarz izohi')}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyUp={(e) => {
                            e.preventDefault()
                            if (e.key === 'Enter') {
                                handleEditComment()
                            }
                        }}
                    />
                </div>
            </div>
            <div
                className={
                    'flex mt-12 items-center justify-center gap-[1.5rem]'
                }
            >
                <button
                    className={'approveBtn bg-black-500 hover:bg-black-700'}
                    onClick={toggleModal}
                >
                    {t('Bekor qilish')}
                </button>
                <button
                    className={'approveBtn bg-success-500 hover:bg-success-700'}
                    onClick={handleEditComment}
                >
                    {t('Tasdiqlash')}
                </button>
            </div>
        </div>
    )
}

export default DebtComment
