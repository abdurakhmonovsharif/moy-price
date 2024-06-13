import React, {useCallback, useEffect, useState} from 'react'
import Input from '../../Components/Inputs/Input'
import BtnAddRemove from '../../Components/Buttons/BtnAddRemove'
import {useDispatch} from 'react-redux'
import {getsmsApiKey, smsApiKey} from '../Seller/sellerSlice'
import {universalToast} from '../../Components/ToastMessages/ToastMessages'

const SmsApi = () => {
    const [apiKeyInputValue, setApiKeyInputValue] = useState('loading...');
    const dispatch = useDispatch();

    const getApiKey = useCallback(async () => {
        const { payload } = await dispatch(getsmsApiKey());
        setApiKeyInputValue(payload.api_key||"");

    }, [dispatch]);

    useEffect(() => {
        getApiKey();
    }, [getApiKey]);

    const handleSaveUserApiKey = useCallback(async () => {
        await dispatch(smsApiKey({ key: apiKeyInputValue })).then(({ payload }) => {
            console.log(payload);
            universalToast(payload.message, 'success');
            getApiKey();
        });
    }, [dispatch, apiKeyInputValue, getApiKey]);

    return (
        <div className={` w-full h-full `}>
            <div className='w-full h-full flex flex-col gap-y-3 items-center justify-start pt-20'>
                <div className='w-[50%]'>
                    <Input
                        disabled={apiKeyInputValue === 'loading...'}
                        label={'Sms Api key'}
                        value={apiKeyInputValue}
                        onChange={({target}) =>
                            setApiKeyInputValue(target.value)
                        }
                        placeholder={apiKeyInputValue===""?"Api mavjud emas":""}
                    />
                </div>
                <div className='w-[50%]'>
                    <BtnAddRemove
                        onClick={handleSaveUserApiKey}
                        disabled={apiKeyInputValue === 'loading...'}
                        text={'Saqlash'}
                        edit={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default SmsApi
