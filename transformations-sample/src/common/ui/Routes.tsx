import { Routes, Route } from "react-router"
import { ContentLayout } from "./ContentLayout"

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ContentLayout />} />
        </Routes>
    )
};
