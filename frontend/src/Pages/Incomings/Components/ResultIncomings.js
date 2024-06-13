import React from 'react'
import {useTranslation} from 'react-i18next'

const ResultIncomings = ({ connectors, styles, currencyType }) => {

    const { t } = useTranslation(['common'])

    const price = () => {
        if (connectors.length > 0) {
            return currencyType === 'USD'
                ? connectors
                    .reduce((prev, item) => prev + item.totalprice, 0)
                    .toLocaleString('ru-RU')
                : connectors
                    .reduce((prev, item) => prev + item.totalpriceuzs, 0)
                    .toLocaleString('ru-RU')
        }
        return 0
    }

    return (
        <div className={`productTypeBlock ${styles}`}>
            <div className='productType'>
                {t("Maxsulotlar soni")}:{' '}
                <span className='ml-[0.5rem] font-[400] text-black-900'>
                    {connectors
                        .reduce((prev, item) => prev + item.products, 0)
                        .toLocaleString('ru-RU')}
                </span>
            </div>
            <div className='productSumAll'>
                {t("Jami")} :{' '}
                <span className='ml-[0.5rem] font-[400] text-black-900'>
                    {price()} {currencyType}
                </span>
            </div>
        </div>
    )
}

export default ResultIncomings
