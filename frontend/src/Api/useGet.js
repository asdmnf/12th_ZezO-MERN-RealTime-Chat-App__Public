import baseURL from "./baseURL"


export const useGet = async (url)=>{
  const res = await baseURL.get(url)
  return res.data
}

export const useGetWithToken = async (url)=>{
  const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
  const res = await baseURL.get(url, config)
  return res.data
}