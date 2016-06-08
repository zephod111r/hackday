(function (Root) {
    "use strict";

    var RootNames = Object.freeze([
        "Namespace",
        "Class",
        "Navigation",
        "StateMachine",
        "HTTP",
        "Page",
        "Input",
        "Translation",
        "Utility",
        "DisplayElement",
        "ProfanityFilter",
        "Rendering",
        "Shaders",
        "Game"
    ]);

    RootNames.forEach(function(value, index, obj) {
        Object.defineProperty(this, value, { value: Object.create(Object.prototype), writable: false, enumerable: true, configurable: false });
    }, Root);

})(this);

(function initNamespace(Root, local) {
    "use strict";

    Object.defineProperties(local, {
        Design: {
            value: function (name, contents) {
                var nameList = name.split('.');
                var currentNameSpace = Root;
                for (var i = 0, len = nameList.length; i < len; i++) {
                    var namespaceName = nameList[i];
                    var list = Object.getOwnPropertyNames(currentNameSpace);
                    if (list.indexOf(currentNameSpace) == -1) {
                        Object.defineProperty(currentNameSpace, namespaceName,
                            { value: Object.create(Object.prototype), writable: false, enumerable: true, configurable: false }
                        );
                    }
                    currentNameSpace = currentNameSpace[namespaceName];
                }

                contents && Object.defineProperties(currentNameSpace, contents);

                return currentNameSpace;

            }, writable: false, enumerable: true, configurable: false
        }
    });


})(this, this.Namespace);

(function initClass(local) {

    "use strict";
    Object.defineProperties(local, {
        Design: {
            value: function (initialiser, methods, staticmethods) {
                initialiser = initialiser || Object.create(Object.prototype);
                initialiser.prototype = Object.create(Object.prototype, methods);
                staticmethods && Object.defineProperties(initialiser, staticmethods);
                Object.defineProperty(initialiser.prototype, "constructor", { value: initialiser, writable: true, configurable: true, enumerable: true });
                return initialiser;
            }, writable: false, enumerable: true, configurable: false
        },
        Derive: {
            value: function (parent, initialiser, methods, staticmethods) {

                if(!parent) {
                    return Root.Class.Design(initialiser, methods, staticmethods);
                }

                initialiser = initialiser || Object.create(Object.prototype);
                var constructor = function () {
                    parent.apply(this, arguments);
                    initialiser.apply(this, arguments);
                };
                constructor.prototype = Object.create(parent.prototype);
                Object.defineProperty(constructor.prototype, "constructor", { value: constructor, writable: true, configurable: true, enumerable: true });
                methods && Object.defineProperties(constructor.prototype, methods);
                staticmethods && Object.defineProperties(constructor, staticmethods);

                return constructor;
            }, writable: false, enumerable: true, configurable: false
        }
    });
})(this.Class);

(function initNavigation(local) {

    "use strict";
    local.Navigator = Class.Design(function () { }, {}, {});

})(this.Navigation);

