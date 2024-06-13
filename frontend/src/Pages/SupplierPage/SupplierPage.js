import React, {useEffect, useState} from 'react'
import FieldContainer from '../../Components/FieldContainer/FieldContainer'
import Button from '../../Components/Buttons/BtnAddRemove'
import Pagination from '../../Components/Pagination/Pagination'
import Table from '../../Components/Table/Table'
import TableMobile from '../../Components/Table/TableMobile'
import {useDispatch, useSelector} from 'react-redux'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import {motion} from 'framer-motion'
import {
    addSupplier,
    clearErrorSuppliers,
    clearSearchedSuppliers,
    clearSuccessAddSupplier,
    clearSuccessDeleteSupplier,
    clearSuccessUpdateSupplier,
    deleteSupplier,
    getSuppliers,
    getSuppliersByFilter,
    updateSupplier
} from './suppliersSlice.js'

import {getAllSuppliers} from '../Incomings/incomingSlice.js'
import {
    successAddSupplierMessage,
    successDeleteSupplierMessage,
    successUpdateSupplierMessage,
    universalToast,
    warningEmptyInput
} from '../../Components/ToastMessages/ToastMessages.js'
import UniversalModal from '../../Components/Modal/UniversalModal.js'
import SearchForm from '../../Components/SearchForm/SearchForm.js'
import {checkEmptyString} from '../../App/globalFunctions.js'
import {useTranslation} from 'react-i18next'
import {filter} from 'lodash'
import {useNavigate} from 'react-router-dom'
import SelectForm from '../../Components/Select/SelectForm.js'

