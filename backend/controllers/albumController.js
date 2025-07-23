
import {v2 as cloudinary} from 'cloudinary'
import albumModel from '../models/albumModel.js';

export const addAlbum = async(req, res)=>{
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const bgColour = req.body.bgColour;

        const imageFile = req.file;
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"});
        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url
        }

        const album = albumModel(albumData);
        await album.save();

        return res.json({success: true, message: "Album added"})
        
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const listAlbum = async(req, res)=>{
    try {
        const allAlbums = await albumModel.find({});
        return res.json({success: true, allAlbums})

    } catch (error) {
        return res.json({success: false, message: error.message})
        
    }
}

export const removeAlbum = async(req, res)=>{
    try {
        await albumModel.findByIdAndDelete(req.body.id);
        return res.json({success: true, message:"Album Removed"})

    } catch (error) {
        return res.json({success: false, message: error.message})
        
    }
}

