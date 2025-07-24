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
    const [openSong, setOpenSong] = useState(false)

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


    // useEffect(()=>{
    //     const timer = setTimeout(() => {
    //         if (!audioRef.current) return;
    //         audioRef.current.ontimeupdate = () =>{
    //             if (!audioRef.current || !seekBar.current || !audioRef.current.duration) return;
    //             const progress = Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100);
    //             seekBar.current.style.width = `${progress}%`;
    //             // seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration*100)) + "%";
    //             setTime({
    //                 currentTime:{
    //                     second: Math.floor(audioRef.current.currentTime % 60),
    //                     minute: Math.floor(audioRef.current.currentTime / 60)
    //                 },
    //                 totalTime:{
    //                     second: Math.floor(audioRef.current.duration % 60),
    //                     minute: Math.floor(audioRef.current.duration / 60)
    //                 }
    //             })
    //         }
    //     }, 1000);

    //     return () => {
    //         clearTimeout(timer);
    //         if (audioRef.current) {
    //             audioRef.current.ontimeupdate = null;
    //         }
    //     };
    // },[audioRef, seekBar])
    useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
        const current = audio.currentTime;
        const duration = audio.duration;

        const progress = Math.floor((current / duration) * 100);
        if (seekBar.current) {
            seekBar.current.style.width = `${progress}%`;
        }

        setTime({
            currentTime: {
                second: Math.floor(current % 60),
                minute: Math.floor(current / 60)
            },
            totalTime: {
                second: Math.floor(duration % 60),
                minute: Math.floor(duration / 60)
            }
        });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
}, [track]); // track changes = new song loaded

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


    // const next = async()=>{
    //     // if(track.id<songsData.length-1){
    //     //     await setTrack(songsData[track.id+1])
    //     //     await audioRef.current.play();
    //     //     setPlayStatus(true);
    //     // }

    //     songsData.map(async(item, index)=>{
    //         if(track._id === item._id && index < songsData.length){
    //             await setTrack(songsData[index+1]);
    //             await audioRef.current.play();
    //             setPlayStatus(true);
    //         }
    //     })
    // }

    const next = async () => {
    const currentIndex = songsData.findIndex(item => item._id === track._id);

    if (songsData.length === 0) return;

    let nextIndex;
    if (currentIndex >= 0 && currentIndex < songsData.length - 1) {
        // go to next
        nextIndex = currentIndex + 1;
    } else {
        // end reached → loop to start
        nextIndex = 0;
    }

    const nextTrack = songsData[nextIndex];
    setTrack(nextTrack);

    setTimeout(() => {
        audioRef.current.play();
        setPlayStatus(true);
    }, 100);
};


    // NEW: For draggable seek
    const handleSeekDrag = (clientX) => {
        const seekRect = seekBg.current.getBoundingClientRect();
        const percent = Math.min(Math.max((clientX - seekRect.left) / seekRect.width, 0), 1);
        audioRef.current.currentTime = percent * audioRef.current.duration;
    };

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
        songsData, albumsData,
        openSong, setOpenSong,
        handleSeekDrag
    }
    
    return(
        <PlayContext.Provider value={contextValue}>
            {props.children}
        </PlayContext.Provider>
    )
}

export default PlayContextProvider