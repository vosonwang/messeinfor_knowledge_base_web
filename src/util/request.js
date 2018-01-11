import cookie from './cookie'
import store from '../store'
import iView from 'iview'

let Request = {}

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
  let header = new Headers()
  let proData = data

  if (headerArg !== undefined) {
    if (headerArg.id !== undefined) {
      header.append("id", headerArg.id)
    }
  } else {
    proData = JSON.stringify(data)
  }

  try {

    /*判断url是否是admin请求*/
    /*如果是admin，检查cookie中是否存在token，如果存在，则继续，否则中断，弹出登录框*/
    if (url.startsWith("/admin")) {
      let a = cookie.getCookie("Authorization")
      if (!a) {
        store.dispatch('switchLogin', true)
        throw new Error("用户未登录！")
      }
      header.append('Authorization', a)
    }

    /*为发起请求做准备*/
    /*字符串转为大写*/
    let capMethod = method.toUpperCase()


    return await fetch(url, {method: capMethod, body: proData, headers: header}).then(status).then(json)

  } catch (e) {
    switch (e.message) {
      case "Unauthorized":
        iView.Message.error({
          content: "系统超时！",
          duration: 2,
        });
        store.dispatch('switchLogin', true)
        break
      case "用户未登录！":
        console.log("用户未登录")
        break
      default:
        iView.Message.error({
          content: "出错了！请联系管理员，错误信息：" + e.message,
          duration: 2,
        });
    }
  }
}

export default Request;
