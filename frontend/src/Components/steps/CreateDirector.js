import React, {useEffect, useState} from 'react'
import FieldContainer from '../FieldContainer/FieldContainer.js'
import {motion} from 'framer-motion'
import BtnAddRemove from '../Buttons/BtnAddRemove.js'
import {checkEmptyString} from '../../App/globalFunctions.js'
import {warningEmptyInput, warningRepeatPasswordDoesntMatch} from '../ToastMessages/ToastMessages.js'

function CreateDirector({handleClickFinish, director}) {
    const [directorName, setDirectorName] = useState('')
    const [directorSurname, setDirectorSurname] = useState('')
    const [directorFatherName, setDirectorFatherName] = useState('')
    const [directorPhone, setDirectorPhone] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const handleFinish = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString([
            {
                value: directorName,
                message: 'Direktor ismi'
            },
            {
                value: directorSurname,
                message: 'Direktor familiyasi'
            },
            {
                value: directorPhone,
                message: 'Telefon raqami'
            },
            {
                value: login,
                message: 'Login'
            },
            {
                value: password,
                message: 'Parol'
            },
            {
                value: repeatPassword,
                message: 'Tasdiqlash paroli'
            }
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            if (password !== repeatPassword) {
                warningRepeatPasswordDoesntMatch()
            } else {
                const body = {
                    login,
                    firstname: directorName,
                    lastname: directorSurname,
                    fathername: directorFatherName,
                    phone: directorPhone,
                    password
                }
                handleClickFinish(body)
            }
        }
    }
    useEffect(() => {
        if (director) {
            setDirectorName(director.firstname ? director?.firstname : '')
            setDirectorSurname(director.lastname ? director?.lastname : '')
            setDirectorFatherName(director.fathername ? director?.fathername : '')
            setDirectorPhone(director.phone ? director?.phone : '')
        }
    }, [director])
    return (
        <motion.form
            transition={{duration: 0.5}}
            initial={{opacity: 0, x: 100}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 20}}
        >
            <div className='flex gap-[2.5rem] mb-[2.5rem]'>
                <FieldContainer
                    label={`Ismi`}
                    maxWidth={'grow'}
                    placeholder={'Jasubrek'}
                    type='text'
                    value={directorName}
                    onChange={e => setDirectorName(e.target.value)}
                    star={true}
                />
                <FieldContainer
                    label={'Familiyasi'}
                    maxWidth={'grow'}
                    placeholder={'Toshev'}
                    type='text'
                    value={directorSurname}
                    star={true}
                    onChange={e => setDirectorSurname(e.target.value)}
                />
                <FieldContainer
                    label={'Otasining ismi'}
                    maxWidth={'grow'}
                    placeholder={'Normurod'}
                    type='text'
                    value={directorFatherName}
                    onChange={e => setDirectorFatherName(e.target.value)}
                />
                <FieldContainer
                    label={`Telefon raqami`}
                    maxWidth={'grow'}
                    placeholder={'99 123 45 67'}
                    type='text'
                    value={directorPhone}
                    star={true}
                    onChange={e => setDirectorPhone(e.target.value)}
                />
            </div>
            <div className='flex gap-[2.5rem]'>
                <FieldContainer
                    label={`Login`}
                    maxWidth={'grow'}
                    placeholder={'admin5'}
                    type='text'
                    value={login}
                    star={true}
                    onChange={e => setLogin(e.target.value)}
                />
                <FieldContainer
                    label={'Parol'}
                    maxWidth={'grow'}
                    placeholder={'Jas12345'}
                    type='password'
                    value={password}
                    star={true}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete={'new-password'}
                />
                <FieldContainer
                    label={'Parol takroriy'}
                    maxWidth={'grow'}
                    placeholder={'Jas12345'}
                    type='password'
                    value={repeatPassword}
                    star={true}
                    onChange={e => setRepeatPassword(e.target.value)}
                    autoComplete={'new-password'}
                />
            </div>
            <div className='flex justify-center mt-[2.5rem]'>
                <div>
                    <BtnAddRemove
                        text='Yakunlash'
                        add={true}
                        edit={true}
                        onClick={handleFinish}
                    />
                </div>
            </div>
        </motion.form>
    )
}

export default CreateDirector