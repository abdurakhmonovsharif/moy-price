import {
    IoBusiness,
    IoCart,
    IoCash,
    IoExitOutline,
    IoHome,
    IoKeyOutline,
    IoListOutline,
    IoPeople,
    IoQrCode,
    IoSettingsOutline,
    IoWallet,
} from 'react-icons/io5'
import {FaCashRegister, FaHandHoldingUsd, FaSms} from 'react-icons/fa'
import {t} from 'i18next'
const navListForDirector = [
    {
        id: 1,
        label: 'Bosh sahifa',
        icon: <IoHome size={'1.5rem'} />,
        path: '/',
        submenu: false,
    },
    {
        id: 2,
        label: 'Maxsulotlar',
        path: 'maxsulotlar',
        icon: <IoCart size={'1.5rem'} />,
        submenu: [
            {
                id: 1,
                label: 'Kategoriyalar',
                icon: 'home',
                path: 'maxsulotlar/kategoriyalar',
            },
            {
                id: 2,
                label: 'Maxsulotlar',
                icon: 'home',
                path: 'maxsulotlar/maxsulotlar',
            },
            {
                id: 3,
                label: 'Omborxona',
                icon: 'home',
                path: 'maxsulotlar/omborxona',
            },
            {
                id: 4,
                label: "O'lchov birliklari",
                icon: 'home',
                path: 'maxsulotlar/ulchov',
            },
            {
                id: 5,
                label: 'Etiketka',
                icon: '',
                path: 'maxsulotlar/etiketka',
                submenu: false,
            },
            {
                id: 6,
                label: 'Qabul qilish',
                icon: '',
                path: 'maxsulotlar/qabul/qabulqilish',
                submenu: false,
            },
            {
                id: 7,
                label: 'Maxsulotlar hisoboti',
                icon: 'home',
                path: 'maxsulotlar/hisobot',
                submenu: [
                    {
                        id: 1,
                        label: 'Sotilgan mahsulotlar',
                        icon: 'home',
                        path: 'maxsulotlar/hisobot/sotilganlar',
                    },
                    {
                        id: 2,
                        label: 'Kam qolganlar',
                        icon: 'home',
                        path: 'maxsulotlar/hisobot/kamqolganlar',
                    },
                ],
            },
            {
                id: 8,
                label: t('Inventarizatsiya'),
                icon: true,
                path: 'maxsulotlar/inventarizatsiya',
                submenu: [
                    {
                        id: 1,
                        label: t('Inventarizatsiya'),
                        icon: 'home',
                        path: 'maxsulotlar/inventarizatsiya/inventarizatsiya',
                    },
                    {
                        id: 2,
                        label: t('Inventarizatsiyalar'),
                        icon: 'home',
                        path: 'maxsulotlar/inventarizatsiya/inventarizatsiyalar',
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        label: 'Sotuv',
        path: 'sotuv/sotish',
        icon: <IoWallet size={'1.5rem'} />,
        submenu: false,
    },
    {
        id: 4,
        label: 'Hamkorlar',
        path: 'hamkorlar',
        icon: <IoPeople size={'1.5rem'} />,
        submenu: [
            {
                id: 1,
                label: 'Yetkazuvchilar',
                icon: '',
                path: 'hamkorlar/yetkazuvchilar',
                submenu: false,
            },
            {
                id: 2,
                label: 'Agentlar',
                icon: '',
                path: 'hamkorlar/agentlar',
                submenu: false,
            },
            {
                id: 3,
                label: 'Mijozlar',
                icon: '',
                path: 'hamkorlar/mijozlar',
                submenu: false,
            },
            {
                id: 4,
                label: 'Sotuvchilar',
                icon: '',
                path: 'hamkorlar/sotuvchilar',
                submenu: false,
            },
        ],
    },
    {
        id: 5,
        label: "Do'konlar",
        icon: <IoBusiness size={'1.5rem'} />,
        path: 'dukonlar',
        submenu: [
            {
                id: 1,
                label: 'Hamkorlar',
                path: 'dukonlar/hamkorlar',
                icon: '',
                submenu: false,
            },
            {
                id: 2,
                label: 'Buyurtma berish',
                path: 'dukonlar/buyurtma_berish/buyurtmalar',
                icon: '',
                submenu: false,
            },
            {
                id: 3,
                label: 'Buyurtma olish',
                path: 'dukonlar/buyurtma_olish/ruyxat',
                icon: '',
                submenu: false,
            },
            {
                id: 4,
                label: 'Filiallar',
                path: 'dukonlar/filiallar',
                icon: '',
                submenu: false,
            },
            {
                id: 5,
                label: 'Almashinuv',
                path: 'dukonlar/almashinuv',
                icon: '',
                submenu: false,
            },
        ],
    },
    {
        id: 6,
        label: 'Xarajatlar',
        icon: <FaHandHoldingUsd size={'1.5rem'} />,
        path: 'xarajatlar',
        submenu: false,
    },
    {
        id: 7,
        label: 'Kassa',
        icon: <FaCashRegister size={'1.5rem'} />,
        path: 'kassa',
        submenu: false,
    },
    {
        id: 8,
        label: 'Valyuta kursi',
        icon: <IoCash size={'1.5rem'} />,
        path: 'valyuta',
        submenu: false,
    },
]
export const navListForSeller = [
    {
        id: 1,
        label: 'Sotuv',
        path: '/',
        icon: <IoWallet size={'1.5rem'} />,
        submenu: false,
    },
    {
        id: 2,
        label: 'Qarzdorlar',
        path: 'qarzdorlar',
        icon: <IoListOutline size={'1.5rem'} />,
        submenu: false,
    },
    {
        id: 3,
        label: 'Xarajatlar',
        icon: <FaHandHoldingUsd size={'1.5rem'} />,
        path: 'xarajatlar',
        submenu: false,
    },
    {
        id: 4,
        label: 'Hamkorlar',
        path: 'hamkorlar',
        icon: <IoPeople size={'1.5rem'} />,
        submenu: [
            {
                id: 1,
                label: 'Agentlar',
                icon: '',
                path: 'hamkorlar/agentlar',
                submenu: false,
            },
            {
                id: 2,
                label: 'Mijozlar',
                icon: '',
                path: 'hamkorlar/mijozlar',
                submenu: false,
            },
        ],
    },
]
export const navListForAdmin = [
    {
        id: 1,
        label: 'Bosh sahifa',
        icon: <IoHome size={'1.5rem'} />,
        path: '/',
    },
    {
        id: 2,
        label: 'Shtrix Kodlar',
        path: 'maxsulotlar',
        icon: <IoQrCode size={'1.5rem'} />,
    },
    {
        id: 3,
        label: "Do'konlar",
        icon: <IoBusiness size={'1.5rem'} />,
        path: 'dukonlar',
        submenu: false,
    },
]

    const user = JSON.parse(localStorage.getItem('userData'))?.userc

    export const profileList = [
        {
            id: 2,
            path: 'shaxsiy/parol',
            label: "Parolni o'zgartirish",
            icon: <IoKeyOutline size={'1rem'} />,
        },
        {
            id: 3,
            path: 'shaxsiy/qrcode',
            label: 'Qrcode yaratish',
            icon: <IoKeyOutline size={'1rem'} />,
        },
        {
            id: 4,
            path: 'shaxsiy/smsapi',
            label: 'Sms api',
            icon: <FaSms size={'1rem'} />
        },
        {
            id: 4,
            label: 'Chiqish',
            icon: <IoExitOutline size={'1rem'} />,
        },
    ]

export default navListForDirector
