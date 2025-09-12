import useSWR from "swr";
import { useToken } from "./tokenHooks";
import { getTransformation, getConfiguration } from "../library/transformationsClient";

export const useTransformation = (transformationId: string) => {
    const accessToken = useToken();
    const { data, error, isLoading } = useSWR(`/${transformationId}`, () => getTransformation(accessToken, transformationId), { refreshInterval: 1000 });

    return { transformation: data, error, isLoading };
};

export const useConfiguration = (configurationId: string) => {
    const accessToken = useToken();
    const { data, error, isLoading } = useSWR(`/${configurationId}`, () => getConfiguration(accessToken, configurationId), { refreshInterval: 1000 });

    return { configuration: data, error, isLoading };
};
