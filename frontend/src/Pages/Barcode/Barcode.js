import FieldContainer from '../../Components/FieldContainer/FieldContainer.js'
import {useEffect, useState} from 'react'
import BtnAddRemove from '../../Components/Buttons/BtnAddRemove.js'
import {universalToast, warningEmptyInput} from '../../Components/ToastMessages/ToastMessages.js'
import ExportBtn from '../../Components/Buttons/ExportBtn.js'
import ImportBtn from '../../Components/Buttons/ImportBtn.js'
import Pagination from '../../Components/Pagination/Pagination.js'
import {useDispatch, useSelector} from 'react-redux'
import Table from '../../Components/Table/Table.js'
import SearchForm from '../../Components/SearchForm/SearchForm.js'
import {
    addBarcode,
    clearSearchedProducts,
    deleteBarCode,
    getAllProductsWithBarcode,
    getBarcode,
    getBarcodeByFilter,
    registerAllBarcode,
    updateBarcode
} from './barcodeSlice.js'
import Spinner from '../../Components/Spinner/SmallLoader.js'
import NotFind from '../../Components/NotFind/NotFind.js'
import BarcodeReader from 'react-barcode-reader'
import {checkEmptyString, exportExcel} from '../../App/globalFunctions.js'
import UniversalModal from '../../Components/Modal/UniversalModal.js'
import * as XLSX from 'xlsx'
import {filter, map} from 'lodash'

