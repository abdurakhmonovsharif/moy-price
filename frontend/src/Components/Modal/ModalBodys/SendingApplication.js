import React from 'react'
import {IoBanSharp, IoHourglass, IoShieldCheckmark, IoTrashOutline} from 'react-icons/io5'
import {map, uniqueId} from 'lodash'
import NotFind from '../../NotFind/NotFind.js'

function SendingApplication({sendingRequests, handleDeleteRequest}) {
    return (
        <div>
            <div className='pt-[2rem]'>
                {sendingRequests.length > 0 ? (
                    map(sendingRequests, (request, index) => {
                        return (
                            <ul
                                className='request-application-ul'
                                key={uniqueId('sendingRquest')}
                            >
                                <li className='font-bold text-lg'>
                                    {index + 1}.
                                </li>
                                <li>
                                    <span className='request-application-ul-li'>
                                        Shop Name
                                    </span>
                                    <p className='text-[1rem] text-black-900'>
                                        {request?.second?.name}
                                    </p>
                                </li>
                                <li>
                                    <span className='request-application-ul-li'>
                                        INN
                                    </span>
                                    <p className='text-[1rem] text-black-900'>
                                        {request?.second?.inn}
                                    </p>
                                </li>
                                <li>
                                    <span className='request-application-ul-li'>
                                        Director Name
                                    </span>
                                    <p className='request-application-li-p'>
                                        <span>
                                            {
                                                request?.second?.director
                                                    ?.firstname
                                            }
                                        </span>
                                        <span>
                                            {
                                                request?.second?.director
                                                    ?.lastName
                                            }
                                        </span>
                                    </p>
                                </li>
                                <li>
                                    <span className='request-application-ul-li'>
                                        Director Phone
                                    </span>
                                    <p className='text-[1rem] text-black-900'>
                                        {request?.second?.director?.phone}
                                    </p>
                                </li>
                                <li>
                                    <div className='mr-[10px] flex gap-[8px]'>
                                        {request?.request && (
                                            <IoHourglass
                                                size={`1.5rem`}
                                                className='text-warning-500'
                                            />
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
                                                handleDeleteRequest(
                                                    request?._id
                                                )
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
        </div>
    )
}

export default SendingApplication
