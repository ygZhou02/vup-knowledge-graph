<template lang="pug">
  #selection.notification
    .close(@click='emit("clearSelection")')
    h4 Selected
    .mini-list
      table
        tr
          th 类型
          th 名称
        tr(v-for="value,key in nodes")
          td {{ types[value._type - 1]}}
          td {{ value.name }}
    ul.list
      li Nodes:
        strong {{ Object.keys(nodes).length }}
      li Links:
        strong {{ Object.keys(links).length }}
    p(v-for="value in required_nodes") {{value}}
</template>
<script>
import Vups from './vups.json'
import Groups from './groups.json'
import Moes from './moes.json'
export default {
  name: 'd3-net-selection',
  props: ['data'],
  data () {
    return {
      groups: Groups,
      vups: Vups,
      moes: Moes,
      types: ['vup', 'group', '萌点']
    }
  },
  methods: {
    emit (action, args) {
      this.$emit('action', action, args)
    }
  },
  computed: {
    links () {
      return this.data.links
    },
    nodes () {
      return this.data.nodes
    },
    required_nodes () {
      var nodelist = []
      for (var node in this.data.nodes) {
        if (this.data.nodes[node]._type === 1) {
          nodelist.push(Vups[this.data.nodes[node].name].bio)
        } else if (this.data.nodes[node]._type === 2) {
          nodelist.push(Groups[this.data.nodes[node].name].bio)
        }
      }
      return nodelist
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  $btn-size = 1.5em

button.icon
  background-color: blue
  border-style: none
  font-size: 1em
  height: $btn-size
  width: $btn-size
  line-height: 1.25em
  border-radius: 50%
  padding:0
  margin:0
  color:$color

button.big
  margin-bottom: 1em
  span
    font-size: 2em

.mini
  font-size: 0.75em

 .title
    color: $color
    font-weight: bold
table
  border-collapse: collapse
tr
  border-bottom: solid 1px lightgrey
th
  border-bottom: solid 2px lightgrey
th
td
  padding: 0 .5em
  text-align: left

.mini-list
ul.list
  display:inline-block
  list-style: none

.notification
  position: absolute
  bottom: 7em
  right: 3em
  z-index: 100
  width: 50em
  padding: 1em 3em 1em 2em
  border-radius: 0.5em
  box-shadow: $box-sh
  border: $border
  background-color: white
  box-shadow: $hard-sh

  .mini-list
    max-height: 100em
    overflow-y: scroll
    overflow-x: hidden
</style>
