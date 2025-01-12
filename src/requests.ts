export type NitrousInit = {
    trigger?: string;
    target?: string;
}

export type NitrousRequestInit = RequestInit & {
    nitrous?: NitrousInit;
};

export default class NitrousRequest extends Request {
    readonly nitrous: NitrousInit;

    constructor(input: RequestInfo | URL, {
        headers: originalHeaders = {},
        nitrous = {},
        ...init
    }: NitrousRequestInit = {}) {
        const headers: HeadersInit = {
            ...originalHeaders,
            Accept: 'text/html',
            'Accept-Charset': 'utf-8',
            'X-Requested-With': 'Nitrous',
            ...(
                nitrous.trigger
                    ? { 'X-Nitrous-Trigger': nitrous.trigger }
                    : {}
            ),
            ...(
                nitrous.target
                    ? { 'X-Nitrous-Target': nitrous.target }
                    : {}
            ),
        };

        super(input, { ...init, headers });
        this.nitrous = nitrous;
    }
}

export type NitrousElementRequestInit = Omit<NitrousRequestInit, 'method' | 'body' | 'nitrous'> & {
    nitrous?: Omit<NitrousInit, 'trigger'>;
};

export class NitrousHyperlinkRequest extends NitrousRequest {
    constructor(el: Element & HTMLHyperlinkElementUtils, {
        nitrous = {},
        ...init
    }: NitrousElementRequestInit = {}) {
        super(el.href, {
            ...init,
            method: 'GET',
            nitrous: {
                ...nitrous,
                trigger: el.id,
            }
        });
    }
}

export class NitrousFormRequest extends NitrousRequest {
    constructor(el: HTMLFormElement, {
        nitrous = {},
        ...init
    }: NitrousElementRequestInit) {
        const data = new FormData(el);

        const body: BodyInit = el.enctype !== 'multipart/form-data'
            ? new URLSearchParams([...data.entries()] as ([string, string])[])
            : data;

        super(el.action, {
            ...init,
            method: el.method,
            body,
            nitrous: {
                ...nitrous,
                trigger: el.id,
            }
        });
    }
}
