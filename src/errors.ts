export class NitrousError extends Error { }

export type NitrousResponseErrorOptions = ErrorOptions & {
    response: Response,
}

export class NitrousResponseError extends NitrousError {
    readonly status: number;
    readonly statusText: string;
    readonly headers: Headers;

    constructor(message: string, { response, ...options }: NitrousResponseErrorOptions) {
        super(message, options);

        this.status = response.status;
        this.statusText = response.statusText;
        this.headers = response.headers;
    }
}

