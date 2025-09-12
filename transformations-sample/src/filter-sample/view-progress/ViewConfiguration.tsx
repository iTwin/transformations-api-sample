import { Divider, Flex, InputGrid, Label, Text } from "@itwin/itwinui-react";
import { useConfiguration } from "../../common/hooks/transformationsHooks";

export interface Props {
    configurationId: string;
}

export const ViewConfiguration = ({ configurationId }: Props) => {
    const { configuration, isLoading } = useConfiguration(configurationId);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (!configuration) {
        return <div>No configuration found</div>;
    }
    return (
        <Flex flexDirection="column" alignItems="flex-start" gap="m" className="container">
            <InputGrid>
                <Label>Name</Label>
                <Text>{configuration.name}</Text>
            </InputGrid>
            <Divider />
            <InputGrid>
                <Label>ID</Label>
                <Text>{configuration.id}</Text>
            </InputGrid>
            <Divider />
            <InputGrid>
                <Label>Changeset Description</Label>
                <Text>{configuration.changesetDescription}</Text>
            </InputGrid>
            <Divider />
            <InputGrid>
                <Label>Created Date</Label>
                <Text>{configuration.createdDateTime.toString()}</Text>
            </InputGrid>
            <Divider />
            <InputGrid>
                <Label>Modified Date</Label>
                <Text>{configuration.modifiedDateTime.toString()}</Text>
            </InputGrid>
            <Divider />
            <InputGrid>
                <Label>Transform Type</Label>
                <Text>{configuration.transformType}</Text>
            </InputGrid>
            <Divider />
            <InputGrid>
                <Label>Source IModel ID</Label>
                <Text>{configuration.sourceIModelId}</Text>
            </InputGrid>
            <Divider />
            <InputGrid>
                <Label>Target IModel ID</Label>
                <Text>{configuration.targetIModelId}</Text>
            </InputGrid>
            <Divider />
            <InputGrid>
                <Label>Saved view</Label>
                <Text>{configuration.transformParameters.savedViewId}</Text>
            </InputGrid>
            <Divider />
        </Flex>
    );
};
