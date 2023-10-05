function Persist() {
    function createMockPersistMode(name) {
        function save(obj) {
            console.log('[ Save ' + name + ' ]', obj)
        }

        function load(obj) {
            console.log('[ Load ' + name + ' ]', obj)
            return obj
        }

        return {
            save,
            load
        }
    }

    function createDebugPersistMode(persist, handler) {
        return {
            save: (obj) => {
                try {
                    persist.save(obj)
                    handler.save(obj)
                } catch (err) {
                    handler.error(err)
                }
            },

            load: (obj) => {
                persist.load(obj)
                handler.load(obj)
            }
        }
    }

    function createLocalStoragePersistMode(name) {
        function save(obj) {
            var json = JSON.stringify(obj)
            localStorage[name] = json
        }

        function load(obj) {
            if (localStorage[name] === undefined || localStorage[name] === null) {
                return obj
            }

            try {
                var json = localStorage[name]
                return JSON.parse(json)
            } catch {
                console.log('Load json error')
                return obj
            }
        }

        return { save, load }
    }

    function createPersistentState(defaultObj, persistMode) {
        if (typeof persistMode === 'string') {
            persistMode = createLocalStoragePersistMode(persistMode)
        }

        const { save, load } = persistMode

        Object.assign(defaultObj, load(defaultObj)) // merge default and loaded objects (keep functions)

        const proxy = new Proxy(defaultObj, {
            set: (obj, prop, value) => {
                obj[prop] = value
                save(obj)

                return value
            },
            get: (obj, prop) => {
                if (obj[prop] !== undefined) {
                    return obj[prop]
                }

                return undefined
            }
        })

        return proxy
    }

    return {
        createMockPersistMode,
        createDebugPersistMode,
        createLocalStoragePersistMode,
        createPersistentState
    }
}