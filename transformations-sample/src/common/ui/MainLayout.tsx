import '@itwin/itwinui-layouts-css/styles.css';

import { SvgItwin } from "@itwin/itwinui-icons-react";
import { PageLayout } from "@itwin/itwinui-layouts-react";
import { Footer, Header, HeaderLogo } from "@itwin/itwinui-react";
import "./layout.scss";

export interface Props {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
    return (
        <PageLayout>
            <PageLayout.Header>
                <Header
                    appLogo={<HeaderLogo logo={<SvgItwin />}>Transformations samples</HeaderLogo>}
                />
            </PageLayout.Header>

            <PageLayout.Content>
                {children}
            </PageLayout.Content>

            <PageLayout.BottomBar className="footer">
                <Footer />
            </PageLayout.BottomBar>
        </PageLayout>
    );
};
