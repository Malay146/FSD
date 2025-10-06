import React, {useEffect, useState } from 'react'

function Feedback() {

    const [exe,setexe] = useState(0);
    const [good,setgood] = useState(0);
    const [average,setaverage] = useState(0);
    const [poor,setpoor] = useState(0);

     useEffect(() => {
        const timer = setInterval(() => {
          setexe(exe + 1);
          setgood(good + 1);
          setaverage(average + 1);
          setpoor(poor + 1);
        }, 2000);
    
        return () => clearInterval(timer);
      },);

  return (
    <div className="flex justify-center items-center w-full">
    <div className='flex w-[50rem] border-2 border-black rounded-lg justify-center items-center flex-col m-6 p-4'>
        <div className="text-center">
            <h1 className='font-[Montserrat] text-[4rem] font-bold'>Feedback</h1>
            <button className='p-2 border-2 border-black rounded-lg m-2' onClick={() => setexe(exe + 1)}>Excellent</button>
            <button className='p-2 border-2 border-black rounded-lg m-2' onClick={() => setgood(exe + 1)}>Good</button>
            <button className='p-2 border-2 border-black rounded-lg m-2' onClick={() => setaverage(exe + 1)}>Average</button>
            <button className='p-2 border-2 border-black rounded-lg m-2' onClick={() => setpoor(exe + 1)}>Poor</button>
        </div>
        <div className="">
            <h1>Excellent: {exe}</h1>
            <h1>Good: {good}</h1>
            <h1>Average: {average}</h1>
            <h1>Poor: {poor}</h1>
        </div>
    </div>
    </div>
  )
}

export default Feedback