function Barcode() {
    const dispatch = useDispatch()
    const {products, searchedProducts, totalSearched, total, loadingGetAll} = useSelector((state) => state.barcode)
    const [data, setData] = useState(products)
    const [filteredDataTotal, setFilteredDataTotal] = useState(total)
    const [barcode, setBarcode] = useState('')
    const [name, setName] = useState('')
    const [searchedBarcode, setSearchedBarcode] = useState('')
    const [searchedName, setSearchedName] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [showByTotal, setShowByTotal] = useState(10)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [currentDeleteProduct, setCurrentDeleteProduct] = useState(null)
    const [stickyForm, setStickyForm] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalBody, setModalBody] = useState(null)
    const [excelData, setExcelData] = useState([])
    const [createdData, setCreatedData] = useState([])

    const headers = [
        {title: '№'},
        {
            title: 'Barcode'
        },
        {
            title: 'Name'
        },
        {
            title: ''
        }
    ]
    const importHeaders = [
        {name: 'Shtrix kodi', value: 'barcode'},
        {name: 'Maxsulot name', value: 'name'}
    ]
    const toggleModal = () => {
        setModalVisible(!modalVisible)
        setModalBody(null)
        setTimeout(() => {
            setExcelData([])
        }, 500)
    }
    const add = (e) => {
        e.preventDefault()
        e.autofocus = true
        const {failed, message} = checkEmptyString([
            {
                value: barcode,
                message: 'Shtrix kod'
            },
            {
                value: name,
                message: 'Maxsulot nomi'
            }
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                currentPage,
                countPage: showByTotal,
                barcode: {
                    barcode: barcode,
                    name: name.replace(/\s+/g, ' ').trim()
                },
                search: {
                    code: searchedBarcode.replace(/\s+/g, ' ').trim(),
                    name: searchedName.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(addBarcode(body)).then(({error}) => {
                if (!error) {
                    clear()
                }
            })
        }
    }
    const save = (e) => {
        e.preventDefault()
        e.autofocus = true
        const {failed, message} = checkEmptyString([
            {
                value: barcode,
                message: 'Shtrix kod'
            },
            {
                value: name,
                message: 'Maxsulot nomi'
            }
        ])
        if (failed) {
            warningEmptyInput(message)
        } else {
            const body = {
                currentPage,
                countPage: showByTotal,
                barcode: {
                    _id: currentProduct._id,
                    barcode: barcode,
                    name: name.replace(/\s+/g, ' ').trim()
                },
                search: {
                    code: searchedBarcode.replace(/\s+/g, ' ').trim(),
                    name: searchedName.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(updateBarcode(body)).then(({error}) => {
                if (!error) {
                    clear()
                    setCurrentProduct(null)
                }
            })
        }
    }
    const clear = (e) => {
        e && (e.autofocus = true)
        e && e.preventDefault()
        setBarcode('')
        setName('')
        setStickyForm(false)
    }
    const edit = (product) => {
        setStickyForm(true)
        setBarcode(product.barcode)
        setName(product.name)
        setCurrentProduct(product)
    }
    const deleteProduct = (product) => {
        setModalBody('approve')
        setModalVisible(true)
        setCurrentDeleteProduct(product)
    }
    const approveDelete = () => {
        const body = {
            _id: currentDeleteProduct._id,
            currentPage,
            countPage: showByTotal,
            search: {
                code: searchedBarcode.replace(/\s+/g, ' ').trim(),
                name: searchedName.replace(/\s+/g, ' ').trim()
            }
        }
        dispatch(deleteBarCode(body)).then(({error}) => {
            if (!error) {
                toggleModal()
                setCurrentDeleteProduct(null)
            }
        })
    }
    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }
    const filterByName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setSearchedName(val)
        ;(searchedProducts.length > 0 || totalSearched > 0) &&
        dispatch(clearSearchedProducts())
        if (valForSearch === '') {
            setData(products)
            setFilteredDataTotal(total)
        } else {
            const filteredProducts = filter(products, (product) => {
                return product.name
                    .toLowerCase()
                    .includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const filterByBarcode = (e) => {
        let val = e.target.value
        let valForSearch = val.replace(/\s+/g, ' ').trim()
        setSearchedBarcode(val)
        ;(searchedProducts.length > 0 || totalSearched > 0) &&
        dispatch(clearSearchedProducts())
        if (valForSearch === '') {
            setData(products)
            setFilteredDataTotal(total)
        } else {
            const filteredProducts = filter(products, (product) => {
                return product.barcode.includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const filterByNameAndBarcode = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0)
            const body = {
                currentPage: 0,
                countPage: showByTotal,
                search: {
                    code: searchedBarcode.replace(/\s+/g, ' ').trim(),
                    name: searchedName.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(getBarcodeByFilter(body))
        }
    }
    const handleScan = (data) => {
        const body = {
            code: data
        }
        dispatch(getBarcode(body)).then(({error}) => {
            if (error) {
                /^[0-9]*$/.test(data) ? setBarcode(data) : universalToast('Shtrix kod formati noto`g`ri', 'error', {
                    autoClose: 2000,
                    position: 'bottom-right'
                })
            } else {
                universalToast('Bunday shtrix kodli maxsulot mavjud', 'error', {
                    autoClose: 2000,
                    position: 'bottom-right'
                })
            }
        })
    }
    const handleError = (err) => {
        err.toString().length > 4 &&
        universalToast('Maxsulot kodi o\'qilmadi!', 'error')
    }
    const onKeyDetect = (e) => {
        e.preventDefault()
    }
    const readExcel = (file) => {
        const fileTypes = ['xls', 'xlsx']
        if (fileTypes.includes(file.name.split('.').pop())) {
            new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.readAsArrayBuffer(file)

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result

                    const wb = XLSX.read(bufferArray, {
                        type: 'buffer'
                    })

                    const wsname = wb.SheetNames[0]

                    const ws = wb.Sheets[wsname]

                    const data = XLSX.utils.sheet_to_json(ws)

                    resolve(data)
                }

                fileReader.onerror = (error) => {
                    universalToast('Ошибка при загрузке файла', 'error')
                    reject(error)
                }
            }).then((data) => {
                if (data.length > 0) {
                    setExcelData(data)
                    setModalBody('import')
                    setModalVisible(true)
                } else {
                    universalToast('Jadvalda ma`lumot mavjud emas', 'error')
                }
            })
        } else {
            universalToast('Fayl formati noto\'g\'ri', 'error')
        }
    }
    const handleClickApproveToImport = () => {
        const oldKeys = Object.keys(excelData[0])
        const newData = map(createdData, (item) => {
            const newItem = {}
            for (const key in item) {
                newItem[key] = item[key].toString().replace(/\s+/g, ' ').trim()
            }
            return newItem
        })
        newData.forEach((item) =>
            oldKeys.forEach(
                (key) => item.hasOwnProperty(key) && delete item[key]
            )
        )
        const body = {
            barcodes: [...newData],
            countPage: showByTotal,
            currentPage,
            search: {
                code: searchedBarcode.replace(/\s+/g, ' ').trim(),
                name: searchedName.replace(/\s+/g, ' ').trim()
            }
        }
        dispatch(registerAllBarcode(body)).then(({error}) => {
            if (!error) {
                toggleModal()
                setCreatedData([])
                setExcelData([])
            }
        })
    }


    const exportData = () => {
        let fileName = 'Shtrix Kodlar'
        const exportHeader = ['№', 'Shtix kodi', 'Maxsulot Nomi']
        if (products?.length > 0) {
            const BarcodeData = map(products, (item, index) => ({
                nth: index + 1,
                code: item?.barcode || '',
                name: item?.name || ''
            }))
            exportExcel(BarcodeData, fileName, exportHeader)
        } else {
            universalToast('Jadvalda ma\'lumot mavjud emas !', 'warning')
        }
    }


    useEffect(() => {
        setData(products)
    }, [products])
    useEffect(() => {
        setFilteredDataTotal(total)
    }, [total])
    useEffect(() => {
        const body = {
            currentPage,
            countPage: showByTotal,
            search: {
                code: '',
                name: ''
            }
        }
        dispatch(getAllProductsWithBarcode(body))
    }, [dispatch, currentPage, showByTotal])
    return (
        <section>
            <UniversalModal
                body={modalBody}
                title={'Agar shtrix kodni o\'chirsangiz uni qayta tiklab bo\'lmaydi !'}
                headerText={'Shtrix kodni o\'chirishni tasdiqlaysizmi ?'}
                approveFunction={modalBody === 'approve' ? approveDelete : handleClickApproveToImport}
                toggleModal={toggleModal}
                isOpen={modalVisible}
                excelData={excelData}
                headers={importHeaders}
                createdData={createdData}
                setCreatedData={setCreatedData}
            />
            <form
                className={`flex items-end gap-[1.25rem] bg-background mainPadding transition ease-linear duration-200 ${stickyForm ? 'stickyForm' : ''}`}>
                <FieldContainer
                    type={'number'}
                    label={'Shtix kodi'}
                    border={true}
                    maxWidth={'grow'}
                    placeholder={'Enter barcode'}
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                />
                <FieldContainer
                    type={'text'}
                    label={'Maxsulot nomi'}
                    placeholder={'Enter name'}
                    border={true}
                    maxWidth={'grow'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className={'flex min-w-[25rem] gap-[1.25rem]'}>
                    <BtnAddRemove add={!stickyForm} edit={stickyForm} text={!stickyForm ? 'Qo\'shish' : 'Saqlash'}
                                  onClick={!stickyForm ? add : save} />
                    <BtnAddRemove text={'Tozalash'} onClick={clear} />
                </div>
            </form>
            <div className={'flex justify-between items-center mainPadding'}>
                <div className={'flex gap-[1.5rem]'}>
                    <ExportBtn
                        onClick={exportData}
                    />
                    <ImportBtn readExcel={readExcel} />
                </div>
                <h3 className={'text-blue-900 text-[xl] leading-[1.875rem]'}>
                    Maxsulotlar
                </h3>
                {(filteredDataTotal !== 0 || totalSearched !== 0) && (
                    <Pagination
                        countPage={Number(showByTotal)}
                        totalDatas={totalSearched || filteredDataTotal}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
            <SearchForm
                filterBy={['total', 'barcode', 'name']}
                filterByTotal={filterByTotal}
                filterByName={filterByName}
                filterByBarcode={filterByBarcode}
                barcode={searchedBarcode}
                searchByName={searchedName}
                filterByCodeAndNameAndCategoryWhenPressEnter={filterByNameAndBarcode}
                filterByBarcodeWhenPressEnter={filterByNameAndBarcode}
            />
            <div className={'tableContainerPadding'}>
                {loadingGetAll ? (
                    <Spinner />
                ) : data.length === 0 && searchedProducts.length === 0 ? (
                    <NotFind text={'Maxsulot mavjud emas'} />
                ) : (
                    <Table
                        headers={headers}
                        data={searchedProducts.length > 0 ? searchedProducts : data}
                        currentPage={currentPage}
                        countPage={showByTotal}
                        page={'barcode'}
                        Edit={edit}
                        Delete={deleteProduct}
                    />)}
            </div>
            <BarcodeReader onError={handleError} onScan={handleScan} stopPropagation={true} preventDefault={true}
                           onKeyDetect={onKeyDetect} />
        </section>
    )
}

export default Barcode