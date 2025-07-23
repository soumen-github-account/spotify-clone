import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { url } from './AddSongs'

const ListAlbum = () => {
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);

  const fetchAlbums = async()=>{
    setLoading(true)
    try {
        const {data} = await axios.get(`${url}/api/album/listAlbum`)
        if(data.success){
            setData(data.allAlbums)
        }
    } catch (error) {
        console.log(error.message)
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
      fetchAlbums()
  },[])

  const removeAlbum = async(id)=>{
      try {
          const {data} = await axios.post(`${url}/api/album/removeAlbum`, {id})
          if(data.success){
              toast.success(data.message);
              await fetchAlbums();
          }
      } catch (error) {
          toast.error(error.message)
          console.log(error.message)
      }
  }
  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
        <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'>
        </div>
    </div>
  ) : (
    <div>
      <p>All Album list</p>
      <br />
      <div>
        <div className='sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100'>
            <b>Image</b>
            <b>Name</b>
            <b>Description</b>
            <b>Album Colour</b>
            <b>Action</b>
        </div>
        {data.map((item, index)=>(
            <div key={index} className='grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 border border-gray-300 text-sm mr-5'>
                <img src={item.image} className='w-12' alt="" />
                <p>{item.name}</p>
                <p>{item.desc}</p>
                <input value={item.bgColour} type="color" />
                <p onClick={()=>removeAlbum(item._id)} className='cursor-pointer'>x</p>
            </div>
        ))}
      </div>
    </div>
  )
}

export default ListAlbum
