import Modal from 'react-modal'
import ModalHeader from './ModalHeader'
import Approve from './ModalBodys/Approve'
import UploadExcel from './ModalBodys/UploadExcel'
import Sell from './ModalBodys/Sell.js'
import Complate from './ModalBodys/Complate.js'
import RegisterIncomingModal from './ModalBodys/RegisterIncomingModal'
import Check from './ModalBodys/Check.js'
import AllChecks from './ModalBodys/AllChecks.js'
import StepperPage from './ModalBodys/StepperPage.js'
import AdminMarkets from './ModalBodys/AdminMarkets.js'
import { SavedSalesCheck } from '../SaleCheck/SavedSalesCheck.js'
import ExchangesBody from './ModalBodys/ExchangesBody'
import { useTranslation } from 'react-i18next'
import SalesList from './ModalBodys/SalesList'
import TotalReports from '../TotalReports/TotalReports.js'
import { SavedIncomingsCheck } from '../SaleCheck/SavedIncomingsCheck.js'
import RequestConnection from './ModalBodys/RequestConnection.js'
import RequestApplication from './ModalBodys/ReuqestApplication.js'
import SendingApplication from './ModalBodys/SendingApplication.js'
import { SavedOrdersCheck } from '../OrdersCheck/SavedOrdersCheck.js'
import DebtComment from './ModalBodys/DebtComment'
import ChangeComment from './ModalBodys/ChangeComment'
import { DailySaleCheck } from './ModalBodys/DailySaleCheck.js'
import MiniSaleDebtPaymentCheck from './ModalBodys/MiniSaleDebtPaymentCheck.js'

function UniversalModal({
    isOpen,
    toggleModal,
    body,
    approveFunction,
    closeModal,
    excelData,
    headers,
    setCreatedData,
    createdData,
    headerText,
    title,
    product,
    changeProduct,
    currency,
    printedSelling,
    printedIncomings,
    printedInventories,
    payment,
    addMarket,
    incomingreport,
    productreport,
    saleproductsreport,
    totalreports,
    dataObject,
    marketByInn,
    sendingRequests,
    handleDeleteRequest,
    incomingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    order,
    commentText,
    dailyid,
    isSalesList,
}) {
    const { t } = useTranslation(['common'])

    const customStyles = {
        content: {
            width: '90%',
            height: '85%',
            padding: '1.25rem',
            transform: 'auto',
        },
    }
    const modalFull = {
        content: {
            width: '100%',
            height: '100%',
            padding: '1rem',
            transform: 'auto',
        },
    }
    const switchBody = () => {
        switch (body) {
            case 'approve':
                return (
                    <Approve
                        headerText={headerText}
                        title={title}
                        approveFunction={approveFunction}
                        toggleModal={toggleModal}
                    />
                )
            case 'complete':
                return (
                    <Complate
                        headerText={headerText}
                        title={title}
                        approveFunction={approveFunction}
                        toggleModal={toggleModal}
                    />
                )
            case 'import':
                return (
                    <UploadExcel
                        excelData={excelData}
                        headers={headers}
                        createdData={createdData}
                        setCreatedData={setCreatedData}
                        approveFunction={approveFunction}
                        toggleModal={toggleModal}
                    />
                )
            case 'addPlus':
                return (
                    <SalesList
                        headers={headers}
                        approveFunction={approveFunction}
                        toggleModal={toggleModal}
                    />
                )
            case 'registerincomingbody':
                return (
                    <RegisterIncomingModal
                        product={product}
                        changeProduct={changeProduct}
                        approveFunction={approveFunction}
                        currency={currency}
                    />
                )
            case 'sell':
                return (
                    <Sell
                        toggleModal={toggleModal}
                        product={product}
                        approveFunction={approveFunction}
                        changeProduct={changeProduct}
                    />
                )
            case 'changeComment':
                return (
                    <ChangeComment
                        commentText={commentText}
                        dailyid={dailyid}
                        toggleModal={toggleModal}
                    />
                )
            case 'checkSell':
                return <Check returned={false} product={product} />
            case 'checkSellReturn':
                return <Check returned={true} product={product} />
            case 'checkOrder':
                return <Check isOrder={true} order={order} />
            case 'checkPayment':
                return <Check payment={payment} isPayment={true} />
            case 'allChecks':
                return <AllChecks product={printedSelling} />
            case 'allChecksWithDetails':
                return <AllChecks allDetails={true} product={printedSelling} />
            case 'addMarket':
                return <StepperPage addMarket={addMarket} />
            case 'filterBranch':
                return (
                    <AdminMarkets
                        product={product}
                        approveFunction={approveFunction}
                        toggleModal={toggleModal}
                    />
                )
            case 'savedsalescheck':
                return <SavedSalesCheck product={printedSelling} />
            case 'savedorderscheck':
                return <SavedOrdersCheck order={order} />
            case 'savedincomingscheck':
                return <SavedIncomingsCheck incomings={printedIncomings} />
            case 'totalReport':
                return (
                    <div className={'flex items-center justify-center'}>
                        <TotalReports
                            currencyType={currency}
                            incomingreport={incomingreport}
                            productreport={productreport}
                            saleproductsreport={saleproductsreport}
                            totalreports={totalreports}
                        />
                    </div>
                )
            // case 'checkInventory':
            //     return <AllCheckInventories product={printedInventories} />
            case 'exchanges':
                return (
                    <ExchangesBody
                        approveFunction={approveFunction}
                        toggleModal={toggleModal}
                        dataObject={dataObject}
                    />
                )
            case 'requestconnection':
                return (
                    <RequestConnection
                        approveFunction={approveFunction}
                        toggleModal={closeModal}
                        market={marketByInn}
                    />
                )
            case 'sendingApplication':
                return (
                    <SendingApplication
                        sendingRequests={sendingRequests}
                        handleDeleteRequest={handleDeleteRequest}
                    />
                )
            case 'requestApplication':
                return (
                    <RequestApplication
                        incomingRequests={incomingRequests}
                        handleDeleteRequest={handleDeleteRequest}
                        handleAcceptRequest={handleAcceptRequest}
                        handleRejectRequest={handleRejectRequest}
                    />
                )
            case 'debtcomment':
                return <DebtComment toggleModal={toggleModal} />
            case 'dailySaleCheck':
                return (
                    <DailySaleCheck
                        data={printedSelling}
                        isSalesList={isSalesList}
                    />
                )
            case 'oneSaleDebtPayments':
                return <MiniSaleDebtPaymentCheck data={payment} type={'one'} />
            case 'allSaleDebtPayments':
                return <MiniSaleDebtPaymentCheck data={payment} type={'all'} />
            case 'allDebtPayedCheck':
                return <MiniSaleDebtPaymentCheck data={payment} type={'debtPayed'} />
            default:
                return t('Bunday jadval topilmadi')
        }
    }
    return (
        <Modal
            isOpen={isOpen}
            style={
                body === 'checkSell' ||
                    body === 'allChecks' ||
                    body === 'addMarket' ||
                    body === 'filterBranch'
                    ? { ...modalFull }
                    : body === 'exchanges'
                        ? { content: { width: '70%' } }
                        : body === 'approve' ||
                            body === 'complete' ||
                            body === 'requestconnection'
                            ? {}
                            : { ...customStyles }
            }
            onRequestClose={closeModal || toggleModal}
            closeTimeoutMS={100}
            contentLabel='Example Modal'
            appElement={document.getElementById('root') || undefined}
        >
            <ModalHeader toggleModal={closeModal || toggleModal} />
            {switchBody()}
        </Modal>
    )
}

export default UniversalModal
