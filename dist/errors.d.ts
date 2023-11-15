export declare const xComError: {
    notFound: (message: string) => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
    clientNotAuthorized: () => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
    userNotAuthenticated: () => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
    requestTypeNotAccepted: () => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
};
