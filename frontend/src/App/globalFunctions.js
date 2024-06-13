import {regexForEmptyString} from '../Components/RegularExpressions/RegularExpressions.js'
import {orderBy, reduce} from 'lodash'
import * as XLSX from 'xlsx'

export const universalSort = (data, setData, key, sort, prevData) => {
    const keys = key.split('.')
    const result = sort
        ? orderBy(
            [...data],
            (item) => {
                return keys.length === 3
                    ? item[keys[0]][keys[1]][keys[2]]
                    : keys.length === 2
                        ? item[keys[0]][keys[1]]
                        : item[key]
            },
            [sort === -1 ? 'desc' : 'asc']
        )
        : prevData
    setData(result)
}
export const UsdToUzs = (val, currency) => Math.round(val * currency)

export const UzsToUsd = (val, currency) =>
    Math.round((val / currency) * 1000) / 1000

// check empty string
export const checkEmptyString = (values) => {
    let result = {failed: false, message: ''}
    for (let i = 0; i < values.length; i++) {
        if (regexForEmptyString.test(values[i].value)) {
            result = {
                message: values[i].message,
                failed: true
            }
            break
        }
    }
    return result
}
// export excel
export const exportExcel = (data, fileName, headers) => {
    const autoFillColumnWidth = (json) => {
        const cols = Object.keys(json[0])
        return cols.map((key, index) => {
            let maxLength = Math.max(
                ...json.map((x) => x[key].toString().length)
            )
            return {
                wch:
                    headers[index].length > maxLength
                        ? headers[index].length + 1
                        : maxLength + 4
            }
        })
    }
    const wscols = autoFillColumnWidth(data)
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet([])
    ws['!cols'] = wscols
    XLSX.utils.sheet_add_aoa(ws, [headers])
    XLSX.utils.sheet_add_json(ws, data, {
        origin: 'A2',
        skipHeader: true
    })
    XLSX.utils.book_append_sheet(wb, ws, 'Maxsulotlar')
    XLSX.writeFile(wb, `${fileName}-${new Date().toLocaleDateString()}.xlsx`)
}

// round UZS||USD
export const roundUzs = (val) => Math.round(val * 1) / 1

export const roundUsd = (val) => Math.round(val * 1000) / 1000

// reduce
export const reduceSumm = (arr, key) =>
    reduce(arr, (prev, current) => prev + current[key], 0)

// current Exchange
export const currentExchangerate = (uzs, usd) => roundUzs(uzs / usd)
