let __wid = 0
function Watcher(vm, fnOrKey, handler, option) {
    this.id = __wid++
    this.type = option.type
    this.vm = vm
    this.cb = handler
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    if (option) {
        this.lazy = !!option.lazy
        this.dirty = this.lazy
    }

    if (typeof fnOrKey === 'function') {
        this.getter = fnOrKey
    } else {
        this.getter = function(o) {
            return o[fnOrKey]
        }
    }
    this.value = this.lazy ? undefined : this.get()
}

Watcher.prototype.addDep = function(dep) {
    let id = dep.id
    console.log(this.type,'- addDep 添加dep:', dep.keyname)
    if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id)
        this.newDeps.push(dep)
        if (!this.depIds.has(id)) {
          dep.addSub(this)
        }
    }
}

Watcher.prototype.cleanupDeps = function() {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
}

Watcher.prototype.depend = function() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
}

Watcher.prototype.get = function() {
    console.log(`%c @@@@@@ 观察者 ${this.type} get`, 'color: red')
    console.log('Dep stack ', Dep.stack, ' 当前target:',Dep.target)
    let vm = this.vm
    pushTarget(this)
    console.log('push 后 Dep stack ', Dep.stack, ' 当前target:',Dep.target)
    console.log(`%c${this.type} 求值计算`, 'color: deepskyblue;font-weight:bold')
    let val = this.getter.call(vm, vm)
    popTarget()
    console.log('pop 后 Dep stack ', Dep.stack, ' 当前target:',Dep.target)
    /* ! 若不清楚旧依赖，每次修改数据都会生成更多的相同依赖，重复更新视图会越来越多，频繁快速修改数据会[死循环似的]卡死页面*/
    this.cleanupDeps()
    return val
}

Watcher.prototype.evaluate = function() {
    this.value = this.get()
    this.dirty = false
}

Watcher.prototype.update = function() {
    if (this.lazy) {
        this.dirty = true
        return
    }
    let oldVal = this.value
    let val = this.get()
    if (val !== oldVal) {
        console.log('watch update real ')
        this.cb.call(this.vm, val, oldVal)
    }
}