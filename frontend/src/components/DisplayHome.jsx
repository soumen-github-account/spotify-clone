import React, { useContext } from 'react'
import Navbar from './Navbar'
// import { albumsData, songsData } from '../assets/assets'
import AlbumItem from './AlbumItem'
import SongIcon from './SongIcon'
import { PlayContext } from '../contexts/PlayerContext'
import { singerData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import AppDownload from './AppDownload'
import SongFace from './SongFace'
import { AnimatePresence } from 'framer-motion';

const DisplayHome = () => {
    const {songsData, albumsData, openSong, setOpenSong} = useContext(PlayContext)
    const navigate = useNavigate();
    
  return (
    <div className='relative'>
        <Navbar />
        <div className='mb-4'>
            <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
            <div className='flex overflow-auto'>
                {albumsData.map((item,index)=>(<AlbumItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />))}
            </div>
        </div>

        <SongIcon tag="Todey's biggest hit" />
        <SongIcon tag="Popular albums and singles" />
        <SongIcon tag="Recomendet for Today" />
        <SongIcon tag="Sad hindi songs Mood off 💔" />
        

        <div className='mb-4'>
            <h1 className='my-5 font-bold text-2xl'>Popular artists</h1>
            <div className='flex overflow-auto'>
                {singerData.map((item,index)=>(
                    <div key={index} onClick={()=>{navigate(`/singerAlbum/${item.id}`); scrollTo(0,0)}} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
                        <img className='rounded-full' src={item.image} alt="" />
                        <p className='font-bold mt-2 mb-1 text-center'>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>

        <AppDownload />
        {/* <AnimatePresence>
            {openSong && <SongFace />}
        </AnimatePresence> */}
    </div>
  )
}

export default DisplayHome
