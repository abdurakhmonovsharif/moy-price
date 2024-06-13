import React, {useEffect, useState} from 'react'
import FieldContainer from '../../Components/FieldContainer/FieldContainer.js'
import Button from '../../Components/Buttons/BtnAddRemove.js'
import SearchForm from '../../Components/SearchForm/SearchForm.js'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import Table from '../../Components/Table/Table.js'
import {useDispatch, useSelector} from 'react-redux'
import {regexForTypeNumber} from '../../Components/RegularExpressions/RegularExpressions.js'
import {checkEmptyString, exportExcel, universalSort} from '../../App/globalFunctions.js'
import UniversalModal from '../../Components/Modal/UniversalModal.js'
import {motion} from 'framer-motion'
import SearchButton from '../../Components/Buttons/SearchButton.js'

import './Category.scss'
import {
    successAddCategoryMessage,
    successDeleteCategoryMessage,
    successUpdateCategoryMessage,
    universalToast,
    warningCategory,
    warningEmptyInput
} from '../../Components/ToastMessages/ToastMessages.js'
import {
    addCategory,
    clearErrorAddCategory,
    clearErrorDeleteCategory,
    clearErrorGetAllCategories,
    clearErrorUpdateCategory,
    clearSearchedCategories,
    clearSuccessAddCategory,
    clearSuccessDeleteCategory,
    clearSuccessUpdateCategory,
    deleteCategory,
    getCategories,
    getCategoriesByFilter,
    updateCategory
} from './categorySlice.js'
import Pagination from '../../Components/Pagination/Pagination.js'
import {useTranslation} from 'react-i18next'
import {filter, map} from 'lodash'
import ExportBtn from '../../Components/Buttons/ExportBtn.js'
import SelectForm from '../../Components/Select/SelectForm.js'
import {VscChromeClose} from 'react-icons/vsc'
import TableMobile from '../../Components/Table/TableMobile.js'
import {FaFilter} from 'react-icons/fa'


