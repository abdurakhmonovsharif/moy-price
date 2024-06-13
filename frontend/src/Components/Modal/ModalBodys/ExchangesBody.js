import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import LabelInput from '../../Inputs/LabelInput'
import {t} from 'i18next'

function ExchangesBody({ approveFunction, toggleModal, dataObject }) {
    const { currencyType } = useSelector((state) => state.currency)

    const [productNumber, setProductNumber] = useState(1)
    const [getProduct, setGetProduct] = useState(dataObject?.get)
    const [sellProduct, setSellProduct] = useState(dataObject?.sell)
    const [errorNumber, setErrorNumber] = useState(true)
    const [getProductUSD, setGetProductUSD] = useState(dataObject?.getUSD)
    const [sellingProductUSD, setSellingProductUSD] = useState(
        dataObject?.sellUSD
    )
    const InputsData = {
        id: dataObject?.id,
        categoryId: dataObject?.categoryId,
        categoryCode: dataObject?.categoryCode,
        get: getProduct ? getProduct : dataObject?.get,
        getUSD: getProductUSD ? getProductUSD : dataObject?.getUSD,
        sell: sellProduct ? sellProduct : dataObject?.sell,
        sellUSD: sellingProductUSD ? sellingProductUSD : dataObject?.sellUSD,
        unidId: dataObject?.unidId,
        unitName: dataObject?.unitName,
        code: dataObject?.code,
        number: productNumber ? Number(productNumber) : '',
        name: dataObject?.name,
        productDataId: dataObject?.productDataId,
        barcode: dataObject.barcode,
        tradeprice: dataObject.tradeprice,
        tradepriceuzs: dataObject.tradepriceuzs,
        minimumcount: dataObject.minimumcount,
    }

    const handleNumberProduct = (event) => {
        if (Number(event) > dataObject.number || Number(event) < 0) {
            setErrorNumber(false)
        } else {
            setErrorNumber(true)
        }
        setProductNumber(event)
    }

    const handleGetProduct = (event, currency) => {
        if (currency === 'USD') {
            setGetProductUSD(event)
        }
        if (currency === 'UZS') {
            setGetProduct(event)
        }
    }

    const handleSellProduct = (event, currency) => {
        if (currency === 'UZS') {
            setSellProduct(event)
        }
        if (currency === 'USD') {
            setSellingProductUSD(event)
        }
    }

    return (
        <div>
            <div className='mb-[2.5rem] text-[1.25rem] text-black-700 leading-[1.5rem] text-center mt-[1.25rem]'>
                {dataObject?.name}
            </div>
            <div className='flex items-center gap-[2.5rem] justify-evenly mb-[2.5rem]'>
                <div className='product-exchange-modal-text'>
                    {t('Kodi')} :
                    <span className='product-exchange-modal-span bg-[#F79009]'>
                        {dataObject ? dataObject?.code : '0'}
                    </span>
                </div>
                <div className='product-exchange-modal-text'>
                    {t('Soni')} :
                    <span className='product-exchange-modal-span bg-[#00B4CC]'>
                        {dataObject
                            ? (
                                dataObject?.number - Math.abs(productNumber)
                            ).toLocaleString('ru-Ru')
                            : '0'}
                    </span>
                </div>
            </div>
            <div className='flex justify-center gap-[1.25rem] mb-[3.75rem]'>
                <div>
                    <LabelInput
                        label={'Soni'}
                        type={'number'}
                        value={productNumber ? productNumber : ''}
                        onChange={(e) => handleNumberProduct(e.target.value)}
                    />
                </div>
                {/* <div>
                    <LabelInput
                        label={'Olish'}
                        type={'number'}
                        value={
                            currencyType === 'UZS' ? getProduct : getProductUSD
                        }
                        onChange={(e) =>
                            handleGetProduct(e.target.value, currencyType)
                        }
                    />
                </div>
                <div>
                    <LabelInput
                        label={'Sotish'}
                        type={'number'}
                        value={
                            currencyType === 'UZS'
                                ? sellProduct
                                : sellingProductUSD
                        }
                        onChange={(e) =>
                            handleSellProduct(e.target.value, currencyType)
                        }
                    />
                </div> */}
            </div>
            <div
                className={'flex mt-7 items-center justify-center gap-[1.5rem]'}
            >
                <button
                    className={'approveBtn bg-black-500 hover:bg-black-700'}
                    onClick={toggleModal}
                >
                    {t('Bekor qilish')}
                </button>
                <button
                    className={'approveBtn bg-success-500 hover:bg-success-700'}
                    onClick={() => approveFunction(InputsData, errorNumber)}
                >
                    {t('Tasdiqlash')}
                </button>
            </div>
        </div>
    )
}

export default ExchangesBody
