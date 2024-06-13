import React, {useEffect, useState} from 'react'
import Api from '../../Config/Api'
import {universalToast} from '../../Components/ToastMessages/ToastMessages'
import Pagination from '../../Components/Pagination/Pagination'
import {useSelector} from 'react-redux'
import {motion} from 'framer-motion'
import Dates from '../../Components/Dates/Dates'
import FieldContainer from '../../Components/FieldContainer/FieldContainer'
import SelectForm from '../../Components/Select/SelectForm'
import {roundUsd, roundUzs} from '../../App/globalFunctions'
import {FaFilter} from 'react-icons/fa'
import {t} from 'i18next'
import {VscClose} from 'react-icons/vsc'

const WarhouseProducts = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
        useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
        }, []);
    const {currencyType} = useSelector((state) => state.currency)

    //================================================
    //================================================
    const [modalOpen,setOpenModal]=useState(false)
    const [startDate, setStartDate] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
        )
    )
    const [endDate, setEndDate] = useState(new Date())

    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const [type, setType] = useState({
        label: t('Kelgan'),
        value: 'income',
    })

    // ==========================================================
    // ==========================================================

    const [warhousePorducts, setWarhouseProducts] = useState([])
    const [totalDatas, setTotalDatas] = useState(0)

    useEffect(() => {
        const getWarhouseProduct = async () => {
            try {
                const {data} = await Api.post('/filials/warhouseproducts/get', {
                    type: type?.value,
                    startDate,
                    endDate,
                    currentPage,
                    countPage,
                })
                setWarhouseProducts(data.warhouseproducts)
                setTotalDatas(data.count)
            } catch (error) {
                universalToast(error, 'error')
            }
        }
        getWarhouseProduct()
    }, [type, startDate, endDate, currentPage, countPage])

    // ==========================================================
    // ==========================================================

    // useEffect(() => {
    //     dispatch(getFilials({ market }))
    // }, [dispatch])

    // ==========================================================
    // ==========================================================

    return (
        <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
                open: {opacity: 1, height: 'auto'},
                collapsed: {opacity: 0, height: 0},
            }}
            transition={{duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98]}}
        >
            
            <div className='mainPadding mt-5 flex ps-[20px] gap-2 justify-araund items-center'>
                <div className='flex m-3  items-center gap-[20px]'>
                    <SelectForm
                        key={'total_1'}
                        onSelect={(e) => setCountPage(e)}
                    />
                    
                </div>
                <FieldContainer
                    placeholder={'Filialni'}
                    select={true}
                    value={type}
                    options={[
                        {
                            label: t('Kelgan'),
                            value: 'income',
                        },
                        {
                            label: t('Chiqqan'),
                            value: 'outcome',
                        },
                    ]}
                    onChange={setType}
                    maxWidth={'w-[200px]'}
                />
                {isMobile ? <button onClick={()=>setOpenModal(true)} class="ms-3 hover:bg-blue-200  bg-blue-400 focus-visible:outline-none w-[120px]   createElement "><FaFilter /> {t('izlash')}</button> : 
                <div className='flex justify-center gap-2'>
                <Dates
                        value={startDate}
                        onChange={setStartDate}
                        placeholder={'01.01.2021'}
                        maxWidth={'w-[7.625rem]'}
                    />
                    <Dates
                        value={endDate}
                        onChange={setEndDate}
                        placeholder={'01.01.2021'}
                        maxWidth={'w-[7.625rem]'}
                    />

            </div>}
            </div>
            {
                isMobile ? modalOpen && <div className='fixed top-0 start-0 bg-[white] w-[100%] h-[100vh] z-50 lg:pt-[100px] pt-[55px]'>
                <VscClose onClick={()=>setOpenModal(false)} className='absolute text-3xl end-[25px] top-[25px] cursor-pointer'/>
                <div className='flex justify-center gap-2 mt-[100px]'>
                    <Dates
                            value={startDate}
                            onChange={setStartDate}
                            placeholder={'01.01.2021'}
                            maxWidth={'w-[6.625rem]'}
                        />
                        <Dates
                            value={endDate}
                            onChange={setEndDate}
                            placeholder={'01.01.2021'}
                            maxWidth={'w-[6.625rem]'}
                        />
    
                </div>
                <div className='flex justify-center mt-[100px]'>
                <button onClick={()=>setOpenModal(false)} class="ms-3 hover:bg-blue-200  bg-blue-400 focus-visible:outline-none w-[120px]   createElement "><FaFilter /> {t('izlash')}</button>
                </div>
                </div> : null
            }
            <div className=' ps-[20px]'>
                {
                    !isMobile?
                    <table className='overflow-x-auto w-full'>
                    <thead className='rounded-t-lg sticky top-0'>
                        <tr className='bg-primary-900 rounded-t-lg'>
                            <th className='th rounded-tl-lg border-r-2 border-primary-700'>
                                №
                            </th>
                            <th className='th border-r-2 border-primary-700'>
                                {t('Sana')}
                            </th>
                            <th className='th border-r-2 border-primary-700'>
                                {t('Omborxona')}
                            </th>
                            <th className='th border-r-2 border-primary-700'>
                                {t('Nomi')}
                            </th>
                            <th className='th border-r-2 border-primary-700'>
                                {t('Kodi')}
                            </th>
                            <th className='th border-r-2 border-primary-700'>
                                {t('Soni')}
                            </th>
                            <th className='th rounded-tr-lg'>{t('Jami narxi')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warhousePorducts &&
                            warhousePorducts.length > 0 &&
                            warhousePorducts.map((product, ind) => (
                                <tr className='tr' key={ind}>
                                    <td className='td py-2'>
                                        {ind + 1 + currentPage * countPage}
                                    </td>
                                    <td className='td'>
                                        <div className='flex justify-between w-full'>
                                            <span>
                                                {new Date(
                                                    product.createdAt
                                                ).toLocaleDateString()}
                                            </span>{' '}
                                            <span>
                                                {new Date(
                                                    product.createdAt
                                                ).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='td'>
                                        {type.value === 'outcome' ? product?.market?.name : product?.filial?.name}
                                    </td>
                                    <td className='td'>
                                        {product?.product?.product.code}
                                    </td>
                                    <td className='td'>
                                        {product?.product?.product?.name}
                                    </td>
                                    <td className='td'>
                                        {product?.product?.fromFilial}
                                    </td>
                                    <td className='td'>
                                        {currencyType === 'USD'
                                            ? roundUsd(
                                                  product?.product?.unitprice *
                                                      product?.product
                                                          ?.fromFilial
                                              ).toLocaleString('ru-RU')
                                            : roundUzs(
                                                  product?.product
                                                      ?.unitpriceuzs *
                                                      product?.product
                                                          ?.fromFilial
                                              ).toLocaleString('ru-RU')}{' '}
                                        {currencyType}
                                    </td>
                                </tr>
                            ))}
                            <tr className='tr'>
                                    <td className='td py-2'></td>
                                    <td className='td'></td>
                                    <td className='td'></td>
                                    <td className='td'></td>
                                    <td className='td'></td>
                                    <td className='td'></td>
                                    <td className='td'>
                                        {currencyType === 'USD'
                                            ? roundUsd(
                                                  warhousePorducts.reduce((prev, product) => prev + (product?.product?.unitprice *
                                                  product?.product
                                                      ?.fromFilial), 0)
                                              ).toLocaleString('ru-RU')
                                            : roundUzs(
                                                warhousePorducts.reduce((prev, product) => prev + (product?.product?.unitpriceuzs *
                                                    product?.product
                                                        ?.fromFilial), 0)
                                              ).toLocaleString('ru-RU')}{' '}
                                        {currencyType}
                                    </td>
                                </tr>
                    </tbody>
                </table>:
                    warhousePorducts &&
                        warhousePorducts.length > 0 &&
                        warhousePorducts.map((product, ind) => (
                    <li className='w-[90vw]  bg-white list-none mb-[10px] ps-0 rounded-md'>
                        <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                            <p className='text-[blue]'>{product?.filial?.name}</p>
                             <p><span>
                                {new Date(
                                product.createdAt
                                ).toLocaleDateString()}
                                </span>{'  '}
                                <span>
                                {new Date(
                                    product.createdAt
                                    ).toLocaleTimeString()}
                                </span>
                            </p>
                        </li>
                        <li className='border p-[10px] text-sm flex justify-between border-s-0 border-t-0 border-e-0'>
                            <p>{product?.product?.product?.name}</p>
                            <p>
                                <span>{t('Soni')}: 
                                {product?.product?.fromFilial}
                                </span>
                            </p>
                        </li>   
                        <li className=' p-[10px] text-sm flex justify-between '>
                            <p className='text-[green]'><span>{t('Jami')}: {' '}
                            {currencyType === 'USD'
                                            ? roundUsd(
                                                  product?.product?.unitprice *
                                                      product?.product
                                                          ?.fromFilial
                                              ).toLocaleString('ru-RU')
                                            : roundUzs(
                                                  product?.product
                                                      ?.unitpriceuzs *
                                                      product?.product
                                                          ?.fromFilial
                                              ).toLocaleString('ru-RU')}{' '}
                                        {currencyType}
                            </span></p>
                            
                        </li>     
                    </li>
                ))
                    
                }
                {isMobile && <li className='w-[90vw]  bg-white list-none mb-[10px] ps-0 rounded-md'>
                    <li className=' p-[10px] text-sm flex justify-between '>
                            <p className='text-[green]'><span>{t('Jami')}: {' '}
                            {currencyType === 'USD'
                                            ? roundUsd(
                                                  warhousePorducts.reduce((prev, product) => prev + (product?.product?.unitprice *
                                                  product?.product
                                                      ?.fromFilial), 0)
                                              ).toLocaleString('ru-RU')
                                            : roundUzs(
                                                warhousePorducts.reduce((prev, product) => prev + (product?.product?.unitpriceuzs *
                                                    product?.product
                                                        ?.fromFilial), 0)
                                              ).toLocaleString('ru-RU')}{' '}
                                        {currencyType}
                            </span></p>
                            
                        </li>
                </li>}
            </div>
                <div className='flex justify-center'>
                <div className='pagination mainPadding'>
                <Pagination
                    countPage={Number(countPage)}
                    currentPage={currentPage}
                    totalDatas={totalDatas}
                    setCurrentPage={setCurrentPage}
                />
            </div>
                </div>
        </motion.section>
    )
}

export default WarhouseProducts
