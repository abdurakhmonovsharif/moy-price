import React, {useEffect, useState} from 'react'
import FieldContainer from '../FieldContainer/FieldContainer.js'
import BtnCreateShop from '../Buttons/BtnCreateShop.js'
import {motion} from 'framer-motion'
import {warningEmptyInput} from '../ToastMessages/ToastMessages.js'
import {checkEmptyString} from '../../App/globalFunctions.js'
import {t} from 'i18next'

function CreateShop({handleClickNext, editedMarket}) {
    const [shopName, setShopName] = useState('')
    const [organizationName, setOrganizationName] = useState('')
    const [addressName, setAddressName] = useState('')
    const [targetName, setTargetName] = useState('')
    const [bankName, setBankName] = useState('')
    const [innName, setInnName] = useState('')
    const [accauntNumber, setAccauntNumber] = useState('')
    const [phoneNumber1, setPhoneNumber1] = useState('')
    const [phoneNumber2, setPhoneNumber2] = useState('')
    const [phoneNumber3, setPhoneNumber3] = useState('')

    const handleClick = () => {
        const {failed, message} = checkEmptyString([
            {
                value: shopName,
                message: 'Do`kon nomi'
            },
            {
                value: phoneNumber1,
                message: 'Telefon raqam 1'
            },
            {
                value: organizationName,
                message: 'Tashkilot nomi'
            }
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const allData = {
                name: shopName,
                organitionName: organizationName,
                phone1: phoneNumber1,
                phone2: phoneNumber2,
                phone3: phoneNumber3,
                bank: bankName,
                bankNumber: accauntNumber,
                inn: Number(innName),
                address: addressName,
                orientation: targetName
            }
            handleClickNext(allData)
        }
    }
    useEffect(() => {
        if (editedMarket) {
            setShopName(editedMarket?.name ? editedMarket?.name : '')
            setOrganizationName(editedMarket?.organitionName ? editedMarket?.organitionName : '')
            setAddressName(editedMarket?.address ? editedMarket?.address : '')
            setTargetName(editedMarket?.orientation ? editedMarket?.orientation : '')
            setBankName(editedMarket?.bank ? editedMarket?.bank : '')
            setInnName(editedMarket?.inn ? editedMarket?.inn : '')
            setAccauntNumber(editedMarket?.bankNumber ? editedMarket?.bankNumber : '')
            setPhoneNumber1(editedMarket?.phone1 ? editedMarket?.phone1 : '')
            setPhoneNumber2(editedMarket?.phone2 ? editedMarket?.phone2 : '')
            setPhoneNumber3(editedMarket?.phone3 ? editedMarket?.phone3 : '')
        }
    }, [editedMarket])
    return (
        <motion.section
            transition={{duration: 0.5}}
            initial={{opacity: 0, x: 0}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 20}}
        >
            <div className='flex gap-[2.5rem] mb-[2.5rem]'>
                <FieldContainer
                    label={`${t('Do\'kon nomi...')}`}
                    maxWidth={'grow'}
                    placeholder={'misol : Мой Прайс'}
                    type='text'
                    value={shopName}
                    star={true}
                    onChange={e => setShopName(e.target.value)}
                />
                <FieldContainer
                    label={'Tashkilot nomi'}
                    maxWidth={'grow'}
                    placeholder={'misol : Мой Прайс'}
                    type='text'
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                />
                <FieldContainer
                    label={'Manzil'}
                    maxWidth={'grow'}
                    placeholder={'misol: Navoiy viloyati'}
                    type='text'
                    value={addressName}
                    onChange={(e) => setAddressName(e.target.value)}
                />
                <FieldContainer
                    label={`Mo'ljal`}
                    maxWidth={'grow'}
                    placeholder={'misol: Guliston paliklinika yonida'}
                    type='text'
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                />
            </div>
            <div className='flex gap-[2.5rem] mb-[2.5rem]'>
                <FieldContainer
                    label={`Bank nomi`}
                    maxWidth={'grow'}
                    placeholder={'misol: Мой Прайс'}
                    type='text'
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                />
                <FieldContainer
                    label={'INN'}
                    maxWidth={'grow'}
                    placeholder={'misol: 123456789'}
                    type='number'
                    value={innName}
                    onChange={(e) => setInnName(e.target.value)}
                />
                <FieldContainer
                    label={'Hisob raqam'}
                    maxWidth={'grow'}
                    placeholder={'misol: 1234567890'}
                    type='number'
                    value={accauntNumber}
                    onChange={(e) => setAccauntNumber(e.target.value)}
                />
            </div>
            <div className='flex gap-[2.5rem]'>
                <FieldContainer
                    label={'Telefon raqam 1'}
                    maxWidth={'grow'}
                    placeholder={'misol : 99 123 45 67'}
                    type='text'
                    value={phoneNumber1}
                    star={true}
                    onChange={(e) => setPhoneNumber1(e.target.value)}
                />
                <FieldContainer
                    label={'Telefon raqam 2'}
                    maxWidth={'grow'}
                    placeholder={'misol : 99 123 45 67'}
                    type='text'
                    value={phoneNumber2}
                    onChange={(e) => setPhoneNumber2(e.target.value)}
                />
                <FieldContainer
                    label={'Telefon raqam 3'}
                    maxWidth={'grow'}
                    placeholder={'misol : 99 123 45 67'}
                    type='text'
                    value={phoneNumber3}
                    onChange={(e) => setPhoneNumber3(e.target.value)}
                />
            </div>
            <div className='flex justify-center mt-[2.5rem]'>
                <div>
                    <BtnCreateShop
                        text='Keyingi qadam'
                        type={'shop'}
                        onClick={handleClick}
                    />
                </div>
            </div>
        </motion.section>
    )
}

export default CreateShop