(function initStateMachine(local) {

    "use strict";

    var Errata_number = 1;
    var CancelledName = "Cancelled";

    function noop(){};

    function pushListener(machine, listener) {
        var listeners = machine.listeners;
        if (listeners) {
            listeners = Array.isArray(listeners) ? listeners : [listeners];
            listeners.push(listener);
        } else {
            listeners = listener;
        }
        machine.listeners = listeners;
    };

    function Completed(machine, value) {
        var targetState;
        if (value && typeof value === "object" && typeof value.Then === "function") {
            targetState = StateMachineStates.state_waiting;
        } else {
            targetState = StateMachineStates.state_success_notify;
        }
        machine.value = value;
        machine.setState(targetState);
    }

    function createErrataDetails(exception, Errata, promise, id, parent, handler) {
        return {
            exception: exception,
            Errata: Errata,
            promise: promise,
            handler: handler,
            id: id,
            parent: parent
        };
    };

    function detailsForChainedErrata(promise, errorValue, context) {
        var exception = context._isException;
        var errorId = context._errorId;
        setErrataInfo(promise, errorId, exception);
        return createErrataDetails(
            exception ? errorValue : null,
            exception ? null : errorValue,
            promise,
            errorId,
            context
        );
    };

    function detailsForHandledErrata(promise, errorValue, context, handler) {
        var exception = context._isException;
        var errorId = context._errorId;
        return createErrataDetails(
            exception ? errorValue : null,
            exception ? null : errorValue,
            promise,
            errorId,
            context,
            handler
        );
    };

    function detailsForErrata(promise, ErrataValue) {
        var ErrataId = ++Errata_number;
        setErrataInfo(promise, ErrataId);
        return createErrataDetails(
            null,
            ErrataValue,
            promise,
            ErrataId
        );
    };

    function detailsForException(promise, exceptionValue) {
        var ErrataId = ++Errata_number;
        setErrataInfo(promise, ErrataId, true);
        return createErrataDetails(
            exceptionValue,
            null,
            promise,
            ErrataId
        );
    };

    function notifySuccess(machine, queue) {
        var value = machine.value;
        var listeners = machine.listeners;
        if (!listeners) {
            return;
        }
        machine.listeners = null;
        var i, len;
        for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
            var listener = len === 1 ? listeners : listeners[i];
            var onComplete = listener.c;
            var target = listener.machine;
            if (target) {
                try {
                    target.setCompleteValue(onComplete ? onComplete(value) : value);
                } catch (ex) {
                    target.setExceptionValue(ex);
                }
                if (target.state !== StateMachineStates.state_waiting && target.listeners) {
                    queue.push(target);
                }
            } else {
                CompletePromise.prototype.Done.call(promise, onComplete);
            }
        }
    }

    function notifyErrata(machine, queue) {
        var value = machine.value;
        var listeners = machine.listeners;
        if (!listeners) {
            return;
        }
        machine.listeners = null;
        var i, len;
        for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
            var listener = len === 1 ? listeners : listeners[i];
            var onErrata = listener.e;
            var target = listener.machine;
            if (target) {
                try {
                    if (onErrata) {
                        if (!onErrata.handlesOnErrata) {
                            callonErrata(target, value, detailsForHandledErrata, machine, onErrata);
                        }
                        target.setCompleteValue(onErrata(value))
                    } else {
                        target.setChainedErrataValue(value, machine);
                    }
                } catch (ex) {
                    target.setExceptionValue(ex);
                }
                if (target.state !== StateMachineStates.state_waiting && target.listeners) {
                    queue.push(target);
                }
            } else {
                ErrataPromise.prototype.Done.call(machine, null, onErrata);
            }
        }
    }

    function setErrataValue(machine, value, onErrataDetails, context) {
        machine.value = value;
        callonErrata(machine, value, onErrataDetails, context);
        machine.setState(StateMachineStates.state_Errata);
    };

    function setCompleteValue(machine, value) {
        var targetState;
        if (value && typeof value === "object" && typeof value.Then === "function") {
            targetState = StateMachineStates.state_waiting;
        } else {
            targetState = StateMachineStates.state_success;
        }
        machine.value = value;
        machine.setState(targetState);
    };

    function callonErrata(promise, value, onErrataDetailsGenerator, context, handler) {
    }

    function Progress(machine, value) {
        var listeners = machine.listeners;
        if (listeners) {
            var i, len;
            for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
                var listener = len === 1 ? listeners : listeners[i];
                var onProgress = listener.p;
                if (onProgress) {
                    try { onProgress(value); } catch (ex) { }
                }
                if (!(listener.c || listener.e) && listener.machine) {
                    listener.machine.Progress(value);
                }
            }
        }
    }

    function Errata(machine, value, onErrataDetails, context) {
        machine.value = value;
        callonErrata(machine, value, onErrataDetails, context);
        machine.setState(StateMachineStates.state_Errata_notify);
    }

    function Done(machine, onComplete, onErrata, onProgress) {
        pushListener(machine, { c: onComplete, e: onErrata, p: onProgress });
    };

    function Then(machine, onComplete, onErrata, onProgress) {
        var result = new ThenPromise(machine);
        pushListener(machine, { machine: result, c: onComplete, e: onErrata, p: onProgress });
        return result;
    };

    var StateMachineStates = Object.freeze({
        state_created: {
            name: "created",
            enter: function (machine) {
                machine.setState(StateMachineStates.state_working);
            },
            Cancel: noop,
            Done: noop,
            Then: noop,
            Completed: noop,
            Errata: noop,
            notify: noop,
            Progress: noop,
            setCompleteValue: noop,
            setErrataValue: noop
        },
        state_working: {
            name: "working",
            enter: noop,
            Cancel: function (machine) {
                machine.setState(StateMachineStates.state_Canceled);
            },
            Done: Done,
            Then: Then,
            Completed: Completed,
            Errata: Errata,
            notify: noop,
            Progress: Progress,
            setCompleteValue: setCompleteValue,
            setErrataValue: setErrataValue
        },
        state_waiting: {
            name: "waiting",
            enter: function (machine) {
                var waitedUpon = machine.value;
                var Errata = function (value) {
                    if (waitedUpon.ErrataId) {
                        machine.ChainedErrata(value, waitedUpon);
                    } else {
                        callonErrata(machine, value, detailsForHandledErrata, waitedUpon, Errata);
                        machine.Errata(value);
                    }
                };
                machine.handlesOnErrata = true;
                waitedUpon.Then(
                    machine.Completed.bind(machine),
                    Errata,
                    machine.Progress.bind(machine)
                );
            },
            Cancel: function (machine) {
                machine.setState(StateMachineStates.state_waiting_Canceled);
            },
            Done: Done,
            Then: Then,
            Completed: Completed,
            Errata: Errata,
            notify: noop,
            Progress: Progress,
            setCompleteValue: setCompleteValue,
            setErrataValue: setErrataValue
        },
        state_waiting_Canceled: {
            name: "waiting_Canceled",
            enter: function (machine) {
                machine.setState(StateMachineStates.state_Canceling);
                var waitedUpon = machine.value;
                if (waitedUpon.Cancel) {
                    waitedUpon.Cancel();
                }
            },
            Cancel: noop,
            Done: Done,
            Then: Then,
            Completed: Completed,
            Errata: Errata,
            notify: noop,
            Progress: Progress,
            setCompleteValue: setCompleteValue,
            setErrataValue: setErrataValue
        },
        state_Canceled: {
            name: "Canceled",
            enter: function (machine) {
                machine.setState(StateMachineStates.state_Canceling);
                machine.CancelAction && machine.CancelAction();
            },
            Cancel: noop,
            Done: Done,
            Then: Then,
            Completed: Completed,
            Errata: Errata,
            notify: noop,
            Progress: Progress,
            setCompleteValue: setCompleteValue,
            setErrataValue: setErrataValue
        },
        state_Canceling: {
            name: "Canceling",
            enter: function (machine) {
                var error = new Error(CancelledName);
                error.name = error.message;
                machine.value = error;
                machine.setState(StateMachineStates.state_Errata_notify);
            },
            Cancel: noop,
            Done: noop,
            Then: noop,
            Completed: noop,
            Errata: noop,
            notify: noop,
            Progress: noop,
            setCompleteValue: noop,
            setErrataValue: noop
        },
        state_success_notify: {
            name: "complete_notify",
            enter: function (machine) {
                machine.Done = CompletePromise.prototype.Done;
                machine.Then = CompletePromise.prototype.Then;
                if (machine.listeners) {
                    var queue = [machine];
                    var p;
                    while (queue.length) {
                        p = queue.pop();
                        p.state.notify(p, queue);
                    }
                }
                machine.setState(StateMachineStates.state_success);
            },
            Cancel: noop,
            Done: null, /*Errata to get here */
            Then: null, /*Errata to get here */
            Completed: noop,
            Errata: noop,
            notify: notifySuccess,
            Progress: noop,
            setCompleteValue: noop,
            setErrataValue: noop
        },
        state_success: {
            name: "success",
            enter: function (machine) {
                machine.Done = CompletePromise.prototype.Done;
                machine.Then = CompletePromise.prototype.Then;
                machine.CleanupAction && machine.CleanupAction();
            },
            Cancel: noop,
            Done: null, /*Errata to get here */
            Then: null, /*Errata to get here */
            Completed: noop,
            Errata: noop,
            notify: notifySuccess,
            Progress: noop,
            setCompleteValue: noop,
            setErrataValue: noop
        },
        state_Errata_notify: {
            name: "Errata_notify",
            enter: function (machine) {
                machine.Done = ErrataPromise.prototype.Done;
                machine.Then = ErrataPromise.prototype.Then;
                if (machine.listeners) {
                    var queue = [machine];
                    var p;
                    while (queue.length) {
                        p = queue.pop();
                        p.state.notify(p, queue);
                    }
                }
                machine.setState(StateMachineStates.state_Errata);
            },
            Cancel: noop,
            Done: null, /*Errata to get here*/
            Then: null, /*Errata to get here*/
            Completed: noop,
            Errata: noop,
            notify: notifyErrata,
            Progress: noop,
            setCompleteValue: noop,
            setErrataValue: noop
        },
        state_Errata: {
            name: "Errata",
            enter: function (machine) {
                machine.Done = ErrataPromise.prototype.Done;
                machine.Then = ErrataPromise.prototype.Then;
                machine.CleanupAction && machine.CleanupAction();
            },
            Cancel: noop,
            Done: null, /*Errata to get here*/
            Then: null, /*Errata to get here*/
            Completed: noop,
            Errata: noop,
            notify: notifyErrata,
            Progress: noop,
            setCompleteValue: noop,
            setErrataValue: noop
        }
    });

    var StateMachineBase = Class.Design(function () {
        Object.defineProperties(this, {
            state: {
                value: null,
                writable: true,
                enumerable: false
            },
            nextState: {
                value: StateMachineStates.state_created,
                writable: true,
                enumerable: false
            },
            value: {
                value: null,
                writable: true,
                enumerable: false
            },
            listeners: {
                value: null,
                writable: true,
                enumerable: false
            }
        });
    }, {
        setState: {
            value: function (state) {
                this.nextState = state;
            },
            writable: false,
            enumerable: true
        },
        Run: {
            value: function () {
                while (this.nextState) {
                    this.state = this.nextState;
                    this.nextState = null;
                    this.state.enter(this);
                }
            },
            writable: false,
            enumerable: false
        },
        Cancel: {
            value: function () {
                this.state.Cancel(this);
                this.Run();
            },
            writable: false,
            enumerable: true
        },
        Done: {
            value: function (onComplete, onErrata, onProgress) {
                return this.state.Done(this, onComplete, onErrata, onProgress);
            },
            writable: true,
            enumerable: true
        },
        Then: {
            value: function (onComplete, onErrata, onProgress) {
                return this.state.Then(this, onComplete, onErrata, onProgress);
            },
            writable: true,
            enumerable: true
        },
        Completed: {
            value: function (value) {
                var result = this.state.Completed(this, value);
                this.Run();
                return result;
            },
            writable: false,
            enumerable: false
        },
        Errata: {
            value: function (value) {
                var result = this.state.Errata(this, value, detailsForErrata);
                this.Run();
                return result;
            },
            writable: false,
            enumerable: false
        },
        Progress: {
            value: function (value) {
                this.state.Progress(this, value);
            },
            writable: false,
            enumerable: false
        },
        CancelAction: {
            value: function () {
                if (this.onCancel) {
                    try { this.onCancel(); } catch (ex) { }
                }
            },
            writable: true,
            enumerable: false
        },
        setCompleteValue: {
            value: function (value) {
                this.state.setCompleteValue(this, value);
                this.Run();
            },
            writable: false,
            enumerable: true
        },
        ChainedErrata: {
            value: function (value, context) {
                var result = this.state.Errata(this, value, detailsForChainedErrata, context);
                this.Run();
                return result;
            },
            writable: false,
            enumerable: false
        },
        setChainedErrataValue: {
            value: function (value, context) {
                var result = this.state.setErrataValue(this, value, detailsForChainedErrata, context);
                this.Run();
                return result;
            },
            writable: false,
            enumerable: false
        },
        setExceptionValue: {
            value: function (value) {
                var result = this.state.setErrataValue(this, value, detailsForException);
                this.Run();
                return result;
            },
            writable: false,
            enumerable: false
        }
    });

    var ThenPromise = Class.Derive(StateMachineBase, function (creator) {
        Object.defineProperties(this, {
            creator: {
                value: creator,
                writable: true,
                enumerable: false
            }
        });

        this.Run();
    }, {
        CleanupAction: {
            value: function () {
                this.creator = null;
            }, writable: false, enumerable: false
        },
        CancelAction: {
            value: function () {
                this.creator && this.creator.Cancel && this.creator.Cancel();
            }, writable: false, enumerable: false
        }
    });

    var ExceptionPromise = Class.Derive(StateMachineBase, function (value) {
        this.value = value;
        callonErrata(this, value, detailsForException);
    });

    var ErrataPromise = Class.Derive(StateMachineBase, null, {
        Done: {
            value: function (unused, onErrata) {
                var value = this.value;
                if (onErrata) {
                    try {
                        if (!onErrata.handlesOnErrata) {
                            callonErrata(null, value, detailsForHandledErrata, this, onErrata);
                        }
                        var result = onErrata(value);
                        if (result && typeof result === "object" && typeof result.Done === "function") {
                            result.Done();
                        }
                        return;
                    } catch (ex) {
                        value = ex;
                    }
                }
                if (value instanceof Error && value.message === CancelledName) {
                    return;
                }
                setImmediate(function () {
                    throw value;
                });
            }, writable: true, enumerable: false
        },
        Then: {
            value: function (unused, onErrata) {
                if (!onErrata) { return this; }
                var result;
                var value = this.value;
                try {
                    if (!onErrata.handlesOnErrata) {
                        callonErrata(null, value, detailsForHandledErrata, this, onErrata);
                    }
                    result = new CompletePromise(onErrata(value));
                } catch (ex) {
                    if (ex === value) {
                        result = this;
                    } else {
                        result = new ExceptionPromise(ex);
                    }
                }
                return result;
            }, writable: true, enumerable: false
        }
    });

    var CompletePromise = Class.Derive(StateMachineBase, function (value) {
        if (value && typeof value === "object" && typeof value.Then === "function") {
            var result = new ThenPromise(null);
            result.setCompleteValue(value);
            return result;
        }
        this.value = value;
    }, {
        Done: {
            value: function (onComplete) {
                if (!onComplete) { return; }
                try {
                    var result = onComplete(this.value);
                    if (result && typeof result === "object" && typeof result.Done === "function") {
                        result.Done();
                    }
                } catch (ex) {
                    setImmediate(function () {
                        throw ex;
                    });
                }
            }, writable: true, enumerable: false
        },
        Then: {
            value: function (onComplete) {
                try {
                    var newValue = onComplete ? onComplete(this.value) : this.value;
                    return newValue === this.value ? this : new CompletePromise(newValue);
                } catch (ex) {
                    return new ExceptionPromise(ex);
                }
            }, writable: true, enumerable: false
        }
    });

    var StateMachinePromise = Class.Derive(StateMachineBase, function (init, onCancel) {

        this.Run();

        try {
            var complete = this.Completed.bind(this);
            var Errata = this.Errata.bind(this);
            var Progress = this.Progress.bind(this);
            init(complete, Errata, Progress);
        } catch (ex) {
            this.setExceptionValue.call(this, ex);
        }
    }, {}, {
        As: {
            value: function (value) {
                if (value && typeof value === "object" && typeof value.Then === "function") {
                    return value;
                }
                return new StateMachineBase(function (complete) {
                    var value = null;
                    switch (typeof (this)) {
                        case "function":
                            value = this();
                            break;
                        default:
                            value = this;
                    }
                    complete(value);
                }.bind(value));
            }
        },
        Wrap: {
            value: function (value) {
                return new CompletePromise(value);
            }
        },
        Timeout: {
            value: function (timeoutMS) {
                var id;
                return new StateMachinePromise(
                    function (c) {
                        if (timeoutMS) {
                            id = setTimeout(c, timeoutMS);
                        } else {
                            setTimeout(c, 0);
                        }
                    },
                    function () {
                        if (id) {
                            clearTimeout(id);
                        }
                    }
                );
            }
        },
    });

    Object.defineProperty(local, "Promise", { value: StateMachinePromise, writable: false, enumerable: true, configurable: true });

})(this.StateMachine);

