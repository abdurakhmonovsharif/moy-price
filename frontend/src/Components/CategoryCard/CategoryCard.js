import { t } from 'i18next'
import {IoCheckmark} from 'react-icons/io5'

function CategoryCard({id, title, code, products, activeCategory, onClick}) {
    return (
        <div className={`category-card ${activeCategory ? 'active-category' : ''}`}
             onClick={() => onClick(id)}>
            <h1 className={`text-black-700 text-base leading-[1.5625rem]`}>{title || t('Nomsiz kategoriya')}</h1>
            <div className={'flex justify-between'}>
                <div className='flex gap-[0.3125rem] items-center'>
                    <p className={'footer-text'}>{t('Kodi')} :</p>
                    <span
                        className={'block rounded-[3.125rem] bg-warning-500 py-[0.125rem] px-[0.625rem] text-xs leading-[0.875rem] text-white-900'}>{code || 0}</span>
                </div>
                <div className='flex gap-[0.3125rem] items-center'>
                    <p className={'footer-text'}>{t('Maxsulot turlari')} :</p>
                    <span
                        className={'block rounded-[3.125rem] bg-success-400 py-[0.125rem] px-[0.625rem] text-xs leading-[0.875rem] text-white-900'}>{products || 0}</span>
                </div>
            </div>
            <div className='category-card-checkmark'>
                <IoCheckmark size={'1rem'} className={'check-icon'} />
            </div>
        </div>
    )
}

export default CategoryCard