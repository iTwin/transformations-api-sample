import { Input, InputGrid, Label, LabeledInput } from "@itwin/itwinui-react";

interface Props {
    transformationName: string;
    setTransformationName: (name: string) => void;
    changesetDescription: string;
    setChangesetDescription: (description: string) => void;
}

export const TransformationStep = (props: Props) => {
    return (
        <>
            <InputGrid className="input-container">
                <Label>Transformation name</Label>
                <Input
                    placeholder="Enter transformation name"
                    value={props.transformationName}
                    onChange={e => props.setTransformationName(e.target.value)}
                    required
                />
            </InputGrid>
            <InputGrid className="input-container">
                <Label>Changeset description</Label>
                <Input
                    placeholder="Enter changeset description for successful transformation"
                    value={props.changesetDescription}
                    onChange={e => props.setChangesetDescription(e.target.value)}
                    required
                />
            </InputGrid>
        </>
    )
};
