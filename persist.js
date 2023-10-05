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

    function createUIState(state) {
        function $(element) {
            if (typeof element === 'string') {
                return document.querySelector('#'+element)
            }
            
            return element
        }
        
        function checkbox(checkboxElt) {
            checkboxElt = $(checkboxElt)
            const id = checkboxElt.id

            if (!id) {
                throw new Error("Can't create state for element without id")
            }

            checkboxElt.checked = state[id]

            checkboxElt.addEventListener('click', () => {
                state[id] = checkboxElt.checked
            })
        }

        function input(inputElt) {
            inputElt = $(inputElt)
            const id = inputElt.id

            if (!id) {
                throw new Error("Can't create state for element without id")
            }

            inputElt.value = state[id]

            inputElt.addEventListener('input', () => {
                state[id] = inputElt.value
            })
        }
        
        return {
            checkbox,
            input
        }
    }

    return {
        createMockPersistMode,
        createDebugPersistMode,
        createLocalStoragePersistMode,
        createPersistentState,
        createUIState
    }
}