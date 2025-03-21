import UI from '@components/ui';
import { FieldType } from 'enum';

const FunctionParamField: FC<ControlMe.FunctionParamField> = props => {
    switch(props.type) {
        case FieldType.String:
            return <UI.Field
                type="text"
            />
        case FieldType.Number:
            return <UI.Field
                type="number"
            />
        case FieldType.Boolean:
            return <UI.Field
                type="checkbox"
            />

        default:
            console.warn(`FieldType ${props.type} is not implemented`);
    }
}

export default FunctionParamField;