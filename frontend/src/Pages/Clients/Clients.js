import React, {useEffect, useState} from 'react'
import FieldContainer from '../../Components/FieldContainer/FieldContainer'
import Button from '../../Components/Buttons/BtnAddRemove'
import Pagination from '../../Components/Pagination/Pagination'
import Table from '../../Components/Table/Table'
import TableMobile from '../../Components/Table/TableMobile'
import {useDispatch, useSelector} from 'react-redux'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import SearchForm from '../../Components/SearchForm/SearchForm'
import UniversalModal from '../../Components/Modal/UniversalModal.js'
import {motion} from 'framer-motion'
import {filter, map} from 'lodash'
import {
    successAddClientMessage,
    successDeleteClientMessage,
    successUpdateClientMessage,
    warningEmptyInput,
} from '../../Components/ToastMessages/ToastMessages.js'
import {
    addClients,
    clearSearchedClients,
    deleteClients,
    getAllPackmans,
    getClients,
    getClientsByFilter,
    updateClients,
} from './clientsSlice'
import {checkEmptyString} from '../../App/globalFunctions.js'
import {useTranslation} from 'react-i18next'
import {VscChromeClose} from 'react-icons/vsc'
import {FaFilter} from 'react-icons/fa'
import SelectForm from '../../Components/Select/SelectForm.js'

