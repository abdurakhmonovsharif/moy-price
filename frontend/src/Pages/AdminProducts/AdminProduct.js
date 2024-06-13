import React, {useEffect, useState} from 'react'
import SearchForm from '../../Components/SearchForm/SearchForm'
import Table from '../../Components/Table/Table'
import BtnAddRemove from './../../Components/Buttons/BtnAddRemove'
import {useDispatch, useSelector} from 'react-redux'
import {
    clearSearchedMarkets,
    createDirector,
    createMarket,
    deleteMarket,
    editDirector,
    editMarket,
    getMarkets,
    getMarketsByFilter
} from './adminproductsSlice.js'
import Pagination from '../../Components/Pagination/Pagination.js'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import UniversalModal from '../../Components/Modal/UniversalModal.js'
import {successAddDirectory, successEditProfile} from '../../Components/ToastMessages/ToastMessages.js'
import {filter} from 'lodash'
import {t} from 'i18next'

const AdminProduct = () => {
    const dispatch = useDispatch()
    const {
        markets,
        total,
        searchedMarkets,
        totalSearched,
        loadingGetMarkets,
        loadingDeleteMarket,
    } = useSelector((state) => state.adminmarkets)
    const [data, setData] = useState(markets)
    const [searchedData, setSearchedData] = useState(searchedMarkets)
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [name, setName] = useState('')
    const [director, setDirector] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [modalBody, setModalBody] = useState('')
    const [currentStep, setCurrentStep] = useState(1)
    const [bgActive, setBgActive] = useState(false)
    const [createdMarketId, setCreatedMarketId] = useState(null)
    const [image, setImage] = useState('')
    const [currentMarket, setCurrentMarket] = useState(null)
    const [editedMarket, setEditedMarket] = useState(null)
    const [deletedMarket, setDeletedMarket] = useState(null)

    const headers = [
        {title: '№', styles: 'text-center'},
        {title: 'Logotip', styles: 'w-[4.25rem]'},
        {title: "Do'kon nomi", styles: 'text-center'},
        {title: 'Director', styles: 'text-center'},
        {title: 'Telefon', styles: 'w-[7.875rem]'},
        {title: "Sa'nasi", styles: ''},
        {title: 'Turi', styles: 'text-center w-[3.1875rem]'},
        {title: '', styles: 'w-[3rem]'},
        {title: 'Delete', styles: 'w-[3rem]'},
    ]

    const toggleModal = () => {
        setModalVisible(false)
        setTimeout(() => {
            setModalBody('')
            setCurrentMarket(null)
            setEditedMarket(null)
            setImage('')
            setCreatedMarketId(null)
            setCurrentStep(1)
            setBgActive(false)
        }, 100)
    }
    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }
    const filterByMarketName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setName(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedMarkets())
        if (valForSearch === '') {
            setData(markets)
            setFilteredDataTotal(total)
        } else {
            const filteredProducts = filter(markets, (market) => {
                return market.name.toLowerCase().includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const filterByDirectorName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setDirector(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
            dispatch(clearSearchedMarkets())
        if (valForSearch === '') {
            setData(markets)
            setFilteredDataTotal(total)
        } else {
            const filteredProducts = filter(markets, (market) => {
                return (
                    market.director.firstname
                        .toLowerCase()
                        .includes(valForSearch) ||
                    market.director.lastname
                        .toLowerCase()
                        .includes(valForSearch)
                )
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const filterByMarketNameAndDirectorNameWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0)
            const body = {
                currentPage: 0,
                countPage: showByTotal,
                search: {
                    name: name.replace(/\s+/g, ' ').trim(),
                    director: director.replace(/\s+/g, ' ').trim(),
                },
            }
            dispatch(getMarketsByFilter(body))
        }
    }
    const handleAddNext = (body) => {
        dispatch(createMarket(body)).then(({error, payload}) => {
            if (!error) {
                setCurrentStep(currentStep + 1)
                setBgActive(true)
                setImage('')
                setCreatedMarketId(payload._id)
            }
        })
    }
    const handleAddFinish = (data) => {
        const body = {
            ...data,
            image,
            market: createdMarketId,
        }
        dispatch(createDirector(body)).then(({error}) => {
            if (!error) {
                const body = {
                    currentPage,
                    countPage: showByTotal,
                    search: {
                        name: name.replace(/\s+/g, ' ').trim(),
                        director: director.replace(/\s+/g, ' ').trim(),
                    },
                }
                setImage('')
                setCurrentStep(1)
                setBgActive(false)
                setCreatedMarketId(null)
                successAddDirectory()
                dispatch(getMarkets(body))
                toggleModal()
            }
        })
    }
    const handleEditFinish = (data) => {
        const body = {
            ...data,
            image,
            market: createdMarketId,
            _id: editedMarket.director._id,
        }
        dispatch(editDirector(body)).then(({error}) => {
            if (!error) {
                const body = {
                    currentPage,
                    countPage: showByTotal,
                    search: {
                        name: name.replace(/\s+/g, ' ').trim(),
                        director: director.replace(/\s+/g, ' ').trim(),
                    },
                }
                setImage('')
                setCurrentStep(1)
                setBgActive(false)
                setCreatedMarketId(null)
                successEditProfile()
                dispatch(getMarkets(body))
                toggleModal()
            }
        })
    }
    const handleEditNext = (body) => {
        const sendingBody = {
            market: {
                ...body,
                _id: editedMarket._id,
            },
        }
        dispatch(editMarket(sendingBody)).then(({error, payload}) => {
            if (!error) {
                setCurrentStep(currentStep + 1)
                setBgActive(true)
                setImage(editedMarket?.director?.image || '')
                setCreatedMarketId(payload._id)
                const body = {
                    currentPage,
                    countPage: showByTotal,
                    search: {
                        name: name.replace(/\s+/g, ' ').trim(),
                        director: director.replace(/\s+/g, ' ').trim(),
                    },
                }
                dispatch(getMarkets(body))
            }
        })
    }

    const handleDelete = (market) => {
        setDeletedMarket(market)
        setModalBody('approve')
        setModalVisible(true)
    }

    const handleDeleteMarket = () => {
        dispatch(deleteMarket({id: deletedMarket._id})).then(
            ({error, payload}) => {
                if (!error) {
                    const body = {
                        currentPage,
                        countPage: showByTotal,
                        search: {
                            name: name.replace(/\s+/g, ' ').trim(),
                            director: director.replace(/\s+/g, ' ').trim(),
                        },
                    }
                    setDeletedMarket(null)
                    setModalVisible(false)
                    setModalBody('')
                    dispatch(getMarkets(body))
                }
            }
        )
    }

    const handleClickRow = (market) => {
        setCurrentMarket(market)
        setModalBody('filterBranch')
        setModalVisible(true)
    }
    const handleClickSave = () => {
        const body = {
            currentPage,
            countPage: showByTotal,
            search: {
                name: name.replace(/\s+/g, ' ').trim(),
                director: director.replace(/\s+/g, ' ').trim(),
            },
        }
        dispatch(getMarkets(body))
        toggleModal()
    }
    const handleClickEdit = (market) => {
        setEditedMarket(market)
        setImage(market?.image ? market?.image : '')
        setModalBody('addMarket')
        setModalVisible(true)
    }

    useEffect(() => {
        const body = {
            currentPage,
            countPage: showByTotal,
            search: {
                name: name.replace(/\s+/g, ' ').trim(),
                director: director.replace(/\s+/g, ' ').trim(),
            },
        }
        dispatch(getMarkets(body))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, currentPage, showByTotal])
    useEffect(() => {
        setData(markets)
    }, [markets])
    useEffect(() => {
        setSearchedData(searchedMarkets)
    }, [searchedMarkets])
    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])

    return (
        <section>
            {loadingDeleteMarket ? (
                <Spinner />
            ) : (
                <UniversalModal
                    title={
                        modalBody === 'approve' &&
                        t("O'chirilgan do'kon ma'lumotlarini tiklashning imkoni mavjud emas")
                    }
                    headerText={
                        modalBody === 'approve' &&
                        t("Diqqat do'kon ma'lumotlarni o'chirishni tasdiqlaysizmi?")
                    }
                    body={modalBody}
                    isOpen={modalVisible}
                    toggleModal={
                        !editedMarket
                            ? currentStep === 1
                                ? toggleModal
                                : () => {}
                            : toggleModal
                    }
                    addMarket={{
                        currentStep,
                        bgActive,
                        handleNext: !editedMarket
                            ? handleAddNext
                            : handleEditNext,
                        handleFinish: !editedMarket
                            ? handleAddFinish
                            : handleEditFinish,
                        image: image,
                        setImage: setImage,
                        editedMarket,
                    }}
                    product={currentMarket}
                    approveFunction={
                        deletedMarket ? handleDeleteMarket : handleClickSave
                    }
                />
            )}
            <div className='mainPadding'>
                <BtnAddRemove
                    text={"Yangi do'kon qo`shish"}
                    add={true}
                    onClick={() => {
                        setModalBody('addMarket')
                        setModalVisible(true)
                    }}
                />
            </div>
            <div className={'flex justify-between items-center mainPadding'}>
                <h3 className={'text-blue-900 text-[xl] leading-[1.875rem]'}>
                    {t('Do\'konlar')}
                </h3>
                {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                    <Pagination
                        countPage={Number(showByTotal)}
                        totalDatas={totalSearched || filteredDataTotal}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
            <SearchForm
                filterBy={['total', 'marketName', 'directorName']}
                filterByMarketName={filterByMarketName}
                filterByDirectorName={filterByDirectorName}
                searchByDirectorName={director}
                searchByMarketName={name}
                filterByDirectorNameWhenPressEnter={
                    filterByMarketNameAndDirectorNameWhenPressEnter
                }
                filterByMarketNameWhenPressEnter={
                    filterByMarketNameAndDirectorNameWhenPressEnter
                }
                filterByTotal={filterByTotal}
            />
            <div className={'tableContainerPadding'}>
                {loadingGetMarkets ? (
                    <Spinner />
                ) : data.length === 0 && searchedData.length === 0 ? (
                    <NotFind text={"Do'konlar mavjud emas"} />
                ) : (
                    <Table
                        page={'adminProduct'}
                        data={searchedData.length > 0 ? searchedData : data}
                        headers={headers}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        onClickTableRow={handleClickRow}
                        Edit={handleClickEdit}
                        handleDelete={handleDelete}
                    />
                )}
            </div>
        </section>
    )
}

export default AdminProduct
