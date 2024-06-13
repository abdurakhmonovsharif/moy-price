import React, {useState} from 'react'
import Stepper from '../../Stepper/Stepper.js'
import CreateDirector from '../../steps/CreateDirector.js'
import CreateShop from '../../steps/CreateShop.js'
import ImageCrop from '../../ImageCrop/ImageCrop.js'
import {useDispatch} from 'react-redux'
import {editProfileImage} from '../../../Pages/Login/loginSlice.js'
import {successUploadImage} from '../../ToastMessages/ToastMessages.js'

function StepperPage({addMarket}) {
    const {currentStep, bgActive, handleNext, handleFinish, image, setImage, editedMarket} = addMarket
    const dispatch = useDispatch()
    const [modalIsOpen, setIsOpen] = useState(false)
    const steps = [
        {title: 'Do\'kon yaratish', stepIndex: 1},
        {title: 'Direktor yaratish', stepIndex: 2}
    ]

    const handleClickNext = (shopData) => {
        const body = {
            ...shopData,
            image: image
        }
        handleNext(body)
    }
    const uploadImage = (croppedImage) => {
        const formData = new FormData()
        formData.append('file', croppedImage)
        dispatch(editProfileImage(formData)).then(({error, payload}) => {
            if (!error) {
                setImage(payload)
                setIsOpen(false)
                successUploadImage()
            }
        })
    }
    const displayStep = (step) => {
        switch (step) {
            case 1:
                return <CreateShop editedMarket={editedMarket} handleClickNext={handleClickNext} />
            case 2:
                return <CreateDirector director={editedMarket?.director} handleClickFinish={handleFinish} />
            default:
        }
    }
    return (
        <div className='mainPadding w-full overflow-hidden'>
            <Stepper
                steps={steps}
                currentStep={currentStep}
                bgActive={bgActive}
            />
            <ImageCrop modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} approve={uploadImage} output={image} />
            {displayStep(currentStep)}
        </div>
    )
}

export default StepperPage
