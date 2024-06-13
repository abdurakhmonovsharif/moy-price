import React, {useEffect, useState} from 'react'
import Table from '../../../Components/Table/Table'
import TableMobile from '../../../Components/Table/TableMobile'
import {useDispatch, useSelector} from 'react-redux'
import {
    deleteSavedPayment,
    getSavedPayments,
} from '../Slices/savedSellingsSlice.js'
import NotFind from '../../../Components/NotFind/NotFind.js'
import SmallLoader from '../../../Components/Spinner/SmallLoader.js'
import {universalToast} from '../../../Components/ToastMessages/ToastMessages.js'
import UniversalModal from '../../../Components/Modal/UniversalModal.js'
import {useTranslation} from 'react-i18next'
import {universalSort} from './../../../App/globalFunctions'

const SavedSellings = () => {
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
    const {savedPayments, getLoading} = useSelector(
        (state) => state.savedSellings
    )
    const [data, setData] = useState(savedPayments)
    const [storeData, setStoreData] = useState(savedPayments)
    const [sorItem, setSorItem] = useState({
        filter: '',
        sort: '',
        count: 0,
    })
    const {currencyType} = useSelector((state) => state.currency)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalBody, setModalBody] = useState('approve')
    const [printBody, setPrintBody] = useState({})
    const [selectedPayment, setSelectedPayment] = useState(null)
    const headers = [
        {styles: 'w-[10%] text-start', filter: '', title: '№'},
        {styles: 'w-[40%]', title: t('Sotuvchi')},
        {styles: 'w-[40%]', filter: 'temporary.clientValue', title: t('Mijoz')},
        {styles: 'w-[10%]', filter: '', title: t('Maxsulotlar')},
        {
            styles: 'w-[10%] text-center',
            filter: 'temporary.totalPrice',
            title: t('Jami'),
        },
        {styles: 'w-[10%] text-center', filter: 'createdAt', title: t('Sana')},
        {styles: 'w-[10%] text-center', filter: 'createdAt', title: t('Vaqti')},
        {styles: 'w-[10%]', filter: '', title: ' '},
    ]
    const toggleModal = () => {
        setModalVisible(!modalVisible)
        setPrintBody({})
        setModalBody('')
    }
    const deletePayment = () => {
        dispatch(deleteSavedPayment({_id: selectedPayment})).then(({error}) => {
            if (!error) {
                toggleModal()
                setSelectedPayment(null)
            }
        })
    }
    const handleGetId = (id) => {
        setSelectedPayment(id)
        toggleModal()
        setModalBody('approve')
    }
    const editSavedPayment = () => {
        universalToast(t('Xizmatdan foydalanish hozircha mavjud emas'), 'info')
    }
    const handlePrintModal = (el) => {
        toggleModal()
        setModalBody('savedsalescheck')
        setPrintBody({
            createdAt: el.createdAt,
            products: el.temporary.tableProducts,
            client: {name: el.temporary.clientValue?.label},
            packman: {name: el.temporary.packmanValue.label},
            user: el.user,
        })
    }

    useEffect(() => {
        dispatch(getSavedPayments())
    }, [dispatch])

    useEffect(() => {
        setData(savedPayments)
        setStoreData(savedPayments)
    }, [savedPayments])

    const filterData = (filterKey) => {
        if (filterKey === sorItem.filter) {
            switch (sorItem.count) {
                case 1:
                    setSorItem({
                        filter: filterKey,
                        sort: '1',
                        count: 2,
                    })
                    universalSort(
                        savedPayments,
                        setData,
                        filterKey,
                        1,
                        storeData
                    )
                    break
                case 2:
                    setSorItem({
                        filter: filterKey,
                        sort: '',
                        count: 0,
                    })
                    universalSort(data, setData, filterKey, '', storeData)
                    break
                default:
                    setSorItem({
                        filter: filterKey,
                        sort: '-1',
                        count: 1,
                    })
                    universalSort(data, setData, filterKey, -1, storeData)
            }
        } else {
            setSorItem({
                filter: filterKey,
                sort: '-1',
                count: 1,
            })
            universalSort(data, setData, filterKey, -1, storeData)
        }
    }

    return (
        <div className='pb-[1.25rem] max-h-[35rem] mb-[1rem] pt-[1.25rem] ps-[1rem] pe-[2rem]'>
            <UniversalModal
                isOpen={modalVisible}
                body={modalBody}
                approveFunction={deletePayment}
                printedSelling={printBody}
                toggleModal={toggleModal}
                headerText={t(
                    'Saqlangan to`lovni o`chirishni tasdiqlaysizmi ?'
                )}
                title={t('Agar to`lov o`chsa uni tiklab bo`lmaydi !')}
            />
            {!getLoading ? (
                savedPayments.length > 0 ? (
                    !isMobile ? (
                        <Table
                            Edit={editSavedPayment}
                            Delete={handleGetId}
                            page='temporarysale'
                            currentPage={3}
                            countPage={3}
                            data={data}
                            headers={headers}
                            currency={currencyType}
                            Print={handlePrintModal}
                            Sort={filterData}
                            sortItem={sorItem}
                        />
                    ) : (
                        <TableMobile
                            Edit={editSavedPayment}
                            Delete={handleGetId}
                            page='temporarysale'
                            currentPage={3}
                            countPage={3}
                            data={data}
                            headers={headers}
                            currency={currencyType}
                            Print={handlePrintModal}
                            Sort={filterData}
                            sortItem={sorItem}
                        />
                    )
                ) : (
                    <NotFind
                        text={t('Saqlanganlar to`lovlar hozircha mavjud emas')}
                    />
                )
            ) : (
                <SmallLoader />
            )}
        </div>
    )
}

export default SavedSellings
