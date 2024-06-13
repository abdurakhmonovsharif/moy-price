import React from 'react'
import {RouteLink} from '../../Components/RouteLinks/RouteLink'
import {Outlet} from 'react-router-dom'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'

const Incoming = () => {
    const {t} = useTranslation(['common'])
    return (
        <motion.section
            className={'h-full flex flex-col'}
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
                open: {opacity: 1},
                collapsed: {opacity: 0}
            }}
            transition={{duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98]}}
        >
            <div
                className='py-[1.1875rem] w-full border-b-2 border-black-100 flex justify-center gap-[2.5rem] items-center'>
                <RouteLink
                    path={'/maxsulotlar/qabul/qabulqilish'}
                    iconType={'bag'}
                    title={t('Qabul qilish')}
                />
                <RouteLink
                    path={'/maxsulotlar/qabul/qabullar'}
                    iconType={'cloud'}
                    title={t('Qabullar')}
                />
                <RouteLink
                    path={'/maxsulotlar/qabul/saqlanganlar'}
                    iconType={'clip'}
                    title={t('Saqlanganlar')}
                />
                <RouteLink
                    path={'/maxsulotlar/qabul/ruyxat'}
                    iconType={'text'}
                    title={t('Ro`yxat')}
                />
            </div>
            <Outlet />
        </motion.section>
    )
}

export default Incoming
