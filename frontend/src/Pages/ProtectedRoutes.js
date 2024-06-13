import {lazy} from 'react'
import {map, uniqueId} from 'lodash'
import {Route} from 'react-router-dom'
import SmsApi from './EditProfile/SmsApi.js'
// pages -->
const SellersReport = lazy(() => import('./Seller/SellersReport.js'))
const ProductReport = lazy(() => import('./ProductReport/ProductReport.js'))
const Category = lazy(() => import('./Category/Category.js'))
const Supplier = lazy(() => import('./SupplierPage/SupplierPage'))
const Labels = lazy(() => import('./Labels/Labels.js'))
const Inventory = lazy(() => import('./Inventory/Inventory'))
const Inventories = lazy(() => import('./Inventories/Inventories'))
const Unit = lazy(() => import('./Units/Unit.js'))
const Sales = lazy(() => import('./Sale/Sale.js'))
const RegisterSelling = lazy(() => import('./Sale/Routes/RegisterSelling.js'))
const SavedSellings = lazy(() => import('./Sale/Routes/SavedSellings.js'))
const Sellings = lazy(() => import('./Sale/Routes/Sellings.js'))
const Packman = lazy(() => import('./Packman/Packman'))
const ClientsPage = lazy(() => import('./Clients/Clients'))
const ClientsSales = lazy(() => import('./Clients/ClientsSales'))
const Shops = lazy(() => import('./MarketFilials/MarketFilials.js'))
const Reports = lazy(() => import('./Reports/Reports.js'))
const Exchangerate = lazy(() => import('./Currency/Currency.js'))
const Sellers = lazy(() => import('./Seller/Sellers'))
const MainPage = lazy(() => import('./MainPage/MainPage'))
const Products = lazy(() => import('./Products/Create/Products'))
const Incoming = lazy(() => import('./Incomings/Incoming'))
const Incomings = lazy(() => import('./Incomings/Routes/Incomings'))
const RegisterIncoming = lazy(() =>
    import('./Incomings/Routes/RegisterIncoming')
)
const SavedIncoming = lazy(() => import('./Incomings/Routes/SavedIncomings'))
const IncomingsList = lazy(() => import('./Incomings/Routes/IncomingsList'))
const IncomingSuppliers = lazy(() =>
    import('./Incomings/Routes/IncomingSuppliers')
)
const ReportPage = lazy(() => import('./Reports/ReportPage.js'))
const Barcode = lazy(() => import('./Barcode/Barcode.js'))
const AdminProduct = lazy(() => import('./AdminProducts/AdminProduct.js'))
const Expense = lazy(() => import('./Expense/Expense.js'))
const EditProfile = lazy(() => import('./EditProfile/EditProfile.js'))
const CreateQrcode = lazy(() => import('./EditProfile/CreateQrcode.js'))
const PayDebts = lazy(() => import('./PayDebts/PayDebts.js'))
const ProductExchanges = lazy(() =>
    import('./ProductExchanges/ProductExchanges.js')
)
const ProductMinimum = lazy(() => import('./ProductReport/ProductMinimum.js'))
const ProductIdExchanges = lazy(() =>
    import('./ProductIdExchanges/ProductIdExchanges.js')
)
const SupplierReport = lazy(() => import('./SupplierPage/SupplierReport.js'))
const CategoryReport = lazy(() => import('./CategoryReport/CategoryReport.js'))
const Connection = lazy(() => import('./Connection/Connection.js'))
const MarketProducts = lazy(() => import('./Connection/Pages/MarketProducts'))
const PartnerProducts = lazy(() => import('./Connection/Pages/PartnerProducts'))
const IncomingOrders = lazy(() =>
    import('./Orders/IncomingOrders/IncomingOrders.js')
)
const SendingOrders = lazy(() =>
    import('./Orders/SendingOrders/SendingOrders.js')
)
const Orders = lazy(() => import('./Orders/IncomingOrders/Routes/Orders.js'))
const SavedOrders = lazy(() =>
    import('./Orders/IncomingOrders/Routes/SavedOrders')
)
const RegisterOrders = lazy(() =>
    import('./Orders/IncomingOrders/Routes/RegisterOrders')
)

