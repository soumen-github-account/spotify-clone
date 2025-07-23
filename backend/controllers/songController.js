
import {v2 as cloudinary} from 'cloudinary'
import songModel from '../models/songModel.js';

export const addSong = async(req, res)=>{
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const album = req.body.album;
        const artist = req.body.artist;
        const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
        if(!Array.isArray(tags) || tags.length === 0){
            return res.json({success: false, message:"tags required"})
        }

        const imageFile = req.files.image[0];
        const audioFile = req.files.audio[0];

        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {resource_type:"video"})
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"});
        const duration = `${Math.floor(audioUpload.duration/60)}:${Math.floor(audioUpload.duration%60)}`

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            artist,
            tags,
            duration
        }

        const song = songModel(songData);
        await song.save();

        return res.json({success: true, message: "Song added"})

    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

export const listSong = async(req, res)=>{
    try {
        const allSong = await songModel.find({});
        return res.json({success: true, songs:allSong})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

export const removeSong = async(req, res)=>{
    try {
        await songModel.findByIdAndDelete(req.body.id);
        return res.json({success:true, message: "Song Removed"})
        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}