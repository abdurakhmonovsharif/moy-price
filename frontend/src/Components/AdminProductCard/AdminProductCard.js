import React from 'react'
import {IoPerson, IoPhonePortrait} from 'react-icons/io5'
import CheckboxCard from '../CheckboxCard/CheckboxCard'

const AdminProductCard = ({market, onchange, isBranch, isConnected}) => {
    return (
        <div className='admin-card flex-[0_0_31.55555555%]'>
            <div className='admin-card-header'>
                <div
                    className={'w-[2.5rem] h-[2.5rem] mb-[0.625rem] bg-white-900 rounded-full border-[2px] border-primary-700 flex items-center justify-center p-[2px] shadow-[0_10px_10px_rgba(0,0,0,0.05)]'}>
                    {market?.image ? <img src={market?.image} alt={market?.name}
                                          className={'rounded-full'} /> : market?.name[0].toUpperCase()}
                </div>
                <div className='admin-header-paragraf'>
                    <p>{market?.name}</p>
                </div>
            </div>
            <div className='admin-users'>
                <div className='admin-users-data'>
                    <p><IoPerson size={'24px'} color={'rgba(255, 255, 255, 0.7'} /></p>
                    <div className='admin-users-name'>
                        <p>{market?.director?.firstname}</p>
                    </div>
                </div>
                <div className='admin-users-data'>
                    <p><IoPhonePortrait size={'24px'} color={'rgba(255, 255, 255, 0.7'} /></p>
                    <div className='admin-users-name'>
                        <p>{market?.phone1}</p>
                    </div>
                </div>
            </div>
            <div className='admin-users-checkbox'>
                <CheckboxCard text={'Aloqa'} market={market} onchange={onchange} value={isConnected} />
                <CheckboxCard text={'Filial'} market={market} onchange={onchange} value={isBranch} />
            </div>
        </div>
    )
}

export default AdminProductCard