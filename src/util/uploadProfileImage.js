import { API_ENDPOINTS } from "./ApiEndpoints";

const CLOUDNARY_UPLOAD_PRESET="moneymanager"
export const uploadProfileImage=async (image)=>{
    const formdata=new FormData();
    formdata.append("file",image)
    formdata.append("upload_preset",CLOUDNARY_UPLOAD_PRESET)
    try{
        const response=await fetch(API_ENDPOINTS.UPLOAD_IMAGE,{
            method:"POST",
            body:formdata
        });
        if(!response.ok){
            const errordata=await response.json();
            throw new Error("Cloudnary upload failed :",(errordata.error.message || response.statusText))
        }
        const data=await response.json();
        console.log("Image uploaded successfully",data)
        return data.secure_url;

    }
    catch(error){
        console.error("error while uploading the image",error)
    }
}