if (typeof JSON !== 'object') {
    JSON = {};
    (function () {
        'use strict';

        function f(n) {
            return n < 10 ? '0' + n : n;
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function () {

                return isFinite(this.valueOf())
                    ? this.getUTCFullYear()     + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate())      + 'T' +
                        f(this.getUTCHours())     + ':' +
                        f(this.getUTCMinutes())   + ':' +
                        f(this.getUTCSeconds())   + 'Z'
                    : null;
            };

            String.prototype.toJSON      =
                Number.prototype.toJSON  =
                Boolean.prototype.toJSON = function () {
                    return this.valueOf();
                };
        }

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep;


        function quote(string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }


        function str(key, holder) {

            var i,  k, v, length,
                mind = gap,
                partial,
                value = holder[key];

            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':
                    return String(value);
                case 'object':
                    if (!value) {
                        return 'null';
                    }
                    gap += indent;
                    partial = [];
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }
                        v = partial.length === 0
                            ? '[]'
                            : gap
                            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                            : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    v = partial.length === 0
                        ? '{}'
                        : gap
                        ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                        : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

        if (typeof JSON.stringify !== 'function') {
            JSON.stringify = function (value, replacer, space) {
                var i;
                gap = '';
                indent = '';
                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }
                } else if (typeof space === 'string') {
                    indent = space;
                }
                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                        typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }
                return str('', {'': value});
            };
        }
        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {

                var j;

                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }
                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

                if (/^[\],:{}\s]*$/
                        .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                    j = eval('(' + text + ')');

                    return typeof reviver === 'function'
                        ? walk({'': j}, '')
                        : j;
                }
                throw new SyntaxError('JSON.parse');
            };
        }
    }());
}


