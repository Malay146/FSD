import React from 'react'
import { useState } from 'react'

function Counting() {

    const [Count, setCount] = useState(0);
    

return (
    <>
    <div className="flex justify-center items-center w-full mb-6">
        <div className=" w-[50rem] border-2 border-black rounded-lg flex flex-col justify-center items-center font-[Montserrat]">
            <h1 className='text-[4rem] font-bold m-4'>Count : {Count}</h1>
            <div className='flex gap-4 text-[1.25rem] mb-4'>
                <button className='border-[1px] border-black py-2 px-4 rounded-xl' onClick={() => setCount(0)}>Reset</button>
                <button className='border-[1px] border-black py-2 px-4 rounded-xl' onClick={() => setCount(Count + 1)}>Increment</button>
                <button className='border-[1px] border-black py-2 px-4 rounded-xl' onClick={() => setCount(Count - 1)}>Decrement</button>
                <button className='border-[1px] border-black py-2 px-4 rounded-xl' onClick={() => setCount(Count + 5)}>Increment 5</button>
            </div>
        </div>
        </div>
    </>
    )
}

export default Counting