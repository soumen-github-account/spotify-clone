import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AddSongs from './pages/AddSongs'
import AddAlbum from './pages/AddAlbum'
import ListSongs from './pages/ListSongs'
import ListAlbum from './pages/ListAlbum'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className='flex items-start min-h-screen'>
      <ToastContainer />
      <Sidebar />
      <div className='flex-1 h-screen overflow-scroll bg-[#F3FFF7]'>
        <Navbar />
        <div className='pt-8 pl-5 sm:pt-12 sm:pl-12'>
          <Routes>
            <Route path='/add-song' element={<AddSongs />} />
            <Route path='/add-album' element={<AddAlbum />} />
            <Route path='/list-song' element={<ListSongs />} />
            <Route path='/list-album' element={<ListAlbum />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
