import React from 'react'
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {Pie} from 'react-chartjs-2'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'

function PieChart({arr = [0]}) {
    const {t} = useTranslation(['common'])

    const {currencyType} = useSelector(state => state.currency)
    ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)
    const options = {
        responsive: true,
        maintainAspectRatio: false
    }
    const data = {
        labels: [t('Xarajatlar'), t('Sof foyda')],
        datasets: [
            {
                data: arr,
                datalabels: {
                    font: {
                        size: 18,
                    },
                    color: arr.length > 1 && arr.some(item => item !== 0) ? '#ffffff' : '#1c1c1c',
                    formatter: (value) => {
                        return value?.toLocaleString('ru-Ru') + '\n' + currencyType
                    },
                    textAlign: 'center',
                    clamp: true,
                    align: 'center'
                },
                backgroundColor: [
                    'rgba(240, 68, 56, 0.5)',
                    'rgba(18, 183, 106, 0.5)'
                ],
                borderColor: [
                    'rgba(240, 68, 56, 1)',
                    'rgba(18, 183, 106, 1)'
                ],
                borderWidth: 1
            }
        ]
    }

    return (
        <Pie data={data} options={options} />
    )
}

export default PieChart