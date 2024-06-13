import SearchInput from '../Inputs/SearchInput.js'
import SelectForm from '../Select/SelectForm.js'
import FilterButtons from '../FilterButtons/FilterButtons.js'
import FieldContainer from '../FieldContainer/FieldContainer.js'
import PrintBtn from '../Buttons/PrintBtn.js'
import {ConfirmBtn} from '../Buttons/SaveConfirmBtn.js'
import Dates from '../Dates/Dates.js'
import {useTranslation} from 'react-i18next'
import {map} from 'lodash'
import SelectInput from '../SelectInput/SelectInput.js'
import Checkbox from '../Checkbox/Checkbox.js'
import {IoCheckmark} from 'react-icons/io5'

function SearchForm({
    filterByPackman,
    searchByPackmans,
    filterByTotal,
    searchByCode,
    searchById,
    searchByDelivererName,
    filterByDelivererName,
    filterByDelivererNameWhenPressEnter,
    searchByClientName,
    filterByClientName,
    filterByClientNameWhenPressEnter,
    filterById,
    filterByIdWhenPressEnter,
    filterByCode,
    filterByCodeAndNameAndCategoryWhenPressEnter,
    searchByName,
    filterByName,
    filterBy,
    searchByCategory,
    filterByCategory,
    numberOfChecks,
    setNumberOfChecks,
    clickPrintBtn,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    date,
    setDate,
    filterByClientPhoneNumber,
    phoneNumber,
    clickConfirmBtn,
    barcode,
    filterByBarcode,
    filterByBarcodeWhenPressEnter,
    searchByDirectorName,
    filterByDirectorName,
    filterByDirectorNameWhenPressEnter,
    searchByMarketName,
    filterByMarketName,
    searchBySellerName,
    filterBySellerName,
    filterBySellerNameWhenPressEnter,
    searchByMarketInn,
    filterByMarketInn,
    filterByMarketInnWhenPressEnter,
    filterByMarketNameWhenPressEnter,
    check,
    handleChangeCheck,
    checkboxLabel,
}) {
    const {t} = useTranslation(['common'])
    const chooseComponent = (key) => {
        switch (key) {
            case 'category':
                return (
                    <FilterButtons
                        key={'category_1'}
                        label={t('Kategoriya')}
                        element={
                            <FieldContainer
                                placeholder={`${t('misol')}: 000000`}
                                type={'text'}
                                value={searchByCategory}
                                onChange={filterByCategory}
                                maxWidth={'w-[90vw] lg:w-[20rem]'}
                                onKeyUp={
                                    filterByCodeAndNameAndCategoryWhenPressEnter
                                }
                            />
                        }
                    />
                )
            case 'code':
                return (
                    <FilterButtons
                        key={'code_1'}
                        label={t('Maxsulot kodi')}
                        element={
                            <FieldContainer
                                placeholder={`${t('misol')}: 000000`}
                                type={'text'}
                                maxWidth={'lg:w-[10rem] w-[90vw]'}
                                value={searchByCode}
                                onChange={filterByCode}
                                onKeyUp={
                                    filterByCodeAndNameAndCategoryWhenPressEnter
                                }
                            />
                        }
                    />
                )
            case 'id':
                return (
                    <FilterButtons
                        key={'id_1'}
                        label={t('ID')}
                        element={
                            <FieldContainer
                                placeholder={t('misol: 101')}
                                type={'text'}
                                maxWidth={'lg:w-[6.8125rem] w-[90vw]'}
                                value={searchById}
                                onChange={filterById}
                                onKeyUp={filterByIdWhenPressEnter}
                            />
                        }
                    />
                )
            case 'name':
                return (
                    <SearchInput
                        key={'search_1'}
                        placeholder={t('qidirish...')}
                        someClasses={'grow'}
                        value={searchByName}
                        onChange={filterByName}
                        onKeyUp={filterByCodeAndNameAndCategoryWhenPressEnter}
                    />
                )
            case 'checkbox':
                return (
                    // <Checkbox
                    //     id={'checkbox-1'}
                    //     onChange={handleChangeCheck}
                    //     value={check}
                    //     label={checkboxLabel}
                    // />
                    <div className={'checkbox mb-4'}>
                        <input
                            type='checkbox'
                            className={'hidden'}
                            id={'checkbox-1'}
                            onChange={handleChangeCheck}
                            checked={check}
                        />
                        <label htmlFor={'checkbox-1'}>
                            <span className={'checkbox-icon'}>
                                <IoCheckmark size={'1rem'} />
                            </span>
                        </label>
                        <span className={'checkbox-label'}>
                            {checkboxLabel}
                        </span>
                    </div>
                )
            case 'delivererName':
                return (
                    <SearchInput
                        key={'yetkazuvchi_ismi_1'}
                        placeholder={t('Yetkazuvchi ismi')}
                        someClasses={'grow'}
                        value={searchByDelivererName}
                        onChange={filterByDelivererName}
                        onKeyUp={filterByDelivererNameWhenPressEnter}
                    />
                )
            case 'clientName':
                return (
                    <SearchInput
                        key={'mijoz_ismi_1'}
                        placeholder={t('mijoz ismi...')}
                        someClasses={'grow basis-1/6'}
                        value={searchByClientName}
                        onChange={filterByClientName}
                        onKeyUp={filterByClientNameWhenPressEnter}
                    />
                )
            case 'clientPhoneNumber':
                return (
                    <SearchInput
                        key={'client_phoneNumber_1'}
                        placeholder={t('Telefon raqam')}
                        someClasses={'grow basis-1/6'}
                        value={phoneNumber}
                        onChange={filterByClientPhoneNumber}
                    />
                )
            case 'sellerName':
                return (
                    <SearchInput
                        key={'sotuvchi_ismi_1'}
                        placeholder={t('sotuvchi ismi...')}
                        someClasses={'grow basis-1/6'}
                        value={searchBySellerName}
                        onChange={filterBySellerName}
                        onKeyUp={filterBySellerNameWhenPressEnter}
                    />
                )
            case 'checks':
                return (
                    <FilterButtons
                        key={'cheklar_soni_1'}
                        label={t('Cheklar soni')}
                        element={
                            <FieldContainer
                                placeholder={t('misol: 101')}
                                type={'text'}
                                maxWidth={'flex-1'}
                                value={numberOfChecks}
                                onChange={setNumberOfChecks}
                            />
                        }
                    />
                )
            case 'printBtn':
                return <PrintBtn key={'print_btn_1'} onClick={clickPrintBtn} />
            case 'startDate':
                return (
                    <FilterButtons
                        key={'start_date_1'}
                        label={t("Boshlang'ich sana")}
                        element={
                            <Dates
                                value={startDate}
                                onChange={setStartDate}
                                placeholder={'01.01.2021'}
                                maxWidth={'lg:w-[10rem] w-[40vw]'}
                            />
                        }
                    />
                )
            case 'endDate':
                return (
                    <FilterButtons
                        key={'end_date_1'}
                        label={t('Tugash sana')}
                        element={
                            <Dates
                                value={endDate}
                                onChange={setEndDate}
                                placeholder={'05.06.2022'}
                                maxWidth={'lg:w-[10rem] w-[40vw]'}
                            />
                        }
                    />
                )
            case 'singleDate':
                return (
                    <FilterButtons
                        key={'single_date_1'}
                        label={t('Sanani tanlang')}
                        element={
                            <Dates
                                value={date}
                                onChange={setDate}
                                placeholder={t('misol: 02.02.2022')}
                                maxWidth={'w-[9.6875rem]'}
                            />
                        }
                    />
                )
            case 'confirmBtn':
                return (
                    <ConfirmBtn
                        key={'confirm_btn_1'}
                        text={t('Yakunlash')}
                        onClick={clickConfirmBtn}
                    />
                )
            case 'barcode':
                return (
                    <FilterButtons
                        key={'barcode_1'}
                        label={t('Shtrix kodi')}
                        element={
                            <FieldContainer
                                placeholder={t('misol: 101')}
                                type={'text'}
                                value={barcode}
                                onChange={filterByBarcode}
                                maxWidth={'lg:w-[10rem] w-[90vw]'}
                                onKeyUp={filterByBarcodeWhenPressEnter}
                            />
                        }
                    />
                )
            case 'directorName':
                return (
                    <SearchInput
                        key={'director_name_1'}
                        value={searchByDirectorName}
                        onChange={filterByDirectorName}
                        placeholder={'Direktor ismi yoki familyasi...'}
                        someClasses={'grow'}
                        onKeyUp={filterByDirectorNameWhenPressEnter}
                    />
                )
            case 'marketName':
                return (
                    <SearchInput
                        key={'market_name_1'}
                        value={searchByMarketName}
                        onChange={filterByMarketName}
                        placeholder={`${t("Do'kon nomi...")}`}
                        someClasses={'grow'}
                        onKeyUp={filterByMarketNameWhenPressEnter}
                    />
                )
            case 'inn':
                return (
                    <SearchInput
                        key={'market_inn_1'}
                        value={searchByMarketInn}
                        onChange={filterByMarketInn}
                        placeholder={"Do'kon INN si..."}
                        someClasses={'grow'}
                        onKeyUp={filterByMarketInnWhenPressEnter}
                    />
                )
            case 'select':
                return (
                    <SelectInput
                        placeholder={t('Yetkazib beruvchi')}
                        onSelect={filterByPackman}
                        options={searchByPackmans}
                    />
                )
            default:
                return null
        }
    }
    return (
        <div className='pl-[20px] flex justify-center items-end gap-[1.5rem] mainPadding lg:flex-nowrap grow flex-wrap'>
            {map(filterBy, (key) => chooseComponent(key))}
        </div>
    )
}

export default SearchForm
