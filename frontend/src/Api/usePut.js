import baseURL from "./baseURL"


export const usePut = async (url, data)=>{
  const res = await baseURL.put(url, data) 
  return res 
}

export const usePutWithImage = async (url, formData)=>{
  const config = {headers: {'Content-Type': 'multipart/form-data'} }
  const res = await baseURL.put(url, formData, config)
  return res
}

export const usePutWithToken = async (url, data)=>{
  const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
  const res = await baseURL.put(url, data, config) 
  return res 
}

export const usePutWithImageWithToken = async (url, formData)=>{
  const config = {
    headers: 
    {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  const res = await baseURL.put(url, formData, config)
  return res
}

