/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export interface ChangesetInfo {
    id: string;
    index: number;
}

export interface Transformation {
    id: string;
    status: "Created" | "Started" | "Succeeded" | "Failed" | "Aborted" | "Initializing";
    errorMessage: string;
    errorCode: number;
    processedEntityCount: number;
    totalEntityCount: number;
    createdDateTime: Date;
    finishedDateTime?: Date;
    sourceChangeset?: ChangesetInfo;
    lastTargetChangesetPushed?: ChangesetInfo;
    configurationId: string;
}

interface Link {
    href: string;
}

interface TransformationResponse {
    transformation: {
        id: string;
        status: "Created" | "Started" | "Succeeded" | "Failed" | "Aborted" | "Initializing";
        errorMessage: string;
        errorCode: number;
        processedEntityCount: number;
        totalEntityCount: number;
        createdDateTime: string;
        finishedDateTime: string;
        sourceChangeset?: ChangesetInfo;
        lastTargetChangesetPushed?: ChangesetInfo;
        _links: {
            configuration: Link;
        }
    }
}

export interface ConfigurationArgs {
    name: string;
    changesetDescription: string;
    sourceIModelId: string;
    targetIModelId: string;
    savedViewId: string;
    accessToken: string;
}

export interface Configuration {
    id: string;
    name: string;
    changesetDescription: string;
    createdDateTime: Date;
    modifiedDateTime: Date;
    transformType: "FilterByViewDefinition";
    sourceIModelId: string;
    targetIModelId: string;
    transformParameters: {
        savedViewId: string;
    }
}

interface ConfigurationResponse {
    configuration: {
        id: string;
        name: string;
        changesetDescription: string;
        createdDateTime: Date;
        modifiedDateTime: Date;
        transformType: "FilterByViewDefinition";
        transformParameters: {
            _links: {
                savedView: Link;
            }
        }
        _links: {
            sourceIModel: Link;
            targetIModel: Link;
        }
    }
}

export const BASE_API_URL = "https://api.bentley.com/transformations";
export const DEFAULT_API_HEADERS = {
    Accept: "application/vnd.bentley.itwin-platform.v2+json",
    "Content-Type": "application/json",
};

export const getTransformation = async(accessToken: string, transformationId: string): Promise<Transformation> => {
    const response = await fetch(`${BASE_API_URL}/${transformationId}`, {
        headers: {
            ...DEFAULT_API_HEADERS,
            "Authorization": accessToken
        }
    });

    const parseResponse: TransformationResponse = await response.json();

    return {
        ...parseResponse.transformation,
        createdDateTime: new Date(parseResponse.transformation.createdDateTime),
        finishedDateTime: parseResponse.transformation.finishedDateTime ? new Date(parseResponse.transformation.finishedDateTime) : undefined,
        configurationId: parseResponse.transformation._links.configuration.href.split("/").pop() || ""
    };
};

export const getConfiguration = async(accessToken: string, configurationId: string): Promise<Configuration> => {
    const response = await fetch(`${BASE_API_URL}/configurations/${configurationId}`, {
        headers: {
            ...DEFAULT_API_HEADERS,
            "Authorization": accessToken
        }
    });

    const data: ConfigurationResponse = await response.json();

    return {
        ...data.configuration,
        transformParameters: {
            savedViewId: data.configuration.transformParameters._links.savedView.href.split("/").pop() || ""
        },
        sourceIModelId: data.configuration._links.sourceIModel.href.split("/").pop() || "",
        targetIModelId: data.configuration._links.targetIModel.href.split("/").pop() || "",
        createdDateTime: new Date(data.configuration.createdDateTime),
        modifiedDateTime: new Date(data.configuration.modifiedDateTime),
    };
};

export const createTransformation = async(accessToken: string, configurationId: string): Promise<Transformation> => {
    const response = await fetch(`${BASE_API_URL}`, {
        method: "POST",
        headers: {
            ...DEFAULT_API_HEADERS,
            "Authorization": accessToken
        },
        body: JSON.stringify({ configurationId })
    });

    const parseResponse: TransformationResponse = await response.json();

    return {
        ...parseResponse.transformation,
        createdDateTime: new Date(parseResponse.transformation.createdDateTime),
        finishedDateTime: parseResponse.transformation.finishedDateTime ? new Date(parseResponse.transformation.finishedDateTime) : undefined,
        configurationId: parseResponse.transformation._links.configuration.href.split("/").pop() || ""
    };
};

export const createConfiguration = async(configurationProps: ConfigurationArgs): Promise<Configuration> => {
    const response = await fetch(`${BASE_API_URL}/configurations/filter-by-saved-view`, {
        method: "POST",
        headers: {
            ...DEFAULT_API_HEADERS,
            "Authorization": configurationProps.accessToken
        },
        body: JSON.stringify({
            name: configurationProps.name,
            changesetDescription: configurationProps.changesetDescription,
            sourceIModelId: configurationProps.sourceIModelId,
            targetIModelId: configurationProps.targetIModelId,
            transformParameters: {
                savedViewId: configurationProps.savedViewId,
                viewMode: "IncludeNewContent"
            }
        })
    });

    const data: ConfigurationResponse = await response.json();

    return {
        ...data.configuration,
        transformParameters: {
            savedViewId: data.configuration.transformParameters._links.savedView.href.split("/").pop() || ""
        },
        sourceIModelId: data.configuration._links.sourceIModel.href.split("/").pop() || "",
        targetIModelId: data.configuration._links.targetIModel.href.split("/").pop() || "",
        createdDateTime: new Date(data.configuration.createdDateTime),
        modifiedDateTime: new Date(data.configuration.modifiedDateTime),
    };
}