import { IModelsClient } from "@itwin/imodels-client-management";
import React from "react";
import useSWR from "swr";
import { useToken } from "./tokenHooks";

export const IModelsClientContext = React.createContext<IModelsClient>(new IModelsClient());

export const useITwinIModels = (iTwinId: string | undefined) => {
    const client = React.useContext(IModelsClientContext);
    const accessToken = useToken();
    const [scheme, token] = React.useMemo(() => accessToken.split(" "), [accessToken]);
    const { data, error, isLoading } = useSWR(() => iTwinId ? `/imodels?iTwinId=${iTwinId}` : undefined, () => {
        return Array.fromAsync(client.iModels.getMinimalList({
            authorization: () => Promise.resolve({ scheme, token }),
            urlParams: {
                iTwinId: iTwinId || "",
            }
        }));
    });

    return { iModels: data, error, isLoading };
};

export interface ITwin {
    id: string;
    displayName: string;
}

export const useITwins = () => {
    const accessToken = useToken();
    const { data, error, isLoading } = useSWR("/itwins/recents", () => fetch("https://api.bentley.com/itwins/recents?subClass=Asset,Project", {
        headers: {
            Authorization: accessToken,
            Accept: "application/vnd.bentley.itwin-platform.v1+json"
        }
    }).then(res => res.json()).then(data => data.iTwins as ITwin[]));

    return { iTwins: data, error, isLoading };
};

export interface SavedView {
    id: string;
    displayName: string;
}

export const useIModelSavedViews = (iTwinId: string | undefined, iModelId: string | undefined) => {
    const accessToken = useToken();
    const { data, error, isLoading } = useSWR(() => iModelId && iTwinId ? `/savedViews/?iModelId=${iModelId}` : undefined, () => fetch(`https://api.bentley.com/savedViews?iTwinId=${iTwinId}&iModelId=${iModelId}`, {
        headers: {
            Authorization: accessToken,
            Accept: "application/vnd.bentley.itwin-platform.v1+json"
        }
    }).then(res => res.json()).then(data => data.savedViews as SavedView[]));

    return { savedViews: data, error, isLoading };
}
