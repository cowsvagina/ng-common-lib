export interface APIResponse<T> {
    errorCode: number;
    errorMsg: string;
    data: T | { [p: string]: any };
}
