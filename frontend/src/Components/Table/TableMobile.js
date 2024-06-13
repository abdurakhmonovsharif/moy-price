import { PackmanTableRow } from './TableRows/PackmanTableRow'
import { SellerTableRow } from './TableRows/SellerTableRow'
import { CategoryTableRow } from './TableRows/CategoryTableRow'
import { RegisterIncomingTableRow } from './TableRows/RegisterIncomingTableRow'
import { InventoriesTableRow } from './TableRows/InventoriesTableRow'
import { InventoryTableRow } from './TableRows/InventoryTableRow'
import { ProductReportTableRow } from './TableRows/ProductReportTableRow'
import { ProductTableRow } from './TableRows/ProductTableRow'
import { SupplierTableRow } from './TableRows/SupplierTableRow'
import { UnitTableRow } from './TableRows/UnitTableRow'
import Thead from './Thead'
import { IncomingsTableRow } from './TableRows/IncomingsTableRow'
import { RegisterSaleTableRow } from './TableRows/RegisterSaleTableRow'
import { TemporaryIncomingsTableRow } from './TableRows/TemporaryIncomingsTableRow'
import { TemporarySaleTableRow } from './TableRows/TemporarySaleTableRow'
import { SalesListTableRow } from './TableRows/SalesListTableRow'
import { ClientTableRow } from './TableRows/ClientTableRow'
import { ExchangenerateTableRow } from './TableRows/ExchangenerateTableRow'
import { SaleReturnTableRow } from './TableRows/SaleReturnTableRow'
import { CashierSaleTableRow } from './TableRows/CashierSaleTableRow'
import { PaymentsTableRow } from './TableRows/PaymentsTableRow'
import { IncomeTableRow } from './TableRows/IncomeTableRow'
import { DebtsTableRow } from './TableRows/DebtsTableRow'
import { DiscountTableRow } from './TableRows/DiscountTableRow'
import { ExpensesTableRow } from './TableRows/ExpensesTableRow'
import { BarcodeTableRow } from './TableRows/BarcodeTableRow.js'
import { AdminProductTableRow } from './TableRows/AdminProductTableRow'
import { ReturnProductsTableRow } from './TableRows/ReturnProductsTableRow.js'
import { GeneralReportTableRow } from './TableRows/GeneralReportTableRow.js'
import { RegisterSaleTableFooter } from './TableFooters/RegisterSaleTableFooter.js'
import { FilialShopTableRow } from './TableRows/FilialShopTableRow'
import DailyReport from './TableRows/DailyReport.js'
import SupplierIncomingsTableRow from './TableRows/SupplierIncomingsTableRow'
import { FilialShopDataIdTableRow } from './TableRows/FilialShopDataIdTablerow'
import { CategoryReportTableRow } from './TableRows/CategoryReportTableRow'
import { MarketProductsTableRow } from './TableRows/MarketProductsTableRow'
import { PartnerProductsTableRow } from './TableRows/PartnerProductsTableRow'
import { RegisterOrdersTableRow } from './TableRows/RegisterOrdersTableRow'
import { OrderProductsTableRow } from './TableRows/OrderProductsTableRow'
import { SavedOrdersTableRow } from './TableRows/SavedOrdersTableRow.js'
import { RegisterIncomingOrdersTableRow } from './TableRows/RegisterIncomingOrdersTableRow.js'
import { IncomingOrderProductsTableRow } from './TableRows/IncomingOrderProductsTableRow.js'
import { ReceiveOrderProductsTableRow } from './TableRows/ReceiveOrderProductsTableRow.js'
import { LabelsIncome } from './TableRows/LabelsIncome'
import { CategoryTableMobileRow } from './TableRows/CetegoryTableMobileRow.js'
import { ProductMobileTableRow } from './TableRows/ProductMobileTableRow.js'
import { CategoryReportMobileTableRow, ProductReportMobileTableRow } from './TableRows/CategoryReportMobileTableRow.js'
import DailyReportMobile from './TableRows/DailyReportMobile.js'
import ProductMinimum from '../../Pages/ProductReport/ProductMinimum.js'
import { ProductMinimumTableRow } from './ProductMinimumTableRow.js'
function TableMobile({
    page,
    data,
    headers,
    currentPage,
    countPage,
    Sort,
    Edit,
    Delete,
    productId,
    currency,
    changeHandler,
    Print,
    inputValue,
    inputDisabled,
    Excel,
    editedIncoming,
    saveEditIncoming,
    sortItem,
    ReturnPayment,
    Save,
    onKeyUp,
    currencyType,
    type,
    Pay,
    isDisabled,
    reports,
    onClickTableRow,
    linkToSellerReports,
    sellers,
    addPlus,
    footer,
    increment,
    decrement,
    lowUnitpriceProducts,
    linkToSupplierReport,
    printedData,
    productminimumpage,
    handleDelete,
    wholeSale,
    handleShowProduct,
    updatePosition,
    handleCountProduct,
    handleUnitPrice,
    selectedFilial,
    editComment,
    startDate,
    endDate,
    modalOpen,
    productModal,
    modalOpen1,
    totalDebt
}) {
    const checkRows = () => {
        switch (page) {
            case 'product':
                return (
                    <ProductMobileTableRow
                        currencyType={currencyType}
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                        currency={currency}
                        productminimumpage={productminimumpage}
                        modalOpen={modalOpen}
                    />
                )
                case 'productMinimum':
                return (
                    <ProductMinimumTableRow
                        currencyType={currencyType}
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currency}
                        productminimumpage={productminimumpage}
                    />
                )
            case 'adminProduct':
                return (
                    <AdminProductTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                        onClickTableRow={onClickTableRow}
                        handleDelete={handleDelete}
                    />
                )
            case 'category':
                return (
                    <CategoryTableMobileRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                        endDate={endDate}
                        startDate={startDate}
                    />
                )
            case 'unit':
                return (
                    <UnitTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                    />
                )
            case 'supplier':
                return (
                    <SupplierTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                        linkToSupplierReport={linkToSupplierReport}
                    />
                )
            case 'productreport':
                return (
                    <ProductReportTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                        currency={currency}
                        changeHandler={changeHandler}
                        Print={Print}
                        printedData={printedData}
                    />
                )
            case 'labelsincome':
                return (
                    <LabelsIncome
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                        currency={currency}
                        changeHandler={changeHandler}
                        Print={Print}
                        printedData={printedData}
                    />
                )
            case 'registerincoming':
                return (
                    <RegisterIncomingTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        changeHandler={changeHandler}
                        Delete={Delete}
                        currency={currency}
                    />
                )
            case 'inventory':
                return (
                    <InventoryTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        changeHandler={changeHandler}
                        inputDisabled={inputDisabled}
                        Save={Save}
                        onKeyUp={onKeyUp}
                    />
                )
            case 'inventories':
                return (
                    <InventoriesTableRow
                        isDisabled={isDisabled}
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Excel={Excel}
                        Print={Print}
                    />
                )
            case 'incomings':
                return (
                    <IncomingsTableRow
                        Edit={Edit}
                        Delete={Delete}
                        changeHandler={changeHandler}
                        editedIncoming={editedIncoming}
                        saveEditIncoming={saveEditIncoming}
                        data={data}
                        currency={currency}
                        currentPage={currentPage}
                        countPage={countPage}
                        onKeyUp={onKeyUp}
                    />
                )
            case 'registersale':
                return (
                    <RegisterSaleTableRow
                        data={data}
                        productId={productId}
                        productModal={productModal}
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currency}
                        Delete={Delete}
                        changeHandler={changeHandler}
                        decrement={decrement}
                        increment={increment}
                        lowUnitpriceProducts={lowUnitpriceProducts}
                        wholeSale={wholeSale}
                        selectedFilial={selectedFilial}
                    />
                )
            case 'temporaryincoming':
                return (
                    <TemporaryIncomingsTableRow
                        data={data}
                        Edit={Edit}
                        Delete={Delete}
                        Print={Print}
                        currency={currency}
                    />
                )
            
                case 'temporarysale':
                return (
                    <TemporarySaleTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currency}
                        Edit={Edit}
                        Delete={Delete}
                        Print={Print}
                    />
                )
            case 'saleslist':
                return (
                    <SalesListTableRow
                        data={data}
                        currency={currency}
                        currentPage={currentPage}
                        countPage={countPage}
                        Print={Print}
                        ReturnPayment={ReturnPayment}
                        sellers={sellers}
                        addPlus={addPlus}
                        editComment={editComment}
                    />
                )
            case 'client':
                return (
                    <ClientTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                        Print={Print}
                        type={type}
                    />
                )
            case 'packman':
                return (
                    <PackmanTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                    />
                )
            case 'seller':
                return (
                    <SellerTableRow
                        modalOpen1={modalOpen1}
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        linkToSellerReports={linkToSellerReports}
                        currency={currency}
                    />
                )
            case 'exchange':
                return (
                    <ExchangenerateTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                    />
                )
            case 'backproduct':
                return (
                    <SaleReturnTableRow
                        onKeyUp={onKeyUp}
                        changeHandler={changeHandler}
                        inputValue={inputValue}
                        currency={currency}
                        data={data}
                    />
                )
            case 'sale':
                return (
                    <CashierSaleTableRow
                        currency={currency}
                        currentPage={currentPage}
                        countPage={countPage}
                        data={data}
                        Print={Print}
                    />
                )
            case 'payments':
                return (
                    <PaymentsTableRow
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currency}
                        data={data}
                        type={type}
                        Print={Print}
                    />
                )
            case 'card':
                return (
                    <PaymentsTableRow
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currency}
                        data={data}
                        type={type}
                    />
                )
            case 'transfer':
                return (
                    <PaymentsTableRow
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currency}
                        data={data}
                        type={type}
                    />
                )
            case 'income':
                return (
                    <IncomeTableRow
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currency}
                        data={data}
                        Print={Print}
                    />
                )
            case 'debts':
                return (
                    <DebtsTableRow
                        data={data}
                        currency={currency}
                        Pay={Pay}
                        Print={Print}
                        Edit={Edit}
                        totalDebt={totalDebt}
                    />
                )
            case 'discounts':
                return (
                    <DiscountTableRow
                        data={data}
                        currency={currency}
                        currentPage={currentPage}
                        countPage={countPage}
                    />
                )
            case 'expenses':
                return (
                    <ExpensesTableRow
                        data={data}
                        currency={currency}
                        currentPage={currentPage}
                        countPage={countPage}
                        Delete={Delete}
                        reports={reports}
                    />
                )
            case 'barcode':
                return (
                    <BarcodeTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Edit={Edit}
                        Delete={Delete}
                    />
                )
            case 'backproducts':
                return (
                    <ReturnProductsTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currency}
                        Print={Print}
                    />
                )
            case 'filialShop':
                return (
                    <FilialShopTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currency}
                    />
                )
            case 'filialShopDataId':
                return (
                    <FilialShopDataIdTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        currency={currency}
                    />
                )
            case 'generalreport':
                return <GeneralReportTableRow data={data} currency={currency} />
            case 'dailyreport':
                return <DailyReportMobile data={data} />
            case 'incomingsupplier':
                return (
                    <SupplierIncomingsTableRow
                        data={data}
                        currency={currency}
                        currentPage={currentPage}
                        countPage={countPage}
                        Pay={Pay}
                    />
                )
            case 'categoryreport':
                return <CategoryReportMobileTableRow data={data} />
            case 'marketProducts':
                return (
                    <MarketProductsTableRow
                        handleShowProduct={handleShowProduct}
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                    />
                )
            case 'partnerProducts':
                return (
                    <PartnerProductsTableRow
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                    />
                )
            case 'registerOrder':
                return (
                    <RegisterOrdersTableRow
                        currency={currency}
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Print={Print}
                    />
                )
            case 'registerIncomingOrder':
                return (
                    <RegisterIncomingOrdersTableRow
                        currency={currency}
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        Print={Print}
                        updatePosition={updatePosition}
                    />
                )
            case 'orderProducts':
                return (
                    <OrderProductsTableRow
                        increment={increment}
                        decrement={decrement}
                        currency={currency}
                        data={data}
                        handleDelete={handleDelete}
                        handleCountProduct={handleCountProduct}
                    />
                )
            case 'receiveOrderProducts':
                return (
                    <ReceiveOrderProductsTableRow
                        increment={increment}
                        decrement={decrement}
                        currency={currency}
                        data={data}
                        handleCountProduct={handleCountProduct}
                    />
                )
            case 'incomingOrderSendProduct':
                return (
                    <IncomingOrderProductsTableRow
                        data={data}
                        increment={increment}
                        decrement={decrement}
                        currency={currency}
                        handleDelete={handleDelete}
                        handleCountProduct={handleCountProduct}
                        handleUnitPrice={handleUnitPrice}
                    />
                )
            case 'savedOrders':
                return (
                    <SavedOrdersTableRow
                        Delete={Delete}
                        data={data}
                        currentPage={currentPage}
                        countPage={countPage}
                        handlePrint={Print}
                    />
                )
            default:
                return (
                    <tr>
                        <td colSpan={7} className='text-black-500 py-2 pl-4'>
                            Ushbu nomdagi javval mavjud emas
                        </td>
                    </tr>
                )
        }
    }

    const checkFooters = () => {
        switch (footer) {
            case 'registersale':
                return (
                    <RegisterSaleTableFooter
                        saleproducts={data}
                        currency={currency}
                    />
                )
            default:
                return ''
        }
    }
    return (
        <table className='overflow-x-auto w-full  mt-2  pb-[1.25rem]  max-h-[35rem] mb-[1rem] flex flex-wrap justify-center '>
            {/* <thead className='rounded-t-lg sticky '>
                <Thead headers={headers} Sort={Sort} sortItem={sortItem} />
            </thead> */}
            <tbody>{checkRows()}</tbody>
            {footer && <tfoot>{checkFooters()}</tfoot>}
        </table>
    )
}

export default TableMobile
