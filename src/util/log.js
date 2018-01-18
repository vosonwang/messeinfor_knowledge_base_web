/*用于在开发环境下打印日志*/
import debug from '../util/debug'
/*TODO update template*/
let log = {};

log.print = (data) => {
  //如果是开发版本，则不输出日志到控制台
  if (debug) {
    console.log(data)
  }
};

export default log
