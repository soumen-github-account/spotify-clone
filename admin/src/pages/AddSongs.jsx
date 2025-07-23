import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { RxCrossCircled } from "react-icons/rx";
import { singerData } from '../../../frontend/src/assets/assets'

// export const url = 'http://localhost:8000'
export const url = 'https://spotify-server-eight.vercel.app'

const tags = [
  "Todey's biggest hit",'Popular albums and singles', 'Recomendet for Today','Sad hindi songs Mood off 💔'
]

const AddSongs = () => {

    const [image, setImage] = useState(false)
    const [song, setSong] = useState(false)
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [album, setAlbum] = useState("none")
    const [loading, setLoading] = useState(false)
    const [singer, setSinger] = useState('');

    const [selectedTags, setSelectedTags] = useState([]);

    const [albumData, setAlbumData] = useState([])

    const onSubmitHandler = async(e)=>{
        e.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData();

            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('image', image);
            formData.append('audio', song);
            formData.append('album', album);
            formData.append('tags', JSON.stringify(selectedTags));
            formData.append('artist', singer)

            const response = await axios.post(`${url}/api/song/add`, formData, {headers: {
              'Content-Type': 'multipart/form-data'
            }})
            if(response.data.success){
                toast.success("Song Added");
                console.log(response.data.message)
            } else{
                toast.error(response.data.message)
                console.log(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }finally{
            setLoading(false)
        }
    }

  const [data, setData] = useState([])

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

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };


  useEffect(()=>{
      fetchAlbums()
  },[])

  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
        <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'>
        </div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
      <div className='flex gap-8'>
        <div className='flex flex-col gap-4'>
            <p>Upload Song</p>
            <input onChange={(e)=>setSong(e.target.files[0])} type="file" id='song' accept='audio/*' hidden />

            <label htmlFor="song">
                <img src={song ? assets.upload_added : assets.upload_song} className='w-24 cursor-pointer' alt="" />
            </label>
        </div>
        <div className='flex flex-col gap-4'>
            <p>Upload Image</p>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
            <label htmlFor="image">
                <img src={image ? URL.createObjectURL(image) : assets.upload_area} className='w-24 cursor-pointer' alt="" />
            </label>
        </div>
      </div>
      <div className='flex flex-col gap-2.5'>
        <p>Song name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[70vw]' placeholder='Type Here' type="text" />
      </div>
      <div className='flex flex-col gap-2.5'>
        <p>Song description</p>
        <input onChange={(e)=>setDesc(e.target.value)} value={desc} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[70vw]' placeholder='Type Here' type="text" />
      </div>

      <h1>Add Tags</h1>
      <div className='flex flex-wrap gap-5'>
      {
        tags.map((tag, index) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <div 
              key={index}
              onClick={() => !isSelected && handleTagClick(tag)}
              className={`border flex items-center gap-2 px-4 py-1.5 rounded-full cursor-pointer transition-all 
                ${isSelected ? 'bg-green-100 border-green-600' : 'border-gray-500'}
              `}
            >
              <span>{tag}</span>
              {isSelected && (
                <RxCrossCircled
                  className='text-red-500'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(tag);
                  }}
                />
              )}
            </div>
          );
        })
      }
    </div>

      <h1>Choose Singer</h1>
    <div className='flex flex-wrap gap-4'>
      {
        singerData.map((item, index)=>(
          <div onClick={()=>setSinger(item.id)} key={index} className={`cursor-pointer rounded-md p-2 ${singer===item.id ? 'bg-green-100 border border-green-600' : ''}`}>
            <img src={item.image} className='md:w-30 w-20 rounded-full' alt="" />
            <p className='text-center'>{item.name}</p>
          </div>
        ))
      }
    </div>

      <div className='flex flex-col gap-2.5'>
        <p>Album</p>
        <select onChange={(e)=>setAlbum(e.target.value)} defaultValue={album} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]'>
            <option value="none">None</option>
            {
              data.map((item, index)=>(
                <option key={index} value={item.name}>{item.name}</option>
              ))
            }
        </select>
      </div>
      <button type='submit' className='text-base bg-black text-white py-2.5 px-14 cursor-pointer'>ADD</button>
    </form>
  )
}

export default AddSongs
