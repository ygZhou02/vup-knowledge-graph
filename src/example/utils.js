// find links by node => [ links ] | null
// import Vups from './jsondata.js'
import Vups from './vups.json'
import Groups from './groups.json'
// import Moes from './moes.json'
export const findLinks = (nodeId, links) => {
  let nodeLinks = []
  for (let link of links) {
    if (link.sid === nodeId || link.tid === nodeId) nodeLinks.push(link)
  }
  return (nodeLinks.length) ? nodeLinks : null
}
export const findNode = (nodes, nodeId) => {
  let index = nodeExists(nodeId)
  if (index) {
    return nodes[index]
  }
  return null
}
// removes node by id => () => ( [newNodes] )
export const removeNode = (nodeId, nodes, cb) => {
  let index = nodes.findIndex(
    (node) => { return node.id === nodeId }
  )
  if (index > -1) {
    nodes.splice(index, 1)
    cb(nodes)
  } else {
    cb(null)
  }
}

// removes orphaned links => { newLinks, removed }
export const rebuildLinks = (nodes, links) => {
  let newLinks = []
  let removed = []
  for (let link of links) {
    if (nodeExists(link.sid, nodes) && nodeExists(link.tid, nodes)) {
      newLinks.push(link)
    } else {
      removed.push(link)
    }
  }
  return { newLinks, removed }
}

// removes unlinked nodes => [ newNodes ]
export const rebuildNodes = (links, nodes) => {
  let newNodes = []
  for (let node of nodes) {
    if (isLinked(node.id, links)) {
      newNodes.push(node)
    }
  }
  return newNodes
}

// finds node by id => boolean
export const nodeExists = (nodeId, nodes) => {
  let index = nodes.findIndex(
    (node) => { return node.id === nodeId }
  )
  return (index > -1)
}

// Checks if node is linked => boolean
const isLinked = (nodeId, links) => {
  let index = links.findIndex(
    (link) => { return (link.tid === nodeId || link.sid === nodeId) }
  )
  return (index > -1)
}

// link formatter
export const newLink = (id, sid, tid) => {
  return { id, sid, tid }
}

// generates random links => [ links ]
export const makeRandomLinks = (nodes, maxLinks) => {
  let links = []
  for (let j = 0; j <= 120; j++) {
    let node = nodes[j]
    if (node._type === 2) {
      for (let up in Groups[node.name].vups) {
        // eslint-disable-next-line no-unused-vars
        let flag = 0
        for (let i = 0; i <= 150; i++) {
          if (nodes[i].name === up) {
            flag = 1
            links.push(newLink(0, i, j))
          }
          if (flag === 1) {
            break
          }
        }
      }
      // links.push(newLink(0, ))
    }
    // let total = Math.floor(Math.random() * maxLinks)
    // for (let i = 0; i <= total; i++) {
    //   let target = Math.floor(Math.random() * nodes.length)
    //   let source = node.id
    //   id++
    //   links.push(newLink(id, source, target))
    // }
  }
  return links
}

// node formatter
export const newNode = (nodeId, nodeName, color, __type, __size) => {
  // eslint-disable-next-line standard/object-curly-even-spacing
  return { id: nodeId, name: nodeName, _color: color, _type: __type, _size: __size}
}

// generates random nodes => [ nodes ]
export const makeRandomNodes = (maxNodes) => {
  let j
  let links = []
  let nodes = Array.apply(null, { length: 0 })
    .map((value, index) => { return newNode(index, '0') })
  let i = 0
  let id = 0
  // nodes.push(newNode('0', 'GROUPS', '#934fa1', 0))
  for (j in Groups) {
    i++
    if (i > 1 && i <= 7) {
      // console.log(Groups[j]['vups'])
      nodes.push(newNode(id, j, '#49bbff', 2, 30))
      id++
    } else if (i > 7) {
      break
    }
  }
  i = 0
  for (j in Groups) {
    i++
    if (i > 1 && i <= 7) {
      for (let up in Groups[j]['vups']) {
        // console.log(Vups[Groups[j]['vups'][up]].moes)
        // console.log(Vups[Groups[j]['vups'][up]].moes)
        if (Vups[Groups[j]['vups'][up]].moes.length === 0) {
          continue
        }
        nodes.push(newNode(id, Vups[Groups[j]['vups'][up]].name, null, 1))
        links.push(newLink('00', id, i - 2))
        let tid = id
        id++
        for (let moe in Vups[Groups[j]['vups'][up]].moes) {
          // console.log(Vups[Groups[j]['vups'][up]].moes[moe])
          // console.log(Moes[Vups[Groups[j]['vups'][up]].moes[moe]])
          let flag = 0
          let sid = 0
          for (sid = 0; sid < id; sid++) {
            if (nodes[sid]._type === 3 && Vups[Groups[j]['vups'][up]].moes[moe] === nodes[sid].name) {
              flag = 1
              break
            }
          }
          if (flag === 0) {
            nodes.push(newNode(id, Vups[Groups[j]['vups'][up]].moes[moe], '#ff9aa1', 3, 10))
            links.push(newLink('000', id, tid))
            id++
          } else if (flag === 1) {
            links.push(newLink('000', sid, tid))
          }
        }
      }
    } else if (i > 7) {
      break
    }
  }
  // eslint-disable-next-line standard/object-curly-even-spacing
  return { node: nodes, link: links}
}

// vue custom event handler
export const methodCall = (vm, action, args) => {
  let method = vm[action]
  if (typeof method === 'function') {
    if (args) method(...args)
    else method()
  } else {
    console.error('Call to undefined method:', action)
  }
}

// vue event wrapper
export const emitEvent = (vm, action, args) => {
  if (vm.$data.conf && vm.$data.conf.allEventsAs) {
    let evName = vm.$data.conf.allEventsAs
    return vm.$emit(evName, action, args)
  }
  return vm.$emit(action, ...args)
}
