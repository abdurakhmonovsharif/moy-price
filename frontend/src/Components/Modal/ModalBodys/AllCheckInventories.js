import React, {useEffect, useRef, useState} from 'react'
import PrintBtn from '../../Buttons/PrintBtn'
import {useReactToPrint} from 'react-to-print'
import InventoriesCheck from '../../InventoriesCheck/InventoriesCheck'
import SmallLoader from '../../Spinner/SmallLoader'

function AllCheckInventories({product}) {

    const [loadInventory, setLoadInventory] = useState(false)
    const [selled, setSelled] = useState([])
    const [returned, setReturned] = useState([])
    const [selledDiscounts, setSelledDiscounts] = useState([])
    const [returnedDiscounts, setReturnedDiscounts] = useState([])
    const [selledPayments, setSelledPayments] = useState([])
    const [returnedPayments, setReturnedPayments] = useState([])
    const saleCheckRef = useRef(null)
    const onBeforeGetContentResolve = useRef(null)
    const handleOnBeforeGetContent = React.useCallback(() => {
        setLoadInventory(true)
        return new Promise((resolve) => {
            onBeforeGetContentResolve.current = resolve

            setTimeout(() => {
                setLoadInventory(false)
                resolve()
            }, 2000)
        })
    }, [setLoadInventory])
    const reactToPrintContent = React.useCallback(() => {
        return saleCheckRef.current
    }, [saleCheckRef.current])
    const print = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: 'All Check Inventories',
        onBeforeGetContent: handleOnBeforeGetContent,
        removeAfterPrint: true
    })

    useEffect(() => {
        if (loadInventory && typeof onBeforeGetContentResolve.current === 'function') {
            onBeforeGetContentResolve.current()
        }
    }, [onBeforeGetContentResolve.current, loadInventory])

    return (
        <section className='w-[27cm] mt-4 mx-auto'>
            {loadInventory &&
                <div
                    className='fixed backdrop-blur-[2px] left-0 right-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>}
            <InventoriesCheck
                ref={saleCheckRef}
                data={product}
            />
            <div className='flex justify-center items-center mt-6'>
                <PrintBtn onClick={print} isDisabled={loadInventory} />
            </div>
        </section>
    )
}

export default AllCheckInventories



