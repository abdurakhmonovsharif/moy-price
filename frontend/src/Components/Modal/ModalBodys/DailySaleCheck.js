import React, {forwardRef, useEffect, useRef, useState} from 'react'
import {IoPrint} from 'react-icons/io5'
import {useSelector} from 'react-redux'
import {useReactToPrint} from 'react-to-print'
import {roundUsd, roundUzs} from '../../../App/globalFunctions'
import {t} from 'i18next'

export const DailySaleCheck = forwardRef((props, ref) => {
    const {data, isSalesList} = props
    const {market} = useSelector((state) => state.login)
    const {currencyType} = useSelector((state) => state.currency)
    const [loadContent, setLoadContent] = useState(false)
    const saleCheckRef = useRef(null)
    const onBeforeGetContentResolve = useRef(null)
    const handleOnBeforeGetContent = React.useCallback(() => {
        setLoadContent(true)
        return new Promise((resolve) => {
            onBeforeGetContentResolve.current = resolve

            setTimeout(() => {
                setLoadContent(false)
                resolve()
            }, 2000)
        })
    }, [setLoadContent])
    const reactToPrintContent = React.useCallback(() => {
        let modifiedContent = saleCheckRef.current?.cloneNode(true)
        modifiedContent?.classList.remove('mx-auto')
        return modifiedContent
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleCheckRef.current])
    const print = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: 'Daily Sale Check',
        onBeforeGetContent: handleOnBeforeGetContent,
        removeAfterPrint: true
    })
    useEffect(() => {
        if (loadContent && typeof onBeforeGetContentResolve.current === 'function') {
            onBeforeGetContentResolve.current()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onBeforeGetContentResolve.current, loadContent])
    return (
        <>
            <div
                ref={saleCheckRef}
                className={'bg-white-900 p-4 rounded-md w-[7.5cm] mx-auto'}
            >
                <div className='flex pb-2 flex-col text-center justify-center'>
                    {market?.image && (
                        <div className='w-full'>
                            <img
                                src={market?.image}
                                alt='logo'
                                className='block mx-auto'
                            />
                        </div>
                    )}
                    {/* <h2 className='text-[16px] mb-4 font-bold'>{market.name}</h2> */}
                    <div className='flex justify-between items-center py-1 text-[12px] font-bold'>
                        Telefon:
                        <span className='text-[12px] text-black-900 font-bold'>{market.phone1}</span>
                    </div>
                    <div className='flex justify-between items-center py-1 text-[12px] font-bold'>
                        Manzil:
                        <span className='text-[12px] text-black-900 font-bold'>{market?.address}</span>
                    </div>
                    <div className='flex justify-between items-center py-1 text-[12px] font-bold'>
                        Sana:
                        <span className='text-[12px] text-black-900 font-bold'>
              {data?.boshsana
                  ? `${new Date(data.boshsana).toLocaleDateString('ru-RU')} - ${new Date(
                      data.tugashsana
                  ).toLocaleDateString('ru-RU')}`
                  : new Date().toLocaleDateString('ru-RU')}
            </span>
                    </div>
                </div>
                <div className='text-black-900 check-ul-li-foot flex-wrap'>
                    Sotuvlar soni :{' '}
                    <span
                        style={{fontWeight: 'bolder'}}
                        className='text-black-900 text-[12px] font-bold'
                    >
            {data?.sotuvlarsoni}
          </span>
                </div>
                {!isSalesList && <div className='text-black-900 check-ul-li-foot flex-col items-center gap-2'>
                    <p>Maxsulotlar</p>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>Sotilgan :</p>
                        <p className='text-[12px]'>{data?.sotilganmaxsulotlarsoni}</p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>Qolgan (turi):</p>
                        <p className='text-[12px]'>
                            <p className='text-[12px]'>{data?.qolganmaxsulotlarsoni}</p>
                        </p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>Qolgan (umumiy):</p>
                        <p className='text-[12px]'>
                            <p className='text-[12px]'>{data?.qolganmaxsulotlarumumiysoni}</p>
                        </p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>Qolgan (qiymati) :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.qolganmaxsulotlarqiymati.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.qolganmaxsulotlarqiymati.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                </div>}
                <div className='text-black-900 check-ul-li-foot flex-col items-center gap-2'>
                    <p>Tushumlar</p>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>Naqd :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.tushumlar.naqt.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.tushumlar.naqt.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>{t('Plastik')}:</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.tushumlar.plastik.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.tushumlar.plastik.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>{t("O'tkazma")} :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.tushumlar.utkazma.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.tushumlar.utkazma.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                </div>
                <div className='text-black-900 check-ul-li-foot flex-col items-center gap-2'>
                    <p>Qaytarilganlar</p>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>Naqd :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.qaytarilganlar.naqt.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.qaytarilganlar.naqt.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>{t('Plastik')}:</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.qaytarilganlar.plastik.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.qaytarilganlar.plastik.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>{t('O\'tkazma')} :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.qaytarilganlar.utkazma.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.qaytarilganlar.utkazma.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                </div>
                <div className='text-black-900 check-ul-li-foot flex-col items-center gap-2'>
                    <p>Xarajatlar</p>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>Naqd :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.xarajatlar.naqt.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.xarajatlar.naqt.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>{t('Plastik')} :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.xarajatlar.plastik.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.xarajatlar.plastik.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>{t('O\'tkazma')} :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.xarajatlar.utkazma.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.xarajatlar.utkazma.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                </div>
                <div className='text-black-900 check-ul-li-foot flex-col items-center gap-2'>
                    <p>{t('Kassadagi qoldiq')}</p>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>Naqd :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.kassaqoldiq.naqt.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.kassaqoldiq.naqt.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>{t('Plastik')} :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.kassaqoldiq.plastik.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.kassaqoldiq.plastik.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                    <div className='w-full flex justify-between items-center flex-wrap'>
                        <p className='text-[12px]'>{t('O\'tkazma')} :</p>
                        <p className='text-[12px]'>
                            {currencyType === 'UZS'
                                ? roundUzs(data?.kassaqoldiq.utkazma.sum).toLocaleString('ru-RU')
                                : roundUsd(data?.kassaqoldiq.utkazma.dollar).toLocaleString('ru-RU')}{' '}
                            {currencyType}
                        </p>
                    </div>
                </div>
                <div className='text-black-900 check-ul-li-foot flex-wrap'>
                    Chegirmalar :{' '}
                    <span
                        style={{fontWeight: 'bolder'}}
                        className='text-black-900 text-[12px] font-bold'
                    >
            {currencyType === 'UZS'
                ? roundUzs(data?.chegirmalar.sum).toLocaleString('ru-RU')
                : roundUsd(data?.chegirmalar.dollar).toLocaleString('ru-RU')}{' '}
                        {currencyType}
          </span>
                </div>
                <div className='text-black-900 check-ul-li-foot flex-wrap'>
                    Qarzlar :{' '}
                    <span
                        style={{fontWeight: 'bolder'}}
                        className='text-black-900 text-[12px] font-bold'
                    >
            {currencyType === 'UZS'
                ? roundUzs(data?.qarzlar.sum).toLocaleString('ru-RU')
                : roundUsd(data?.qarzlar.dollar).toLocaleString('ru-RU')}{' '}
                        {currencyType}
          </span>
                </div>
                {!isSalesList && <div className='text-black-900 check-ul-li-foot flex-wrap'>
                    Sof foyda :{' '}
                    <span
                        style={{fontWeight: 'bolder'}}
                        className='text-black-900 text-[12px] font-bold'
                    >
            {currencyType === 'UZS'
                ? roundUzs(data?.foyda.sum).toLocaleString('ru-RU')
                : roundUsd(data?.foyda.dollar).toLocaleString('ru-RU')}{' '}
                        {currencyType}
          </span>
                </div>}
            </div>
            <div className='flex justify-center items-center mt-6'>
                <button
                    className={`group print-btn-style ml-auto min-w-max ${
                        loadContent ? 'pointer-events-none' : 'pointer-events-auto'
                    }`}
                    onClick={print}
                    disabled={loadContent}
                >
                    <span className='print-text-style'>Xprinter</span>
                    <span className='print-icon-style'>
            <IoPrint
                size={'1.125rem'}
                className='text-primary-800 text-lg transition-all ease-in-out duration-200 group-hover:text-primary-900'
            />
          </span>
                </button>
            </div>
        </>
    )
})
