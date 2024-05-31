import { useCallback, useMemo } from 'react';
import { useForm } from '@context/Form';

import { randomUUID } from 'crypto';

const FieldBase: FCC<UI.FieldBaseProps> = props => {
    const { state: [form], onFieldChange } = useForm();

   

    return <div className="form-field">
        {props.children}
    </div>
}

export default FieldBase;