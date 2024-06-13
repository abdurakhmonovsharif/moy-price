import React, {useEffect, useState} from 'react'
import Table from '../../../../Components/Table/Table'
import {useDispatch, useSelector} from 'react-redux'
import {deleteSavedOrder, getSavedOrders} from '../Slices/savedOrdersSlice.js'
import NotFind from '../../../../Components/NotFind/NotFind.js'
import SmallLoader from '../../../../Components/Spinner/SmallLoader.js'
import {useTranslation} from 'react-i18next'
import UniversalModal from '../../../../Components/Modal/UniversalModal.js'

function SavedOrders() {
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()

    const headers = [
        {title: '№', styles: 'w-[10%]'},
        {
            title: 'Sana',
            styles: 'w-[15%]',
        },
        {
            title: 'Vaqt',
            styles: 'w-[10%]',
        },
        {
            title: "Do'kon nomi",
            styles: 'w-[25%]',
        },
        {title: 'Maxsulot soni', styles: 'w-[10%]'},
        {title: 'Umumiy narxi USD', styles: 'w-[15%]'},
        {title: 'Umumiy narxi UZS', styles: 'w-[15%]'},
        {
            title: '',
            styles: 'w-[10%]',
        },
    ]
    const {savedOrders, getLoading} = useSelector((state) => state.savedOrders)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalBody, setModalBody] = useState('approve')
    const [printBody, setPrintBody] = useState({})
    const [selectedOrder, setSelectedOrder] = useState(null)

    const toggleModal = () => {
        setModalVisible(!modalVisible)
        setPrintBody({})
        setModalBody('')
    }

    const handleGetId = (id) => {
        setSelectedOrder(id)
        toggleModal()
        setModalBody('approve')
    }
    const deleteOrder = () => {
        dispatch(deleteSavedOrder({temporaryId: selectedOrder})).then(
            ({error}) => {
                if (!error) {
                    toggleModal()
                    setSelectedOrder(null)
                    dispatch(getSavedOrders())
                }
            }
        )
    }
    const handlePrintModal = (el) => {
        toggleModal()
        setModalBody('savedorderscheck')
        setPrintBody(el)
    }

    useEffect(() => {
        dispatch(getSavedOrders())
    }, [dispatch])

    return (
        <section>
            <div className='mainPadding tableContainerPadding'>
                <UniversalModal
                    order={printBody}
                    isOpen={modalVisible}
                    body={modalBody}
                    approveFunction={deleteOrder}
                    printedSelling={printBody}
                    toggleModal={toggleModal}
                    headerText={t(
                        "Saqlangan buyurtmani o'chirishni tasdiqlaysizmi ?"
                    )}
                    title={t('Agar buyurtma o`chsa uni tiklab bo`lmaydi !')}
                />
                {!getLoading ? (
                    savedOrders.length > 0 ? (
                        <Table
                            Delete={handleGetId}
                            page='savedOrders'
                            currentPage={''}
                            countPage={''}
                            data={savedOrders}
                            headers={headers}
                            Print={handlePrintModal}
                        />
                    ) : (
                        <NotFind
                            text={t(
                                'Saqlanganlar buyurtmalar hozircha mavjud emas'
                            )}
                        />
                    )
                ) : (
                    <SmallLoader />
                )}
            </div>
        </section>
    )
}

export default SavedOrders
