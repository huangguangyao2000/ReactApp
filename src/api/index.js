import ajax from './ajax'
import jsonp from 'jsonp'
import CryptoJS from 'crypto-js'

const BASE = ''

export const reqLogin =(username,password)=>ajax('/login',{username,password},'POST');

export const reqWeather = (city)=>{
    
    var UID = "P0LJb5tl8NV5gd3fi";
    var KEY = "SCyRO_G0jnl17wsMR";
    var API = "http://api.seniverse.com/v3/weather/now.json";
    var LOCATION =city; 
    var ts = Math.floor((new Date()).getTime() / 1000);
    var str = "ts=" + ts + "&uid=" + UID;
    var sig = CryptoJS.HmacSHA1(str, KEY).toString(CryptoJS.enc.Base64);
    sig = encodeURIComponent(sig);
    str = str + "&sig=" + sig;
    var url = API + "?location=" + LOCATION + "&" + str ;

    return new Promise((resolve,reject)=>{
        jsonp(url,{
            param:'callback'
        },(error,response)=>{
            const weather = response.results[0].now.text;
            const temperature = response.results[0].now.temperature;
            const cityName = response.results[0].location.name;
            resolve({weather,temperature,cityName})
    })
    })
}

export const reqCategorys = (parentId)=>ajax('/manage/category/list',{parentId})

export const reqAddCategory = (parentId,categoryName)=>ajax('/manage/category/add',{
    parentId,categoryName
},'POST')

export const reqUpdateCategory = ({categoryId,categoryName})=>ajax('/manage/category/update',{
    categoryId,
    categoryName
},'POST') 

export const reqCategory = (categoryId)=>ajax('/manage/category/info',{categoryId})

export const reqProducts = (pageNum,pageSize)=>ajax('/manage/product/list',{pageNum,pageSize})

export const reqSearchProducts=({pageNum,pageSize,searchType,searchName})=>ajax('/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})

export const reqAddOrUpdateProduct= (product)=>ajax('/manage/product/'+
    (product._id?'update':'add'),product,'post'
)

export const reqUpdateProductStatus = (productId,status)=>ajax(
    '/manage/product/updateStatus',{
        productId,
        status
    },'POST'
    )

export const reqDeleteImg = (name)=>ajax('manage/img/delete',name,'POST')

export const reqRoles = () => ajax(BASE + '/manage/role/list')
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')


export const reqUsers = () => ajax(BASE + '/manage/user/list')
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')
