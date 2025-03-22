import UI from '@components/ui';
import { FieldType } from 'enum';

import FileSelect from '../FileSelect';

const FunctionParamField: FC<ControlMe.FunctionParamField & {
    value?: unknown;
    onChange?(v: unknown): void;
    error?: string;
}> = props => {
    switch(props.type) {
        case FieldType.String:
            return <UI.Field
                type="text"
                label={props.label}
                description={props.description}
                onChange={props.onChange}
                value={props.value as string}
                defaultValue={props.defaultValue as string}
                multiline={props.multiline}
                sx={props.sx}
                error={props.error}
            />
        case FieldType.Number:
            return <UI.Field
                type="number"
                label={props.label}
                description={props.description}
                onChange={props.onChange}
                value={props.value as number}
                defaultValue={props.defaultValue as number}
                sx={props.sx}
                error={props.error}
            />
        case FieldType.Boolean:
            return <UI.Field
                type="checkbox"
                label={props.label}
                description={props.description}
                onChange={props.onChange}
                value={props.value as boolean}
                defaultValue={props.defaultValue as boolean}
                sx={props.sx}
                error={props.error}
            />
        /*case FieldType.File: // TODO this needs to be wrapped in a button
            <FileSelect
                fileType={props.fileType}
            />*/

        default:
            console.warn(`FieldType ${props.type} is not implemented`);
    }
}

export default FunctionParamField;