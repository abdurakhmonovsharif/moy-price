import React, {useEffect, useState} from 'react'
import FilialConnectionCard from '../../Components/FilialConnectionCard/FilialConnectionCard'
import FieldContainer from '../../Components/FieldContainer/FieldContainer.js'
import Button from '../../Components/Buttons/BtnAddRemove.js'
import {useTranslation} from 'react-i18next'
import UniversalModal from '../../Components/Modal/UniversalModal.js'
import {regexForTypeNumber} from '../../Components/RegularExpressions/RegularExpressions.js'
import {useDispatch, useSelector} from 'react-redux'
import {
    answerToRequest,
    clearMarketByInn,
    createRequestToConnection,
    deleteRequestToConnection,
    getConnectionMarkets,
    getMarketByInn,
    getNewRequestsToConnection,
    incomingRequestsToConnection,
    sendingRequestsToConnection
} from './connectionSlice.js'
import SearchForm from '../../Components/SearchForm/SearchForm.js'
import {filter, map, uniqueId} from 'lodash'

function Connection() {
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()
    const {
        marketByInn,
        connections,
        sendingRequests,
        incomingRequests,
        countOfNewRequests,
    } = useSelector((state) => state.connections)
    const {market} = useSelector((state) => state.login)
    const [modalVisible, setModalVisible] = useState(false)
    const [inn, setInn] = useState('')
    const [modalBody, setModalBody] = useState('requestconnection')
    const [connectionMarkets, setConnectionMarkets] = useState([])
    const [allSendingRequests, setAllSendingRequests] = useState([])
    const [allIncomingRequests, setAllIncomingRequests] = useState([])

    const clearForm = () => {
        setInn('')
    }
    const handleInn = (e) => {
        let val = e.target.value
        if (regexForTypeNumber.test(val)) {
            setInn(val)
        }
    }
    const handelCloseModal = () => {
        setModalVisible(false)
        clearMarketByInn()
    }
    const handleFindMarketByInn = (e) => {
        e.preventDefault()
        dispatch(getMarketByInn({inn})).then(({error}) => {
            if (!error) {
                setModalVisible(true)
                setModalBody('requestconnection')
            }
        })
    }
    const handleCreateRequestToConnection = () => {
        const body = {firstMarket: market._id, secondMarket: marketByInn._id}
        dispatch(createRequestToConnection(body)).then(({error}) => {
            if (!error) {
                clearMarketByInn()
                setModalVisible(false)
                clearForm()
                dispatch(sendingRequestsToConnection())
            }
        })
    }
    const handleDeleteRequest = (connectionId) => {
        dispatch(deleteRequestToConnection({connectionId})).then(({error}) => {
            if (!error) {
                dispatch(sendingRequestsToConnection())
                dispatch(incomingRequestsToConnection())
            }
        })
    }
    const handleAnswerRequest = (connection) => {
        dispatch(answerToRequest({connection})).then(({error}) => {
            if (!error) {
                dispatch(incomingRequestsToConnection())
                dispatch(getConnectionMarkets())
                dispatch(getNewRequestsToConnection())
            }
        })
    }
    const handleAcceptRequest = (connection) => {
        handleAnswerRequest({
            ...connection,
            accept: true,
            rejected: false,
            request: false,
        })
    }
    const handleRejectRequest = (connection) => {
        handleAnswerRequest({
            ...connection,
            accept: false,
            rejected: true,
            request: false,
        })
    }

    const sendingRequest = (e) => {
        e.preventDefault()
        setModalVisible(true)
        setModalBody('sendingApplication')
    }
    const requestApplication = (e) => {
        e.preventDefault()
        setModalVisible(true)
        setModalBody('requestApplication')
    }

    // filters
    const filterByMarketName = (e) => {
        const val = e.target.value.toLowerCase()
        const filtered = filter(connections, (market) =>
            market.name.toLowerCase().includes(val)
        )
        setConnectionMarkets(filtered)
    }
    const filterByMarketInn = (e) => {
        const val = e.target.value.toLowerCase()
        const filtered = filter(connections, (market) =>
            market.inn.toString().toLowerCase().includes(val)
        )
        setConnectionMarkets(filtered)
    }

    const filterByDirectorName = (e) => {
        const val = e.target.value.toLowerCase()
        const filtered = filter(
            connections,
            (market) =>
                market.director.firstname.toLowerCase().includes(val) ||
                market.director.lastname.toLowerCase().includes(val)
        )
        setConnectionMarkets(filtered)
    }
    // modal toggle
    const toggleModal = () => setModalVisible(!modalVisible)
    // useEffects
    useEffect(() => {
        dispatch(getConnectionMarkets())
        dispatch(incomingRequestsToConnection())
        dispatch(sendingRequestsToConnection())
        dispatch(getNewRequestsToConnection())
    }, [dispatch])
    useEffect(() => {
        setConnectionMarkets(connections)
    }, [connections])
    useEffect(() => {
        setAllSendingRequests(sendingRequests)
    }, [sendingRequests])
    useEffect(() => {
        setAllIncomingRequests(incomingRequests)
    }, [incomingRequests])

    return (
        <div>
            <UniversalModal
                body={modalBody}
                marketByInn={marketByInn}
                toggleModal={toggleModal}
                approveFunction={handleCreateRequestToConnection}
                closeModal={handelCloseModal}
                isOpen={modalVisible}
                sendingRequests={allSendingRequests}
                handleDeleteRequest={handleDeleteRequest}
                incomingRequests={allIncomingRequests}
                handleAcceptRequest={handleAcceptRequest}
                handleRejectRequest={handleRejectRequest}
            />

            <form
                className={`flex gap-[1.25rem] bg-background flex-col mainPadding transition ease-linear duration-200`}
            >
                <div className='supplier-style'>
                    <FieldContainer
                        value={inn}
                        onChange={handleInn}
                        label={t("Do'kon INN raqami")}
                        placeholder={`${t('misol')}: 123 456 789`}
                        border={true}
                    />
                    <div className={'flex gap-[1.25rem] grow'}>
                        <Button
                            onClick={handleFindMarketByInn}
                            add={true}
                            text={t("Yangi do'kon qo'shish")}
                        />
                        <Button
                            edit={true}
                            text={t('Yuborilganlar')}
                            onClick={sendingRequest}
                        />
                        <Button
                            count={countOfNewRequests.count}
                            bell={true}
                            text={t("So'rovlar")}
                            onClick={requestApplication}
                        />
                    </div>
                </div>
            </form>

            <div className='mainPadding'>
                <p className='supplier-title text-center'>
                    {t("Hamkor do'konlar")}
                </p>
            </div>
            <SearchForm
                filterBy={['marketName', 'inn', 'directorName', 'lastname']}
                filterByMarketName={filterByMarketName}
                filterByMarketInn={filterByMarketInn}
                filterByDirectorName={filterByDirectorName}
            />
            <div className='mainPadding'>
                {connectionMarkets &&
                    map(connectionMarkets, (market) => (
                        <div className='pb-4' key={uniqueId('markets')}>
                            <FilialConnectionCard market={market} />
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default Connection