const ClientsPage = () => {
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()

    const {packmans, clients, loading, searchedClients, total, totalSearched} =
        useSelector((state) => state.clients)

    const {user} = useSelector((state) => state.login)

    const headers =
        user.type === 'Director'
            ? [
                  {title: '№', styles: 'w-[8%] text-left'},
                  // {title: t('Agent'), styles: 'w-[41%] text-left'},
                  {title: t('Mijoz'), styles: 'w-[41%] text-left'},
                  {title: t('Telefon'), styles: 'w-[41%] text-left'},
                  {title: t('Savdo'), styles: 'w-[41%] text-left'},
                  {title: t('Sof foyda'), styles: 'w-[41%] text-left'},
                  {title: '', styles: 'w-[8%] text-left'},
              ]
            : [
                  {title: '№', styles: 'w-[8%] text-left'},
                  // {title: t('Agent'), styles: 'w-[41%] text-left'},
                  {title: t('Mijoz'), styles: 'w-[41%] text-left'},
                  {title: t('Savdo'), styles: 'w-[41%] text-left'},
                  {title: '', styles: 'w-[8%] text-left'},
              ]

    const [startDate, setStartDate] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
        )
    )
    const [endDate, setEndDate] = useState(
        new Date(new Date().setHours(23, 59, 59, 0)).toISOString()
    )

    // states
    const [packmanOptions, setPackmanOptions] = useState([])
    const [data, setData] = useState([])
    const [searchedData, setSearchedData] = useState([])
    const [clientName, setClientName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [packman, setPackman] = useState(null)
    const [packmanId, setPackmanId] = useState(null)
    const [currentClient, setCurrentClient] = useState('')
    const [deletedCLients, setDeletedClients] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [stickyForm, setStickyForm] = useState(false)
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [searchByName, setSearchByName] = useState('')
    const [searchPhoneNumber, setSearchPhoneNumber] = useState('')
    const [printedSelling, setPrintedSelling] = useState(null)
    const [modalBody, setModalBody] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    // modal toggle
    const toggleModal = () => {
        setModalVisible(!modalVisible)
        setTimeout(() => {
            setDeletedClients(null)
        }, 500)
    }
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

    // handle change of input
    const handleChangeClientName = (e) => {
        setClientName(e.target.value)
    }
    // handle change of input
    const handleChangePhoneNumber = (e) => {
        setPhoneNumber(e.target.value)
    }
    // table edit and delete
    const handleEditClients = (client) => {
        setPackman(
            client.packman
                ? {label: client.packman.name, value: client.packman._id}
                : ''
        )
        setClientName(client.name || '')
        setPhoneNumber(client.phoneNumber)
        setCurrentClient(client)
        setStickyForm(true)
    }

    const handleDeleteClient = (client) => {
        setDeletedClients(client)
        setModalBody('approve')
        setModalVisible(true)
    }

    const handlePrint = (sale) => {
        setModalBody('allChecks')
        setPrintedSelling(sale)
        setModalVisible(true)
    }

    const handleClickApproveToDelete = () => {
        const body = {
            name: deletedCLients.name,
            _id: deletedCLients._id,
            packman: deletedCLients.packman,
            currentPage,
            countPage: showByTotal,
            search: {
                client: searchByName.replace(/\s+/g, ' ').trim(),
            },
        }
        dispatch(deleteClients(body)).then(({error}) => {
            if (!error) {
                clearForm()
                successDeleteClientMessage()
            }
        })
        toggleModal()
    }
    // handle submit of inputs
    const addNewClients = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString([
            {
                value: clientName,
                message: t('Mijoz ismi'),
            },
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                name: clientName,
                phoneNumber,
                packman: (packman && packman.value) || null,
                currentPage,
                countPage: showByTotal,
                search: {
                    client: searchByName.replace(/\s+/g, ' ').trim(),
                },
            }
            dispatch(addClients(body)).then(({error}) => {
                if (!error) {
                    clearForm()
                    successAddClientMessage()
                }
            })
        }
    }

    const handleEdit = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString([
            {
                value: clientName,
                message: t('Mijoz ismi'),
            },
            {
                value: phoneNumber,
                message: t('Telefon raqam'),
            },
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                name: clientName,
                _id: currentClient._id,
                packman: (packman && packman.value) || null,
                currentPage,
                phoneNumber,
                countPage: showByTotal,
                search: {
                    client: searchByName.replace(/\s+/g, ' ').trim(),
                },
            }
            dispatch(updateClients(body)).then(({error}) => {
                if (!error) {
                    clearForm()
                    successUpdateClientMessage()
                }
            })
        }
    }

    const clearForm = (e) => {
        e && e.preventDefault()
        setClientName('')
        setPackman(null)
        setStickyForm(false)
        setPhoneNumber('')
    }

    // filter by packman
    const filterByPackman = ({value}) => {
        setPackmanId(value)
    }

    // filter by total
    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }

    // handle change of search inputs
    const filterByClientName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setSearchByName(val)
        if (searchedData.length > 0 || totalSearched > 0)
            dispatch(clearSearchedClients())
        if (valForSearch === '') {
            setData(clients)
            setFilteredDataTotal(total)
        } else {
            const filteredClients = filter(clients, (client) => {
                return client.name.toLowerCase().includes(valForSearch)
            })
            setData(filteredClients)
            setFilteredDataTotal(filteredClients.length)
        }
    }
    const filterByClientPhoneNumber = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setSearchPhoneNumber(val)
        if (searchedData.length > 0 || totalSearched > 0)
            dispatch(clearSearchedClients())
        if (valForSearch === '') {
            setData(clients)
            setFilteredDataTotal(total)
        } else {
            const filteredClients = filter(clients, (client) => {
                return client.phoneNumber.toLowerCase().includes(valForSearch)
            })
            setData(filteredClients)
            setFilteredDataTotal(filteredClients.length)
        }
    }

    const filterByNameWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            const body = {
                currentPage,
                countPage: showByTotal,
                search: {
                    client: searchByName.replace(/\s+/g, ' ').trim(),
                },
            }
            dispatch(getClientsByFilter(body))
        }
    }

    const handleChangeOptions = (e) => {
        setPackman(e)
    }

    useEffect(() => {
        dispatch(getAllPackmans())
    }, [dispatch])

    useEffect(() => {
        const body = {
            // currentPage,
            // countPage: showByTotal,
            // startDate,
            // endDate,
            search: {
                client: searchByName.replace(/\s+/g, ' ').trim(),
                packman: packmanId,
            },
        }
        dispatch(getClients(body))
        //    eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, showByTotal, currentPage, startDate, endDate, packmanId])
    useEffect(() => {
        setData(clients)
    }, [clients])
    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])
    useEffect(() => {
        setSearchedData(searchedClients)
    }, [searchedClients])
    useEffect(() => {
        const options = map(packmans, (packman) => {
            return {label: packman.name, value: packman._id}
        })
        setPackmanOptions(options)
    }, [packmans])

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
                headerText={`${deletedCLients && deletedCLients.name} ${t(
                    'ismli mijozni o`chirishni tasdiqlaysizmi?'
                )}`}
                title={t('O`chirilgan mijozni tiklashning imkoni mavjud emas!')}
                toggleModal={toggleModal}
                body={modalBody}
                approveFunction={handleClickApproveToDelete}
                isOpen={modalVisible}
                printedSelling={printedSelling}
            />
            <form
                className={`flex ps-[20px] mt-[40px] gap-[1.25rem] bg-background flex-col mainPadding transition ease-linear duration-200 ${
                    stickyForm && 'stickyForm'
                }`}
            >
                <div className='supplier-style'>
                    <FieldContainer
                        value={packman}
                        onChange={handleChangeOptions}
                        label={t('Agentni tanlang')}
                        placeholder={t('Dilso`z')}
                        select={true}
                        options={packmanOptions}
                        maxWidth={'lg:w-[21rem] w-[90vw]'}
                        border={true}
                    />

                    <FieldContainer
                        value={clientName}
                        label={t('Mijoz ismi')}
                        placeholder={t('misol: Navro`z')}
                        maxWidth={'lg:w-[21rem] w-[90vw]'}
                        type={'string'}
                        onChange={handleChangeClientName}
                    />
                    <div className={'flex gap-[1.25rem] grow w-[18.3125rem]'}>
                        <Button
                            add={!stickyForm}
                            edit={stickyForm}
                            text={
                                stickyForm
                                    ? t(`Saqlash`)
                                    : t('Yangi agent qo`shish')
                            }
                            onClick={stickyForm ? handleEdit : addNewClients}
                        />
                        <Button onClick={clearForm} text={t('Tozalash')} />
                    </div>
                </div>

                <FieldContainer
                    value={phoneNumber}
                    label={t('Телефон ракам')}
                    placeholder={t('misol: 911234333')}
                    maxWidth={'lg:w-[21rem] w-[90vw]'}
                    type={'string'}
                    onChange={handleChangePhoneNumber}
                />
            </form>
            {isMobile && (
                <div className='flex ps-[10px] pe-[20px] lg:justify-start gap-2 items-center justify-between mb-4'>
                    {/* <SelectForm key={'total_1'} onSelect={filterByTotal} /> */}
                    <button
                        onClick={() => {
                            setModalOpen(true)
                        }}
                        className='d-block  hover:bg-blue-200  bg-blue-400   focus-visible:outline-none w-[150px] h-[40px] createElement '
                    >
                        <FaFilter /> {t('izlash')}
                    </button>
                </div>
            )}
            {!isMobile ? (
                <div className='mt-[10px] px-4 flex justify-center items-center'>
                    <SearchForm
                        filterBy={[
                            // 'total',
                            // 'startDate',
                            // 'endDate',
                            'clientName',
                            'clientPhoneNumber',
                            'select',
                        ]}
                        filterByPackman={filterByPackman}
                        // filterByTotal={filterByTotal}
                        filterByClientNameWhenPressEnter={
                            filterByNameWhenPressEnter
                        }
                        filterByDelivererNameWhenPressEnter={
                            filterByNameWhenPressEnter
                        }
                        searchByClientName={searchByName}
                        filterByClientName={filterByClientName}
                        startDate={startDate}
                        endDate={new Date(endDate)}
                        phoneNumber={searchPhoneNumber}
                        filterByClientPhoneNumber={filterByClientPhoneNumber}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        searchByPackmans={[
                            {
                                label: 'Barchasi',
                                value: null,
                            },
                            ...packmanOptions,
                        ]}
                    />
                </div>
            ) : (
                modalOpen && (
                    <div className='absolute lg:p-[50px] w-[100vw]  h-[100vh]  flex justify-evenly flex-wrap    top-0	left-0 z-50 bg-[white]	'>
                        <VscChromeClose
                            onClick={() => setModalOpen(false)}
                            className=' absolute right-[20px]  top-[20px]  text-4xl cursor-pointer'
                        />

                        <div className='mt-[10px] flex flex-wrap justify-center items-center'>
                            <SearchForm
                                filterBy={[
                                    // 'total',
                                    // 'startDate',
                                    // 'endDate',
                                    'clientName',
                                    'select',
                                ]}
                                filterByPackman={filterByPackman}
                                // filterByTotal={filterByTotal}
                                filterByClientNameWhenPressEnter={
                                    filterByNameWhenPressEnter
                                }
                                filterByDelivererNameWhenPressEnter={
                                    filterByNameWhenPressEnter
                                }
                                searchByClientName={searchByName}
                                filterByClientName={filterByClientName}
                                startDate={startDate}
                                endDate={new Date(endDate)}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                                searchByPackmans={[
                                    {
                                        label: 'Barchasi',
                                        value: null,
                                    },
                                    ...packmanOptions,
                                ]}
                            />
                            <button
                                onClick={() => {
                                    setModalOpen(false)
                                }}
                                className='d-block  hover:bg-blue-200  bg-blue-400   focus-visible:outline-none w-[150px] h-[40px] createElement '
                            >
                                <FaFilter /> {t('izlash')}
                            </button>
                        </div>
                    </div>
                )
            )}

            <div className='lg:tableContainerPadding'>
                {loading ? (
                    <Spinner />
                ) : data.length === 0 && searchedData.length === 0 ? (
                    <NotFind text={t('Mijozlar mavjud emas')} />
                ) : !isMobile ? (
                    <Table
                        data={searchedData.length > 0 ? searchedData : data}
                        page={'client'}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        headers={headers}
                        Edit={handleEditClients}
                        Delete={handleDeleteClient}
                        Print={handlePrint}
                        type={user.type}
                    />
                ) : (
                    <TableMobile
                        data={searchedData.length > 0 ? searchedData : data}
                        page={'client'}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        headers={headers}
                        Edit={handleEditClients}
                        Delete={handleDeleteClient}
                        Print={handlePrint}
                        type={user.type}
                    />
                )}
            </div>
            {/* <div className='pagination-supplier flex justify-center mt-[30px] mb-[30px] '>
                {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                    <Pagination
                        countPage={Number(showByTotal)}
                        totalDatas={totalSearched || filteredDataTotal}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div> */}
        </motion.section>
    )
}

export default ClientsPage
