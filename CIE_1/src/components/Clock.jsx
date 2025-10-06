import React, { useEffect, useState } from 'react'

function Clock() {

  const [currentDate, setDate] = useState(new Date());

  const today = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  const time = currentDate.toLocaleTimeString();

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  

  return (
    <>
    <div className="w-full flex justify-center items-center">
      <div className="flex w-[50rem] border-2 border-black rounded-lg justify-center items-center flex-col font-['Roboto']">
        <h1 className="text-[5rem] font-semibold m-8">Live Clock</h1>
        <h1 className="text-[3rem] font-normal">{today}</h1>  
        <h1 className="text-[3rem] font-normal mb-4">{time}</h1>  
      </div>
    </div>
    </>
  )
}

export default Clock;
