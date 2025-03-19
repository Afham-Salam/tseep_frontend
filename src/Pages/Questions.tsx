import React, { useState } from 'react'

type Props = {}

export default function Questions({}: Props) {
    const [sidebarVisible, setSidebarVisible] = useState(true);
  return (
    <div> <aside
    className={`${
      sidebarVisible
        ? "w-72 border-r border-gray-500 sm:relative absolute"
        : "w-0 sm:w-0 sm:relative"
    } h-screen md:p-4 p-2 transition-all duration-300 bg-black z-40`}
  >
    {sidebarVisible && (
      <>
        <div className="flex justify-between items-center">
          <div className="text-gray-300 font-bold text-lg mb-4">
            ChatBot
          </div>
          <button
            onClick={() => setSidebarVisible(false)}
            className="text-white text-xl"
          >
            {/* <IoIosClose /> */}
          </button>
        </div>
       
        
      </>
    )}
  </aside>
</div>
  )
}