const Category = () => {
    const {t} = useTranslation(['common'])

    const headers = [
        {
            title: t('№'),
            styles: 'w-[10%]'
        },
        {
            title: t('Kategoriya kodi'),
            filter: 'code',
        },
        {
            title: t('Kategoriya nomi'),
            filter: 'name',
            // styles: 'w-[60%]'
        },
        {
            title:t('Sotilganlar soni'),
            filter: 'totalproducts',
        },
        {
            title: t('Sotilganlar jami'),
            filter: 'totalsales',
        },
        {
            title: t('Sof foyda'),
            filter: 'profit',
        },
        {
            title: '',
            styles: 'w-[15%]'
        }
    ]

    const dispatch = useDispatch()
    const {
        categories,
        errorGetCategories,
        searchedCategories,
        loading,
        total,
        totalSearched,
        errorAddCategory,
        successAddCategory,
        successUpdateCategory,
        errorUpdateCategory,
        successDeleteCategory,
        errorDeleteCategory
    } = useSelector((state) => state.category)
    const [data, setData] = useState(categories)
    const [searchedData, setSearchedData] = useState(searchedCategories)
    const [codeOfCategory, setCodeOfCategory] = useState('')
    const [nameOfCategory, setNameOfCategory] = useState('')
    const [searchByCode, setSearchByCode] = useState('')
    const [searchByName, setSearchByName] = useState('')
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [stickyForm, setStickyForm] = useState(false)
    const [sorItem, setSorItem] = useState({
        filter: '',
        sort: '',
        count: 0
    })
    const [currentCategory, setCurrentCategory] = useState(null)
    const [deletedCategory, setDeletedCategory] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    const [startDate, setStartDate] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
        )
    )
    const [endDate, setEndDate] = useState(new Date())
    const [modalOpen, setModalOpen]=useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    // modal toggle
    const toggleModal = () => setModalVisible(!modalVisible)

    // handle change of inputs
    const handleChangeCodeOfCategory = (e) => {
        let val = e.target.value
        if (regexForTypeNumber.test(val)) {
            setCodeOfCategory(val)
        }
    }
    const handleChangeNameOfCategory = (e) => {
        setNameOfCategory(e.target.value)
    }
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // filter by total
    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }

    // table edit and delete
    const handleEditCategory = (category) => {
        setCurrentCategory(category)
        setCodeOfCategory(category.code)
        setNameOfCategory(category.name)
        setStickyForm(true)
    }

    const handleEdit = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString(
            [
                {
                    value: codeOfCategory,
                    message: t('Kategoriya kodi')
                },
                {
                    value: nameOfCategory,
                    message: t('Kategoriya nomi')
                }
            ]
        )
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                currentPage,
                countPage: showByTotal,
                search: {
                    name: searchByName.replace(/\s+/g, ' ').trim(),
                    code: searchByCode.replace(/\s+/g, ' ').trim()
                },
                category: {
                    name: nameOfCategory,
                    code: codeOfCategory,
                    _id: currentCategory._id
                }
            }
            dispatch(updateCategory(body))
        }
    }

    const handleDeleteCategory = (category) => {
        const body = {
            ...category,
            currentPage,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim(),
                code: searchByCode.replace(/\s+/g, ' ').trim()
            }
        }
        setDeletedCategory(body)
        toggleModal()
    }
    const handleClickApproveToDelete = () => {
        dispatch(deleteCategory(deletedCategory))
        handleClickCancelToDelete()
    }
    const handleClickCancelToDelete = () => {
        setModalVisible(false)
        setDeletedCategory(null)
    }

    // handle submit of inputs
    const addNewcategory = (e) => {
        e.preventDefault()
        const {failed, message} = checkEmptyString(
            [
                {
                    value: codeOfCategory,
                    message: t('Kategoriya kodi')
                },
                {
                    value: nameOfCategory,
                    message: t('Kategoriya nomi')
                }
            ]
        )
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                currentPage,
                countPage: showByTotal,
                category: {
                    name: nameOfCategory,
                    code: codeOfCategory
                },
                search: {
                    name: searchByName.replace(/\s+/g, ' ').trim(),
                    code: searchByCode.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(addCategory(body))
        }
    }

    const clearForm = (e) => {
        e && e.preventDefault()
        setCodeOfCategory('')
        setNameOfCategory('')
        setCurrentCategory(null)
        setStickyForm(false)
    }

    // handle change of search inputs
    const filterByCode = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setSearchByCode(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
        dispatch(clearSearchedCategories())
        if (valForSearch === '') {
            setData(categories)
            setFilteredDataTotal(total)
        } else {
            const filteredCategories = filter(categories, (category) => {
                return category.code.includes(valForSearch)
            })
            setData(filteredCategories)
            setFilteredDataTotal(filteredCategories.length)
        }
    }
    const filterByName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setSearchByName(val)
        ;(searchedData.length > 0 || totalSearched > 0) &&
        dispatch(clearSearchedCategories())
        if (valForSearch === '') {
            setData(categories)
            setFilteredDataTotal(total)
        } else {
            const filteredCategories = filter(categories, (category) => {
                return (
                    category.name &&
                    category.name.toLowerCase().includes(valForSearch)
                )
            })
            setData(filteredCategories)
            setFilteredDataTotal(filteredCategories.length)
        }
    }
    const filterByCodeAndNameWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0)
            const body = {
                currentPage: 0,
                countPage: showByTotal,
                search: {
                    name: searchByName.replace(/\s+/g, ' ').trim(),
                    code: searchByCode.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(getCategoriesByFilter(body))
        }
    }

    const filterData = (filterKey) => {
        if (filterKey === sorItem.filter) {
            switch (sorItem.count) {
                case 1:
                    setSorItem({
                        filter: filterKey,
                        sort: '1',
                        count: 2
                    })
                    universalSort(
                        searchedData.length > 0 ? searchedData : data,
                        searchedData.length > 0 ? setSearchedData : setData,
                        filterKey,
                        1,
                        searchedData.length > 0
                            ? searchedCategories
                            : categories
                    )
                    break
                case 2:
                    setSorItem({
                        filter: filterKey,
                        sort: '',
                        count: 0
                    })
                    universalSort(
                        searchedData.length > 0 ? searchedData : data,
                        searchedData.length > 0 ? setSearchedData : setData,
                        filterKey,
                        '',
                        searchedData.length > 0
                            ? searchedCategories
                            : categories
                    )
                    break
                default:
                    setSorItem({
                        filter: filterKey,
                        sort: '-1',
                        count: 1
                    })
                    universalSort(
                        searchedData.length > 0 ? searchedData : data,
                        searchedData.length > 0 ? setSearchedData : setData,
                        filterKey,
                        -1,
                        searchedData.length > 0
                            ? searchedCategories
                            : categories
                    )
            }
        } else {
            setSorItem({
                filter: filterKey,
                sort: '-1',
                count: 1
            })
            universalSort(
                searchedData.length > 0 ? searchedData : data,
                searchedData.length > 0 ? setSearchedData : setData,
                filterKey,
                -1,
                searchedData ? searchedCategories : categories,
                searchedData.length > 0
            )
        }
    }
    
    const excelData = () => {
        let fileName = 'Kategoriyalar'
        const exportHeader = ['№', 'Kodi', 'Nomi']
        if (data?.length > 0) {
            const categoryData = map(data, (item, index) => ({
                nth: index + 1,
                code: item?.code || '',
                name: item?.name || ''
            }))
            exportExcel(categoryData, fileName, exportHeader)
        } else {
            universalToast('Jadvalda ma\'lumot mavjud emas !', 'warning')
        }
    }

    useEffect(() => {
        if (errorGetCategories) {
            warningCategory()
            dispatch(clearErrorGetAllCategories())
        }
        if (errorAddCategory) {
            universalToast(errorAddCategory, 'error')
            dispatch(clearErrorAddCategory())
        }
        if (successAddCategory) {
            successAddCategoryMessage()
            dispatch(clearSuccessAddCategory())
            clearForm()
        }

        if (successUpdateCategory) {
            successUpdateCategoryMessage()
            dispatch(clearSuccessUpdateCategory())
            clearForm()
        }
        if (errorUpdateCategory) {
            universalToast(errorUpdateCategory, 'error')
            dispatch(clearErrorUpdateCategory())
        }

        if (errorDeleteCategory) {
            universalToast(errorDeleteCategory, 'error')
            dispatch(clearErrorDeleteCategory())
        }
        if (successDeleteCategory) {
            successDeleteCategoryMessage()
            dispatch(clearSuccessDeleteCategory())
        }
    }, [
        dispatch,
        errorGetCategories,
        errorAddCategory,
        successAddCategory,
        successUpdateCategory,
        errorUpdateCategory,
        errorDeleteCategory,
        successDeleteCategory
    ])
    useEffect(() => {
        const body = {
            currentPage,
            countPage: showByTotal,
            search: {
                name: searchByName.replace(/\s+/g, ' ').trim(),
                code: searchByCode.replace(/\s+/g, ' ').trim()
            },
            startDate,
            endDate
        }
        dispatch(getCategories(body))
        //    eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, showByTotal, dispatch, startDate, endDate])
    useEffect(() => {
        setData(categories)
    }, [categories])
    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])
    useEffect(() => {
        setSearchedData(searchedCategories)
    }, [searchedCategories])

    return (
        <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
                open: {opacity: 1, height: 'auto'},
                collapsed: {opacity: 0, height: 0}
            }}
            transition={{duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98]}}
        >
            <UniversalModal
                body='approve'
                toggleModal={toggleModal}
                headerText={`${deletedCategory && deletedCategory.code} - ${t(
                    'kategoriyani o`chirishni tasdiqlaysizmi?'
                )}`}
                title={t(
                    'O`chirilgan kategoriyalarni tiklashning imkoni mavjud emas!'
                )}
                approveFunction={handleClickApproveToDelete}
                closeModal={handleClickCancelToDelete}
                isOpen={modalVisible}
            />
            <form
                className={`flex gap-[1.25rem] mt-[40px] bg-background ps-[20px] flex-col mainPadding transition ease-linear duration-200 ${
                    stickyForm ? 'stickyForm' : ''
                }`}
            >
                <div className='supplier-style'>
                    <span className='lg:w-[400px] w-[90vw]'>
                    <FieldContainer
                        value={codeOfCategory}
                        onChange={handleChangeCodeOfCategory}
                        label={t('Kategoriya kodi')}
                        placeholder={`${t('misol')}: 000000`}
                        className='input-category '
                    />
                    </span>
                    <FieldContainer
                        value={nameOfCategory}
                        label={t('Kategoriya nomi')}
                        placeholder={''}
                        maxWidth={'w-[29rem]'}
                        type={'string'}
                        onChange={handleChangeNameOfCategory}
                    />
                    <div className={'flex gap-[1.25rem] grow'}>
                        <span className='lg:w-[300px]'>
                        <Button
                            onClick={stickyForm ? handleEdit : addNewcategory}
                            add={!stickyForm}
                            edit={stickyForm }
                            text={
                                stickyForm
                                    ? t('Saqlash')
                                    : t('Yangi kategoriya qo\'shish')
                            }
                        />
                        </span>
                        <span className='w-[200px] me-[-100px]'>

                        <Button onClick={clearForm} text={t('Tozalash')} />
                        </span>
                    </div>
                </div>
            </form>
            <>
                {
                    modalOpen?<div className='absolute lg:p-[50px] w-[100vw]  h-[100vh]  flex justify-evenly flex-wrap items-center  top-0	left-0 z-50 bg-[white]	'>
                    <VscChromeClose  onClick={()=>setModalOpen(false)} className=' absolute right-[20px]  top-[20px]  text-4xl cursor-pointer'/>
                
                        <SearchForm
                                filterBy={['total', 'category', 'name', 'startDate', 'endDate']}
                                filterByTotal={filterByTotal}
                                filterByCategory={filterByCode}
                                filterByName={filterByName}
                                
                                filterByCodeAndNameAndCategoryWhenPressEnter={
                                    filterByCodeAndNameWhenPressEnter
                                }
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                            />
                    <button onClick={() => {
                  setModalOpen(false);
                  
                }}  className='d-block  hover:bg-green-200  bg-green-400 mt-[-200px] lg:mt-[25px]  focus-visible:outline-none w-[150px] h-[40px] createElement '><FaFilter   /> {t('izlash')}</button>
                    </div>:null
                }
                
                </>
                
                <div className='  flex flex-nowrap justify-evenly mb-2 gap-2 items-center lg:justify-start'>
                <SelectForm  key={'total_1'}  onSelect={filterByTotal}/>
                {isMobile?<SearchButton data={setModalOpen}/>:null}
                <ExportBtn
                    onClick={excelData}
                />
                
                </div>
                {!isMobile?
                <SearchForm
                                filterBy={['total', 'category', 'name', 'startDate', 'endDate']}
                                filterByTotal={filterByTotal}
                                filterByCategory={filterByCode}
                                filterByName={filterByName}
                                
                                filterByCodeAndNameAndCategoryWhenPressEnter={
                                    filterByCodeAndNameWhenPressEnter
                                }
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                            />:null}
            

            
            {
                !isMobile ? <div className=' tableContainerPadding '>
                {loading ? (
                    <Spinner />
                ) : data.length === 0 && searchedData.length === 0 ? (
                    <NotFind text={t('Maxsulot mavjud emas')} />
                ) : (
                    <Table
                        headers={headers}
                        Edit={handleEditCategory}
                        Delete={handleDeleteCategory}
                        page={'category'}
                        data={searchedData.length > 0 ? searchedData : data}
                        Sort={filterData}
                        sortItem={sorItem}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        startDate={startDate}
                        endDate={endDate}
                    />
                )}
            </div> : <div className=''>
                {loading ? (
                    <Spinner />
                ) : data.length === 0 && searchedData.length === 0 ? (
                    <NotFind text={t('Maxsulot mavjud emas')} />
                ) : (
                    <TableMobile
                        headers={headers}
                        Edit={handleEditCategory}
                        Delete={handleDeleteCategory}
                        page={'category'}
                        data={searchedData.length > 0 ? searchedData : data}
                        Sort={filterData}
                        sortItem={sorItem}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        startDate={startDate}
                        endDate={endDate}
                    />
                )}
            </div>
            }
            <div className=' pagination-supplier ps-[0px] mainPadding flex flex-nowrap justify-center '>
                
                <p className='supplier-title'>{t('')}</p>
                {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                    <Pagination
                        countPage={Number(showByTotal)}
                        totalDatas={totalSearched || filteredDataTotal}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
            
        </motion.section>
    )
}

export default Category
