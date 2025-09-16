/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";
import { Button, ComboBox, Divider, Flex, Input, InputGrid, Label, ProgressRadial } from "@itwin/itwinui-react";
import { TransformationStep } from "../../common/ui/TransformationStep";
import { AsyncLoader } from "../../common/ui/AsyncLoader";
import { useITwins, useITwinIModels, useIModelSavedViews, IModelsClientContext } from "../../common/hooks/iTwinPlatformHooks";
import { useToken } from "../../common/hooks/tokenHooks";
import { createConfiguration, createTransformation } from "../../common/library/transformationsClient";
import { useSampleState } from "../../common/hooks/sampleStateHooks";

export const CreateFilterBySavedViewForm = () => {
    const [transformationName, setTransformationName] = React.useState("");
    const [changesetDescription, setChangesetDescription] = React.useState("");
    const [sourceITwinId, setSourceITwinId] = React.useState("");
    const [sourceIModelId, setSourceIModelId] = React.useState("");
    const [savedViewId, setSavedViewId] = React.useState("");
    const [targetITwinId, setTargetITwinId] = React.useState("");
    const [targetIModelName, setTargetIModelName] = React.useState("");
    const [isCreating, setIsCreating] = React.useState(false);
    const sampleState = useSampleState();

    const iModelsClient = React.useContext(IModelsClientContext);
    const accessToken = useToken();

    const { iTwins, error: iTwinError, isLoading: isLoadingITwin } = useITwins();
    const iTwinOptions = React.useMemo(() => iTwins ? iTwins.map(itwin => ({ value: itwin.id, label: itwin.displayName })) : [], [iTwins]);

    const { iModels, error: iModelError, isLoading: isLoadingIModel } = useITwinIModels(sourceITwinId);
    const iModelOptions = React.useMemo(() => iModels ? iModels.map(iModel => ({ value: iModel.id, label: iModel.displayName })) : [], [iModels]);

    const { savedViews, error: savedViewsError, isLoading: isLoadingSavedViews } = useIModelSavedViews(sourceITwinId, sourceIModelId);
    const savedViewOptions = React.useMemo(() => savedViews ? savedViews.map(view => ({ value: view.id, label: view.displayName })) : [], [savedViews]);

    const validated = React.useMemo(() => {
        return (transformationName && changesetDescription && sourceITwinId && sourceIModelId && savedViewId && targetITwinId && targetIModelName) && !isCreating;
    }, [transformationName, changesetDescription, sourceITwinId, sourceIModelId, savedViewId, targetITwinId, targetIModelName, isCreating]);

    const startTransformation = () => {
        setIsCreating(true);
        const [scheme, token] = accessToken.split(" ");
        iModelsClient.iModels.createEmpty({
            authorization: () => Promise.resolve({ scheme, token }),
            iModelProperties: {
                name: targetIModelName,
                iTwinId: targetITwinId
            }
        }).then(targetIModel => {
            return createConfiguration({
                accessToken,
                name: transformationName,
                changesetDescription,
                sourceIModelId,
                targetIModelId: targetIModel.id,
                savedViewId: savedViewId
            });
        }).then(configuration => {
            sampleState.setConfigurationId(configuration.id);
            sampleState.setTargetITwinId(targetITwinId);
            sampleState.setTargetIModelId(configuration.targetIModelId);
            return createTransformation(accessToken, configuration.id);
        }).then(transformation => {
            sampleState.setTransformationId(transformation.id);
            setIsCreating(false);
        });
    };

    React.useEffect(() => {
        if (isCreating) {
            startTransformation();
        }
    }, [isCreating]);

    return (
        <Flex flexDirection="column" className="container">
            <TransformationStep
                transformationName={transformationName}
                setTransformationName={setTransformationName}
                changesetDescription={changesetDescription}
                setChangesetDescription={setChangesetDescription}
            />
            {transformationName && changesetDescription ?
                <>
                    <Divider />
                    <AsyncLoader isLoading={isLoadingITwin} error={iTwinError}>
                        <InputGrid className="input-container">
                            <Label>Select source iTwin</Label>
                            <ComboBox
                                options={iTwinOptions}
                                inputProps={{ placeholder: "Select source iTwin", required: true }}
                                onChange={e => setSourceITwinId(e)}
                            />
                        </InputGrid>
                    </AsyncLoader>
                </> :
                undefined
            }
            {sourceITwinId ?
                <AsyncLoader isLoading={isLoadingIModel} error={iModelError}>
                    <InputGrid className="input-container">
                        <Label>Select source iModel</Label>
                        <ComboBox
                            options={iModelOptions}
                            inputProps={{ placeholder: "Select source iModel", required: true }}
                            onChange={e => setSourceIModelId(e)}
                        />
                    </InputGrid>
                </AsyncLoader> :
                undefined
            }
            {sourceIModelId ?
                <AsyncLoader isLoading={isLoadingSavedViews} error={savedViewsError}>
                    <InputGrid className="input-container">
                        <Label>Select saved view</Label>
                        <ComboBox
                            options={savedViewOptions}
                            inputProps={{ placeholder: "Select saved view", required: true }}
                            onChange={e => setSavedViewId(e)}
                        />
                    </InputGrid>
                </AsyncLoader> :
                undefined
            }
            {savedViewId ?
                <>
                    <Divider />
                    <AsyncLoader isLoading={isLoadingITwin} error={iTwinError}>
                        <InputGrid className="input-container">
                            <Label>Select target iTwin</Label>
                            <ComboBox
                                options={iTwinOptions}
                                inputProps={{ placeholder: "Select target iTwin", required: true }}
                                onChange={e => setTargetITwinId(e)}
                            />
                        </InputGrid>
                    </AsyncLoader>
                    <InputGrid className="input-container">
                        <Label>Target iModel name</Label>
                        <Input
                            placeholder="Enter target iModel name"
                            value={targetIModelName}
                            onChange={e => setTargetIModelName(e.target.value)}
                            required
                        />
                    </InputGrid>
                </> :
                undefined
            }
            <Flex.Spacer />
            <Button
                styleType="cta"
                disabled={!validated}
                onClick={() => setIsCreating(true)}
                style={{ width: "256px" }}
            >
                {isCreating
                    ? <ProgressRadial />
                    : "Transform"
                }
            </Button>
        </Flex>
    );
};
