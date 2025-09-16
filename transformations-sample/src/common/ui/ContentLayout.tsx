/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Flex, Surface } from "@itwin/itwinui-react";
import { CreateFilterBySavedViewForm } from "../../filter-sample/create-configuration/CreateFilterBySavedViewForm";
import { ViewConfiguration } from "../../filter-sample/view-progress/ViewConfiguration";
import { ViewTransformationProgress } from "../../filter-sample/view-progress/ViewTransformationProgress";
import { IModelViewer } from "../../filter-sample/view-results/IModelViewer";
import { useSampleState } from "../hooks/sampleStateHooks";

export const ContentLayout = () => {
    const { state } = useSampleState();

    return (
        state.showViewer ?
            <IModelViewer /> : 
            <Flex className="full-height content" gap="m">
                <Flex.Item flex="1" className="full-height">
                    <Surface className="full-height">
                        {state.configurationId ?
                            <ViewConfiguration configurationId={state.configurationId} /> :
                            <CreateFilterBySavedViewForm />
                        }
                    </Surface>
                </Flex.Item>
                <Flex.Item flex="1" className="full-height">
                    {state.transformationId ?
                        <Surface className="full-height">
                                <ViewTransformationProgress />
                        </Surface> :
                        null
                    }
                </Flex.Item>
            </Flex>
    );
};
