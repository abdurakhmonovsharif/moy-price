import React from 'react'
import {RouteLink} from '../../../Components/RouteLinks/RouteLink'
import {Outlet} from 'react-router-dom'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'

const SendingOrders = () => {
    const {t} = useTranslation(['common'])

    return (
        <motion.section className={'h-full flex flex-col'}
                        key='content'
                        initial='collapsed'
                        animate='open'
                        exit='collapsed'
                        variants={{
                            open: {opacity: 1, height: '100%'},
                            collapsed: {opacity: 0, height: 0}
                        }}
                        transition={{duration: 0.5}}>
            <div
                className='py-[1.1875rem] w-full border-b-2 border-black-100 flex justify-center gap-[2.5rem] items-center'>
                <RouteLink
                    path={'buyurtmalar'}
                    iconType={'bag'}
                    title={t('Buyurtmalar')}
                />
                <RouteLink
                    path={'saqlanganlar'}
                    iconType={'clip'}
                    title={t('Saqlanganlar')}
                />
                <RouteLink
                    path={'ruyxat'}
                    iconType={'text'}
                    title={t('Ro`yxat')}
                />
            </div>
            <Outlet />
        </motion.section>
    )
}

export default SendingOrders
