import baseURL from "./baseURL"


export const usePost = async (url, data)=>{
  const res = await baseURL.post(url, data)
  return res
}

export const usePostWithImage = async (url, formData)=>{
  const config = {headers: {'Content-Type': 'multipart/form-data'} }
  const res = await baseURL.post(url, formData, config)
  return res
}

export const usePostWithToken = async (url, data)=>{
  const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
  const res = await baseURL.post(url, data, config)
  return res
}

export const usePostWithImageWithToken = async (url, formData)=>{
  const config = {
    headers: 
    {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  const res = await baseURL.post(url, formData, config)
  return res
}