(function initHttpRequests(local) {

    var httpRequest = function () {
        if (!XMLHttpRequest) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
        else
            return new XMLHttpRequest();
    }

    var SaveJavascript = function (c, e, p) {
        var request = httpRequest();

        var complete = function () {
            if (this.status == 200) {
                c();
            } else {
                e(this.responseText);
            }
        }

        var error = function () {
            e(this.responseText);
        }

        var progress = function () {
            p(this.readyState);
        }

        request.open("post", this.url, true, this.user, this.password);
        request.setRequestHeader('Content-type', 'text/plain');
        request.onerror = error;
        request.onprogress = progress;
        request.ontimeout = error;
        request.onload = complete;
        request.send(this.content);
    };

    var ListEntryExtMap = Object.freeze({
        // text
        html: 'text/html',
        htm: 'text/html',
        txt: 'text/plain',
        js: 'text/javascript',
        csv: 'text/csv',
        css: 'text/css',
        cmd: 'text/cmd',
        vcard: 'text/vcard',

        // image
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg_xml',
        gif: 'image/gif',
        tff: 'image/tiff',
        tiff: 'image/tiff',

        // video
        avi: 'video/avi',
        mpeg: 'video/mpeg',
        mp4: 'video/mp4',
        ogg: 'video/ogg',
        wmv: 'video/x_ms_wmv',
        flv: 'video/flv',
        mov: 'video/quicktime',

        // audio
        mp3: 'audio/mp3',
        wav: 'audio/wav',

        //application
        json: 'application/json',
        xml: 'application/xml',
                     
        // shaders
        vsh: 'x-shader/x-vertex',
        fsh: 'x-shader/x-fragment'
    });

    function GetFiledir(url) {
        if (url) {
            var m = url.toString().match(/.*\/(.+?)\./);
            if (m && m.length > 1) {
                return m[0].substr(0, m[0].length - m[1].length);
            }
        }
        return "/";
    }

    function GetFilename(url) {
        if (url) {
            var m = url.toString().match(/.*\/(.+?)\./);
            if (m && m.length > 1) {
                return m[1];
            }
        }
        return "";
    }

    function GetFileext(url) {
        if (url) {
            var m = url.toString().match(/.*\/(.+?)\./);
            if (m && m.length > 1) {
                return url.substr(m[0].length);
            }
        }
        return "";
    }

    var HTTPRequest = Class.Design(function (entry) {
        Object.defineProperties(this, {
            url: {
                value: entry.url,
                writable: false,
                enumerable: true
            },
            response: {
                value: null,
                writable: true,
                enumerable: false
            }
        });

    }, {
        Type: {
            get: function () {
                var type = ListEntryExtMap[this.Extension];
                if (!type) {
                    type = ListEntryExtMap.txt;
                }
                return type;
            },
            enumerable: true
        },
        Filename: {
            get: function () {
                return GetFilename(this.url);
            },
            enumerable: true
        },
        Extension: {
            get: function () {
                return GetFileext(this.url);
            },
            enumerable: true
        },
        Directory: {
            get: function () {
                return GetFiledir(this.url);
            }, enumerable: true
        },
        Cancel: {
            value: function () {
                this.oncleanup && this.cleanup();
            }
        },
        Get: {
            value: function () {
                if (this.response) {
                    return StateMachine.Promise.Wrap(this.response);
                }

                return new StateMachine.Promise(function (c, e, p) {
                    var datatype = this.Extension.toLowerCase();

                    var complete = function () {

                        switch (this.responseType) {
                            case 'text':
                                c(this.responseText);
                                break;
                            case 'blob':
                                var blob = URL.createObjectURL(this.response);
                                c(blob);
                                break;
                            case 'document':
                                c(this.responseXML);
                                break;
                            default:
                                c(this.response);
                                break;
                        };

                    };

                    var error = function (request) {
                        e(request.statusText);
                    };

                    var progress = function (value) {
                        p(value);
                    };

                    var request = httpRequest();
                    request.open("get", this.url, true);
                    request.setRequestHeader('Content-type', ListEntryExtMap[datatype]);

                    switch (datatype) {
                        case 'html':
                        case 'htm':
                        case 'txt':
                        case 'js':
                        case 'csv':
                        case 'css':
                        case 'cmd':
                        case 'vcard':
                        case 'fsh':
                        case 'vsh':
                            request.responseType = "text";
                            break;
                        case 'json':
                            request.responseType = "json";
                            break;
                        case 'avi':
                        case 'mov':
                        case 'mp4':
                        case 'flv':
                        case 'ogg':
                        case 'wmv':
                        case 'mpeg':
                        case 'jpg':
                        case 'png':
                        case 'gif':
                        case 'svg':
                        case 'tff':
                        case 'tiff':
                        case 'jpeg':
                            request.responseType = "blob";
                            break;
                        default:
                            request.responseType = "document";
                            break;
                    };

                    request.onerror = error;
                    request.onprogress = progress;
                    request.ontimeout = error;
                    request.onload = complete;
                    request.send();
                }.bind(this)).Then(function (value) {
                    this.response = value;
                    switch (this.Extension.toLowerCase()) {
                        case 'jpg':
                        case 'png':
                        case 'gif':
                        case 'svg':
                        case 'tff':
                        case 'tiff':
                        case 'jpeg':
                            this.oncleanup = function () { URL.revokeObjectURL(this.response); }.bind(this);
                            break;
                        default:
                            break;
                    }
                    return value;
                }.bind(this));
            }, writable: false, enumerable: true
        }
    });

    Object.defineProperties(local, {
        Load: {
            value: function (url) {
                return new HTTPRequest({ url: url }).Get();
            }, writable: false, enumerable: false
        },
        SaveJavascript: {
            value: function (url, content, user, password) {
                return new StateMachine.Promise(SaveJavascript.bind({ url: url, content: content, user: user, password: password }));
            }, writable: false, enumerable: false
        }
    });


})(this.HTTP);

