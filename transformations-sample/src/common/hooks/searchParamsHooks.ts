/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useNavigate, useSearchParams } from "react-router";
import { useSampleState } from "./sampleStateHooks";
import React from "react";

export function useSearchParamsSampleState() {
    const [searchParams] = useSearchParams();

    return {
        transformationId: searchParams.get("transformationId") ?? undefined,
        configurationId: searchParams.get("configurationId") ?? undefined,
        targetITwinId: searchParams.get("targetITwinId") ?? undefined,
        targetIModelId: searchParams.get("targetIModelId") ?? undefined,
    }
}

export function useSaveSampleState() {
    const { state } = useSampleState();
    const [_, setSearchParams] = useSearchParams();

    const saveState = () => {
        const params = new URLSearchParams();
        if (state.configurationId)
            params.set("configurationId", state.configurationId);
        if (state.transformationId)
            params.set("transformationId", state.transformationId);
        if (state.targetITwinId)
            params.set("targetITwinId", state.targetITwinId);
        if (state.targetIModelId)
            params.set("targetIModelId", state.targetIModelId);
        setSearchParams(params);
    };
    
    React.useEffect(() => {
        saveState();
    }, [state]);
}
