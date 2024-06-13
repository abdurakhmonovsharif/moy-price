import React from 'react'
import {motion} from 'framer-motion'

function FilialCard({market, onClick, activeFilial}) {
    return (
        <motion.div
            initial={{y: '100%'}}
            animate={{y: '0%'}}
            transition={{duration: 0.5}}
            className={`flex items-center gap-[1.25rem] p-[1.25rem] border-[2px] border-blue-100 bg-white-900 rounded-[0.5rem] ${
                activeFilial === market.id ? 'bg-[#86A7E9]' : ''
            } hover:bg-[#86A7E9] duration-200 cursor-pointer group`}
            onClick={() => onClick(market)}
        >
            <div
                className={
                    'w-[2.625rem] h-[2.625rem] bg-white-900 rounded-full border-[2px] border-primary-700 flex items-center justify-center p-[2px] shadow-[0_10px_10px_rgba(0,0,0,0.05)]'
                }
            >
                {market?.image ? (
                    <img
                        src={market?.image}
                        alt={market?.filialName}
                        className={'rounded-full'}
                    />
                ) : (
                    market?.filialName[0].toUpperCase()
                )}
            </div>
            <div className={'flex flex-col gap-[0.3125rem] grow'}>
                <h3
                    className={`font-medium text-sm leading-[1rem] text-blue-700 group-hover:text-white-900 durattion-200 ${
                        activeFilial === market.filialName
                            ? 'text-white-900'
                            : ''
                    }`}
                >
                    {market?.filialName}
                </h3>
                <p
                    className={`font-light text-xs leading-[0.875rem] text-black-700 group-hover:text-white-900 durattion-200 ${
                        activeFilial === market.filialName
                            ? 'text-white-900'
                            : ''
                    }`}
                >
                    {market?.directorName} {market?.directorLastName}
                </p>
            </div>
        </motion.div>
    )
}

export default FilialCard
