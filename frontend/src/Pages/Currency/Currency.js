import React, {useEffect, useState} from 'react'
import FieldContainer from '../../Components/FieldContainer/FieldContainer.js'
import Button from '../../Components/Buttons/BtnAddRemove.js'
import Table from '../../Components/Table/Table.js'
import TableMobile from '../../Components/Table/TableMobile.js'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from 'framer-motion'
import {addExchangerate, deleteExchangerate, getCurrencies, updateExchangerate} from './currencySlice.js'
import UniversalModal from '../../Components/Modal/UniversalModal.js'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import SmallLoader from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import {checkEmptyString} from '../../App/globalFunctions.js'
import {universalToast} from '../../Components/ToastMessages/ToastMessages.js'
import {useTranslation} from 'react-i18next'
import Checkbox from '../../Components/Checkbox/Checkbox.js'

const Currency = () => {
    const { t } = useTranslation(['common'])
    const dispatch = useDispatch()
    const { currencies, getCurrenciesLoading } = useSelector(
        (state) => state.currency
    )

    const headers = [
        { title: '№', styles: 'w-[8%] text-left' },
        { title: t('Sana'), styles: 'w-[17%] text-center' },
        { title: t('Kurs'), styles: 'w-[67%] text-center' },
        { title: '', styles: 'w-[8%] text-center' },
    ]

    const [data, setData] = useState(currencies)
    const [exchangeName, setExchangeName] = useState('')
    const [currentExchange, setCurrentExchange] = useState('')
    const [deletedExchange, setDeletedExchange] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [stickyForm, setStickyForm] = useState(false)
    const [newExchange, setNewExchange] = useState(false)
    const [modalBody, setModalBody] = useState(null)

    const [isIncomingPrice, setIsIncomingPrice] = useState(false)
    const [isSellingPrice, setIsSellingPrice] = useState(false)

    const toggleModal = () => setModalVisible(!modalVisible)

    const handleChangeExchangeName = (e) => {
        setExchangeName(e.target.value)
    }

    const handleEditExchange = (exchangerate) => {
        setCurrentExchange(exchangerate)
        setExchangeName(exchangerate.exchangerate)
        setStickyForm(true)
    }
    const handleDeleteExchange = (exchangerate) => {
        setDeletedExchange(exchangerate)
        setModalBody('approve')
        toggleModal()
    }
    const handleClickApproveToDelete = () => {
        const body = { _id: deletedExchange._id }
        dispatch(deleteExchangerate(body))
        handleClickCancelToDelete()
    }
    const handleClickCancelToDelete = () => {
        setModalVisible(false)
        setDeletedExchange(null)
        setModalBody(null)
    }

    const addNewExchange = (e) => {
        e.preventDefault()

        const body = { exchangerate: exchangeName, isIncomingPrice, isSellingPrice }
        const { failed } = checkEmptyString([
            { value: exchangeName, message: 'Kurs narxi' },
        ])
        if (failed) {
            return universalToast(t('Valyuta kursini kiriting!'), 'error')
        }
        if (isIncomingPrice || isSellingPrice) {
            setNewExchange(true)
            setModalVisible(true)
            setModalBody('complete')
        } else {
            return universalToast(t('Sotish yoki kelish tanlang!'), 'warning')
        }
    }

    const handleEdit = (e) => {
        e.preventDefault()
        const { failed } = checkEmptyString([
            { value: exchangeName, message: 'Kurs narxi' },
        ])
        if (failed) {
            return universalToast(t('Valyuta kursini kiriting!'), 'error')
        }
        const body = {
            exchangerate: exchangeName,
            _id: currentExchange._id,
        }
        dispatch(updateExchangerate(body)).then(({ error }) => {
            if (!error) {
                clearForm()
                setNewExchange(true)
                setModalVisible(true)
                setModalBody('complete')
            }
        })
    }

    const updateAllProducts = () => {
        const body = { exchangerate: exchangeName, isIncomingPrice, isSellingPrice }
        dispatch(addExchangerate(body)).then(({ error }) => {
            if (!error) {
                clearForm()
                setNewExchange(false)
                setModalVisible(false)
                setModalBody(null)
            }
        })
    }
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const clearForm = (e) => {
        e && e.preventDefault()
        setExchangeName('')
        setIsIncomingPrice(false)
        setIsSellingPrice(false)
        setCurrentExchange(null)
        setStickyForm(false)
    }

    const handleKeyUp = (e) => {
        e.preventDefault()
        if (e.key === 'Enter') {
            addNewExchange()
        }
    }

    useEffect(() => {
        dispatch(getCurrencies())
    }, [dispatch])

    useEffect(() => {
        setData(currencies)
    }, [currencies])

    return (
        <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
            {getCurrenciesLoading && (
                <div className='fixed backdrop-blur-[2px] z-[100] left-0 top-0 right-0 bottom-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            <UniversalModal
                headerText={
                    newExchange
                        ? `${t("Diqqat! Barcha mahsulotlar narxi valyuta kursiga nisbatan o'zgarishini xohlaysizmi?")}`
                        : `${deletedExchange && deletedExchange.exchangerate
                        } ${t("kurs narxini o'chirishni tasdiqlaysizmi?")}`
                }
                title={
                    newExchange
                        ? ''
                        : t(
                            "O'chirilgan kurs narxini tiklashning imkoni mavjud emas!"
                        )
                }
                toggleModal={toggleModal}
                body={modalBody}
                approveFunction={
                    newExchange ? updateAllProducts : handleClickApproveToDelete
                }
                closeModal={handleClickCancelToDelete}
                isOpen={modalVisible}
            />
            <form
                className={`unitFormStyle mt-[50px] ${stickyForm && 'stickyForm'
                    } flex gap-[1.25rem] bg-background flex-col mainPadding transition ps-[20px] ease-linear duration-200`}
            >
                <div className='exchangerate-style flex lg:flex-nowrap flex-wrap'>
                    <FieldContainer
                        value={exchangeName}
                        onChange={handleChangeExchangeName}
                        label={t('Kurs narxi')}
                        placeholder={"11 000 UZS"}
                        maxWidth={'w-[30.75rem]'}
                        type={'number'}
                        border={true}
                        onKeyPress={handleKeyUp}
                    />
                    <Checkbox
                        id={'isIncomingPrice'}
                        onChange={() => setIsIncomingPrice(!isIncomingPrice)}
                        value={isIncomingPrice}
                        label={t('Kelish narxi')}
                    />
                    <Checkbox
                        id={'isSellingPrice'}
                        onChange={() => setIsSellingPrice(!isSellingPrice)}
                        value={isSellingPrice}
                        label={t('Sotish narxi')}
                    />
                    <div
                        className={'w-full flex gap-[1.25rem] grow w-[33.2rem]'}
                    >
                        <Button
                            onClick={stickyForm ? handleEdit : addNewExchange}
                            add={!stickyForm}
                            edit={stickyForm}
                            text={
                                stickyForm
                                    ? t(`Saqlash`)
                                    : t(`Yangi o'lchov qo'shish`)
                            }
                        />
                        <Button onClick={clearForm} text={t('Tozalash')} />
                    </div>
                </div>
            </form>

            <div className='lg:tableContainerPadding'>
                {getCurrenciesLoading ? (
                    <Spinner />
                ) : currencies.length === 0 ? (
                    <NotFind text={t('Valyuta kursi mavjud emas')} />
                ) : (
                    !isMobile?
                    <Table
                    page={'exchange'}
                    data={data}
                    currentPage={0}
                    countPage={10}
                    headers={headers}
                    Edit={handleEditExchange}
                    Delete={handleDeleteExchange}
                />:
                <TableMobile
                page={'exchange'}
                data={data}
                currentPage={0}
                countPage={10}
                headers={headers}
                Edit={handleEditExchange}
                Delete={handleDeleteExchange}
            />
                )}
            </div>
        </motion.section>
    )
}

export default Currency
