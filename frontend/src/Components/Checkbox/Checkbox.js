import {IoCheckmark} from 'react-icons/io5'

function Checkbox({onChange, value, label, id}) {
    return (
        <div className={'checkbox'}>
            <input type='checkbox' className={'hidden'} id={id} onChange={onChange} checked={value} />
            <label htmlFor={id}>
                <span className={'checkbox-icon'}><IoCheckmark size={'1rem'} /></span>
            </label>
            <span className={'checkbox-label'}>{label}</span>
        </div>
    )
}

export default Checkbox