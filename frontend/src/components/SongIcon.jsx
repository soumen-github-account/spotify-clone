import React, { useContext, useEffect, useState } from 'react'
import { PlayContext } from '../contexts/PlayerContext'

const SongIcon = ({tag}) => {
  const {playWithId, songsData} = useContext(PlayContext)

  const [songs, setSongs] = useState([]);
  
  useEffect(() => {
    if (Array.isArray(songsData)) {
      const filtered = songsData.filter(song => song.tags.includes(tag));
      setSongs(filtered);
    }
  }, [songsData, tag]);

  return (
    <div className='mb-4'>
      <h1 className='my-5 font-bold text-2xl'>{tag}</h1>
      <div className='flex overflow-auto'>
          {songs.map((item,index)=>(
            // <SongIcon key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} 
            // />
            <div onClick={()=>playWithId(item._id)} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
              <img className='rounded' src={item.image} alt="" />
              <p className='font-bold mt-2 mb-1 clip1'>{item.name}</p>
              <p className='text-slate-200 text-sm'>{item.desc}</p>
            </div>
            ))}
      </div>
    </div>
  )
}

export default SongIcon
