import {useSelector} from 'react-redux'

function Avatar({border = false, navbarExpended, director = null}) {
    const user = useSelector((state) => state.login.user)
    const checkImageHas = (image) => {
        return image.indexOf('http://') === 0 || image.indexOf('https://') === 0
    }
    return (
        <>
            {border && director ? (
                <div className={'flex items-center gap-[1.25rem] p-[1.25rem]'}>
                    <div className='avatar-border rounded-[50%] p-[0.625rem] overflow-hidden'>
                        <div
                            className={`avatar-image flex items-center justify-center w-[50px] h-[50px] rounded-full overflow-hidden`}
                        >
                            {director.image && checkImageHas(director.image) ? (
                                <img
                                    src={director.image}
                                    alt={director.firstname}
                                    className={'pointer-events-none'}
                                />
                            ) : (
                                `${
                                    director.firstname[0].toUpperCase() +
                                    director.lastname[0].toUpperCase()
                                }`
                            )}
                        </div>
                    </div>
                    <div className={`flex flex-col gap-[5px]`}>
                        <h4
                            className={
                                'text-black-900 leading-[1.4375rem] text-xl'
                            }
                        >
                            {director.firstname} {director.lastname}
                        </h4>
                        <p
                            className={
                                'text-black-700 text-base leading-[1.1875rem]'
                            }
                        >
                            {director.type}
                        </p>
                    </div>
                </div>
            ) : (
                <div className={`w-full flex items-center gap-[10px]`}>
                    <div
                        className={`avatar-image flex items-center justify-center transition-all ease-linear duration-300 w-[50px] h-[50px] rounded-full overflow-hidden shadow-[0_10px_10px_rgba(0,0,0,0.15)]`}
                    >
                        {user?.image && checkImageHas(user?.image) ? (
                            <img
                                src={user?.image}
                                alt={user?.firstname}
                                className={'pointer-events-none'}
                            />
                        ) : (
                            `${user?.firstname[0].toUpperCase() + user?.lastname[0].toUpperCase()}`
                        )}
                    </div>
                    <div
                        className={`transition-all ease-in duration-200 avatar-info flex flex-col gap-[5px] ${
                            navbarExpended
                                ? 'w-0 invisible opacity-0 ml-[10%]'
                                : 'opacity-100 visible w-max'
                        }`}
                    >
                        <h4 className={'text-black-900 font-medium'}>
                            {user?.firstname[0].toUpperCase() + user?.firstname.slice(1)} {user?.lastname[0].toUpperCase() + user?.lastname.slice(1)}
                        </h4>
                        <p className={'text-black-700 text-xs leading-[14px]'}>
                            {user.type}
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Avatar
