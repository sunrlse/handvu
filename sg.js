
function SG(opts) {
    let { watch, computed} = opts
    this.opts = opts
    this.initData()
    if (computed) {
        this.initComputeds(computed)
    }
    if (watch) {
        this.initWatch(watch)
    }
    this.mount()
}

SG.prototype.initData = function() {
    let data = this.data = this.opts.data
    let keys = Object.keys(data)
    keys.forEach(key => {
        this.proxy(this, 'data', key)
        this.reactive(data, key)
    })
}

SG.prototype.proxy = function(obj, middleObj, key) {
    console.log('设置代理 : ', key)
    Object.defineProperty(obj, key, {
        get: function() {
            console.log('proxy getting : ', key)
            return obj[middleObj][key]
        },
        set: function(val) {
            obj[middleObj][key] = val
            // console.log('proxy setting ', obj[middleObj])
        }
    })
}

SG.prototype.reactive = function(data, key) {
    let self = this
    let dep = new Dep(key)
    let val = data[key]
    Object.defineProperty(data, key, {
        // enumerable: true,
        // configurable: true,
        get: function() {
            // 每次修改数据 都会触发这里，收集依赖，所以在watcher 里面每次执行watcher的getter(传入的主要执行的函数)执行后要清除旧的依赖
            console.log('source data getting : ', key)
            if (Dep.target) {
                console.log('-------------------------------------------------- Dep target is ', Dep.target)
                dep.depend()
            }
            return val
        },
        set: function(newVal) {
            console.log('source data seting : ', key , ' : ', newVal)
            val = newVal
            dep.notify()
        }
    })
}

SG.prototype.initComputeds = function(obj) {
    let self = this
    let watchers = this._computedWatchers = Object.create(null)
    for (key in obj) {
        let getter = obj[key]
        console.log('========== init watcher : computed ========')
        watchers[key] = new Watcher(this, getter, function() {}, {
            lazy: true,
            type: 'computed:' + key
        })
        if (!(key in self)) {
            defineComputed(self, key, getter)
        } else {
            console.warn(`The computed property "${key}" is already defined in data.`)
        }
    }
}

function defineComputed(target, key, expFn) {
    let defCofig = {
        get: function () {}
    }
    if (typeof expFn === 'function') {
        // defCofig.get = function () {
        //     return expFn.call(this, this)
        // }
        defCofig.get = function() {
            let watcher = this._computedWatchers[key]
            if (watcher) {
                if (watcher.dirty) {
                    watcher.evaluate()
                }
                if (Dep.target) {
                    watcher.depend()
                }
                return watcher.value
            }
        }
    }
    Object.defineProperty(target, key, defCofig)
}

SG.prototype.initWatch = function(watch) {
    let keys = Object.keys(watch)
    keys.forEach(key => {
        console.log('========== init watcher : user watch ========')
        new Watcher(this, key, watch[key], {
            type: 'user watcher:' + key
        })
    })
}

SG.prototype.mount = function() {
    console.log('========== init watcher : mount ========')
    new Watcher(self, () => {
        console.log('mount watch getter invoke')
        this.updateView()
    }, function () {}, {
        type: 'mount watcher' 
    })
    // console.log('mounted')
}

SG.prototype.updateView = function() {
    this.render()
}

SG.prototype.render = function() {
    console.log('%c渲染!!!', 'color: blue')  
    if (!this.el) {
        this.el = document.getElementById(this.opts.target)
    }
    let template = this.opts.template
    let reg = /({{\w+}})/g
    let html = template.replace(reg, (...matched) => {
        let str = matched[1]
        let key = str.substring(2, str.length - 2)
        let val = this[key] || ''
        return val
    })
    this.el.innerHTML = html
}