(function initPage(local) {

    var rootNode = document.getElementById('PageLocator'), initialised = false, scripts = {}, links = {};
    var head = document.head || document.getElementsByTagName("head")[0];

    var forEach = function (arrayLikeValue, action) {
        for (var i = 0, l = arrayLikeValue.length; i < l; i++) {
            action(arrayLikeValue[i], i);
        }
    };

    function addScript(scriptTag, fragmentHref, position) {
        var src = scriptTag.src;
        if (!src) {
            src = fragmentHref + "script[" + position + "]";
        }

        if (!(src in scripts)) {
            scripts[src] = true;
            var n = document.createElement("script");
            if (scriptTag.language) {
                n.setAttribute("language", scriptTag.language);
            }
            if (scriptTag.type) {
                n.setAttribute("type", scriptTag.type);
            } else {
                n.setAttribute("type", "text/javascript");
            }
            if (scriptTag.id) {
                n.setAttribute("id", scriptTag.id);
            }
            if (scriptTag.src) {
                n.setAttribute("src", scriptTag.src);
            }
            else {
                n.text = scriptTag.text;
            }
            head.appendChild(n);
        }
    };

    function addStyle(styleTag, fragmentHref, position) {
        var src = (fragmentHref + "script[" + position + "]");
        if (!(src in styles)) {
            styles[src] = true;
            head.appendChild(styleTag.cloneNode(true));
        }
    };

    function addLink(styleTag) {
        var src = styleTag.href;
        if (!(src in links)) {
            links[src] = true;
            var n = styleTag.cloneNode(false);
            n.href = styleTag.href;
            head.appendChild(n);
        }
    };

    var initialise = function() {
        if (initialised) { return; }

        initialised = true;

        forEach(head.querySelectorAll("script"), function (e) {
            scripts[e.src.toLowerCase()] = true;
        });


        forEach(head.querySelectorAll('link[rel="stylesheet"], link[type="text/css"]'), function (e) {
            links[e.href.toLowerCase()] = true;
        });
    };

    StateMachine.Promise.Timeout().Then(function () {
        rootNode = document.getElementById('PageLocator');
        initialise();
    });

    var RootNode = function () {
        return rootNode || document.getElementById('PageLocator');
    }

    var ScriptObject = function (document, src) {
        Object.defineProperties(this, {
            src: {
                value: src,
                writable: false,
                enumerable: true
            },
            loadedDocument: {
                value: document,
                writable: false,
                enumerable: true,
                configurable: true
            }
        });
    }

    var CacheObject = function (url) {
        Object.defineProperties(this, {
            url: {
                value: url,
                writable: false,
                enumerable: true
            },
            loadedDocument: {
                value: null,
                writable: false,
                enumerable: true,
                configurable: true
            },
            promise: {
                value: null,
                writable: true,
                enumerable: true,
                configurable: true
            },
            element: {
                value: null,
                writable: true,
                enumerable: true,
                configurable: true
            },
            scripts: {
                value: {},
                writable: false,
                enumerable: false,
                configurable: true
            }
        });
    };

    Object.defineProperties(CacheObject.prototype, {
        Page_Promise: {
            get: function () {
                if (this.promise) {
                    return this.promise;
                }
                return StateMachine.Promise.Wrap(this);
            },
            set: function (value) {
                this.promise =  StateMachine.Promise.As(value);
            },
            enumerable: true
        },
        Basic: {
            value: true,
            writable: true,
            enumerable: true
        }
    });

    var PageCache = function () {
        Object.defineProperties(this, {
            cache: {
                value: {},
                writable: false,
                enumerable: false,
                configurable: true
            }
        });
    };

    Object.defineProperties(PageCache.prototype, {
        URLAbsolute: {
            value: function(url) {
                var link = document.createElement('a');
                link.href = url;
                return link.href;
            },
            enumerable : true,
            writable: false
        },
        AddItem: {
            value: function (url, data) {
                url = this.URLAbsolute(url);

                if (this.isPresent(url)) {
                    return;
                }

                this.cache[url] = data;
            },
            writable: false,
            enumerable: true
        },
        isPresent: {
            value: function (url) {
                return this.cache.hasOwnProperty(url);
            },
            writable: false,
            enumerable: false
        },
        GetItem: {
            value: function (url) {
                url = this.URLAbsolute(url);
                if (this.isPresent(url)) {
                    return this.cache[url];
                }
                return null;
            },
            writable: false,
            enumerable: true
        }
    });

    local.Cache = new PageCache();

    var navigationfunctor = function (page) {

        var newDiv = page.documentFragment.firstChild.cloneNode();
        newDiv.page = page;
        Object.defineProperty(page, 'element', { value: newDiv, writable: false, enumerable: true, configurable: true });
        page.attempts = 0;
        page.functor = function () {

            if (!this.Basic) {
                delete this.attempts;
                delete this.functor;
                return this;
            } else {
                this.attempts++;
                if (this.attempts > 10)
                    throw new Error("Load timed out!");
                return StateMachine.Promise.Timeout(100).Then(this.functor);
            }

        }.bind(page);

        var promise = new StateMachine.Promise.Timeout(100).Then(page.functor)

        return promise.Then(function () {
            var oldElement = RootNode().firstChild;
            oldElement && oldElement.page && oldElement.page.Unload && oldElement.page.Unload();
            RootNode().appendChild(this.element);
            if (oldElement) {
                RootNode().removeChild(oldElement);
                delete oldElement.page;
            }
            if (this.Ready)
                this.Ready(this.element, this.State);
            Application.DisableSpinner();
        }.bind(page));
    };

    Object.defineProperties(local, {
        Load: {
            value: function (url, entry) {
                return HTTP.Load(url).Then(function (inner) {
                    var htmlDoc = document.implementation.createHTMLDocument("frag");
                    var base = htmlDoc.createElement("base");
                    htmlDoc.head.appendChild(base);
                    var anchor = htmlDoc.createElement("a");
                    htmlDoc.body.appendChild(anchor);
                    base.href = document.location.href;
                    anchor.setAttribute("href", url);
                    base.href = anchor.href;
                    htmlDoc.documentElement.innerHTML = inner;
                    htmlDoc.head.appendChild(base);
                    return htmlDoc;
                }).Then(function (doc) {
                    Object.defineProperty(this, 'loadedDocument', { value: doc, writable: false, configurable: true, enumerable: true });
                    return this;
                }.bind(entry)).Then(function (cacheObj) {

                    var href = cacheObj.url;
                    var cd = cacheObj.loadedDocument;
                    var b = cd.body;

                    forEach(cd.querySelectorAll('link[rel="stylesheet"], link[type="text/css"]'), addLink);
                    forEach(cd.getElementsByTagName('style'), function (e, i) { addStyle(e, href, i); });
                    forEach(cd.getElementsByTagName('script'), function (e, i) { addScript(e, href, i); });

                    forEach(b.getElementsByTagName('img'), function (e) { e.src = e.src; });
                    forEach(b.getElementsByTagName('a'), function (e) {
                        // for # only anchor tags, we don't update the href
                        //
                        if (e.href !== "") {
                            var href = e.getAttribute("href");
                            if (href && href[0] != "#") {
                                e.href = e.href;
                            }
                        }
                    });
                    var localScripts = b.getElementsByTagName("script");
                    while (localScripts.length > 0) {
                        var s = localScripts[0];
                        s.parentNode.removeChild(s);
                    }
                    var fragment = document.createDocumentFragment();
                    var imported = document.importNode(cd.body, true);
                    while (imported.childNodes.length > 0) {
                        fragment.appendChild(imported.childNodes[0]);
                    }

                    Object.defineProperty(cacheObj, 'documentFragment', { value: fragment, writable: false, configurable: false, enumerable: true });

                    return cacheObj;
                }).Then(function (cacheObj) {

                    if (cacheObj.loadedDocument) {
                        delete cacheObj.loadedDocument;
                    }

                    delete cacheObj.promise;
                    return cacheObj;
                });
            }, writable: false,
            enumerable: true
        },
        EnableSpinner: {
            value: function () {
                var spinner = document.getElementById("loadingSpinner");
                Utility.RemoveStyleClass(spinner, "Hidden");
                Utility.AddStyleClass(spinner, "Visible");
            },
            enumerable: true,
            writable: false,
        },
        DisableSpinner: {
            value: function () {
                var spinner = document.getElementById("loadingSpinner");
                Utility.RemoveStyleClass(spinner, "Visible");
                Utility.AddStyleClass(spinner, "Hidden");
            },
            enumerable: true,
            writable: false
        },
        Navigate: {
            value: function (url, options) {


                local.EnableSpinner();

                var item = local.Cache.GetItem(url);

                if (!item) {
                    item = this.Create(url, {
                        Ready: {
                            value: function (element) {
                            },
                            writable: false,
                            enumerable: true,
                            configurable: true
                        },
                        Unload: {
                            value: function () {
                            },
                            writable: false,
                            enumerable: true,
                            configurable: true
                        }
                    });
                    item.Page_Promise = this.Load(url, item);
                }
                Object.defineProperty(item, 'State', { value: options, writable: true, enumerable: true, configurable: true });
                return item.Page_Promise.Then(navigationfunctor);
                
            },
            writable: false,
            enumerable: true
        },
        Create: {
            value: function (url, methods) {

                var data = local.Cache.GetItem(url);

                if(!data) {
                    data = new CacheObject(url);
                    local.Cache.AddItem(url, data);
                } else {
                    data.Basic = false;
                }
                    
                methods && Object.defineProperties(data, methods);
                return data;
            },
            writable: false,
            enumerable: true
        }
    });
})(this.Page);

