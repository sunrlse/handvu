let __did = 0
function Dep(keyname) {
    this.id = __did++
    this.keyname = keyname
    this.subscribers = []
}

Dep.prototype.addSub = function(sub) {
    this.subscribers.push(sub)
}

Dep.prototype.removeSub = function(sub) {
    let subscribers = this.subscribers
    if (subscribers.length) {
        const index = subscribers.indexOf(sub)
        if (index > -1) {
            return subscribers.splice(index, 1)
        }
    }
}

Dep.prototype.depend = function() {
    console.log(this.keyname,'- dep depend收集触发')
    if (Dep.target) {
        Dep.target.addDep(this)
    }
}

Dep.prototype.notify = function() {
    console.log(`%c${this.keyname} dep notify sub:watcher `, 'color:green')
    this.subscribers.forEach(sub => {
        console.log(`%c${sub.type} - 更新`, 'color: orange')
        sub.update()
    })
}

Dep.target = null

Dep.stack = []

function pushTarget(target) {
    Dep.stack.push(target)
    Dep.target = target
}

function popTarget() {
    Dep.stack.pop()
    Dep.target = Dep.stack[Dep.stack.length - 1]
}
