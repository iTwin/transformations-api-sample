export interface SampleState {
    configurationId?: string;
    transformationId?: string;
    targetITwinId?: string;
    targetIModelId?: string;
    showViewer?: boolean;
}

export type SampleAction =
    | { type: "SET_CONFIGURATION_ID", payload: string }
    | { type: "SET_TRANSFORMATION_ID", payload: string }
    | { type: "SET_TARGET_ITWIN_ID", payload: string }
    | { type: "SET_TARGET_IMODEL_ID", payload: string }
    | { type: "SET_SHOW_VIEWER", payload: boolean }
    | { type: "RESET" };

export function sampleReducer(state: SampleState, action: SampleAction): SampleState {
    switch (action.type) {
        case "SET_CONFIGURATION_ID":
            return { ...state, configurationId: action.payload };
        case "SET_TRANSFORMATION_ID":
            return { ...state, transformationId: action.payload };
        case "SET_TARGET_ITWIN_ID":
            return { ...state, targetITwinId: action.payload };
        case "SET_TARGET_IMODEL_ID":
            return { ...state, targetIModelId: action.payload };
        case "SET_SHOW_VIEWER":
            return { ...state, showViewer: action.payload };
        case "RESET":
            return { configurationId: undefined, transformationId: undefined, targetITwinId: undefined, targetIModelId: undefined, showViewer: undefined };
        default:
            return state;
    }
}