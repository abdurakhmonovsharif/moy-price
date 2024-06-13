import React from 'react'

function NotFind({text}) {
    return (
        <div className={'text-center py-10'}>
            <h3 className={'text-black-300 text-[xl] leading-[1.875rem]'}>
                {text}...
            </h3>
        </div>
    )
}

export default NotFind