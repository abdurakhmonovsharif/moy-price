import React, {useEffect, useState} from 'react'
import Button from '../../Components/Buttons/BtnAddRemove'
import Table from '../../Components/Table/Table'
import FieldContainer from '../../Components/FieldContainer/FieldContainer'
import Pagination from '../../Components/Pagination/Pagination'
import SearchForm from '../../Components/SearchForm/SearchForm'
import {useDispatch, useSelector} from 'react-redux'
import UniversalModal from '../../Components/Modal/UniversalModal'
import Spinner from '../../Components/Spinner/SmallLoader'
import NotFind from '../../Components/NotFind/NotFind'
import {motion} from 'framer-motion'
import {
    successAddPackmanMessage,
    successDeletePackmanMessage,
    successUpdatePackmanMessage,
    universalToast,
    warningEmptyInput
} from '../../Components/ToastMessages/ToastMessages'
import {
    addPackman,
    clearErrorPackmans,
    clearSearchedPackmans,
    clearSuccessAddPackmans,
    clearSuccessDeletePackmans,
    clearSuccessUpdatePackmans,
    deletePackman,
    getPackmans,
    getPackmansByFilter,
    updatePackman
} from './packmanSlice'
import {checkEmptyString} from '../../App/globalFunctions.js'
import {useTranslation} from 'react-i18next'
import {filter} from 'lodash'
import TableMobile from '../../Components/Table/TableMobile.js'
import SelectForm from '../../Components/Select/SelectForm.js'

