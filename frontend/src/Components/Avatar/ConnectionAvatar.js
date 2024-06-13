import {useSelector} from 'react-redux'

function ConnectionAvatar({border = false, navbarExpended, director = null}) {
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
                </div>
            )}
        </>
    )
}

export default ConnectionAvatar
