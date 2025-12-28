// No longer used

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function useContent(){
    const [content, setContents] = useState([]);

    async function fetchContent() {
        await axios.get(`${BACKEND_URL}/api/v1/content`, {
            headers: {
                Authorization: localStorage.getItem("token") || ""
            }
        }).then((response) => {
            setContents(response.data.contents);
        })
    }
    useEffect(() =>{
        fetchContent();
    }, [])

    return { content, fetchContent };
}