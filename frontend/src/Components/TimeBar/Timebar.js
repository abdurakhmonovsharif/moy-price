import { useState } from 'react'
import { useTranslation } from 'react-i18next';

function Timebar() {
    const { t } = useTranslation(['common'])
    const [hour, setHour] = useState(
        new Date().toLocaleTimeString('uz-UZ', { hour12: false })
    )
    const weekDays = [
        t('Yakshanba'),
        t('Dushanba'),
        t('Seshanba'),
        t('Chorshanba'),
        t('Payshanba'),
        t('Juma'),
        t('Shanba')
    ]
    const monthNames = [
        t('Yanvar'),
        t('Fevral'),
        t('Mart'),
        t('Aprel'),
        t('May'),
        t('Iyun'),
        t('Iyul'),
        t('Avgust'),
        t('Sentabr'),
        t('Oktabr'),
        t('Noyabr'),
        t('Dekabr')
    ]
    setTimeout(() => {
        setHour(new Date().toLocaleTimeString('uz-UZ', { hour12: false }))
    }, 1000)
    return (
        <div
            className={
                'w-[60%] px-[2.5rem] py-[1.875rem] bg-loginButton rounded-[1.875rem] text-center text-white-900 flex flex-col gap-[1.25rem] shadow-[-23px_28px_15px_rgba(0,0,0,0.06)] absolute left-[79.5373665480427%] top-[6.761565836298932%] z-20'
            }
        >
            <h5 className={'font-bold text-[1.25rem] leading-[1.4375rem]'}>
                {weekDays[new Date().getDay()]}, {new Date().getDate()}{' '}
                {monthNames[new Date().getMonth()]}, {new Date().getFullYear()}{' '}
                {t("yil")}
            </h5>
            <span
                className={'time-line block border-[1px] border-b-white-900'}
            ></span>
            <h3 className={'leading-[1.75rem] font-bold text-[1.5rem]'}>
                {hour.replaceAll(':', ' : ')}
            </h3>
        </div>
    )
}

export default Timebar