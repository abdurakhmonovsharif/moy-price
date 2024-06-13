import React, {useCallback, useEffect, useState} from 'react'
import CardLink from '../../../Components/Card/CardLink'
import {useDispatch, useSelector} from 'react-redux'
import {filter, map, uniqueId} from 'lodash'
import {getAllSuppliers, getIncomingConnectors} from '../incomingSlice'
import Dates from '../../../Components/Dates/Dates'
import SelectInput from '../../../Components/SelectInput/SelectInput'
import FilterButtons from '../../../Components/FilterButtons/FilterButtons'
import ResultIncomings from '../Components/ResultIncomings'
import {useTranslation} from 'react-i18next'

function Incomings() {
    const {t} = useTranslation(['common'])
    const dispatch = useDispatch()
    const {
        market: {_id},
    } = useSelector((state) => state.login)
    const {currencyType} = useSelector((state) => state.currency)
    const {incomingconnectors, suppliers} = useSelector(
        (state) => state.incoming
    )

    const [beginDay, setBeginDay] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        ).toISOString()
    )
    const [endDay, setEndDay] = useState(
        new Date(new Date().setHours(23, 59, 59, 0)).toISOString()
    )

    const [suppliersData, setSuppliersData] = useState([])
    const [cardConnectors, setCardConnectors] = useState([])
    const [supplierSearch, setSupplierSearch] = useState('')

    // change suppliers data
    const changeSuppliersData = (data) => {
        const suppliers = map(data, (supplier) => {
            return {
                label: supplier.name,
                value: supplier._id,
            }
        })
        setSuppliersData(suppliers)
    }

    //change connectors data START
    const changeConnectorsData = useCallback((data) => {
        let groups = []
        const convert = (el) => new Date(el.createdAt).toLocaleDateString()
        for (let element of data) {
            let existingGroups = filter(
                groups,
                (group) => convert(group) === convert(element)
            )
            if (existingGroups.length > 0) {
                currentGroup(existingGroups, element)
            } else {
                newGroup(groups, element)
            }
        }
        addChnagedIncomings(groups)
    }, [])

    const addChnagedIncomings = (groups) => {
        const sumSupplier = (arr) => {
            let repeat = []
            return arr.reduce((prev, {_id}) => {
                if (!repeat.includes(_id)) {
                    repeat.push(_id)
                    return prev + 1
                }
                return prev
            }, 0)
        }
        const sumTotal = (arr) => {
            return arr.reduce((prev, total) => prev + total, 0)
        }
        const data = map(groups, (income) => {
            return {
                createdAt: income.createdAt,
                products: income.incoming.length,
                suppliers: sumSupplier(income.supplier),
                totalprice: sumTotal(income.total),
                totalpriceuzs: sumTotal(income.totaluzs),
                totalpayment: sumTotal(income.totalpayment),
                totalpaymentuzs: sumTotal(income.totalpaymentuzs),
                debt: sumTotal(income.debt),
                debtuzs: sumTotal(income.debtuzs),
            }
        })
        setCardConnectors(data)
    }

    const currentGroup = (exist, el) => {
        exist[0].incoming.push(...el.incoming)
        exist[0].supplier.push(el.supplier)
        exist[0].total.push(el.total)
        exist[0].totaluzs.push(el.totaluzs)
        exist[0].totalpayment.push(el.totalpayment)
        exist[0].totalpaymentuzs.push(el.totalpaymentuzs)
        exist[0].debt.push(el.debt)
        exist[0].debtuzs.push(el.debtuzs)
        exist[0]._id = el._id
    }
    
    const newGroup = (group, el) => {
        let newgroup = {
            createdAt: el.createdAt,
            incoming: [...el.incoming],
            total: [el.total],
            totaluzs: [el.totaluzs],
            totalpayment: [el.totalpayment],
            totalpaymentuzs: [el.totalpaymentuzs],
            debt: [el.debt],
            debtuzs: [el.debtuzs],
            supplier: [el.supplier],
            _id: el._id,
        }
        group.push(newgroup)
    }
    //change connectors data END

    const selectSuppliers = (e) => {
        let target = e.value
        if (target === 'all') {
            changeConnectorsData(incomingconnectors)
            setSupplierSearch('')
        } else {
            const connectorsForSupplier = filter(
                incomingconnectors,
                ({supplier}) => {
                    return supplier._id === target
                }
            )
            changeConnectorsData(connectorsForSupplier)
            setSupplierSearch(e.label)
        }
    }

    // change date func
    const changeDate = (value, name) => {
        name === 'beginDay' && setBeginDay(new Date(value).toISOString())
        name === 'endDay' && setEndDay(new Date(value).toISOString())
    }

    useEffect(() => {
        changeSuppliersData(suppliers)
    }, [suppliers])

    useEffect(() => {
        changeConnectorsData(incomingconnectors)
    }, [incomingconnectors, changeConnectorsData])

    useEffect(() => {
        dispatch(
            getIncomingConnectors({
                market: _id,
                beginDay,
                endDay,
            })
        )
    }, [dispatch, _id, beginDay, endDay])

    useEffect(() => {
        dispatch(getAllSuppliers({_id}))
    }, [dispatch, _id])
    return (
        <section className={'grow overflow-auto'}>
            <div className='flex items-center gap-[1.25rem] mainPadding'>
                <Dates
                    label={t('dan')}
                    value={new Date(beginDay)}
                    onChange={(value) => changeDate(value, 'beginDay')}
                    maxWidth={'max-w-[9.6875rem]'}
                />
                <Dates
                    label={t('gacha')}
                    value={new Date(endDay)}
                    onChange={(value) => changeDate(value, 'endDay')}
                    maxWidth={'max-w-[9.6875rem]'}
                />
                <FilterButtons
                    element={
                        <SelectInput
                            isSearchable={true}
                            options={[
                                {
                                    label: t('Yetkazib beruvchilar'),
                                    value: 'all',
                                },
                                ...suppliersData,
                            ]}
                            onSelect={selectSuppliers}
                        />
                    }
                    grow={true}
                    label={t('Yetkazuvchi')}
                />
            </div>
            <ResultIncomings
                currencyType={currencyType}
                connectors={cardConnectors}
                styles={'mainPadding'}
            />
            <div className='flex flex-wrap gap-[1.25rem] mainPadding'>
                {map(cardConnectors, (item) => {
                    return (
                        <CardLink
                            key={uniqueId('card')}
                            totalprice={item.totalprice}
                            totalpriceuzs={item.totalpriceuzs}
                            currencyType={currencyType}
                            pieces={item.products}
                            suppliers={item.suppliers}
                            createdAt={item.createdAt}
                            debt={item.debt}
                            debtUzs={item.debtuzs}
                            paid={item.totalpayment}
                            paidUzs={item.totalpaymentuzs}
                            path={`/maxsulotlar/qabul/qabullar/${uniqueId()}`}
                            state={{
                                date: item.createdAt,
                                supplier: supplierSearch,
                            }}
                        />
                    )
                })}
            </div>
        </section>
    )
}

export default Incomings
