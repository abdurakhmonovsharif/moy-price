import React from 'react'
import {
    IoBanSharp,
    IoCheckmarkCircleSharp,
    IoCloseCircleSharp,
    IoShieldCheckmark,
    IoTrashOutline
} from 'react-icons/io5'
import {map, uniqueId} from 'lodash'
import NotFind from '../../NotFind/NotFind.js'

function RequestApplication({
    incomingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    handleDeleteRequest,
}) {
    return (
        <div className='pt-[2rem]'>
            {incomingRequests.length > 0 ? (
                map(incomingRequests, (request, index) => {
                    return (
                        <ul
                            className='request-application-ul'
                            key={uniqueId('incomingRequest')}
                        >
                            <li className='font-bold text-lg'>{index + 1}.</li>
                            <li>
                                <span className='request-application-ul-li'>
                                    Shop Name
                                </span>
                                <p className='text-[1rem] text-black-900'>
                                    {request?.first?.name}
                                </p>
                            </li>
                            <li>
                                <span className='request-application-ul-li'>
                                    INN
                                </span>
                                <p className='text-[1rem] text-black-900'>
                                    {request?.first?.inn}
                                </p>
                            </li>
                            <li>
                                <span className='request-application-ul-li'>
                                    Director Name
                                </span>
                                <p className='request-application-li-p'>
                                    <span>
                                        {request?.first?.director?.firstname}
                                    </span>
                                    <span>
                                        {request?.first?.director?.lastName}
                                    </span>
                                </p>
                            </li>
                            <li>
                                <span className='request-application-ul-li'>
                                    Director Phone
                                </span>
                                <p className='text-[1rem] text-black-900'>
                                    {request?.first?.director?.phone}
                                </p>
                            </li>
                            <li>
                                <div className='mr-[10px] flex gap-[8px]'>
                                    {request?.request && (
                                        <div>
                                            <button
                                                onClick={() =>
                                                    handleAcceptRequest(request)
                                                }
                                            >
                                                <IoCheckmarkCircleSharp
                                                    size={`1.5rem`}
                                                    className='text-success-600'
                                                />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRejectRequest(request)
                                                }
                                            >
                                                <IoCloseCircleSharp
                                                    size={`1.5rem`}
                                                    className='text-error-600'
                                                />
                                            </button>
                                        </div>
                                    )}
                                    {request?.accept && (
                                        <IoShieldCheckmark
                                            size={`1.5rem`}
                                            className='text-success-700'
                                        />
                                    )}
                                    {request?.rejected && (
                                        <IoBanSharp
                                            size={`1.5rem`}
                                            className='text-warning-700'
                                        />
                                    )}
                                    <button
                                        className='request-application-delete-icon'
                                        onClick={() =>
                                            handleDeleteRequest(request?._id)
                                        }
                                    >
                                        <IoTrashOutline size={`1rem`} />
                                    </button>
                                </div>
                            </li>
                        </ul>
                    )
                })
            ) : (
                <NotFind text={"So'rovlar majud emas"} />
            )}
        </div>
    )
}

export default RequestApplication
