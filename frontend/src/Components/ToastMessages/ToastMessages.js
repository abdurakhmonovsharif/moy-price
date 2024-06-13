import {toast} from 'react-toastify'
import i18n from './../../i18n'
// Long toast message with header and body
const toastWithHeader = (header, message) => (
    <div>
        <h1 className={'text-sm mb-1'}>{header}</h1>
        <p className={'text-xs'}>{message}</p>
    </div>
)

// Success Messages

export const successLoggedIn = () =>
    toast.success(
        toastWithHeader(
            i18n.t('Xush kelibsiz'),
            i18n.t('Kirish muvaffaqiyatli amalga oshirildi!')
        )
    )
export const successAddProductMessage = () =>
    toast.success(i18n.t('Maxsulot muvaffaqiyatli yaratildi!'))
export const successUpdateProductMessage = () =>
    toast.success(i18n.t('Maxsulot muvaffaqiyatli o`zgartirildi!'))
export const successDeleteProductMessage = () =>
    toast.success(i18n.t('Maxsulot muvaffaqiyatli o`chirildi!'))

export const successAddUnitMessage = () =>
    toast.success(i18n.t('O`lchov birligi muvaffaqiyatli yaratildi!'))
export const successUpdateUnitMessage = () =>
    toast.success(i18n.t('O`lchov birligi muvaffaqiyatli o`zgartirildi!'))
export const successDeleteUnitMessage = () =>
    toast.success(i18n.t('O`lchov birligi muvaffaqiyatli o`chirildi!'))

export const successAddClientMessage = () =>
    toast.success(i18n.t('Yangi mijoz muvaffaqiyatli yaratildi!'))
export const successUpdateClientMessage = () =>
    toast.success(i18n.t('Mijoz muvaffaqiyatli o`zgartirildi!'))
export const successDeleteClientMessage = () =>
    toast.success(i18n.t('Mijoz muvaffaqiyatli o`chirildi!'))

export const successAddSupplierMessage = () =>
    toast.success(i18n.t('Yangi yetkazib beruvchi muvaffaqiyatli yaratildi!'))
export const successUpdateSupplierMessage = () =>
    toast.success(i18n.t('Yetkazib beruvchi muvaffaqiyatli o`zgartirildi!'))
export const successDeleteSupplierMessage = () =>
    toast.success(i18n.t('Yetkazib beruvchi muvaffaqiyatli o`chirildi!'))

export const successAddSellerMessage = () =>
    toast.success(i18n.t('Sotuvchi muvaffaqiyatli yaratildi!'))
export const successUpdateSellerMessage = () =>
    toast.success(i18n.t('Sotuvchi muvaffaqiyatli o`zgartirildi!'))

// Exchange rate massages
export const successAddExchangeMessage = () =>
    toast.success(i18n.t('Valyuta kursi muvaffaqiyatli yaratildi!'))
export const successUpdateExchangeMessage = () =>
    toast.success(i18n.t('Valyuta kursi muvaffaqiyatli o`zgartirildi !'))
export const successDeleteExchangeMessage = () =>
    toast.success(i18n.t('Valyuta kursi muvaffaqiyatli o`chirildi !'))

export const successUpdateInventoryMessage = () =>
    toast.success(i18n.t('Inventarizatsiya muvaffaqqiyatli saqlandi!'))
export const successCompleteInventoryMessage = () =>
    toast.success(i18n.t('Inventarizatsiya muvaffaqqiyatli yakunlandi!'))

export const successAddPackmanMessage = () =>
    toast.success(i18n.t('Agent muvaffaqiyatli yaratildi!'))
export const successUpdatePackmanMessage = () =>
    toast.success(i18n.t('Agent muvaffaqiyatli o`zgartirildi!'))
export const successDeletePackmanMessage = () =>
    toast.success(i18n.t('Agent muvaffaqiyatli o`chirildi!'))

export const successAddCategoryMessage = () =>
    toast.success(i18n.t('Kategoriya muvaffaqiyatli yaratildi!'))
export const successUpdateCategoryMessage = () =>
    toast.success(i18n.t('Kategoriya muvaffaqiyatli o`zgartirildi!'))
export const successDeleteCategoryMessage = () =>
    toast.success(i18n.t('Kategoriya muvaffaqiyatli o`chirildi!'))

