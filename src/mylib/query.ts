// useQuery 只在超时错误时，才重试
export const retryTimeout = (_failureCount: number, err: Error) => err.message.toLowerCase().includes("timeout")