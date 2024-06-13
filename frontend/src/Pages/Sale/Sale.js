import React, {useEffect} from 'react'
import {RouteLink} from '../../Components/RouteLinks/RouteLink'
import {Outlet} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from 'framer-motion'
import {getCurrency} from '../Currency/currencySlice.js'
import {useTranslation} from 'react-i18next'

const Sale = () => {
    const { t } = useTranslation(['common'])
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.login)
    useEffect(() => {
        dispatch(getCurrency())
    }, [dispatch])
    return (
        <motion.section className={'flex flex-col h-full'}
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
                open: { opacity: 1 },
                collapsed: { opacity: 0 }
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}>
            <div
                className='flex lg:mt-2 mt-[60px] lg:justify-center  gap-2  overflow-scroll  pb-16 md:pb-5'>
                {/*<div className='ms-5'>*/}
                {/*    <RouteLink*/}
                {/*        path={'pos'}*/}
                {/*        iconType={'bag'}*/}
                {/*        title={'POS'}*/}
                {/*    />*/}
                {/*</div>*/}
                <div className='ms-5'>
                    <RouteLink
                        path={user.type.toLowerCase() === 'seller' ? '/' : 'sotish'}
                        iconType={'bag'}
                        title={t('Sotuv')}
                    />
                </div>
                <div className=' '>
                    <RouteLink
                        path={'saqlanganlar'}
                        iconType={'clip'}
                        title={t('Saqlanganlar')}
                    /></div>
                <div className='me-5 '>
                    <RouteLink
                        path={'ruyxat'}
                        iconType={'text'}
                        title={t('Ro`yxat')}
                    /></div>
            </div>
            <Outlet />
        </motion.section>
    )
}

export default Sale