function Packman() {
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()
    const {
        errorPackmans,
        packmans,
        successAddPackman,
        successUpdatePackman,
        successDeletePackman,
        loading,
        searchedPackmans,
        total,
        totalSearched
    } = useSelector((state) => state.packmans)

    const headers = [
        {styles: 'w-[10%] text-start', filter: '', title: '№'},
        {styles: 'w-[80%] text-start', filter: '', title: t('Agentlar')},
        {styles: 'w-[10%]', filter: '', title: ' '}
    ]

    //states
    const [data, setData] = useState([])
    const [searchedData, setSearchedData] = useState('')
    const [packmanName, setPackmanName] = useState('')
    const [currentPackman, setCurrentPackman] = useState('')
    const [deletedPackman, setDeletedPackman] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [stickyForm, setStickyForm] = useState(false)
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [searchByName, setSearchByName] = useState('')
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
    // modal toggle
    const toggleModal = () => setModalVisible(!modalVisible)

    // handle changed input
    const handleChangePackmanName = (e) => {
        setPackmanName(e.target.value)
    }

    // table edit and delete
    const handleEditPackman = (packman) => {
        setCurrentPackman(packman)
        setPackmanName(packman.name)
        setStickyForm(true)
    }
    const handleDeletePackman = (packman) => {
        setDeletedPackman(packman)
        toggleModal()
    }

    const handleClickApproveToDelete = () => {
        const body = {
            _id: deletedPackman._id,
            currentPage,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim()
            }
        }
        dispatch(deletePackman(body))
        handleClickCancelToDelete()
    }

    const handleClickCancelToDelete = () => {
        setModalVisible(false)
        setDeletedPackman(null)
    }

    // handle change of inputs

    const addNewPackman = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString([
            {
                value: packmanName,
                message: t('Agent ismi')
            }
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                name: packmanName,
                currentPage,
                countPage: showByTotal,
                search: {
                    name: searchByName.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(addPackman(body))
            setPackmanName('')
        }
    }

    const handleEdit = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString([
            {
                value: packmanName,
                message: t('Agent ismi')
            }
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                name: packmanName,
                _id: currentPackman._id,
                currentPage,
                countPage: showByTotal,
                search: {
                    name: searchByName.replace(/\s+/g, ' ').trim()
                },
                market: currentPackman.market
            }
            dispatch(updatePackman(body))
        }
    }

    const clearForm = (e) => {
        e && e.preventDefault()
        setPackmanName('')
        setStickyForm(false)
        setDeletedPackman(null)
        setCurrentPackman(null)
    }

    //filter by total
    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }

    // handle change of search inputs
    const filterByName = (e) => {
        let val = e.target.value
        setSearchByName(val)
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        ;(searchedData.length > 0 || totalSearched > 0) &&
        dispatch(clearSearchedPackmans())
        if (valForSearch === '') {
            setData(packmans)
            setFilteredDataTotal(total)
        } else {
            const filteredPackmans = filter(packmans, (packman) => {
                return packman.name.toLowerCase().includes(valForSearch)
            })
            setData(filteredPackmans)
            setFilteredDataTotal(filteredPackmans.length)
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
            dispatch(getPackmansByFilter(body))
        }
    }

    // useEffects
    useEffect(() => {
        if (errorPackmans) {
            universalToast(errorPackmans, 'error')
            dispatch(clearErrorPackmans())
        }
        if (successAddPackman) {
            successAddPackmanMessage()
            dispatch(clearSuccessAddPackmans())
            clearForm()
        }
        if (successUpdatePackman) {
            successUpdatePackmanMessage()
            dispatch(clearSuccessUpdatePackmans())
            setCurrentPackman('')
            setStickyForm(false)
            clearForm()
        }
        if (successDeletePackman) {
            successDeletePackmanMessage()
            dispatch(clearSuccessDeletePackmans())
            clearForm()
        }
    }, [
        dispatch,
        errorPackmans,
        successAddPackman,
        successUpdatePackman,
        successDeletePackman
    ])

    useEffect(() => {
        const body = {
            currentPage,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim()
            }
        }
        dispatch(getPackmans(body))
        //    eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, showByTotal, currentPage])

    useEffect(() => {
        setData(packmans)
    }, [packmans])

    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])

    useEffect(() => {
        setSearchedData(searchedPackmans)
    }, [searchedPackmans])

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
                headerText={`${deletedPackman && deletedPackman.name
                } ${t('ismli agentni o\'chirishni tasdiqlaysizmi?')}`}
                title={t('O\'chirilgan agentni tiklashning imkoni mavjud emas!')}
                toggleModal={toggleModal}
                body={'approve'}
                approveFunction={handleClickApproveToDelete}
                closeModal={handleClickCancelToDelete}
                isOpen={modalVisible}
            />
            <form className={`sale-deliver-form ps-[20px] mt-[40px] flex lg:flex-nowrap flex-wrap ${stickyForm && 'stickyForm'}`}>
                <FieldContainer
                    onChange={handleChangePackmanName}
                    value={packmanName}
                    label={t('Agentning ismi')}
                    placeholder={t('misol: Anvar')}
                    maxWidth={'w-[43.75rem]'}
                    type={'string'}
                />
                <div className={'flex gap-[1.25rem] grow items-end'}>
                    <Button
                        add={!stickyForm}
                        edit={stickyForm}
                        text={stickyForm ? t(`Saqlash`) : t('Yangi agent qo`shish')}
                        onClick={stickyForm ? handleEdit : addNewPackman}
                    />
                    <Button text={t('Tozalash')} onClick={clearForm} />
                </div>
            </form>
            
            <div className='flex ps-[10px] items-center '>
            <SelectForm  key={'total_1'}  onSelect={filterByTotal}/>
            <SearchForm
                filterBy={['total', 'name']}
                filterByTotal={filterByTotal}
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
                ) : data.length === 0 ? (
                    <NotFind text={'Agentlar mavjud emas'} />
                ) : (
                    !isMobile?
                    <Table
                        page='packman'
                        currentPage={currentPage}
                        countPage={showByTotal}
                        data={searchedData.length > 0 ? searchedData : data}
                        headers={headers}
                        Delete={handleDeletePackman}
                        Edit={handleEditPackman}
                    />
                    :
                    <TableMobile
                        page='packman'
                        currentPage={currentPage}
                        countPage={showByTotal}
                        data={searchedData.length > 0 ? searchedData : data}
                        headers={headers}
                        Delete={handleDeletePackman}
                        Edit={handleEditPackman}
                    />
                )}
            </div>
            <div className='flex justify-center mt-[30px] mb-[30px]'>
                    {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                        <Pagination
                            countPage={Number(showByTotal)}
                            totalDatas={totalSearched || filteredDataTotal}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                        />
                    )}
                </div>
        </motion.section>
    )
}

export default Packman
