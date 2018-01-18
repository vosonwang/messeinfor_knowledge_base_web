import cookie from './cookie'
import store from '../store'
import log from '../util/log'

let Request = {};


const status = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  }
  else {
    return Promise.reject(new Error(response.statusText))
  }
}


const json = (response) => {
  return response.json()
}

Request.fetchAsync = async (url, method, data, headerArg) => {
  let header = new Headers(),
    //method字符串转为大写
    capMethod = method.toUpperCase(), proData = data;


  if (!url.startsWith("/admin/images") && !url.startsWith("/admin/files")) {
    proData = JSON.stringify(data)
  }


  if (headerArg !== undefined && headerArg.id !== undefined) {
    header.append("id", headerArg.id)
  }


  try {

    /*判断url是否是admin请求*/
    /*如果是admin，检查cookie中是否存在token，如果存在，则继续，否则中断，弹出登录框*/
    if (url.startsWith("/admin")) {
      let a = cookie.getCookie("Authorization");
      if (!a) {
        throw new Error("用户未登录！")
      }
      header.append('Authorization', a)
    }

    if (capMethod === 'GET') {
      return await fetch(url, {method: capMethod, headers: header}).then(status).then(json)
    } else {
      return await fetch(url, {method: capMethod, body: proData, headers: header}).then(status).then(json)
    }

  } catch (e) {
    switch (e.message) {
      case "Unauthorized":
      case "用户未登录！":
        store.dispatch('switchLogin', true);
        break;
      default:
        log.print(e.message);
    }
  }
}

export default Request;
