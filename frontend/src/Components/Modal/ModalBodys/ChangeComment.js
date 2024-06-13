import React, {useState} from 'react'
import Api from '../../../Config/Api'
import FieldContainer from '../../FieldContainer/FieldContainer'
import {universalToast} from '../../ToastMessages/ToastMessages'

const ChangeComment = ({ commentText, dailyid, toggleModal }) => {

    const [comment, setComment] = useState(commentText)

    const handleChangeComment = async () => {
        const { data } = await Api.post('/sales/comment/update', {
            comment,
            dailyid
        })
        return data;
    }

    return (
        <div>
            <form>
                <div className={'flex gap-[1.25rem] mt-[1rem]'}>
                    <FieldContainer
                        placeholder={'Izoh'}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                </div>
            </form>
            <div
                className={
                    'flex mt-12 items-center justify-center gap-[1.5rem]'
                }
            >
                <button
                    className={'approveBtn bg-success-500 hover:bg-success-700'}
                    onClick={() => {
                        handleChangeComment()
                            .then((data) => {
                                universalToast(data.message, 'success')
                                toggleModal()
                            })
                            .catch((data) => universalToast(data.message, 'error'))
                    }}
                >
                    {'Tasdiqlash'}
                </button>
            </div>
        </div>
    )
}

export default ChangeComment