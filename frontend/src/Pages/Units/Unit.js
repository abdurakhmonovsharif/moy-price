import React, {useEffect, useState} from 'react'
import Button from '../../Components/Buttons/BtnAddRemove.js'
import Table from '../../Components/Table/Table.js'
import TableMobile from '../../Components/Table/TableMobile.js'
import FieldContainer from '../../Components/FieldContainer/FieldContainer.js'
import {useDispatch, useSelector} from 'react-redux'
import {
    successAddUnitMessage,
    successDeleteUnitMessage,
    successUpdateUnitMessage,
    universalToast,
    warningEmptyInput,
} from '../../Components/ToastMessages/ToastMessages.js'
import {
    addUnit,
    clearErrorUnits,
    clearSuccessAddUnit,
    clearSuccessDeleteUnit,
    clearSuccessUpdateUnit,
    deleteUnit,
    getUnits,
    updateUnit,
} from './unitsSlice.js'
import UniversalModal from '../../Components/Modal/UniversalModal.js'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import {checkEmptyString} from '../../App/globalFunctions.js'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'

function Unit() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()
    const {
        errorUnits,
        units,
        successAddUnit,
        successUpdateUnit,
        successDeleteUnit,
        loading,
    } = useSelector((state) => state.units)
    const headers = [
        {styles: 'w-[10%] text-start', filter: '', title: t('№')},
        {
            styles: 'w-[80%] text-start',
            filter: '',
            title: t("O'lchov birliklari"),
        },
        {styles: 'w-[10%]', filter: '', title: ' '},
    ]

    // states
    const [data, setData] = useState(units)
    const [unitName, setUnitName] = useState('')
    const [currentUnit, setCurrentUnit] = useState('')
    const [deletedUnit, setDeletedUnit] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [stickyForm, setStickyForm] = useState(false)

    // modal toggle
    const toggleModal = () => setModalVisible(!modalVisible)

    // handle change of inputs
    const handleChangeUnitName = (e) => {
        setUnitName(e.target.value)
    }

    // table edit and delete
    const handleEditUnit = (unit) => {
        setCurrentUnit(unit)
        setUnitName(unit.name)
        setStickyForm(true)
    }
    const handleDeleteUnit = (unit) => {
        setDeletedUnit(unit)
        toggleModal()
    }
    const handleClickApproveToDelete = () => {
        const body = {_id: deletedUnit._id}
        dispatch(deleteUnit(body))
        handleClickCancelToDelete()
    }
    const handleClickCancelToDelete = () => {
        setModalVisible(false)
        setDeletedUnit(null)
    }

    // handle submit of inputs
    const addNewUnit = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString([
            {
                value: unitName,
                message: t('O`lchov birligi nomi'),
            },
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {name: unitName}
            dispatch(addUnit(body))
        }
    }

    const handleEdit = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString([
            {
                value: unitName,
                message: t('O`lchov birligi nomi'),
            },
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                name: unitName,
                _id: currentUnit._id,
            }
            dispatch(updateUnit(body))
        }
    }

    const clearForm = (e) => {
        e && e.preventDefault()
        setUnitName('')
        setCurrentUnit(null)
        setDeletedUnit(null)
        setStickyForm(false)
    }

    // useEffects
    useEffect(() => {
        if (errorUnits) {
            universalToast(errorUnits, 'error')
            dispatch(clearErrorUnits())
        }
        if (successAddUnit) {
            successAddUnitMessage()
            dispatch(clearSuccessAddUnit())
            clearForm()
        }
        if (successUpdateUnit) {
            successUpdateUnitMessage()
            dispatch(clearSuccessUpdateUnit())
            setCurrentUnit('')
            setStickyForm(false)
            clearForm()
        }
        if (successDeleteUnit) {
            successDeleteUnitMessage()
            dispatch(clearSuccessDeleteUnit())
            clearForm()
        }
    }, [
        dispatch,
        errorUnits,
        successAddUnit,
        successUpdateUnit,
        successDeleteUnit,
    ])

    useEffect(() => {
        dispatch(getUnits())
    }, [dispatch])

    useEffect(() => {
        setData(units)
    }, [units])

    return (
        <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
                open: {opacity: 1, height: 'auto'},
                collapsed: {opacity: 0, height: 0},
            }}
            transition={{duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98]}}
        >
            <UniversalModal
                headerText={`${deletedUnit && deletedUnit.name} ${t(
                    'o`lchov birligini o`chirishni tasdiqlaysizmi?'
                )}`}
                title={t(
                    'O`chirilgan o`lchov birligini tiklashning imkoni mavjud emas!'
                )}
                toggleModal={toggleModal}
                body={'approve'}
                approveFunction={handleClickApproveToDelete}
                closeModal={handleClickCancelToDelete}
                isOpen={modalVisible}
            />
            <form
                className={`unitFormStyle  flex lg:flex-nowrap flex-wrap mt-[40px] pl-[20px] ${
                    stickyForm && 'stickyForm'
                }`}
            >
                <FieldContainer
                    onChange={handleChangeUnitName}
                    value={unitName}
                    label={t('O`lchov birligini kiriting')}
                    placeholder={t('misol: kg')}
                    maxWidth={'w-[43.75rem]'}
                />

                <div className={'flex gap-[1.25rem] grow items-end'}>
                    <Button
                        add={!stickyForm}
                        edit={stickyForm}
                        text={
                            stickyForm
                                ? t(`Saqlash`)
                                : t('Yangi o`lchov qo`shish')
                        }
                        onClick={stickyForm ? handleEdit : addNewUnit}
                    />
                    <Button text={t('Tozalash')} onClick={clearForm} />
                </div>
            </form>

            <div className='mainPadding text-[1.25rem] text-blue-900 '>
                {t("O'lchov birliklari")}
            </div>

            <div className='lg:tableContainerPadding mb-4'>
                {loading ? (
                    <Spinner />
                ) : data.length === 0 ? (
                    <NotFind text={t('O`lchov birliklari mavjud emas')} />
                ) : isMobile ? (
                    <TableMobile
                        page='unit'
                        data={data}
                        headers={headers}
                        currentPage={0}
                        countPage={0}
                        Delete={handleDeleteUnit}
                        Edit={handleEditUnit}
                    />
                ) : (
                    <Table
                        page='unit'
                        data={data}
                        headers={headers}
                        currentPage={0}
                        countPage={0}
                        Edit={handleEditUnit}
                    />
                )}
            </div>
        </motion.section>
    )
}

export default Unit
