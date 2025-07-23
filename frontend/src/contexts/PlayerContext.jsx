import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";
import axios from 'axios'

export const PlayContext = createContext();

const PlayContextProvider = (props) =>{
    const audioRef = useRef()
    const seekBg = useRef()
    const seekBar = useRef()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [songsData, setSongsData]  = useState([])
    const [albumsData, setAlbumsData] = useState([])

    const [track, setTrack] = useState(songsData[1])
    const [playStatus, setPlayStatus] = useState(false)
    const [time, setTime] = useState({
        currentTime:{
            second:0,
            minute:0
        },
        totalTime:{
            second:0,
            minute:0
        }
    })

    const play = ()=>{
        audioRef.current.play();
        setPlayStatus(true)
    }

    const pause = ()=>{
        audioRef.current.pause()
        setPlayStatus(false)
    }

    const playWithId = async(id)=>{
        // await setTrack(songsData[id])
        // await audioRef.current.play();
        // setPlayStatus(true)
        await songsData.map((item)=>{
            if(id === item._id){
                setTrack(item);
            }
        })

        await audioRef.current.play();
        setPlayStatus(true)
    }
    const seekSong = async(e)=>{
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    }

    const getSongData = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/song/list')
            if(data.success){
                setSongsData(data.songs)
                setTrack(data.songs[0])
            } else{
                console.log(data.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const getAlbumData = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/album/listAlbum')
            if(data.success){
                setAlbumsData(data.allAlbums)
            }
        } catch (error) {
            console.log(error.message)
        }
    }


    useEffect(()=>{
        setTimeout(() => {
            audioRef.current.ontimeupdate = () =>{
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration*100)) + "%";
                setTime({
                    currentTime:{
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime:{
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                })
            }
        }, 1000);
    },[audioRef])
    const previous = async()=>{
        // if(track.id>0){
        //     await setTrack(songsData[track.id-1])
        //     await audioRef.current.play();
        //     setPlayStatus(true);
        // }

        songsData.map(async(item, index)=>{
            if(track._id === item._id && index > 0){
                await setTrack(songsData[index-1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }
    const next = async()=>{
        // if(track.id<songsData.length-1){
        //     await setTrack(songsData[track.id+1])
        //     await audioRef.current.play();
        //     setPlayStatus(true);
        // }

        songsData.map(async(item, index)=>{
            if(track._id === item._id && index < songsData.length){
                await setTrack(songsData[index+1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }

    useEffect(()=>{
        getSongData();
        getAlbumData();
    },[])

    const contextValue = {
        audioRef,seekBar,seekBg,
        track,setTrack,playStatus,setPlayStatus,
        time,setTime,play,pause,
        playWithId, previous,next,
        seekSong, backendUrl,
        songsData, albumsData
    }
    
    return(
        <PlayContext.Provider value={contextValue}>
            {props.children}
        </PlayContext.Provider>
    )
}

export default PlayContextProvider