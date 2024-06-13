import React, { useEffect, useState } from 'react'
import ImageCrop from '../../Components/ImageCrop/ImageCrop.js'
import { useDispatch, useSelector } from 'react-redux'
import FieldContainer from '../../Components/FieldContainer/FieldContainer.js'
import BtnAddRemove from '../../Components/Buttons/BtnAddRemove.js'
import { createQrcode, deleteQrcode, editProfileImage, editUser } from '../Login/loginSlice.js'
import { successUploadImage, warningEmptyInput } from '../../Components/ToastMessages/ToastMessages.js'
import { checkEmptyString } from '../../App/globalFunctions.js'
import SmallLoader from '../../Components/Spinner/SmallLoader.js'
import { t } from 'i18next'

function CreateQrcode() {
    const dispatch = useDispatch()
    const { user, loading, market } = useSelector((state) => state.login)
    const [modalIsOpen, setIsOpen] = useState(false)
    const [modalIsOpen2, setIsOpen2] = useState(false)
    const [currentUser, setCurrentUser] = useState({
        ...market,
    })

    const handleChangeImage = (croppedImage) => {
        console.log("okkk");
        const formData = new FormData()
        formData.append('file', croppedImage)
        dispatch(editProfileImage(formData)).then(({ error, payload }) => {
            if (!error) {
                successUploadImage()
                setCurrentUser({
                    ...currentUser,
                    qrcode: payload
                })
                setIsOpen(false)
            }
        })
    }

    const handleSubmit = () => {
            const body = {
                market: currentUser._id,
                qrcode: currentUser.qrcode.replace(/\s+/g, ' ').trim(),
            }  
            dispatch(createQrcode(body))
        
    }

    const handleDelete = () => {
            const body = {
                market: currentUser._id,
            }  
            dispatch(deleteQrcode(body)).then(({error}) => {
                if (!error) {
                    setCurrentUser({
                        ...market,
                        qrcode: ""
                    })
                }
            })
        
    } 

    const [s, setS] = useState(0)
    useEffect(() => {
        if (!s) {
            setCurrentUser({
                ...market
            })
            setS(1)
        }
    }, [user, s])
    return (
        <section className={'mainPadding h-full overflow-y-auto'}>
            {loading &&
                <div
                    className='fixed backdrop-blur-[2px] left-0 right-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>}
            <div className='flex justify-around items-center gap-6'>
                <div>
                    <ImageCrop output={currentUser.qrcode} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}
                        approve={handleChangeImage} />
                </div>
            </div>
            <div className={'max-w-[15.625rem] mx-auto flex gap-4 pt-4'}>
                <BtnAddRemove text={t('Saqlash')} edit={true} onClick={handleSubmit} />
                <BtnAddRemove onClick={handleDelete} text={t('Tozalash')} />
            </div>
        </section>
    )
}

export default CreateQrcode