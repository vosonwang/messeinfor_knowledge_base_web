import ck from './cookie'
import store from '../store'
import iView from 'iview'

let req = {}

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

req.fetchAsync = async (url, method, data, headerArg) => {
  let header = new Headers()

  if (headerArg !== undefined) {
    header.append(headerArg.key, headerArg.value)
  }


  try {

    /*判断url是否是admin请求*/
    /*如果是admin，检查cookie中是否存在token，如果存在，则继续，否则中断，弹出登录框*/
    if (url.startsWith("/admin")) {
      let a = ck.getCookie("Authorization")
      if (!a) {
        /*弹出登录框，中断*/
        store.dispatch('switchLogin', true)
        throw new Error("用户未登录！")
      }
      header.append('Authorization', a)
    }

    /*为发起请求做准备*/
    /*字符串转为大写*/
    let capMethod = method.toUpperCase()

    if (capMethod !== "GET" && (data == null || data === undefined)) {
      /*请求中未包含数据，中断*/
      throw new Error("请求中未包含数据！")
    }

    let proData = JSON.stringify(data)


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
        store.dispatch('switchLogin', true)
        break
      case "请求中未包含数据！":
        iView.Message.error({
          content: "系统超时！",
          duration: 2,

        });
        break
      default:
        iView.Message.error({
          content: e.message,
          duration: 2,

        });
    }
  }
}

export default req;