const Supplier = () => {
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
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        errorSuppliers,
        suppliers,
        successAddSupplier,
        successUpdateSupplier,
        successDeleteSupplier,
        loading,
        searchedSuppliers,
        total,
        totalSearched
    } = useSelector((state) => state.suppliers)

    const headers = [
        {title: t('№'), styles: 'w-[8%] text-left'},
        {title: t('Yetkazuvchi'), styles: 'w-[84%] text-left'},
        {title: '', styles: 'w-[8%] text-left'}
    ]

    // states
    const [data, setData] = useState(suppliers)
    const [searchedData, setSearchedData] = useState(searchedSuppliers)
    const [supplierName, setSupplierName] = useState('')
    const [currentSupplier, setCurrentSupplier] = useState('')
    const [deletedSupplier, setDeletedSupplier] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [stickyForm, setStickyForm] = useState(false)
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [searchByName, setSearchByName] = useState('')

    // modal toggle
    const toggleModal = () => setModalVisible(!modalVisible)

    // handle change of inputs
    const handleChangeSupplierName = (e) => {
        setSupplierName(e.target.value)
    }

    // table edit and delete
    const handleEditSupplier = (supplier) => {
        setCurrentSupplier(supplier)
        setSupplierName(supplier.name)
        setStickyForm(true)
    }
    const handleDeleteSupplier = (supplier) => {
        setDeletedSupplier(supplier)
        toggleModal()
    }
    const handleClickApproveToDelete = () => {
        const body = {
            _id: deletedSupplier._id,
            currentPage,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim()
            }
        }
        dispatch(deleteSupplier(body))
        handleClickCancelToDelete()
    }
    const handleClickCancelToDelete = () => {
        setModalVisible(false)
        setDeletedSupplier(null)
    }

    // handle submit of inputs
    const addNewSupplier = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString([{
            value: supplierName,
            message: t('Yetkazuvchi ismi')
        }])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                name: supplierName,
                currentPage,
                countPage: showByTotal,
                search: {
                    name: searchByName.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(addSupplier(body))
        }
    }

    const handleEdit = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString([{
            value: supplierName,
            message: t('Yetkazuvchi ismi')
        }])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                name: supplierName,
                _id: currentSupplier._id,
                currentPage,
                countPage: showByTotal,
                search: {
                    name: searchByName.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(updateSupplier(body))
        }
    }

    const clearForm = (e) => {
        e && e.preventDefault()
        setSupplierName('')
        setCurrentSupplier(null)
        setStickyForm(false)
        setDeletedSupplier(null)
    }

    // filter by total
    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }

    // handle change of search inputs
    const filterByName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setSearchByName(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
        dispatch(clearSearchedSuppliers())
        if (valForSearch === '') {
            setData(suppliers)
            setFilteredDataTotal(total)
        } else {
            const filteredSuppliers = filter(suppliers, (supplier) => {
                return supplier.name.toLowerCase().includes(valForSearch)
            })
            setData(filteredSuppliers)
            setFilteredDataTotal(filteredSuppliers.length)
        }
    }
    const filterByNameWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            const body = {
                currentPage,
                countPage: showByTotal,
                search: {
                    name: searchByName.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(getSuppliersByFilter(body))
        }
    }

    // link to next page
    const linkToSupplierReport = (id) => {
        navigate(`/hamkorlar/yetkazuvchilar/${id}`)
    }

    // useEffects
    useEffect(() => {
        if (errorSuppliers) {
            universalToast(errorSuppliers, 'error')
            dispatch(clearErrorSuppliers())
        }
        if (successAddSupplier) {
            successAddSupplierMessage()
            dispatch(clearSuccessAddSupplier())
            dispatch(getAllSuppliers())
            clearForm()
        }
        if (successUpdateSupplier) {
            successUpdateSupplierMessage()
            dispatch(clearSuccessUpdateSupplier())
            dispatch(getAllSuppliers())
            setCurrentSupplier('')
            setStickyForm(false)
            clearForm()
        }
        if (successDeleteSupplier) {
            dispatch(getAllSuppliers())
            successDeleteSupplierMessage()
            dispatch(clearSuccessDeleteSupplier())
            clearForm()
        }
    }, [
        dispatch,
        errorSuppliers,
        successAddSupplier,
        successUpdateSupplier,
        successDeleteSupplier
    ])

    useEffect(() => {
        const body = {
            currentPage,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim()
            }
        }
        dispatch(getSuppliers(body))
        //    eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, showByTotal, currentPage])

    useEffect(() => {
        setData(suppliers)
    }, [suppliers])

    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])

    useEffect(() => {
        setSearchedData(searchedSuppliers)
    }, [searchedSuppliers])
    return (
        <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
                open: {opacity: 1, height: 'auto'},
                collapsed: {opacity: 0, height: 0}
            }}
            transition={{duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98]}}
        >
            <UniversalModal
                headerText={`${deletedSupplier && deletedSupplier.name} ${t(
                    'yetkazib beruvchini o`chirishni tasdiqlaysizmi?'
                )}`}
                title={t(
                    'O`chirilgan yetkazib beruvchini tiklashning imkoni mavjud emas!'
                )}
                toggleModal={toggleModal}
                body={'approve'}
                approveFunction={handleClickApproveToDelete}
                closeModal={handleClickCancelToDelete}
                isOpen={modalVisible}
            />
            <form
                className={`flex ps-[20px] gap-[1.25rem] lg:mt-0 mt-[40px] bg-background flex-col mainPadding transition ease-linear duration-200 ${
                    stickyForm && 'stickyForm'
                }`}
            >
                <div className='supplier-style'>
                    <FieldContainer
                        label={t('Yetkazuvchi ismi')}
                        placeholder={''}
                        maxWidth={'w-[41rem]'}
                        type={'string'}
                        value={supplierName}
                        onChange={handleChangeSupplierName}
                    />
                    <div className={'flex gap-[1.25rem] grow w-[20.8125rem]'}>
                        <Button
                            add={!stickyForm}
                            edit={stickyForm}
                            text={
                                stickyForm
                                    ? t(`Saqlash`)
                                    : t('Yangi yetkazuvchi qo`shish')
                            }
                            onClick={stickyForm ? handleEdit : addNewSupplier}
                        />
                        <Button onClick={clearForm} text={t('Tozalash')} />
                    </div>
                </div>
            </form>
            <div className='flex ps-[10px] items-center '>
            <SelectForm  key={'total_1'}  onSelect={filterByTotal}/>
            <SearchForm
                filterByTotal={filterByTotal}
                filterBy={['total', 'name']}
                filterByName={filterByName}
                searchByName={searchByName}
                filterByCodeAndNameAndCategoryWhenPressEnter={
                    filterByNameWhenPressEnter
                }
            />
            </div>

            <div className='lg:tableContainerPadding'>
                {loading ? (
                    <Spinner />
                ) : data.length === 0 && searchedData.length === 0 ? (
                    <NotFind text={t('Yetkazib beruvchilar mavjud emas')} />
                ) : (
                    !isMobile?
                    <Table
                        data={searchedData.length > 0 ? searchedData : data}
                        page={'supplier'}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        headers={headers}
                        Edit={handleEditSupplier}
                        Delete={handleDeleteSupplier}
                        linkToSupplierReport={linkToSupplierReport}
                    />:
                    <TableMobile
                        data={searchedData.length > 0 ? searchedData : data}
                        page={'supplier'}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        headers={headers}
                        Edit={handleEditSupplier}
                        Delete={handleDeleteSupplier}
                        linkToSupplierReport={linkToSupplierReport}
                    />
                )}
                
            </div>
            <div className='pagination-supplier flex justify-center [mb-30px] mt-[30px]'>
                {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                    <Pagination
                        countPage={Number(showByTotal)}
                        totalDatas={totalSearched || filteredDataTotal}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
        </motion.section>
    )
}

export default Supplier
