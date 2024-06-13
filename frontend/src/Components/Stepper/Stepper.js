import {IoCheckmark} from 'react-icons/io5'
import {motion} from 'framer-motion'
import {uniqueId, map} from 'lodash'
const Stepper = ({steps, currentStep, bgActive}) => {
    const displaySteps = map(steps,(step, index) => {
        return (
            <div
                key={uniqueId('stepper')}
                className={
                    index !== steps.length - 1
                        ? 'w-full flex items-center'
                        : 'flex items-center'
                }
            >
                <div className='flex flex-col items-center relative text-white-900 text-[0.75rem]'>
                    <div
                        className={`rounded-full transition duration-500 ease-in-out  flex justify-center items-center h-[1.875rem] w-[1.875rem] ${
                            step.stepIndex !== currentStep && bgActive ? 'bg-[#12B76A]' : step.stepIndex === currentStep ? ' bg-primary-700' : " bg-black-200"
                        }`}
                    >
                        {step.stepIndex !== currentStep && bgActive ? (
                            <motion.span 
                              className='text-white-900'
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.25 }}
                              >
                                <IoCheckmark size={"1rem"}/>
                            </motion.span>
                        ) : (
                            <span 
                            className='text-white-900'
                            >
                             {index + 1}
                          </span>  
                        )}
                    </div>
                </div>

                <div
                    className={`border-t-2 flex-auto transition duration-500 ease-in-out  ${
                        step.stepIndex !== currentStep && bgActive
                            ? 'border-success-400'
                            : 'border-black-100'
                    }`}
                >
                </div>
            </div>
        )
    })

    return (
        <section className='w-[18.75rem] mx-auto mb-[3.75rem]'>
            <div className='px-[2rem] py-[0.625rem]'>
                <div className='flex justify-between items-center'>
                    {displaySteps}
                </div>
            </div>
            <div className='flex justify-between'>
                {map(steps,(step) => {
                    return (
                        <div
                            key={uniqueId('stepper-2')}
                            className={`font-[25rem] text-[0.875rem] ${
                               step.stepIndex !== currentStep && bgActive ? 'text-[#039855]' : step.stepIndex === currentStep ? ' text-primary-900' : " text-[#111] opacity-50"
                            }`}
                        >
                            {step.title}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default Stepper
