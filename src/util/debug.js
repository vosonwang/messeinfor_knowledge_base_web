//检查是否是开发版本，导出以供全局使用
const debug = process.env.NODE_ENV === 'development';
export default debug
