/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Button, Flex, ProgressLinear, Text } from "@itwin/itwinui-react";
import React from "react";
import { useTransformation } from "../../common/hooks/transformationsHooks";
import { useSampleState } from "../../common/hooks/sampleStateHooks";
import { useSaveSampleState } from "../../common/hooks/searchParamsHooks";

export const ViewTransformationProgress = () => {
    const { state, setShowViewer } = useSampleState();
    const [status, setStatus] = React.useState(`Transformation is being started...`);
    const [showButton, setShowButton] = React.useState(false);
    const { transformation } = useTransformation(state.transformationId!);
    
    useSaveSampleState();

    React.useEffect(() => {
        switch (transformation?.status) {
            case "Created":
                setStatus("Transformation is being started...");
                break;
            case "Started":
                setStatus(`${transformation.processedEntityCount * 100 / transformation.totalEntityCount}% of iModel processed...`);
                break;
            case "Succeeded":
                setStatus(`Transformation has been successfully completed.`);
                setShowButton(true);
                break;
            case "Failed":
                setStatus(`Transformation has failed: ${transformation.errorMessage} (code: ${transformation.errorCode})`);
                break;
            case "Aborted":
                setStatus(`Transformation has been aborted.`);
                break;
            case "Initializing":
                setStatus(`Transformation is preparing to process iModel...`);
                break;
            default:
                break;
        }
    }, [state.transformationId, transformation]);

    const openViewer = () => {
        setShowViewer(true);
    }

    return (
        <Flex justifyContent="center" className="full-height" flexDirection="column">
            {showButton ? 
            <>
                <Text>Transformation completed successfully!</Text>
                <Button onClick={openViewer} styleType="cta">View Result</Button>
            </> :
            <div className="signin-content">
                <ProgressLinear indeterminate={true} labels={[status]} />
            </div>}
        </Flex>
    );
};
