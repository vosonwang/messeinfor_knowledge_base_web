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
};


const json = (response) => {
  return response.json()
};

Request.fetchAsync = async (url, method, data) => {
  log.print('Request：' + method + ":" + url);
  let payload = {};

  //method字符串转为大写
  payload.method = method.toUpperCase();

  if (data) {
    //判断是否是上传文件，如果不是则将数据转为json
    if (!url.startsWith("/admin/images") && !url.startsWith("/admin/files")) {
      payload.body = JSON.stringify(data)
    } else {
      payload.body = data
    }
  }


  try {

    /*判断url是否是admin请求*/
    /*如果是admin，检查cookie中是否存在token，如果存在，则继续，否则中断，弹出登录框*/
    if (url.startsWith("/admin")) {
      let a = cookie.getCookie("Authorization");
      if (!a) {
        throw new Error("用户未登录！")
      } else {
        let header = new Headers();
        header.append('Authorization', a);
        payload.headers = header
      }
    }


    return await fetch(url, payload).then(status).then(json)


  } catch (e) {
    switch (e.message) {
      case "Unauthorized":
        log.print('Request：登录超时！');
        store.dispatch('switchLogin', true);
        break;
      case "用户未登录！":
        log.print('Request：用户未登录！');
        store.dispatch('switchLogin', true);
        break;
      default:
        log.print('Request：请求异常，异常信息：' + e.message);
    }
  }
};

export default Request;
