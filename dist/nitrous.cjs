
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "defineNitrous", function () { return $34ef62e549118b26$export$94e464f5235b694f; });
class $8d960040d6aee23c$export$8b798890db6ddfa7 extends Error {
}
class $8d960040d6aee23c$export$9e533b70869ab88 extends $8d960040d6aee23c$export$8b798890db6ddfa7 {
    status;
    statusText;
    headers;
    constructor(message, { response: response, ...options }){
        super(message, options);
        this.status = response.status;
        this.statusText = response.statusText;
        this.headers = response.headers;
    }
}


class $75a469d8acd6483f$export$2e2bcd8739ae039 extends Request {
    nitrous;
    constructor(input, { headers: originalHeaders = {}, nitrous: nitrous = {}, ...init } = {}){
        const headers = {
            ...originalHeaders,
            Accept: 'text/html',
            'Accept-Charset': 'utf-8',
            'X-Requested-With': 'Nitrous',
            ...nitrous.trigger ? {
                'X-Nitrous-Trigger': nitrous.trigger
            } : {},
            ...nitrous.target ? {
                'X-Nitrous-Target': nitrous.target
            } : {}
        };
        super(input, {
            ...init,
            headers: headers
        });
        this.nitrous = nitrous;
    }
}
class $75a469d8acd6483f$export$c5b2e5324cfde4af extends $75a469d8acd6483f$export$2e2bcd8739ae039 {
    constructor(el, { nitrous: nitrous = {}, ...init } = {}){
        super(el.href, {
            ...init,
            method: 'GET',
            nitrous: {
                ...nitrous,
                trigger: el.id
            }
        });
    }
}
class $75a469d8acd6483f$export$94597ea2ec5c8ade extends $75a469d8acd6483f$export$2e2bcd8739ae039 {
    constructor(el, { nitrous: nitrous = {}, ...init }){
        const data = new FormData(el);
        const body = el.enctype !== 'multipart/form-data' ? new URLSearchParams([
            ...data.entries()
        ]) : data;
        super(el.action, {
            ...init,
            method: el.method,
            body: body,
            nitrous: {
                ...nitrous,
                trigger: el.id
            }
        });
    }
}


class $31fe49aa2b69d749$var$NitrousRequestHandler {
    nitrous;
    timeout;
    _controller;
    constructor(nitrous, timeout){
        this.nitrous = nitrous;
        this.timeout = timeout;
        this._controller = new AbortController();
    }
    abort(reason) {
        this._controller.abort(reason);
        this._controller = new AbortController();
    }
    async handleRequest(req, target) {
        const signal = !this.timeout ? this._controller.signal : AbortSignal.any([
            AbortSignal.timeout(this.timeout),
            this._controller.signal
        ]);
        const res = await fetch(req, {
            signal: signal
        });
        if (!res.ok) throw new (0, $8d960040d6aee23c$export$9e533b70869ab88)(`Invalid status code: '${res.status} ${res.statusText}'`, {
            response: res
        });
        const html = await res.text();
        this.nitrous.swap(html, target);
    }
}
class $31fe49aa2b69d749$export$1503f43ba49760aa extends $31fe49aa2b69d749$var$NitrousRequestHandler {
    handleEvent(e) {
        e.preventDefault();
        const req = new (0, $75a469d8acd6483f$export$c5b2e5324cfde4af)(e.target, {
            nitrous: {
                target: this.nitrous.target
            }
        });
        const target = e.target.dataset['target'] ? this.nitrous.querySelector(e.target.dataset['target']) : null;
        this.handleRequest(req, target).catch(console.error);
    }
}
class $31fe49aa2b69d749$export$45eab262e9be2d6b extends $31fe49aa2b69d749$var$NitrousRequestHandler {
    handleEvent(e) {
        e.preventDefault();
        const req = new (0, $75a469d8acd6483f$export$94597ea2ec5c8ade)(e.target, {
            nitrous: {
                target: this.nitrous.target
            }
        });
        const target = e.target.dataset['target'] ? this.nitrous.querySelector(e.target.dataset['target']) : null;
        this.handleRequest(req, target).catch(console.error);
    }
}



function $34ef62e549118b26$export$94e464f5235b694f(name, { include: include = [
    'a',
    'area'
], exclude: exclude = [], swapTitle: swapTitle = true } = {}) {
    return class Nitrous extends HTMLElement {
        static #_ = customElements.define(name, this);
        static swapTitle = swapTitle;
        _parser = new DOMParser();
        _onClick = new (0, $31fe49aa2b69d749$export$1503f43ba49760aa)(this);
        _onSubmit = new (0, $31fe49aa2b69d749$export$45eab262e9be2d6b)(this);
        _include = include instanceof Array ? include.join(', ') : include;
        _exclude = exclude instanceof Array ? exclude.join(', ') : exclude;
        get include() {
            return this._include;
        }
        set include(value) {
            this._include = value instanceof Array ? value.join(',') : value;
        }
        get exclude() {
            return this._exclude;
        }
        set exclude(value) {
            this._exclude = value instanceof Array ? value.join(',') : value;
        }
        get target() {
            return this.getAttribute('target') ?? '';
        }
        set target(value) {
            this.setAttribute('target', value);
        }
        connectedCallback() {
            this.register();
        }
        disconnectedCallback() {
            this.unregister();
        }
        register(root = this) {
            for (const el of root.querySelectorAll(this._include)){
                if (el.matches(this._exclude)) continue;
                switch(true){
                    case el instanceof HTMLAnchorElement && el.dataset['nitrous'] !== 'false':
                    case el instanceof HTMLAreaElement && el.dataset['nitrous'] !== 'false':
                        el.addEventListener('click', this._onClick);
                        break;
                    case el instanceof HTMLFormElement && el.dataset['nitrous'] !== 'false':
                        el.addEventListener('submit', this._onSubmit);
                        break;
                    default:
                        continue;
                }
            }
        }
        unregister(root = this) {
            for (const el of root.querySelectorAll(this._include)){
                if (el.matches(this._exclude)) continue;
                switch(true){
                    case el instanceof HTMLAnchorElement && el.dataset['nitrous'] !== 'false':
                    case el instanceof HTMLAreaElement && el.dataset['nitrous'] !== 'false':
                        el.removeEventListener('click', this._onClick);
                        break;
                    case el instanceof HTMLFormElement && el.dataset['nitrous'] !== 'false':
                        el.removeEventListener('submit', this._onSubmit);
                        break;
                    default:
                        continue;
                }
            }
        }
        swap(input, target = null) {
            const dom = typeof input === 'string' ? this._parser.parseFromString(input, 'text/html') : input;
            target ??= this.querySelector(this.target);
            if (!target) throw new (0, $8d960040d6aee23c$export$8b798890db6ddfa7)(`Target '${this.target}' does not exist`);
            target.replaceChildren(...Array.from(dom.body.childNodes).map((node)=>document.adoptNode(node)));
            if (Nitrous.swapTitle) document.title = dom.title;
        }
    };
}


//# sourceMappingURL=nitrous.cjs.map
