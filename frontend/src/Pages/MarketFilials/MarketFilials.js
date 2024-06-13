import React, {useEffect, useState} from 'react'
import Filial from '../../Components/Filial/Filial'
import {map, uniqueId} from 'lodash'
import {motion} from 'framer-motion'
import SmallLoader from '../../Components/Spinner/SmallLoader'
import socket from '../../Config/socket.js'
import {useDispatch, useSelector} from 'react-redux'
import {universalToast} from '../../Components/ToastMessages/ToastMessages.js'
import {setFilialDatas} from '../ProductExchanges/productExchangesSlice.js'

function MarketFilials() {
    const {market} = useSelector((state) => state.login)
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        market &&
            socket.emit('getAllFilials', {
                market: market._id,
            })
        market &&
            socket.on('getAllFilials', ({id, filials}) => {
                if (id === market._id) {
                    setLoading(false)
                    dispatch(setFilialDatas(filials))
                    setData(
                        map(filials, (filial) => {
                            return {
                                director: {
                                    firstname:
                                        filial?.director?.firstname || '',
                                    lastname: filial?.director?.lastname || '',
                                    image: filial?.director?.image || '',
                                },
                                typecount: filial?.productCategory || 0,
                                productcount: filial?.productCount || 0,
                                totalPrice:
                                    filial?.products?.totalPriceuzs || 0,
                                totalPriceUSD:
                                    filial?.products?.totalPrice || 0,
                                shopname: filial?.name || '',
                                _id: filial?._id || '',
                            }
                        })
                    )
                }
            })
        market &&
            socket.on('error', ({id, err}) => {
                id === market._id && universalToast(err.message, 'error')
            })
    }, [market, dispatch])

    return (
        <motion.section
            className='mainPadding'
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
            {loading && (
                <div className='fixed backdrop-blur-[2px] left-0 right-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            {data.length > 0 &&
                map(data, (value) => (
                    <div className='pb-[1.25rem]' key={uniqueId('filial')}>
                        <Filial value={value} />
                    </div>
                ))}
        </motion.section>
    )
}

export default MarketFilials
