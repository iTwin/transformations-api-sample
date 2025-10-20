/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import "./App.scss";
import '@itwin/itwinui-react/styles.css';

import { Flex, ProgressLinear } from "@itwin/itwinui-react";
import React, {  } from "react";

import { Auth } from "./common/library/Auth";
import { MainLayout } from "./common/ui/MainLayout";
import { AppRoutes } from "./common/ui/Routes";
import { TokenContext } from "./common/hooks/tokenHooks";
import { SampleStateContext, useSampleReducer } from "./common/hooks/sampleStateHooks";
import { useSearchParamsSampleState } from "./common/hooks/searchParamsHooks";

const App: React.FC = () => {
    const [accessToken, setAccessToken] = React.useState<string | undefined>();
    const authClient = Auth.getClient();

    const initialState = useSearchParamsSampleState();
    const sampleState = useSampleReducer(initialState);

    const login = React.useCallback(async () => {
        try {
            await authClient.signInSilent();
        } catch {
            await authClient.signIn();
        }
    }, [authClient]);

    React.useEffect(() => {
        const getToken = async () => {
            await login();
            const token = await authClient.getAccessToken();
            setAccessToken(token);
        }

        void getToken();
    }, [login, authClient]);

    React.useEffect(() => {
        const getAccessToken = async () => {
            const token = await authClient.getAccessToken();
            setAccessToken(token);
        }

        if (authClient.hasSignedIn) {
            void getAccessToken();
        } else {
            void login();
        }
    }, [authClient, login]);

    return (
        <div className="viewer-container">
            <SampleStateContext.Provider value={sampleState}>
                {accessToken ? 
                    <TokenContext.Provider value={accessToken}>
                        <MainLayout>
                            <AppRoutes />
                        </MainLayout>
                    </TokenContext.Provider> :
                    <Flex justifyContent="center" className="full-height">
                        <div className="signin-content">
                            <ProgressLinear indeterminate={true} labels={["Signing in..."]} />
                        </div>
                    </Flex>
                }
            </SampleStateContext.Provider>
        </div>
    );
};

export default App;