const OrdersSend = lazy(() =>
    import('./Orders/SendingOrders/Routes/RegisterOrders.js')
)
const SavedOrdersSend = lazy(() =>
    import('./Orders/SendingOrders/Routes/SavedOrders')
)
const RegisterOrdersSend = lazy(() =>
    import('./Orders/SendingOrders/Routes/Orders.js')
)

const WarhouseProducts = lazy(() =>
    import('./WarhouseProducts/WarhouseProducts')
)

const Pos = lazy(() => import('./Pos/Pos'))

// <-- pages

const directorRoutes = [
    {
        path: '/',
        element: <MainPage />
    },
    {
        path: '/maxsulotlar/qabul/',
        element: <Incoming />,
        subRoutes: [
            {
                path: 'qabulqilish',
                element: <RegisterIncoming />
            },
            {
                path: 'qabullar',
                element: <Incomings />
            },
            {
                path: 'qabullar/:id',
                element: <IncomingSuppliers />
            },
            {
                path: 'saqlanganlar',
                element: <SavedIncoming />
            },
            {
                path: 'ruyxat',
                element: <IncomingsList />
            }
        ]
    },
    {
        path: '/maxsulotlar/maxsulotlar',
        element: <Products />
    },
    {
        path: '/maxsulotlar/omborxona',
        element: <WarhouseProducts />
    },
    {
        path: '/maxsulotlar/hisobot/sotilganlar',
        element: <ProductReport />
    },
    {
        path: '/maxsulotlar/hisobot/kamqolganlar',
        element: <ProductMinimum />
    },
    {
        path: '/maxsulotlar/kategoriyalar',
        element: <Category />
    },
    {
        path: '/maxsulotlar/kategoriyalar/:code',
        element: <CategoryReport />
    },
    {
        path: '/maxsulotlar/ulchov',
        element: <Unit />
    },
    {
        path: '/maxsulotlar/etiketka',
        element: <Labels />
    },
    {
        path: '/maxsulotlar/inventarizatsiya/inventarizatsiya',
        element: <Inventory />
    },
    {
        path: '/maxsulotlar/inventarizatsiya/inventarizatsiyalar',
        element: <Inventories />
    },
    {
        path: '/sotuv/',
        element: <Sales />,
        subRoutes: [
            {
                path: 'sotish',
                element: <RegisterSelling />
            },
            {
                path: 'saqlanganlar',
                element: <SavedSellings />
            },
            {
                path: 'ruyxat',
                element: <Sellings />
            },
            {
                path: 'pos',
                element: <Pos />
            }
        ]
    },
    {
        path: '/hamkorlar/yetkazuvchilar',
        element: <Supplier />
    },
    {
        path: '/hamkorlar/yetkazuvchilar/:id',
        element: <SupplierReport />
    },
    {
        path: '/hamkorlar/agentlar',
        element: <Packman />
    },
    {
        path: '/hamkorlar/mijozlar',
        element: <ClientsPage />
    },
    {
        path: '/hamkorlar/mijoz',
        element: <ClientsSales />
    },
    {
        path: '/hamkorlar/sotuvchilar',
        element: <Sellers />
    },
    {
        path: '/hamkorlar/sotuvchilar/:id',
        element: <SellersReport />
    },
    {
        path: '/valyuta',
        element: <Exchangerate />
    },
    {
        path: '/xarajatlar',
        element: <Expense />
    },
    {
        path: '/kassa',
        element: <Reports />
    },
    {
        path: '/kassa/:id',
        element: <ReportPage />
    },
    {
        path: '/dukonlar/filiallar/*',
        element: <Shops />,
        subRoutes: [
            {
                path: ':tablename/:_id',
                element: <Shops />
            },
            {
                path: 'filiallar',
                element: <Shops />
            },
            {
                path: ':tablename/:_id/exchangesId',
                element: <ProductIdExchanges />
            }
        ]
    },
    {
        path: '/dukonlar/almashinuv',
        element: <ProductExchanges />
    },
    {
        path: '/dukonlar/hamkorlar',
        element: <Connection />
    },
    {
        path: '/dukonlar/hamkorlar/mahsulotlar/:id',
        element: <MarketProducts />
    },
    {
        path: '/dukonlar/hamkorlar/hamkormahsulotlari/:id',
        element: <PartnerProducts />
    },
    {
        path: '/dukonlar/hamkorlar/buyurtma',
        element: <div>buyurtma</div>
    },
    {
        path: '/dukonlar/buyurtma_olish',
        element: <IncomingOrders />,
        subRoutes: [
            {
                path: 'buyurtmalar',
                element: <RegisterOrders />
            },
            {
                path: 'saqlanganlar',
                element: <SavedOrders />
            },
            {
                path: 'ruyxat',
                element: <Orders />
            }
        ]
    },
    {
        path: '/dukonlar/buyurtma_berish',
        element: <SendingOrders />,
        subRoutes: [
            {
                path: 'buyurtmalar',
                element: <OrdersSend />
            },
            {
                path: 'saqlanganlar',
                element: <SavedOrdersSend />
            },
            {
                path: 'ruyxat',
                element: <RegisterOrdersSend />
            }
        ]
    },
    {
        path: '/shaxsiy/parol',
        element: <EditProfile />
    },
    {
        path: '/shaxsiy/qrcode',
        element: <CreateQrcode />
    },{
        path:'/shaxsiy/smsapi',
        element:<SmsApi/>
    }
]
const sellerRoutes = [
    {
        path: '/',
        element: <Sales />,
        subRoutes: [
            {
                path: '/',
                element: <RegisterSelling />
            },
            {
                path: 'saqlanganlar',
                element: <SavedSellings />
            },
            {
                path: 'ruyxat',
                element: <Sellings />
            }
        ]
    },
    {
        path: '/qarzdorlar',
        element: <PayDebts />
    },
    {
        path: '/xarajatlar',
        element: <Expense />
    },
    {
        path: '/hamkorlar/agentlar',
        element: <Packman />
    },
    {
        path: '/hamkorlar/mijozlar',
        element: <ClientsPage />
    },
    {
        path: '/hamkorlar/mijoz',
        element: <ClientsSales />
    }
]
const adminRoutes = [
    {
        path: '/',
        element: (
            <h1 className={'text-center text-black-700 p-[1rem]'}>
                Bunday sahifa hozircha mavjud emas
            </h1>
        )
    },
    {
        path: '/dukonlar/*',
        element: <AdminProduct />
    },
    {
        path: '/maxsulotlar',
        element: <Barcode />
    },
    {
        path: '/shaxsiy/parol',
        element: <EditProfile />
    }
]

