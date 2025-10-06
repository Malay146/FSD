import React from 'react'
import { useState } from 'react'

function Home() {

    const [Count, setCount] = useState(0);
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    

return (
    <>
        <div className="w-screen h-screen flex flex-col justify-center items-center font-[Montserrat]">
            <h1 className='text-[4rem] font-bold m-4'>Count : {Count}</h1>
            <div className='flex gap-4 text-[1.25rem] mb-4'>
                <button className='border-[1px] border-black py-2 px-4 rounded-xl' onClick={() => setCount(0)}>Reset</button>
                <button className='border-[1px] border-black py-2 px-4 rounded-xl' onClick={() => setCount(Count + 1)}>Increment</button>
                <button className='border-[1px] border-black py-2 px-4 rounded-xl' onClick={() => setCount(Count - 1)}>Decrement</button>
                <button className='border-[1px] border-black py-2 px-4 rounded-xl' onClick={() => setCount(Count + 5)}>Increment 5</button>
            </div>
            <h1 className='text-[4rem] font-bold font-[Montserrat] mb-4'>Welcome to Charusat</h1>
            <div className="mb-4">
                <p className='text-[1.25rem] m-2'>First Name : <input type="text" className='border-[1px] border-black rounded-lg px-2' value={firstName} onChange={(e) => {setfirstName(e.target.value)}}/></p>
                <p className='text-[1.25rem] m-2'>Last Name : <input type="text" className='border-[1px] border-black rounded-lg px-2' value={lastName} onChange={(e) => {setlastName(e.target.value)}}/></p>
            </div>
            <div className="text-[1.25rem]">
                <p>First Name : {firstName}</p>
                <p>Last Name : {lastName}</p>
            </div>
        </div>
    </>
    )
}

export default Home