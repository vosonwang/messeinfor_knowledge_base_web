let util = {};
util.title = function (title) {
  title = title ? title : 'Messeinfor Knowledge Base';
  window.document.title = title
};

util.addAttr = (data) => {
  data.forEach(function (v) {
    v.active = false;
    v.expand = true
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

export default util
