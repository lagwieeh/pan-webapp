"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./App.css"
import { PackageSearch, UserRoundSearch, ClipboardList } from "lucide-react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-gray-50">
      {/* <Link to={'/'}>Home</Link> */}
      <div className="sections flex justify-center gap-2 p-4 md:p-6 flex-col sm:flex-row ">
        <Link
          to={"/products"}
          className="product section bg-gray-50 flex flex-col items-center text-[#9d7871] hover:text-[#7d4b45] hover:border-current hover:bg-[#fffef5] p-10 rounded-xl border transition-all"
        >
          <PackageSearch />
          <span>Productos</span>
        </Link>
        <Link
          disabled="disabled"
          to={"/customers"}
          className="client section bg-gray-50 flex flex-col items-center text-[#9d7871] hover:text-[#7d4b45] hover:border-current hover:bg-[#fffef5] p-10 rounded-xl border transition-all"
        >
          <UserRoundSearch />
          <span>Clientes</span>
        </Link>
        <Link
          to={"/lotes"}
          className="lotes section bg-gray-50 flex flex-col items-center text-[#9d7871] hover:text-[#7d4b45] hover:border-current hover:bg-[#fffef5] p-10 rounded-xl border transition-all"
        >
          <ClipboardList />
          <span>Lotes</span>
        </Link>
      </div>
    </div>
  )
}

export default App

