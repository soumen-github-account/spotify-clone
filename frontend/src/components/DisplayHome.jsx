import React, { useContext } from 'react'
import Navbar from './Navbar'
// import { albumsData, songsData } from '../assets/assets'
import AlbumItem from './AlbumItem'
import SongIcon from './SongIcon'
import { PlayContext } from '../contexts/PlayerContext'

const DisplayHome = () => {
    const {songsData, albumsData} = useContext(PlayContext)
  return (
    <>
        <Navbar />
        <div className='mb-4'>
            <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
            <div className='flex overflow-auto'>
                {albumsData.map((item,index)=>(<AlbumItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />))}
            </div>
        </div>

        <div className='mb-4'>
            <h1 className='my-5 font-bold text-2xl'>Todey's biggest hits</h1>
            <div className='flex overflow-auto'>
                {songsData.map((item,index)=>(<SongIcon key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />))}
            </div>
        </div>
    </>
  )
}

export default DisplayHome
