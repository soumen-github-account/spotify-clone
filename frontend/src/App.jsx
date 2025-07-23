import React, { useContext } from 'react'
import Sidebar from './components/Sidebar'
import Player from './components/Player'
import Display from './components/Display'
import { PlayContext } from './contexts/PlayerContext'


const App = () => {
  const {audioRef, track, songsData} = useContext(PlayContext)
  return (
    <div className='h-screen bg-black'>
      {songsData.length !== 0 
        ? <>
            <div className='h-[90%] flex'>
              <Sidebar />
              <Display/>
            </div>
            <Player/>
            </>
          :
          null
      }
      
      <audio ref={audioRef} src={track?track.file:""} preload='auto'></audio>

      </div>
  )
}

export default App
