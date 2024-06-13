import React from 'react'
import Table from '../../../../Components/Table/Table'
import {t} from 'i18next'

function SavedOrders() {
    const data = [
        {
          date : "07.09.2022",
          time : '12:07:50',
          shopName : "Alo24 Amerika Filiali",
          productCount : 25,
          productUnit : t('dona'),
          totalPrice : 25,
          totalPriceUZS : 250000,
        },
        {
            date : "08.09.2022",
            time : '12:07:50',
            shopName : "Alo24 Amerika Filiali",
            productCount : 25,
            productUnit : t('dona'),
            totalPrice : 25,
            totalPriceUZS : 250000,
        },
        {
            date : "09.09.2022",
            time : '12:07:50',
            shopName : "Alo24 Amerika Filiali",
            productCount : 25,
            productUnit : t('dona'),
            totalPrice : 25,
            totalPriceUZS : 250000,
        }
    ]

    const headers = [
        {title: '№', styles: 'w-[10%]'},
        {
            filter: 'date',
            title: 'Sana',
            styles: 'w-[10%]',
        },
        {
            filter: 'time',
            title: 'Vaqt',
            styles: 'w-[10%]',
        },
        {
            title: "Do'kon nomi",
            filter: 'name',
        },
        {title: 'Maxsulot soni', filter: 'count', styles: 'w-[10%]'},
        {title: 'Umumiy narxi USD', filter: 'price', styles: 'w-[15%]'},
        {title: 'Umumiy narxi UZS', filter: 'price', styles: 'w-[15%]'},
        {
            title : '', filter : '', styles : 'w-[10%]'
        }   
    ]

    return(
        <section>
             <div className='tableContainerPadding'>
                <Table
                    page='savedOrders'
                    currentPage={''}
                    countPage={''}
                    data={data}
                    headers={headers}
                />
             </div>
        </section>
    )
}

export default SavedOrders;