(function initTranslation(local) {

    Object.defineProperties(local, {
        language: {
            value: null,
            enumerable: false,
            writable: true
        },
        Translate: {
            value: function (id) {
                if (this.Dictionary.hasOwnProperty(id) == false)
                    return id;

                var that = "";

                var string = this.Dictionary[id];
                for (var index = 1; index < arguments.length; ++index) {
                    var toReplace = "";
                    toReplace += '{';
                    toReplace += index.toString();
                    toReplace += '}';
                    string = string.replace(toReplace, arguments[index].toString());
                }
                return string;
            },
            writable: false,
            enumerable: false
        },
        Dictionary: {
            value: {},
            writable: false,
            enumerable: true,
            configurable: true
        },
        Language: {
            value: function (value) {
                if (this.language != value) {
                    var url = "./resources/strings/" + value + "/strings.json";

                    return HTTP.Load(url).Then(function (jsonObj) {

                        if(typeof jsonObj == 'string')
                        {
                            jsonObj = JSON.parse(jsonObj);
                        }

                        Object.defineProperty(this, 'Dictionary', { value: jsonObj, writable: false, enumerable: true, configurable: true });

                        for (var index in this.Dictionary) {
                            var string = this.Dictionary[index];
                            string = string.replace(/<br>/gi, "\n");
                            this.Dictionary[index] = string;
                        }

                        this.language = value;
                    }.bind(local));
                }
                return StateMachine.Promise.Wrap();
            }
        }
    });

    String.prototype.Translate = function String_Translate(string) {
        var args = [this];
        for (var index = 0; index < arguments.length; ++index) {
            args.push(arguments[index]);
        }
        return Translation.Translate.apply(local, args);
    };

})(this.Translation);

(function initApplication(Root) {
    "use strict";

    function noop() { };

    var myApplication = Class.Design(function () {
        Object.defineProperties(this, {
            onInitialise: {
                value: null,
                writable: true,
                enumerable: true
            },
            onRun: {
                value: null,
                writable: true,
                enumerable: true
            },
            onShutdown: {
                value: null,
                writable: true,
                enumerable: true
            }
        });
    }, {
        EnableSpinner: {
            value: function () {
                var spinner = document.getElementById("loadingSpinner");
                spinner && (spinner.style.display = "block");
            },
            enumerable: true,
            writable: false,
        },
        DisableSpinner: {
            value: function () {
                var spinner = document.getElementById("loadingSpinner");
                spinner && (spinner.style.display = "none");
            },
            enumerable: true,
            writable: false
        }
    }, {
        Initialise: {
            value: function () {
                return this.onInitialise ? this.onInitialise() : false;
            }, writable: false, enumerable: false
        },
        Run: {
            value: function () {
                if (this.onRun)
                    return this.onRun();
                else
                    throw Error("No run function applied!");
            }, writable: false, enumerable: false
        },
        Shutdown: {
            value: function (reason) {
                this.onShutdown ? this.onShutdown() : false;
                document.close();
            }, writable: false, enumerable: false
        }
    });

    Root.Application = new myApplication();
    var Init = myApplication.Initialise.bind(Root.Application);
    var Shutdown = myApplication.Shutdown.bind(Root.Application);
    var Run = myApplication.Run.bind(Root.Application);

    StateMachine.Promise.Timeout().Then(Root.Application.DisableSpinner);

    window.onbeforeunload = function () {
        Shutdown();
    }

    document.onreadystatechange = function () {
        switch (document.readyState) {
            case 'interactive':
            case 'uninitialized':
                break;
            case 'complete':
                Translation.Language("en-GB").Then(Init).Then(Run);
                break;
            default:
                Shutdown();
                break;
        }
    };

})(this);

(function initUtility(local) {

    Object.defineProperties(local, {
        AddStyleClass: {
            value: function (item) {
                if (!item && !item["className"]) {
                    return;
                }

                var nameToAdd = item.className;

                for (var index = 1; index < arguments.length; ++index) {
                    var name = arguments[index];
                    if (typeof name != 'string') continue;
                    if (nameToAdd.length != 0)
                        nameToAdd += ' ';
                    nameToAdd += name;
                }

                item.className = nameToAdd;
            },
            writable: false,
            enumerable: true,
            configurable: false
        },
        RemoveStyleClass: {
            value: function (item) {
                if (!item && !item["className"]) {
                    return;
                }

                var list = item.className.split(' ');

                for (var index = 1; index < arguments.length; ++index) {
                    var name = arguments[index];
                    if (typeof name != 'string') continue;
                    var entry = list.indexOf(name);
                    if (entry != -1) {
                        list.splice(entry, 1);
                    }
                }

                list.unshift(item);
                item.className = '';
                local.AddStyleClass.apply(local, list);
            },
            writable: false,
            enumerable: true,
            configurable: false
        },
        HasStyleClass: {
            value: function (item) {
                if (!item && !item["className"]) {
                    return false;
                }

                var list = item.className.split(' ');

                var valid = false;

                for (var index = 1; index < arguments.length; ++index) {
                    var name = arguments[index];
                    if (typeof name != 'string') continue;
                    var entry = list.indexOf(name);
                    if (entry != -1) {
                        valid = true;
                    }
                }

                return valid;
            },
            writable: false,
            enumerable: true,
            configurable: false
        }
    });

})(this.Utility);

