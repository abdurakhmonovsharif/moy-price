import {t} from 'i18next'

export const ReportsTableHeaders = (header) => {
    let paymenttype =
        (header === 'cash' && 'Naqt') ||
        (header === 'card' && 'Plastik') ||
        (header === 'transfer' && "O'tkazma")

    const headers = {
        sale: [
            {
                title: '№',
            },
            {
                title: t('Sana'),
                filter: 'createdAt',
            },
            {
                title: t('ID'),
                filter: t('id'),
            },
            {
                title: t('Mijoz'),
            },
            {
                title: t('Jami'),
            },
            {
                title: "To'langan",
            },
            {
                title: t('Qarz'),
            },
            {
                title: t('Izoh'),
            },
            {
                title: '',
                styles: 'w-[7rem]',
            },
        ],
        income: [
            {
                title: '№',
            },
            {
                title: t('Sana'),
                filter: 'createdAt',
            },
            {
                title: t('ID'),
                filter: 'saleconnector.id',
            },
            {
                title: t('Kelgan narxi'),
            },
            {
                title: t('Sotilgan narxi'),
            },
            {
                title: t('Chegirma'),
            },
            {
                title: t('Foyda'),
            },
            {
                title: '',
            },
        ],
        debts: [
            {
                title: '№',
            },
            {
                title: t('Sana'),
                filter: 'createdAt',
            },
            {
                title: t('ID'),
                filter: 'saleconnector.id',
            },
            {
                title: t('Mijoz'),
                filter: 'client',
            },
            {
                title: t('Qarz izoh'),
            },
            {
                title: t(`To'lov sanasi`),
            },
            {
                title: t('Jami'),
            },
            {
                title: t('Qarz'),
            },
            {
                title: '',
            },
        ],
        expenses: [
            {
                title: '№',
            },
            {
                title: t('Sana'),
                filter: 'createdAt',
            },
            {
                title: t('Summa'),
            },
            {
                title: t('Izoh'),
            },
            {
                title: t('Turi'),
            },
        ],
        discounts: [
            {
                title: '№',
            },
            {
                title: t('Sana'),
                filter: 'createdAt',
            },
            {
                title: t('ID'),
                filter: 'saleconnector.id',
            },
            {
                title: t('Mijoz'),
                filter: 'client',
            },
            {
                title: t('Jami'),
            },
            {
                title: t('Chegirma'),
            },
            {
                title: t('Foiz'),
            },
        ],
        backproducts: [
            {
                title: '№',
            },
            {
                title: t('Sana'),
                filter: 'createdAt',
            },
            {
                title: t('ID'),
                filter: 'saleconnector.id',
            },
            {
                title: t('Mijoz'),
                filter: 'client',
            },
            {
                title: t('Soni'),
            },
            {
                title: t('Jami'),
            },
            {
                title: t('Qaytarilgan'),
            },
            {
                title: '',
            },
        ],
        payments: [
            {
                title: '№',
            },
            {
                title: t('Sana'),
                filter: 'createdAt',
            },
            {
                title: t('ID'),
                filter: 'saleconnector.id',
            },
            {
                title: t('Mijoz'),
            },
            {
                title: t('Naqt'),
            },
            {
                title: t('Plastik'),
            },
            {
                title: t("O'tkazma"),
            },
            {
                title: t("Qarzdan to'lov"),
            },
            {
                title: t('Qaytarilgan'),
            },
            {
                title: '',
            },
        ],
    }

    // return header === 'cash' || header === 'card' || header === 'transfer'
    //     ? headers.payments
    //     : headers[`${header}`]

    return headers[`${header}`]
}
