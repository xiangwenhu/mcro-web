export default interface IOSSOption {
    accessKeyId: string;
    accessKeySecret: string;
    stsToken?: string;
    bucket?: string;
    endpoint?: string;
    region?: string;
    internal?: boolean;
    secure?: boolean;
    timeout?: string | number;
    cname?: boolean;
    isRequestPay?: boolean;
    useFetch?: boolean;
}
