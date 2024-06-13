import React, {useState} from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {IoCamera, IoClose} from 'react-icons/io5'
import Modal from 'react-modal'

function ImageCrop({approve, output, modalIsOpen, setIsOpen}) {
    const [src, setSrc] = useState(null)
    const [crop, setCrop] = useState({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        aspect: 1
    })
    const [image, setImage] = useState(null)
    const cropImageNow = () => {
        const canvas = document.createElement('canvas')
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        )

        const reader = new FileReader()
        canvas.toBlob(blob => {
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                dataURLtoFile(reader.result, 'cropped.jpg')
            }
        })
    }
    const handleClickFile = (e) => {
        e.target.value = null
    }

    function closeModal() {
        setIsOpen(false)
    }

    const handleFile = e => {
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
            setIsOpen(true)
            setSrc(fileReader.result)
        }
        fileReader.readAsDataURL(e.target.files[0])
    }
    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n)

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        let croppedImage = new File([u8arr], filename, {type: mime})
        approve(croppedImage)
    }
    const customStyles = {
        content: {
            width: '90%',
            height: '85%',
            padding: '1.25rem',
            transform: 'auto'
        }
    }
    return (
        <div className='w-full mb-[2.5rem]'>
            <center>
                <label
                    htmlFor='fileId'
                    className='relative transition-all w-[6.25rem] h-[6.25rem] rounded-full flex justify-center items-center shadow-[0px_5px_5px_rgba(0,0,0,0.15)] bg-white-900 cursor-pointer hover:bg-white-700 duration-200'
                >
                    {output ? (
                        <div className='w-full h-full'>
                            <div className='group w-full h-full rounded-full'>
                                <img
                                    src={output}
                                    alt={'user'}
                                    className='object-cover w-full h-full rounded-full'
                                />
                                <div
                                    className='absolute duration-75 delay-[0] top-0 left-0 right-0 bottom-0 w-full h-full rounded-full hover:bg-black-500 duration-200 invisible group-hover:visible'>
                                    <IoCamera
                                        size={`2.1875rem`}
                                        className='text-white-900 w-[2.1875rem] absolute top-1/3 right-1/3'
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='absolute w-full h-full rounded-full hover:bg-black-500 duration-200'>
                            <IoCamera
                                size={`2.1875rem`}
                                className='text-black-200 w-[2.1875rem] absolute top-1/3 right-1/3'
                            />
                        </div>
                    )}
                </label>
                <input
                    onClick={(e) => handleClickFile(e)}
                    className='hidden'
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleFile(e)}
                    id='fileId'
                />
            </center>
            {src && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    appElement={document.getElementById('root') || undefined}
                >
                    <div className={'h-full'}>
                        {/* header */}
                        <div className={'flex items-center justify-end'}>
                            <button
                                type={'button'}
                                className={
                                    'text-[1.8rem] text-black-500 transition-all ease-in duration-100 hover:text-error-500 active:scale-75'
                                }
                                onClick={closeModal}
                            >
                                <IoClose size={'1.8rem'} className={'pointer-events-none'} />
                            </button>
                        </div>
                        {/* body */}
                        <div className='mt-4 flex items-center justify-center'>
                            <ReactCrop
                                className='object-cover'
                                src={src}
                                onImageLoaded={setImage}
                                crop={crop}
                                keepSelection={true}
                                circularCrop={true}
                                onChange={setCrop}
                            />
                        </div>
                        {/* footer */}
                        <div
                            className={'flex mt-[2.5rem] items-center justify-center gap-[1.5rem]'}
                        >
                            <button
                                className={'approveBtn bg-primary-800 hover:bg-primary-900'}
                                onClick={cropImageNow}
                            >
                                Yuklash
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ImageCrop
