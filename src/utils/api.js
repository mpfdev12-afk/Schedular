import axios from "axios"
import { toast } from "react-toastify";

const base_url = 'http://localhost:8000/api/v1'

export const fetchDataFromApi = async (url,params,id='')=>{
    try {
        const {data} = await axios.get(base_url+url,{
            params,
            withCredentials:true
        })
    
        return data;
    }
    catch (error) {
        //console.log(error);
    }
}

export const sendDataToapi = async (url,body,header,params)=>{
    try {
        const result = await axios.post(base_url + url,body,{
            headers: {
                'Content-Type': header || 'multipart/form-data',
            },
            params,
            withCredentials:true, // Ensure cookies are sent with the request (Imp)
        });
        return result;
    } catch (error) {
        throw error;
    }
}

export const updateDatatoapi = async (url,body,header)=>{
    try {
        const result = await axios.patch(base_url + url,body,{
            headers: {
                'Content-Type': header || 'multipart/form-data',
            },
            withCredentials:true, // Ensure cookies are sent with the request (Imp)
        });
        return result;
    } catch (error) {
        throw error;
    }
}

export const deleteDataFromApi = async (url)=>{
    try{
        const result = await axios.delete(base_url+url);
        return result;
    }catch(err){
        throw err
    }
}