(function initDisplayElement(local) {

    var AlignType = {
        left: "Left",
        right: "Right",
        top: "Top",
        bottom: "Bottom",
        topleft: "TopLeft",
        topright: "TopRight",
        bottomleft: "BottomLeft",
        bottomright: "BottomRight",
        center: "Center",
        leftcenter: "LeftCenter",
        rightcenter: "RightCenter",
        topcenter: "TopCenter",
        bottomcenter: "BottomCenter",
    };

    local.AlignType = AlignType;

    var Base = Class.Design(function() {
        Object.defineProperties(this, {
            element: {
                value: null,
                writable: false,
                enumerable: false,
                configurable: true
            },
            alignment: {
                value: AlignType.left,
                writable: true,
                enumerable: false,
                configurable: false
            }
        });
        
    }, {
        ElementType: {
            set: function(type) {
                Object.defineProperty(this, 'element', {
                    value: document.createElement(type),
                    writable: false,
                    enumerable: false,
                    configurable: true
                });
                this.element.DataController = this;
            },
            enumerable: false
        },
        AddClass: {
            value: function () {
                if (this.element && arguments.length > 0) {
                    var list = [this.element];
                    for (var index = 0; index < arguments.length; ++index) {
                        list.push(arguments[index]);
                    }
                    Utility.AddStyleClass.apply(null, list);
                }
            },
            enumerable: true,
            writable: false,
            configurable: false
        },
        RemoveClass: {
            value: function (className) {
                this.element && Utility.RemoveStyleClass(this.element, className);
            },
            enumerable: true,
            writable: false,
            configurable: false
        },
        Parent: {
            get: function () {
                return this.element && this.element.parentElement;
            },
            set: function (value) {
                if (value && !value.appendChild) {
                    if (value && value.Element && typeof value.Element == 'object') {
                        value = value.Element;
                    } else {
                        return;
                    }
                }
                if (value) {
                    value.appendChild(this.element);
                } else if (this.Element) {
                    this.Element.parent = null;
                }
            },
            enumerable: true
        },
        Element: {
            get: function () {
                return this.element;
            },
            enumerable: true
        },
        Visible: {
            set: function (value) {
                if (!!value) {
                    this.RemoveClass("Hidden");
                    this.AddClass("Visible");
                } else {
                    this.RemoveClass("Visible");
                    this.AddClass("Hidden");
                }
            },
            get: function () {
                return Utility.HasStyleClass(this.element, "Visible");
            },
            enumerable: true,
            configurable: true
        },
        Dispose: {
            value: function () {
                this.element && this.element.DataController && (this.element.DataController = null)
                this.element && this.Parent && this.Parent.removeChild(this.element);
            },
            writable: false,
            enumerable: true,
            configurable: true

        },
        Position:{
            value: function( rect ) {
                var elem = this.element;

                if (!elem || !elem.style) return;

                elem.style.left = rect.left.toString() + "px";
                elem.style.right = rect.right.toString() + "px";
                elem.style.top = rect.top.toString() + "px";
                elem.style.bottom = rect.bottom.toString() + "px";
                elem.style.width = rect.width.toString() + "px";
                elem.style.height = rect.height.toString() + "px";
            },
            writable: false,
            enumerable: true,
            configurable: false
        },
        Translate: {
            value: function ( translationRect ) {
                var elem = this.element;
                var parent = this.Parent;
                if (!elem || !parent) return;

                var parentrect = parent.getClientRects()[0];
                var oldrect = elem.getClientRects()[0];
                var rect = { left: oldrect.left - parentrect.left, top: oldrect.top - parentrect.top, bottom: oldrect.bottom - parentrect.top, right: oldrect.right - parentrect.left, height: oldrect.height, width: oldrect.width }

                rect.left += translationRect.left;
                rect.right += translationRect.right;
                rect.top += translationRect.top;
                rect.bottom += translationRect.bottom;
                rect.height += translationRect.height;
                rect.width += translationRect.width;

                this.Position(rect);
            },
            writable: false,
            enumerable: true,
            configurable: false
        },
        Align: {
            value: function (alignType, internal) {

                var elem = this.element;
                var parent = this.Parent;

                if (elem && parent) {
                    var parentrect = parent.getClientRects()[0];
                    var oldrect = elem.getClientRects()[0];
                    var rect = { left: 0, top: 0, bottom: oldrect.height, right: oldrect.width, height: oldrect.height, width: oldrect.width }
                    elem.style.position = "relative";

                    switch(alignType) {
                        case AlignType.bottom:  {
                            rect.bottom = parentrect.height;
                            rect.top = parentrect.height - rect.height;
                            }
                            break;
                        case AlignType.top: {
                            rect.top = 0;
                            rect.bottom = rect.height;
                            }
                            break;
                        case AlignType.center: {
                            rect.top = (parentrect.height - rect.height) / 2;
                            rect.bottom = (parentrect.height + rect.height) / 2;
                            rect.left = (parentrect.width - rect.width) / 2;
                            rect.right = (parentrect.width + rect.width) / 2;
                        }
                            break;
                        case AlignType.leftcenter: {
                            rect.top = (parentrect.height - rect.height) / 2;
                            rect.bottom = (parentrect.height + rect.height) / 2;
                            rect.left = 0;
                            rect.right = rect.width;
                        }
                            break;
                        case AlignType.rightcenter: {
                            rect.top = (parentrect.height - rect.height) / 2;
                            rect.bottom = (parentrect.height + rect.height) / 2;
                            rect.left = parentrect.width - rect.width;
                            rect.right = parentrect.width;
                        }
                            break;
                        case AlignType.bottomcenter: {
                            rect.bottom = parentrect.height;
                            rect.top = parentrect.height - rect.height;
                            rect.left = (parentrect.width - rect.width) / 2;
                            rect.right = (parentrect.width + rect.width) / 2;
                        }
                            break;
                        case AlignType.topcenter: {
                            rect.top = 0;
                            rect.bottom = rect.height;
                            rect.left = (parentrect.width - rect.width) / 2;
                            rect.right = (parentrect.width + rect.width) / 2;
                        }
                            break;
                        case AlignType.topleft: {
                            rect.top = 0;
                            rect.bottom = rect.height;
                            rect.left = 0;
                            rect.right = rect.width;
                        }
                            break;
                        case AlignType.topright: {
                            rect.top = 0;
                            rect.bottom = rect.height;
                            rect.left = parentrect.width - rect.width;
                            rect.right = parentrect.width;
                        }
                            break;
                        case AlignType.right: {
                            rect.left = parentrect.width - rect.width;
                            rect.right = parentrect.width;
                        }
                            break;
                        case AlignType.bottomleft: {
                            rect.left = 0;
                            rect.right = rect.width;
                            rect.bottom = parentrect.height;
                            rect.top = parentrect.height - rect.height;
                        }
                        case AlignType.bottomright: {
                            rect.left = parentrect.width - rect.width;
                            rect.right = parentrect.width;
                            rect.bottom = parentrect.height;
                            rect.top = parentrect.height - rect.height;
                        }
                            break;
                        default: {
                            rect.left = 0;
                            rect.right = rect.width;
                            rect.top = 0;
                            rect.bottom = rect.height;
                        }
                    }
                    this.Position(rect);
                    this.alignment = alignType;
                }
            },
            writable: false,
            enumerable: true,
            configurable: false
        }
    });

    var cancelEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    Object.defineProperties(local, {
        Wrap: {
            value: Class.Derive(Base, function (element) {
                Object.defineProperty(this, 'element', {
                    value: element,
                    writable: false,
                    enumerable: false,
                    configurable: true
                });
                this.element && (this.element.DataController = this);
                this.AddClass("Visible", "Enabled");
            }),
            writable: false,
            configurable: false,
            enumerable: true
        },
        Div: {
            value: Class.Derive(Base, function (url) {
                this.ElementType = 'div';
                this.Source = url;
                this.AddClass("Visible", "Enabled");
            }, {
            }, {
            }),
            enumerable: true,
            writable: false,
            configurable: false
        },
        Image: {
            value: Class.Derive(Base, function (url) {
                this.ElementType = 'img';
                this.Source = url;
                this.AddClass("Visible", "Enabled", "Image");
            }, {
                Source: {
                    set: function (value) {
                        HTTP.Load(value).Then(function (value) { this.Element.src = value; }.bind(this));
                    },
                    enumerable: true
                }
            }, {}),
            enumerable: true,
            writable: false,
            configurable: false
        },
        Text: {
            value: Class.Derive(Base, function (text) {
                this.ElementType = 'div';
                this.Text = text;
                this.AddClass("Visible", "Enabled", "Text");
            }, {
                Text: {
                    get: function () {
                        return this.Element.innerText;
                    },
                    set: function (value) {
                        this.Element.innerText = value.Translate();
                    },
                    enumerable: true
                }
            }),
            writable: false,
            configurable: false,
            enumerable: true
        },
        Input: {
            value: Class.Derive(Base, function () {
                this.ElementType = 'input';
                this.onchange = cancelEvent;
                this.AddClass("Visible", "Enabled", "Input");
            },
            {
                Value: {
                    get: function () {
                        return this.Element.value;
                    },
                    set: function (value) {
                        this.Element.value = value;
                    },
                    enumerbale: true
                },
                OnChange: {
                    set: function (value) {
                        if (typeof value != 'function') {
                            value = cancelEvent;
                        }
                        this.Element.onchange = value;
                    },
                    enumerable: true
                }
            }),
            writable: false,
            configurable: false,
            enumerable: true
        },
        Button: {
            value: Class.Derive(Base, function () {
                this.ElementType = 'button';
                Object.defineProperties(this, {
                    clickaction: {
                        value: null,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    }
                });

                this.AddClass("Visible", "Enabled", "Button");
            },
            {
                OnClick: {
                    set: function (value) {
                        if (typeof value == 'function')
                            this.clickaction = this.element.onclick = value;
                    },
                    enumerable: true,
                    configurable: true
                },
                Enabled: {
                    set: function (value) {
                        if (!!value) {
                            this.element.onclick = this.clickaction;
                            Utility.RemoveStyleClass(this.element, "Disabled");
                            Utility.AddStyleClass(this.element, "Enabled");
                        } else {
                            this.element.onclick = cancelEvent;
                            Utility.RemoveStyleClass(this.element, "Enabled");
                            Utility.AddStyleClass(this.element, "Disabled");
                        }
                    },
                    get: function () {
                        return Utility.HasStyleClass(this.element, "Enabled");
                    },
                    enumerable: true,
                    configurable: true
                }
            }),
            enumerable: true,
            writable: false,
            configurable: false
        }
    });

})(this.DisplayElement);

