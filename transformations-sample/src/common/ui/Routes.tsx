/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Routes, Route } from "react-router"
import { ContentLayout } from "./ContentLayout"

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ContentLayout />} />
        </Routes>
    )
};
