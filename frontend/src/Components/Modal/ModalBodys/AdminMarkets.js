import React, {useEffect, useState} from 'react'
import SearchForm from '../../SearchForm/SearchForm.js'
import {
    clearSearchedBranches,
    getBranches,
    getBranchesByFilter,
    updateMarkets
} from '../../../Pages/AdminProducts/adminproductsSlice.js'
import {useDispatch, useSelector} from 'react-redux'
import Spinner from '../../Spinner/SmallLoader.js'
import NotFind from '../../NotFind/NotFind.js'
import Pagination from '../../Pagination/Pagination.js'
import AdminProductCard from '../../AdminProductCard/AdminProductCard.js'
import BtnAddRemove from '../../Buttons/BtnAddRemove.js'
import {filter, map} from 'lodash'

function AdminMarkets({product, approveFunction}) {
    const dispatch = useDispatch()
    const {
        branches,
        totalBranches,
        searchedBranches,
        totalSearchedBranches,
        loadingGetBranches
    } = useSelector(state => state.adminmarkets)
    const [name, setName] = useState('')
    const [data, setData] = useState([])
    const [director, setDirector] = useState('')
    const [showByTotal, setShowByTotal] = useState('10')
    const [currentPage, setCurrentPage] = useState(0)
    const [searchedData, setSearchedData] = useState(searchedBranches)
    const [filteredDataTotal, setFilteredDataTotal] = useState(totalBranches)
    const [newBranches, setNewBranches] = useState({
        filials: [],
        connections: []
    })
    const filterByTotal = ({value}) => {
        setShowByTotal(value)
        setCurrentPage(0)
    }
    const filterByMarketName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setName(val)
        ;(searchedData.length > 0 || totalSearchedBranches > 0) &&
        dispatch(clearSearchedBranches())
        if (valForSearch === '') {
            setData(branches)
            setFilteredDataTotal(totalBranches)
        } else {
            const filteredProducts = filter(branches,(market) => {
                return market.name
                    .toLowerCase()
                    .includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const filterByDirectorName = (e) => {
        let val = e.target.value
        let valForSearch = val.toLowerCase().replace(/\s+/g, ' ').trim()
        setDirector(val)
        ;(searchedData.length > 0 || totalSearchedBranches > 0) &&
        dispatch(clearSearchedBranches())
        if (valForSearch === '') {
            setData(branches)
            setFilteredDataTotal(totalBranches)
        } else {
            const filteredProducts = filter(branches,(market) => {
                return market.director.firstname
                    .toLowerCase()
                    .includes(valForSearch) || market.director.lastname.toLowerCase().includes(valForSearch)
            })
            setData(filteredProducts)
            setFilteredDataTotal(filteredProducts.length)
        }
    }
    const filterByMarketNameAndDirectorNameWhenPressEnter = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0)
            const body = {
                currentPage: 0,
                countPage: showByTotal,
                marketId: product?._id,
                search: {
                    name: name.replace(/\s+/g, ' ').trim(),
                    director: director.replace(/\s+/g, ' ').trim()
                }
            }
            dispatch(getBranchesByFilter(body))
        }
    }
    const handleChangeCheckbox = (market, type, checked) => {
        if (type === 1) {
            return false
        } else {
            if (checked) {
                const newFilials = [...newBranches.filials, market._id]
                const body = {
                    currentPage: currentPage,
                    countPage: showByTotal,
                    market: {
                        ...product,
                        filials: newFilials
                    },
                    search: {
                        name: market.name,
                        director: ''
                    },
                    filial: {
                        ...market,
                        mainmarket: product._id
                    }
                }
                dispatch(updateMarkets(body)).then(({error}) => {
                    if (!error) {
                        setNewBranches({...newBranches, filials: newFilials})
                    }
                })
            } else {
                const newFilials = filter(newBranches.filials,(id) => id !== market._id)
                let filial = {...market}
                delete filial.mainmarket
                const body = {
                    currentPage: currentPage,
                    countPage: showByTotal,
                    market: {
                        ...product,
                        filials: [...newFilials]
                    },
                    search: {
                        name: market.name,
                        director: ''
                    },
                    filial: {...filial}
                }
                dispatch(updateMarkets(body)).then(({error}) => {
                    if (!error) {
                        setNewBranches({...newBranches, filials: newFilials})
                    }
                })
            }
        }
    }
    useEffect(() => {
        setData(branches)
    }, [branches])
    useEffect(() => {
        setFilteredDataTotal(totalBranches)
    }, [totalBranches])
    useEffect(() => {
        setSearchedData(searchedBranches)
    }, [searchedBranches])
    useEffect(() => {
        const body = {
            currentPage: currentPage,
            countPage: showByTotal,
            marketId: product?._id,
            search: {
                name: name.replace(/\s+/g, ' ').trim(),
                director: director.replace(/\s+/g, ' ').trim()
            }
        }
        dispatch(getBranches(body))
        setNewBranches({
            filials: product.filials,
            connections: product.connections
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, showByTotal, product, currentPage])
    return (
        <section className={'mt-4'}>
            <div className={'flex justify-between items-center mainPadding'}>
                <h3 className={'text-blue-900 text-[xl] leading-[1.875rem]'}>
                    Filiallar
                </h3>
                {(filteredDataTotal !== 0 || totalSearchedBranches !== 0) && (
                    <Pagination
                        countPage={Number(showByTotal)}
                        totalDatas={totalSearchedBranches || filteredDataTotal}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
            <div className='flex items-center'>
                <SearchForm
                    filterBy={['total', 'marketName', 'directorName']}
                    filterByMarketName={filterByMarketName}
                    filterByDirectorName={filterByDirectorName}
                    searchByDirectorName={director}
                    searchByMarketName={name}
                    filterByDirectorNameWhenPressEnter={filterByMarketNameAndDirectorNameWhenPressEnter}
                    filterByMarketNameWhenPressEnter={filterByMarketNameAndDirectorNameWhenPressEnter}
                    filterByTotal={filterByTotal}
                />
                <div className={'min-w-[18rem]'}>
                    <BtnAddRemove text={'Saqlash'} edit={true} onClick={approveFunction} />
                </div>
            </div>
            {loadingGetBranches ? (
                <Spinner />
            ) : data.length === 0 && searchedData.length === 0 ? (
                <NotFind text={'Do\'konlar mavjud emas'} />
            ) : <div className={'flex flex-wrap gap-[2rem] pl-[2.5rem] py-[1.25rem]'}>

                {searchedData.length > 0 ? map(searchedData, (item) =>
                        <AdminProductCard
                            market={item} key={item._id}
                            isBranch={filter(newBranches.filials,(br) => br === item._id).length > 0}
                            isConnected={filter(newBranches.connections,(br) => br === item._id).length > 0}
                            onchange={handleChangeCheckbox}
                        />) :
                    map(data, (item) =>
                        <AdminProductCard
                            market={item} key={item._id}
                            isBranch={filter(newBranches.filials,(br) => br === item._id).length > 0}
                            isConnected={filter(newBranches.connections,(br) => br === item._id).length > 0}
                            onchange={handleChangeCheckbox} />)}

            </div>}
        </section>
    )
}

export default AdminMarkets