(function initProfanityFilter(local) {

    Object.defineProperties(local, {
        Check: {
            value: function (text) {
                return text;
            },
            writable: false,
            enumerable: true
        }
    });

})(this.ProfanityFilter);

(function initInput(local) {

    Object.defineProperties(local, {
        KeyMap: {
            value: Object.freeze({
                "backspace":	 8,
                "tab":	 9,
                "enter":	 13,
                "shift":	 16,
                "ctrl":	 17,
                "alt":	 18,
                "pause":19,
                "break":	 19,
                "capslock":	 20,
                "escape":	 27,
                "pageup":	 33,
                "pagedown":	 34,
                "end":	 35,
                "home":	 36,
                "leftarrow":	 37,
                "uparrow":	 38,
                "rightarrow":	 39,
                "downarrow":	 40,
                "insert":	 45,
                "delete":	 46,
                "0":	 48,
                "1":     49,
                "2":	 50,
                "3":	 51,
                "4":	 52,
                "5":	 53,
                "6":	 54,
                "7":	 55,
                "8":	 56,
                "9":	 57,
                "a":	 65,
                "b":	 66,
                "c":	 67,
                "d":	 68,
                "e":	 69,
                "f":	 70,
                "g":	 71,
                "h":	 72,
                "i":	 73,
                "j":	 74,
                "k":	 75,
                "l":	 76,
                "m":	 77,
                "n":	 78,
                "o":	 79,
                "p":	 80,
                "q":	 81,
                "r":	 82,
                "s":	 83,
                "t":	 84,
                "u":	 85,
                "v":	 86,
                "w":	 87,
                "x":	 88,
                "y":	 89,
                "z":	 90,
                "leftwindowkey":	 91,
                "rightwindowkey":	 92,
                "selectkey":	 93,
                "numpad0":	 96,
                "numpad1":	 97,
                "numpad2":	 98,
                "numpad3":	 99,
                "numpad4":	 100,
                "numpad5":	 101,
                "numpad6":	 102,
                "numpad7":	 103,
                "numpad8":	 104,
                "numpad9":	 105,
                "multiply":	 106,
                "add":	 107,
                "subtract":	 109,
                "decimalpoint":	 110,
                "divide":	 111,
                "f1":	 112,
                "f2":	 113,
                "f3":	 114,
                "f4":	 115,
                "f5":	 116,
                "f6":	 117,
                "f7":	 118,
                "f8":	 119,
                "f9":	 120,
                "f10":	 121,
                "f11":	 122,
                "f12":	 123,
                "numlock":	 144,
                "scrolllock":	 145,
                "semi-colon":	 186,
                "equalsign":	 187,
                "comma":	 188,
                "dash":	 189,
                "period":	 190,
                "forwardslash":	 191,
                "graveaccent":	 192,
                "openbracket":	 219,
                "backslash":	 220,
                "closebraket":	 221,
                "singlequote":	 222
            }),
            writable: false,
            enumerable: true
        },

        GetKeyCode: {
            value: function (event) {
                var keyCode = ('which' in event) ? event.which : event.keyCode;
                return keyCode;
            },
            writable: false,
            enumerable: true
        }
    });

})(this.Input);