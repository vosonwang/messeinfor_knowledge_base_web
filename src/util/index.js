import moment from "moment";

let util = {};
util.title = function (title) {
  title = title ? title : 'Coming . . . . .';
  window.document.title = title
};

/*向目录树每个节点中添加"扩展"和"激活"两个值*/
util.addAttr = (data) => {
  data.forEach(function (v) {
    v.active = false;
    v.expand = true
  });
  return data
};

util.hasAlias = (data) => {
  data.forEach(function (v) {
    if (v.alias_id !== '00000000-0000-0000-0000-000000000000') {
      v.title = v.title + ' *'
    }
  });
  return data
};

/*
* 组织目录树
* * arrObj 必须是数组对象，且不能为空
* 将一纬度数组对象转换为无限层级的Tree形数组对象* */
util.combine = (rows) => {
  function exists(rows, parentId) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === parentId) return true
    }
    return false
  }

  let nodes = [];
  // get the top level nodes
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    if (!exists(rows, row.parent_id)) {
      nodes.push(row)
    }
  }

  let toDo = [];
  for (let i = 0; i < nodes.length; i++) {
    toDo.push(nodes[i])
  }
  while (toDo.length) {
    let node = toDo.shift();   // the parent node
    // get the children nodes
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      if (row.parent_id === node.id) {
        let child = row;
        if (node.children) {
          node.children.push(child)
        } else {
          node.children = [child]
        }
        toDo.push(child)
      }
    }
  }
  return nodes
};

/*转换语言的代号*/
util.langParse = (lang) => {
  switch (typeof lang) {
    case 'string':
      switch (lang) {
        case "zh-CN":
          return 0;
        case "en-US":
          return 1;
      }
      break;
    case 'number':
      switch (lang) {
        case 0:
          return "zh-CN";
        case 1:
          return "en-US";
      }
      break;
  }
};

util.convertCST = (cst) => {
  if (cst === undefined) {
    return ""
  }
  if (cst.includes('+08:00')) {
    return moment(cst).format('YYYY-MM-DD HH:mm:ss')
  } else {
    return moment(cst).utc().format('YYYY-MM-DD HH:mm:ss')
  }
};

export default util
