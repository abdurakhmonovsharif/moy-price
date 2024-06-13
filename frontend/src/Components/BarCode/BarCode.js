import React from 'react'
import {Body} from './Body.js'
import {map, range, uniqueId} from 'lodash'

const repeat = (count, element) => {
    let result = []
    for (let i = 0; i < count; i++) {
        result.push(element)
    }
    return result
}

export const BarCode = (
    {
        countOfCheques,
        productForCheques,
        printedData,
        componentRef,
        currency,
        marketName,
        isShowPrice
    }) => {
    return (
        <div ref={componentRef}>
            {productForCheques &&
                countOfCheques &&
                map(productForCheques, (productForCheque) =>
                    range(0, countOfCheques).map(() => {
                        return (
                            <Body
                                key={uniqueId('barCode')}
                                currency={currency}
                                product={productForCheque}
                                marketName={marketName}
                                isShowPrice={isShowPrice}
                            />
                        )
                    })
                )}
            {
                map(printedData, item => <div key={uniqueId('barCodeContainer')}>
                    {
                        map(repeat(item.numberOfChecks, item.product), (product) => <Body
                            key={uniqueId('barCode')}
                            currency={currency}
                            product={product}
                            marketName={marketName}
                            isShowPrice={isShowPrice}
                        />)
                    }
                </div>)
            }
        </div>
    )
}
