import React from 'react'
import { useTranslation } from 'react-i18next';
import { FaFilter } from "react-icons/fa";
function SearchButton({data}) {
    const {t} = useTranslation(['common'])
  return (
    <button onClick={()=>data(true)} className=' hover:bg-blue-200  bg-blue-400 focus-visible:outline-none w-[100px] lg:h-[33px] h=[40px] createElement '><FaFilter   /> {t('izlash')}</button>
  )
}

export default SearchButton
 