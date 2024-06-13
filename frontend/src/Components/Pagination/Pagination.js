import React from 'react'
import {IoChevronBack, IoChevronForward} from 'react-icons/io5'
import ReactPaginate from 'react-paginate'

const Pagination = ({countPage, totalDatas, setCurrentPage, currentPage}) => {
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(totalDatas / countPage); i++) {
        pageNumbers.push(i)
    }

    const pageHandle = (data) => {
        setCurrentPage(data.selected)
    }

    return (
        <nav className='float-right'>
            <ReactPaginate
                previousLabel={<IoChevronBack width={'7px'} height={'12px'} />}
                forcePage={currentPage}
                nextLabel={<IoChevronForward width={'7px'} height={'12px'} />}
                breakLabel={'...'}
                pageCount={pageNumbers.length}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={pageHandle}
                containerClassName={'flex justify-between items-center'}
                pageClassName={'mr-[15px] text-primary-800'}
                pageLinkClassName={
                    'w-[35px] h-[35px] border border-primary-800 rounded-lg text-sm flex justify-center items-center hover:bg-primary-700 hover:border-primary-700 hover:text-white-900 transition ease-in-out duration-100'
                }
                previousClassName={'mr-[15px]'}
                previousLinkClassName={
                    'w-[35px] h-[35px] border border-primary-800 rounded-lg text-sm text-primary-800 flex justify-center items-center hover:bg-primary-700 hover:border-primary-700 hover:text-white-900 transition ease-in-out duration-100'
                }
                nextClassName={'mr-[15px]'}
                nextLinkClassName={
                    'w-[35px] h-[35px] border border-primary-800 rounded-lg text-sm text-primary-800 flex justify-center items-center hover:bg-primary-700 hover:border-primary-700 hover:text-white-900 transition ease-in-out duration-100'
                }
                breakClassName={'mr-[15px]'}
                breakLinkClassName={
                    'w-[35px] h-[35px] border border-primary-800 rounded-lg text-sm text-primary-800 flex justify-center items-center hover:bg-primary-700 hover:border-primary-700 hover:text-white-900 transition ease-in-out duration-100'
                }
                activeClassName={'mr-[15px]'}
                activeLinkClassName={
                    'border border-primary-800 bg-primary-800 text-white-900'
                }
                disabledLinkClassName={
                    'bg-transparent border-black-100 text-black-100 hover:bg-transparent hover:border-black-100 hover:text-black-100'
                }
            />
        </nav>
    )
}
export default Pagination
