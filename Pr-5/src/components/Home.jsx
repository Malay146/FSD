import React from 'react'
import { useState } from 'react'

function Home() {

  const [input, setInput] = useState('');

  const handleButtonClick = (value) => {
    if (value === 'DEL') {
      setInput((prev) => prev.slice(0, -1));
    } 
    else if(value === 'C'){
      setInput('');
    }
    else if (value === '=') {
      try {
        setInput(eval(input).toString()); // ⚠️ Use with caution; eval() can be dangerous
      } catch {
        setInput('Error');
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  return (
    <>
        <div className="flex justify-center items-center h-screen w-screen font-[Roboto]">
            <div class='main' className='bg-[#131a26] w-[30rem] h-[36rem] rounded-2xl shadow-lg shadow-[#131a26]-500/40'>
                <div class='result' className=" border-white w-full">
                    <input type="text" readOnly value={input} className='p-[2rem] w-full bg-[#131a26] text-white text-4xl text-right spin rounded-2xl'/>
                </div>
                <div class='operator'className="text-white bg-[#d81e5b] w-full h-[5rem] grid grid-cols-6 text-3xl">
                  <button onClick={() => {handleButtonClick('/')}}>/</button>
                  <button onClick={() => {handleButtonClick('*')}}>*</button>
                  <button onClick={() => {handleButtonClick('+')}}>+</button>
                  <button onClick={() => {handleButtonClick('-')}}>-</button>
                  <button onClick={() => {handleButtonClick('DEL')}}>DEL</button>
                  <button onClick={() => {handleButtonClick('C')}}>C</button>
                </div>
                <div class="number" className='text-white w-full h-[24.5rem] grid grid-cols-3 text-3xl'>
                  <button onClick={() => {handleButtonClick('1')}}>1</button>
                  <button onClick={() => {handleButtonClick('2')}}>2</button>
                  <button onClick={() => {handleButtonClick('3')}}>3</button>
                  <button onClick={() => {handleButtonClick('4')}}>4</button>
                  <button onClick={() => {handleButtonClick('5')}}>5</button>
                  <button onClick={() => {handleButtonClick('6')}}>6</button>
                  <button onClick={() => {handleButtonClick('7')}}>7</button>
                  <button onClick={() => {handleButtonClick('8')}}>8</button>
                  <button onClick={() => {handleButtonClick('9')}}>9</button>
                  <button onClick={() => {handleButtonClick('0')}}>0</button>
                  <button onClick={() => {handleButtonClick('.')}}>.</button>
                  <button onClick={() => {handleButtonClick('=')}}>=</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default Home