import combineClasses from '@utils/string/combineClasses';

const FieldBase: FCC<UI.FieldBaseProps> = props => <div className={combineClasses('form-field', props.className)}>
    {props.children}
</div>

export default FieldBase;