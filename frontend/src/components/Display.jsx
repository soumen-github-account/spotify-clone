import React, { useContext, useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import { PlayContext } from '../contexts/PlayerContext'
import SingersAlbum from './SingersAlbum'
import { singerData } from '../assets/assets'
import SongFace from './SongFace'
const Display = () => {
  const {albumsData} = useContext(PlayContext)
  const scrollPositions = useRef({})

  const displayRef = useRef()
  const location = useLocation()
  const isAlbum = location.pathname.includes("album")
  const isSingerAlbum = location.pathname.includes("singerAlbum")

  // const albumId = isAlbum ? location.pathname.slice(-1) : "";
  const albumId = isAlbum ? location.pathname.split("/").pop() : "";
  const singerAlbumId = isSingerAlbum ? location.pathname.split('/').pop() : '';

  // const bgColor = albumsData[Number(albumId)].bgColor
  const bgColor = isAlbum && albumsData.length > 0 ? albumsData.find((x)=>(x._id == albumId)).bgColour : "#121212"
  
  const singerBgColour = isSingerAlbum
    ? singerData.find((x) => x.id === singerAlbumId)?.bgColour || '#113F67'
    : '#113F67';
  
  useEffect(()=>{
    if(isAlbum){
      displayRef.current.style.background = `linear-gradient(${bgColor},#121212)`
    } else if(isSingerAlbum){
      displayRef.current.style.background = `linear-gradient(${singerBgColour},#113F67)`
    } else{
      displayRef.current.style.background = '#121212'
    }
  })

  // Save scroll before route change
  useEffect(() => {
    return () => {
      if (displayRef.current) {
        scrollPositions.current[location.pathname] = displayRef.current.scrollTop
      }
    }
  }, [location.pathname])

  //Restore scroll on route change
  useEffect(() => {
    const savedScroll = scrollPositions.current[location.pathname]
    if (displayRef.current && savedScroll !== undefined) {
      displayRef.current.scrollTop = savedScroll
    }
  }, [location.pathname])

  return (
    <div ref={displayRef} className='w-[100%] m-2 px-2 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
      {albumsData.length > 0
      ?
      <Routes>
        <Route path='/' element={<DisplayHome />} />
        <Route path='/album/:id' element={<DisplayAlbum album={albumsData.find((x) => (x._id == albumId))} />} />
        <Route path='/singerAlbum/:id' element={<SingersAlbum />} />
        <Route path='/songFace' element={<SongFace />} />
      </Routes>
      : null
      }
    </div>
  )
}

export default Display
