import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import FieldContainer from './../../FieldContainer/FieldContainer'
import {useDispatch, useSelector} from 'react-redux'
import {filter, map} from 'lodash'
import {getAllPackmans} from './../../../Pages/Clients/clientsSlice'
import {getClients} from './../../../Pages/Sale/Slices/registerSellingSlice'

const SalesList = ({approveFunction, toggleModal}) => {
    const {t} = useTranslation(['common'])

    const dispatch = useDispatch()
    const [userValue, setUserValue] = useState('')
    const [packmanValue, setPackmanValue] = useState('')
    const [clientValue, setClientValue] = useState('')
    const [optionPackman, setOptionPackman] = useState([])
    const {packmans} = useSelector((state) => state.clients)
    const {clients} = useSelector((state) => state.registerSelling)
    const [optionClient, setOptionClient] = useState([])

    useEffect(() => {
        setOptionPackman([
            {
                label: t('Tanlang'),
                value: '',
            },
            ...packmans.map((packman) => ({
                value: packman._id,
                label: packman.name,
            })),
        ])
    }, [packmans, t])

    useEffect(() => {
        setOptionClient([
            {
                label: t('Barchasi'),
                value: '',
            },
            ...clients.map((client) => ({
                value: client._id,
                label: client.name,
            })),
        ])
    }, [clients, t])

    const handleChangePackmanValue = (option) => {
        setPackmanValue(option)
        const pack = filter(packmans, (pack) => pack._id === option.value)[0]
        if (pack && pack.hasOwnProperty('clients')) {
            setOptionClient(
                map(pack.clients, (client) => ({
                    label: client.name,
                    value: client._id,
                    packman: pack,
                }))
            )
        } else {
            setOptionClient([
                {
                    label: t('Tanlang'),
                    value: '',
                },
                ...clients.map((client) => ({
                    label: client.name,
                    value: client._id,
                    packman: client?.packman,
                })),
            ])
        }
        setClientValue('')
        setUserValue('')
    }
    const handleChangeClientValue = (option) => {
        setClientValue(option)
        const client = filter(
            clients,
            (client) => client._id === option.value
        )[0]
        if (client && client.hasOwnProperty('packman')) {
            setPackmanValue({
                label: client.packman.name,
                value: client.packman._id,
            })
        }
        option.value ? setUserValue(option.label) : setUserValue('')
    }
    const handleChangeUserValue = (e) => {
        setUserValue(e.target.value)
        if (e.target.value !== clientValue) {
            setOptionClient([
                {
                    label: t('Tanlang'),
                    value: '',
                },
                ...clients.map((client) => ({
                    label: client.name,
                    value: client._id,
                    packman: client?.packman,
                })),
            ])
        }
    }

    useEffect(() => {
        dispatch(getAllPackmans())
        dispatch(getClients())
    }, [dispatch])

    return (
        <div>
            <form>
                <div className={'flex gap-[1.25rem] mt-[1rem]'}>
                    <FieldContainer
                        placeholder={t('Santexniklar')}
                        maxWidth={'w-[14.676875rem]'}
                        border={true}
                        select={true}
                        value={packmanValue}
                        options={optionPackman}
                        onChange={handleChangePackmanValue}
                    />
                    <FieldContainer
                        placeholder={t('Xaridor')}
                        maxWidth={'w-[14.676875rem]'}
                        border={true}
                        select={true}
                        value={clientValue}
                        options={optionClient}
                        onChange={handleChangeClientValue}
                    />
                    <FieldContainer
                        placeholder={t('Xaridor yaratish')}
                        value={userValue}
                        onChange={handleChangeUserValue}
                    />
                </div>
            </form>
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
                    onClick={() => {
                        let body = {
                            client: {
                                name: userValue,
                            },
                        }
                        packmanValue.value
                            ? (body.packmanid = packmanValue.value)
                            : (body.client.name = userValue)
                        clientValue.value
                            ? (body.client._id = clientValue.value)
                            : (body.client.name = userValue)
                        approveFunction(body)
                    }}
                >
                    {t('Tasdiqlash')}
                </button>
            </div>
        </div>
    )
}

export default SalesList
