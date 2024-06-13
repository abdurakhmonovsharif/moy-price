import React, {useEffect, useRef, useState} from 'react'
import PrintBtn from '../../Buttons/PrintBtn'
import {useReactToPrint} from 'react-to-print'
import {SaleCheckAll} from '../../SaleCheck/SaleCheckAll.js'
import SmallLoader from '../../Spinner/SmallLoader.js'
import {filter} from 'lodash'
import {SmallCheck} from './SmallCheck'
import {IoPrint} from 'react-icons/io5'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { SaleCheckAll2 } from '../../SaleCheck/SaleCheckAll2.js'
import { SmallCheck2 } from './SmallCheck2.js'

function AllCheck({product,allDetails}) {
    // detect mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [loadContent, setLoadContent] = useState(false)
    const [selled, setSelled] = useState([])
    const [returned, setReturned] = useState([])
    const [selledDiscounts, setSelledDiscounts] = useState([])
    const [returnedDiscounts, setReturnedDiscounts] = useState([])
    const [selledPayments, setSelledPayments] = useState([])
    const [returnedPayments, setReturnedPayments] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const saleCheckRef = useRef()
    const saleSmallCheckRef1 = useRef()
    const saleSmallCheckRef2 = useRef()
    const onBeforeGetContentResolve = useRef(null)

    const handleOnBeforeGetContent = React.useCallback((e) => {
        setLoadContent(true)
        return new Promise((resolve) => {
            onBeforeGetContentResolve.current = resolve

            setTimeout(() => {
                setLoadContent(false)
                resolve()
            }, 2000)
        })
    }, [setLoadContent])

    const reactToPrintContent = () => {
        return saleCheckRef.current?.cloneNode(true)
    }

    const reactToPrintContent2 = () => {
        return allDetails?saleSmallCheckRef2.current?.cloneNode(true):saleSmallCheckRef1.current?.cloneNode(true)
    }

    const print = useReactToPrint({
        content: () => reactToPrintContent(),
        documentTitle: 'All Checks',
        onBeforeGetContent: handleOnBeforeGetContent,
        removeAfterPrint: false,
        // for A4 printer
        pageStyle: '@page { size: A4; margin: 0mm; }'
    })

    const printMobile = useReactToPrint({
        content: () => reactToPrintContent(),
        documentTitle: 'All Checks',
        onBeforeGetContent: handleOnBeforeGetContent,
        removeAfterPrint: false,
        // for A4 printer
        pageStyle: '@page { size: A4; margin: 0mm; }',
        print: async (printIframe) => {
            setLoadContent(true)
            try {
                const document = printIframe.contentDocument
                const body = document.body

                const canvas = await html2canvas(body, {
                    useCORS: true,
                    allowTaint: true,
                    scrollX: 0,
                    scrollY: 0,
                    onclone: (document) => {
                        const body = document.body
                        body.style.overflow = 'hidden'
                        body.style.width = '21cm'
                        body.style.height = '29.7cm'
                        body.style.padding = '0'
                        body.style.margin = '0'
                        body.style.border = 'none'
                    }
                })

                const imgData = canvas.toDataURL('image/png')
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    format: 'a4'
                })
                const width = pdf.internal.pageSize.getWidth()
                const height = pdf.internal.pageSize.getHeight()
                pdf.addImage(imgData, 'JPEG', 0, 0, width, height)
                await pdf.save(product?.client ? `${product.client.name}.pdf` : product?.saleconnector ? `${product.saleconnector.id}.pdf` : product?.id ? `${product.id}.pdf` : `${new Date().toISOString()}.pdf`, {returnPromise: true})
            } catch (e) {
                console.log(e)
            } finally {
                setLoadContent(false)
            }
        }
    })

    const print2 = useReactToPrint({
        content: () => reactToPrintContent2(),
        documentTitle: 'All Checks',
        onBeforeGetContent: handleOnBeforeGetContent,
        removeAfterPrint: false
    })

    useEffect(() => {
        if (
            loadContent &&
            typeof onBeforeGetContentResolve.current === 'function'
        ) {
            onBeforeGetContentResolve.current()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onBeforeGetContentResolve.current, loadContent])
    useEffect(() => {
        setSelled(filter(product?.products, (item) => item.pieces > 0))
        setReturned(filter(product?.products, (item) => item.pieces < 0))
        setSelledDiscounts(
            filter(product?.discounts, (item) => item.discount > 0)
        )
        setReturnedDiscounts(
            filter(product?.discounts, (item) => item.discount < 0)
        )
        setSelledPayments(filter(product?.payments, (item) => item.payment > 0))
        setReturnedPayments(
            filter(product?.payments, (item) => item.payment < 0)
        )
        setUserInfo(product?.user)
    }, [product])
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <section className='w-[27cm] mt-4 mx-auto'>
            {loadContent && (
                <div
                    className='fixed backdrop-blur-[2px] left-0 right-0 bg-white-700 flex flex-col items-center justify-center w-full h-full'>
                    <SmallLoader />
                </div>
            )}
            <div className='hidden md:block'>
                {allDetails?<SaleCheckAll2
                    ref={saleCheckRef}
                    returned={returned}
                    selled={selled}
                    selledDiscounts={selledDiscounts}
                    returnedDiscounts={returnedDiscounts}
                    selledPayments={selledPayments}
                    returnedPayments={returnedPayments}
                    product={product}
                    userInfo={userInfo}
                />:<SaleCheckAll
                ref={saleCheckRef}
                returned={returned}
                selled={selled}
                selledDiscounts={selledDiscounts}
                returnedDiscounts={returnedDiscounts}
                selledPayments={selledPayments}
                returnedPayments={returnedPayments}
                product={product}
                userInfo={userInfo}
            />}
            </div>
            <div className='hidden'>
         <SmallCheck2
                    ref={saleSmallCheckRef2}
                    returned={returned}
                    selled={selled}
                    selledDiscounts={selledDiscounts}
                    returnedDiscounts={returnedDiscounts}
                    selledPayments={selledPayments}
                    returnedPayments={returnedPayments}
                    product={product}
                    userInfo={userInfo}
                /><SmallCheck
                ref={saleSmallCheckRef1}
                returned={returned}
                selled={selled}
                selledDiscounts={selledDiscounts}
                returnedDiscounts={returnedDiscounts}
                selledPayments={selledPayments}
                returnedPayments={returnedPayments}
                product={product}
                userInfo={userInfo}
            />
            </div>
            <div className='flex justify-center md:justify-between items-center mt-6 '>
                <div className={'hidden md:inline'}>
                    <button

                        className={`group print-btn-style ml-auto min-w-max ${loadContent ? 'pointer-events-none' : 'pointer-events-auto'
                        }`}
                        onClick={print2}
                        disabled={loadContent}
                    >
                        <span className='print-text-style'>Xprinter</span>
                        <span className='print-icon-style'>
                            <IoPrint
                                size={'1.125rem'}
                                className='text-primary-800 text-lg transition-all ease-in-out duration-200 group-hover:text-primary-900'
                            />
                        </span>
                    </button>
                </div>
                <div>
                    <PrintBtn onClick={isMobile ? printMobile : print} isDisabled={loadContent} />
                </div>
            </div>
        </section>
    )
}

export default AllCheck
