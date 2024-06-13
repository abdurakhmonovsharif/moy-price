import {useEffect} from 'react'
import {IoChevronForward} from 'react-icons/io5'
// import {GoPrimitiveDot} from 'react-icons/go'
import {NavLink} from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import {map} from 'lodash'

function SubAccordionLink({
                              submenu,
                              id,
                              path,
                              label,
                              activeSecondSubMenuId,
                              handleClickSecondMenu,
                              globalPath
                          }) {
    const navLinkClasses = ({isActive}) => {
        return `flex items-center rounded-[4px] gap-[5px] py-[5px] pl-[0.625rem] leading-[1.1875rem] transition-all ease-in-out duration-200 text-base ${
            isActive ? 'text-warning-500' : 'text-black-700 hover:bg-black-100'
        }`
    }
    useEffect(() => {
        if (globalPath.includes(path.split('/')[1])) {
            handleClickSecondMenu(id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, id])
    const {t} = useTranslation(['common'])

    return (
        <>
            <button
                className={`w-full flex items-center transition ease-in-out duration-100 py-[5px] px-[0.9375rem] rounded-[4px] border-b-[1px] gap-x-[5px] ${
                    globalPath.includes(path.split('/')[1])
                        ? 'bg-primary-700 text-white-900 border-primary-800'
                        : 'border-transparent text-black-700 hover:bg-black-100'
                }`}
                onClick={() => handleClickSecondMenu(id)}
            >
                <span
                    className={`transition ease-in-out duration-200 ${
                        activeSecondSubMenuId === id ? 'rotate-90' : ''
                    }`}
                >
                    <IoChevronForward size={'0.875rem'} />
                </span>
                <span className={'text-base leading-[1.1875rem]'}>{t(label)}</span>
            </button>
            <div
                className={`transition-all ease-in-out duration-300 overflow-hidden flex flex-col border-b-[1px] border-b-[rgba(184,186,185,1)] pl-[1.875rem] ${
                    activeSecondSubMenuId === id
                        ? 'max-h-screen opacity-100 py-[0.625rem]'
                        : 'max-h-0 opacity-0'
                }`}
            >
                {map(submenu, (subitem) => (
                    <NavLink
                        key={subitem.id}
                        to={subitem.path}
                        className={navLinkClasses}
                    >
                        
                        <span>{t(subitem.label)}</span>
                    </NavLink>
                ))}
            </div>
        </>
    )
}

export default SubAccordionLink