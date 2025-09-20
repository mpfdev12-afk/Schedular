import { useEffect, useState } from "react"
import { fetchDataFromApi } from "../utils/api";

const useFetch = (url,params,id = '')=>{
    const [data,setdata] = useState(null);
    const [loading,setloading] = useState(false);
    const [error,seterror] = useState(null);

    useEffect(()=>{
        setloading(true);
        setdata(null);
        seterror(null);
        fetchDataFromApi(url,params,id).then((res)=>{
            setloading(false);
            setdata(res);
            //console.log(res);
        }).catch((err)=>{
            setloading(false);
            seterror(err);
        })
    },[url,params,id]);

    console.log(data);

    return {data,loading,error};
}

export default useFetch;