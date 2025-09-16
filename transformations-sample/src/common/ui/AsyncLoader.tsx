/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ProgressLinear } from "@itwin/itwinui-react";

export interface Props {
    isLoading: boolean;
    error?: Error;
    children: React.ReactNode;
}

export const AsyncLoader = ({ isLoading, error, children }: Props) => {
    if (isLoading) {
        return <ProgressLinear indeterminate={true} labels={["Loading..."]} />
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return children;
};
