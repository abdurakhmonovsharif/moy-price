import React from 'react'
import PrintBtn from '../../Buttons/PrintBtn'
import BtnAddRemove from '../../Buttons/BtnAddRemove'
import {useTranslation} from 'react-i18next'
import {map, uniqueId} from 'lodash'

function SavedChecks() {

    const { t } = useTranslation(['common'])
    const data = [
        { id: 1, kodi: '101010', maxsulot: 'otvod 90 (40)', soni: 1, narxi: '200 000 UZS', jami: '200 000 UZS' },
        { id: 2, kodi: '101010', maxsulot: 'truba 90 (40)', soni: 1, narxi: '300 000 UZS', jami: '300 000 UZS' },
        { id: 3, kodi: '101010', maxsulot: 'otvod 90 (40)', soni: 1, narxi: '400 000 UZS', jami: '400 000 UZS' }
    ]

    return (
        <section className='w-[63.78rem] bg-white-900'>
            <div className='check-saved-head'>
                <ul className='w-[35%]'>
                    <li className='check-ul-li'>{t("Do'kon")}:
                        <span className='check-ul-li-span'>{t("Alo24")}</span>
                    </li>
                    <li className='check-ul-li'>{t("Telefon")}:
                        <span className='check-ul-li-span'>+998991234567</span>
                    </li>
                    <li className='check-ul-li'>{t("Manzil")}:
                        <span className='check-ul-li-span'>{t("Navoiy viloyati")}</span>
                    </li>
                    <li className='check-ul-li'>{t("Sana")}:
                        <span className='check-ul-li-span'>06.08.2022</span>
                    </li>
                </ul>

                <div className='w-[60%]'>
                    <h2 className='check-text-style text-end pb-[2rem]'>{t("ALO24")}</h2>
                    <h2 className='check-text-style text-end'>{t("Sotuvchi")} : <span>{t("Dilshod Muminov")}</span></h2>
                </div>
            </div>
            <div className='border-b-[0.8px] border-black-700 mb-1 pb-4'>
                <table className='border-collapse border border-slate-400 w-full'>
                    <thead>
                        <tr>
                            <td className='check-table-rtr'>{t("№<")}</td>
                                <td className='check-table-rtr'>{t("Kodi")}</td>
                                <td className='check-table-rtr'>{t("Maxsulot")}</td>
                                <td className='check-table-rtr'>{t("Soni")}</td>
                                <td className='check-table-rtr'>{t("Narxi(dona)")}</td>
                                <td className='check-table-rtr'>{t("Jami")}</td>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        map(data, (item) => {
                            return (
                                <tr key={uniqueId('savedCheck')}>
                                    <td className='p-1 border text-center text-[0.875rem] font-bold'>{item.id}</td>
                                    <td className='check-table-body'>{item.kodi}</td>
                                    <td className='check-table-body'>{item.maxsulot}</td>
                                    <td className='check-table-body'>{item.soni}</td>
                                    <td className='check-table-body'>{item.narxi}</td>
                                    <td className='check-table-body'>{item.jami}</td>
                                </tr>
                            )
                        })
                    }

                    </tbody>
                </table>
            </div>
            <div className='flex justify-between text-[1rem] text-black-700 font-bold'>
                <h3>{t("Jami")} : </h3>
                <h3>7800 USD</h3>
            </div>
            <div className='flex justify-around items-center mt-[3rem]'>
                <div>
                    <PrintBtn />
                </div>
                <div className='w-[10rem]'>
                    <BtnAddRemove />
                </div>
            </div>
        </section>
    )
}

export default SavedChecks