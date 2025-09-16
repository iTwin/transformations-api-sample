/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    },
    resolve: {
        alias: [
            {
                find: "~@itwin/appui-react",
                replacement: "@itwin/appui-react",
            },
            {
                find: "~@itwin/core-react",
                replacement: "@itwin/core-react",
            },
        ],
    },
    envPrefix: "IMJS_"
});