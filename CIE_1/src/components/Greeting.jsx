import React, { useState } from 'react'

function Greeting() {

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');

  return (
    <div className='flex justify-center items-center'>
      <div className="p-6 section-1 font-[Montserrat] text-center border-2 border-black rounded-lg m-6">
        <p className='text-[1.5rem] p-4'>First Name: <input placeholder='Enter your first name' className='border-1 border-black rounded-md bg-slate-300' type="text" name="" id="" value={firstName} onChange={(e) => {setfirstName(e.target.value)}}/></p>
        <p className='text-[1.5rem] p-4'>Last Name: <input placeholder='Enter your last name' className='border-1 border-black rounded-md bg-slate-300' type="text" name="" id="" value={lastName} onChange={(e) => {setlastName(e.target.value)}}/></p>
        <h1 className='text-[4rem] font-bold m-4'>Welcome,{firstName} {lastName}!</h1>
      </div>
    </div>
  )
}

export default Greeting