export const successDeleteTemporary = () =>
    toast.success(i18n.t('Saqlangan sotuv muvaffaqiyatli o`chirildi!'))
export const successSavedTemporary = () =>
    toast.success(i18n.t('Sotuv muvaffaqiyatli saqlandi!'))

export const successAddBarcodeMessage = () =>
    toast.success(i18n.t('Shtrix kod muvaffaqiyatli yaratildi!'))
export const successUpdateBarcodeMessage = () =>
    toast.success(i18n.t('Shtrix kod muvaffaqiyatli o`zgartirildi!'))
export const successDeleteBarcodeMessage = () =>
    toast.success(i18n.t('Shtrix kod muvaffaqiyatli o`chirildi!'))
export const successRegisterAllBarcodesMessage = () =>
    toast.success(i18n.t('Shtrix kodlarlar muvaffaqiyatli yaratildi!'))

export const successUploadImage = () =>
    toast.success(i18n.t('Rasm muvaffaqiyatli yuklandi!'))
export const successEditProfile = () =>
    toast.success(i18n.t('Yangi ma`lumot muvoffaqiyatli saqlandi!'))
export const successAddDirectory = () =>
    toast.success(i18n.t('Direktor muvaffaqiyatli yaratildi!'))

export const successPayDebt = () =>
    toast.success(i18n.t('Qarz muvaffaqiyatli to`ldirildi!'))

// Warning Messages
export const warningRepeatPasswordDoesntMatch = () =>
    toast.warn(i18n.t('Takroriy parol no`to`g`ri kiritilgan!'))
export const warningDeleteProduct = () =>
    toast.warn(i18n.t('Maxsulotlarni uchirish mumkin emas!'))
export const warningEmptyInput = (text) =>
    toast.warn(
        text
            ? i18n.t(`${text} ${i18n.t("bo'sh qolishi mumkin emas!")}`)
            : i18n.t('Ma`lumotlar to`liq kiritilmagan!')
    )
export const warningCurrencyRate = () =>
    toast.warn(i18n.t('Valyuta kursi kiritilmagan!'))
export const warningCategory = () => {
    toast.warn(i18n.t('Kategoriyalar mavjud emas!'))
}
export const warningSaleProductsEmpty = () =>
    toast.warn(i18n.t('Maxsulot mavjud emas !'))
export const warningMorePayment = () =>
    toast.warn(i18n.t('To`lov summasidan ortiq summa kiritib bo`lmaydi'))
export const warningLessPayment = () =>
    toast.warn(i18n.t('To`lov summasidan kam summa kiritib bo`lmaydi'))

export const warningDebtClient = () =>
    toast.warn(
        i18n.t(
            'Diqqat! Qarzga savdoni amalga oshirish uchun mijoz ismini kiriting!'
        )
    )
    export const warningDebtClientPayEndDate = () =>
        toast.warn(
            i18n.t(
                'Diqqat! Qarzga savdoni amalga oshirish uchun ohirgi to`lov sanasini  kiriting!'
            )
        )
export const warningMoreDiscount = (val) =>
    toast.warn(`${val} ${i18n.t("dan ortiq chegirma kiritib bo'lmaydi")}`)
export const warningLessSellPayment = () =>
    toast.warn(i18n.t('Sotish narxi kelish narxidan past bo`lmasligi kerak'))

export const warningCountSellPayment = () =>
    toast.warn(i18n.t('Masulot omborda yetarlicha mavjud emas'))

export const warningReturnProductsEmpty = () =>
    toast.warn(i18n.t('Qaytariladigan maxsulotlar mavjud emas !'))

// Product Exchanges toast

export const warningSellingExchanges = () =>
    toast.warn("Sotish narxi olish narxidan kam yoki teng bo'lmasligi kerak !")

export const emptyProductExchanges = () =>
    toast.warn("Ma'lumotlar to'liq kiritilmagan !")

export const productNumberExchanges = () =>
    toast.warn(
        "Siz kiritgan maxsulot soni umumiy maxsulot sonidan ko'p bolishi mumkin emas !"
    )

export const productNumberMinusExchanges = () =>
    toast.warn("Maxsulot soni manfiy bo'lishi mumkin emas !")

export const productExchangesFilial = () =>
    toast.error('Maxsulot kiritilmagan yoki filial tanlanmagan !')

// Universal Messages
export const universalToast = (message, type, option = {}) =>
    toast[type](message, option)
