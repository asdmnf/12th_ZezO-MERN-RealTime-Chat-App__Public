import baseURL from "./baseURL"


export const useDelete = async (url)=>{
  const res = await baseURL.delete(url)
  return res.data
}

export const useDeleteWithToken = async (url)=>{
  const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
  const res = await baseURL.delete(url, config)
  return res.data
}