const chooseRoute = (type, isIncomePage) => {
    switch (type) {
        case 'director':
            return directorRoutes
        case 'seller':
            return !isIncomePage ? sellerRoutes : [
                ...sellerRoutes,
                {
                    path: 'sotilganlar',
                    element: <ProductReport />
                },
                {
                    path: 'kamqolganlar',
                    element: <ProductMinimum />
                },
                {
                    path: '/maxsulotlar/qabul/',
                    element: <Incoming />,
                    subRoutes: [
                        {
                            path: 'qabulqilish',
                            element: <RegisterIncoming />
                        },
                        {
                            path: 'qabullar',
                            element: <Incomings />
                        },
                        {
                            path: 'qabullar/:id',
                            element: <IncomingSuppliers />
                        },
                        {
                            path: 'saqlanganlar',
                            element: <SavedIncoming />
                        },
                        {
                            path: 'ruyxat',
                            element: <IncomingsList />
                        }
                    ]
                },
            ]
        case 'admin':
            return adminRoutes
        default:
            return [
                {
                    path: '/',
                    element: <h1>Sahifa mavjud emas</h1>
                }
            ]
    }
}

const protectedRoutes = (type, isIncomePage) => {
    const catchRoutes = chooseRoute(type.toLowerCase(), isIncomePage)
    return map(catchRoutes, (route) =>
        route.subRoutes ? (
            <Route
                exact
                key={uniqueId('route')}
                path={route.path}
                element={route.element}
            >
                {map(route.subRoutes, (subRoute) => (
                    <Route
                        key={uniqueId('sub-route')}
                        path={subRoute.path}
                        element={subRoute.element}
                    />
                ))}
            </Route>
        ) : (
            <Route
                exact
                key={uniqueId('route')}
                path={route.path}
                element={route.element}
            />
        )
    )
}
export default protectedRoutes
