import React from "react";
import { sampleReducer, SampleState } from "../library/sampleState";

export function useSampleReducer(initialState: SampleState) {
    const [state, dispatch] = React.useReducer(sampleReducer, initialState);

    const setConfigurationId = (id: string) => {
        dispatch({ type: "SET_CONFIGURATION_ID", payload: id });
    };
    const setTransformationId = (id: string) => {
        dispatch({ type: "SET_TRANSFORMATION_ID", payload: id });
    };
    const setTargetITwinId = (id: string) => dispatch({ type: "SET_TARGET_ITWIN_ID", payload: id });
    const setTargetIModelId = (id: string) => dispatch({ type: "SET_TARGET_IMODEL_ID", payload: id });
    const reset = () => dispatch({ type: "RESET" });
    const setShowViewer = (show: boolean) => dispatch({ type: "SET_SHOW_VIEWER", payload: show });

    return {
        state,
        setConfigurationId,
        setTransformationId,
        setTargetITwinId,
        setTargetIModelId,
        setShowViewer,
        reset
    };
}

export const SampleStateContext = React.createContext({} as ReturnType<typeof useSampleReducer>);

export function useSampleState() {
    const state = React.useContext(SampleStateContext);

    return state;
}
