import {configureStore} from '@reduxjs/toolkit'
import LoginReducer from '../Pages/Login/loginSlice'
import CurrencyReducer from '../Pages/Currency/currencySlice'
import ProductsReducer from '../Pages/Products/Create/productSlice'
import UnitsReducer from '../Pages/Units/unitsSlice'
import SuppliersReducer from '../Pages/SupplierPage/suppliersSlice.js'
import CategoryReducer from '../Pages/Category/categorySlice'
import IncomingReducer from '../Pages/Incomings/incomingSlice'
import InventoryReducer from '../Pages/Inventory/inventorySlice'
import InventoryConnectorReducer from '../Pages/Inventories/inventorieSlice.js'
import PackmanReducer from '../Pages/Packman/packmanSlice'
import RegisterSellingReducer from '../Pages/Sale/Slices/registerSellingSlice.js'
import SavedSellingsReducer from '../Pages/Sale/Slices/savedSellingsSlice.js'
import ClientsReducer from '../Pages/Clients/clientsSlice'
import ReportsReducer from '../Pages/Reports/reportsSlice.js'
import SellingsReducer from '../Pages/Sale/Slices/sellingsSlice.js'
import SellersReducer from '../Pages/Seller/sellerSlice'
import BarcodeReducer from '../Pages/Barcode/barcodeSlice.js'
import ExpenseReducer from '../Pages/Expense/expenseSlice'
import AdminProductsReducer from '../Pages/AdminProducts/adminproductsSlice.js'
import ProductReportReducer from '../Pages/ProductReport/productreportSlice.js'
import exchangesReducer from '../Pages/ProductExchanges/productExchangesSlice.js'
import FilialDatasReducer from '../Pages/FilialExchanges/filialExchengesSlice.js'
import ExchangesDataIdReducer from '../Pages/ProductIdExchanges/productIdExchangesSlice.js'
import CategoryReportReducer from '../Pages/CategoryReport/CategoryReportSlice.js'
import ConnectionsReducer from '../Pages/Connection/connectionSlice.js'
import PartnerProductsReducer from '../Pages/Connection/Pages/partnerProductSlice.js'
import RegisterOrdersReducer from '../Pages/Orders/SendingOrders/Slices/registerOrdersSlice.js'
import SavedOrdersReducer from '../Pages/Orders/SendingOrders/Slices/savedOrdersSlice.js'
import OrdersReducer from '../Pages/Orders/SendingOrders/Slices/ordersSlice.js'
import IncomingOrdersReducer from '../Pages/Orders/IncomingOrders/Slices/ordersSlice.js'
import RegisterIncomingOrdersReducer from '../Pages/Orders/IncomingOrders/Slices/registerOrdersSlice.js'

export default configureStore({
    devTools: process.env.NODE_ENV === 'development',
    reducer: {
        login: LoginReducer,
        currency: CurrencyReducer,
        products: ProductsReducer,
        units: UnitsReducer,
        suppliers: SuppliersReducer,
        category: CategoryReducer,
        incoming: IncomingReducer,
        inventories: InventoryReducer,
        inventoryConnectors: InventoryConnectorReducer,
        packmans: PackmanReducer,
        clients: ClientsReducer,
        registerSelling: RegisterSellingReducer,
        savedSellings: SavedSellingsReducer,
        reports: ReportsReducer,
        sellings: SellingsReducer,
        sellers: SellersReducer,
        barcode: BarcodeReducer,
        expense: ExpenseReducer,
        adminmarkets: AdminProductsReducer,
        productReport: ProductReportReducer,
        exchanges: exchangesReducer,
        filialData: FilialDatasReducer,
        exchangesIdData: ExchangesDataIdReducer,
        categoryReport: CategoryReportReducer,
        connections: ConnectionsReducer,
        partnerProducts: PartnerProductsReducer,
        registerOrders: RegisterOrdersReducer,
        savedOrders: SavedOrdersReducer,
        orders: OrdersReducer,
        incomingOrders: IncomingOrdersReducer,
        registerIncomingOrders: RegisterIncomingOrdersReducer,
    },
})
