/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import type { ScreenViewport } from "@itwin/core-frontend";
import { FitViewTool, IModelApp, StandardViewId } from "@itwin/core-frontend";
import { ECSchemaRpcInterface } from "@itwin/ecschema-rpcinterface-common";
import {
    MeasurementActionToolbar,
    MeasureTools,
    MeasureToolsUiItemsProvider,
} from "@itwin/measure-tools-react";
import {
    AncestorsNavigationControls,
    CopyPropertyTextContextMenuItem,
    createPropertyGrid,
    PropertyGridManager,
    ShowHideNullValuesSettingsMenuItem,
} from "@itwin/property-grid-react";
import {
    CategoriesTreeComponent,
    createTreeWidget,
    ModelsTreeComponent,
    TreeWidget,
} from "@itwin/tree-widget-react";
import {
    Viewer,
    ViewerContentToolsProvider,
    ViewerNavigationToolsProvider,
    ViewerPerformance,
    ViewerStatusbarItemsProvider,
} from "@itwin/web-viewer-react";
import { useCallback, useMemo } from "react";

import { Auth } from "../../common/library/Auth";
import { unifiedSelectionStorage } from "../../selectionStorage";
import { useSampleState } from "../../common/hooks/sampleStateHooks";

export const IModelViewer = () => {
    const { state } = useSampleState();
    const authClient = Auth.getClient();

    /** NOTE: This function will execute the "Fit View" tool after the iModel is loaded into the Viewer.
     * This will provide an "optimal" view of the model. However, it will override any default views that are
     * stored in the iModel. Delete this function and the prop that it is passed to if you prefer
     * to honor default views when they are present instead (the Viewer will still apply a similar function to iModels that do not have a default view).
     */
    const viewConfiguration = useCallback((viewPort: ScreenViewport) => {
        // default execute the fitview tool and use the iso standard view after tile trees are loaded
        const tileTreesLoaded = () => {
            return new Promise((resolve, reject) => {
                const start = new Date();
                const intvl = setInterval(() => {
                    if (viewPort.areAllTileTreesLoaded) {
                        ViewerPerformance.addMark("TilesLoaded");
                        ViewerPerformance.addMeasure(
                            "TileTreesLoaded",
                            "ViewerStarting",
                            "TilesLoaded"
                        );
                        clearInterval(intvl);
                        resolve(true);
                    }
                    const now = new Date();
                    // after 20 seconds, stop waiting and fit the view
                    if (now.getTime() - start.getTime() > 20000) {
                        reject();
                    }
                }, 100);
            });
        };

        tileTreesLoaded().finally(() => {
            void IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
            viewPort.view.setStandardRotation(StandardViewId.Iso);
        });
    }, []);

    const viewCreatorOptions = useMemo(
        () => ({ viewportConfigurer: viewConfiguration }),
        [viewConfiguration]
    );

    const onIModelAppInit = useCallback(async () => {
        // iModel now initialized
        await TreeWidget.initialize();
        await PropertyGridManager.initialize();
        await MeasureTools.startup();
        MeasurementActionToolbar.setDefaultActionProvider();
    }, []);

    return (
        <Viewer
            iTwinId={state.targetITwinId ?? ""}
            iModelId={state.targetIModelId ?? ""}
            authClient={authClient}
            viewCreatorOptions={viewCreatorOptions}
            enablePerformanceMonitors={true} // see description in the README (https://www.npmjs.com/package/@itwin/web-viewer-react)
            onIModelAppInit={onIModelAppInit}
            backendConfiguration={{
                defaultBackend: {
                    rpcInterfaces: [ECSchemaRpcInterface],
                },
            }}
            uiProviders={[
                new ViewerNavigationToolsProvider(),
                new ViewerContentToolsProvider({
                    vertical: {
                        measureGroup: false,
                    },
                }),
                new ViewerStatusbarItemsProvider(),
                {
                    id: "TreeWidgetUIProvider",
                    getWidgets: () => [
                        createTreeWidget({
                            trees: [
                                {
                                    id: ModelsTreeComponent.id,
                                    getLabel: () => ModelsTreeComponent.getLabel(),
                                    render: (props) => (
                                        <ModelsTreeComponent
                                            getSchemaContext={(iModel) => iModel.schemaContext}
                                            density={props.density}
                                            selectionStorage={unifiedSelectionStorage}
                                            selectionMode={"extended"}
                                            onPerformanceMeasured={props.onPerformanceMeasured}
                                            onFeatureUsed={props.onFeatureUsed}
                                        />
                                    ),
                                },
                                {
                                    id: CategoriesTreeComponent.id,
                                    getLabel: () => CategoriesTreeComponent.getLabel(),
                                    render: (props) => (
                                        <CategoriesTreeComponent
                                            getSchemaContext={(iModel) => iModel.schemaContext}
                                            density={props.density}
                                            selectionStorage={unifiedSelectionStorage}
                                            onPerformanceMeasured={props.onPerformanceMeasured}
                                            onFeatureUsed={props.onFeatureUsed}
                                        />
                                    ),
                                },
                            ],
                        }),
                    ],
                },
                {
                    id: "PropertyGridUIProvider",
                    getWidgets: () => [
                        createPropertyGrid({
                            autoExpandChildCategories: true,
                            ancestorsNavigationControls: (props) => (
                                <AncestorsNavigationControls {...props} />
                            ),
                            contextMenuItems: [
                                (props) => <CopyPropertyTextContextMenuItem {...props} />,
                            ],
                            settingsMenuItems: [
                                (props) => (
                                    <ShowHideNullValuesSettingsMenuItem
                                        {...props}
                                        persist={true}
                                    />
                                ),
                            ],
                        }),
                    ],
                },
                new MeasureToolsUiItemsProvider(),
            ]}
            selectionStorage={unifiedSelectionStorage}
        />
    );
};
