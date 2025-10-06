import React, { useEffect, useState } from 'react'

function Home() {

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
      <div className="w-screen h-screen flex justify-center items-center flex-col font-['Roboto']">
        <h1 className="text-[5rem] font-semibold m-8">Welcome to Charusat</h1>
        <h1 className="text-[3rem] font-normal">It is {today}</h1>  
        <h1 className="text-[3rem] font-normal">It is {time}</h1>  
      </div>
    </>
  )
}

export default Home;
