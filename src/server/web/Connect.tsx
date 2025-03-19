import { useNavigate } from 'react-router';
import { useConnectionContext } from './Connection';

import Backdrop from '@muim/Backdrop';
import Progress from '@muim/CircularProgress';

import UI from '@components/ui';

const Connect = () => {
    const [connection, setConnection] = useConnectionContext();
    const navigate = useNavigate();

    // TODO add socket connection here

    return <Backdrop open>
        <UI.Stack className="connecting" direction="column" alignItems="center">
            <Progress />
            <UI.MUI.HelperText>Requesting access</UI.MUI.HelperText>
        </UI.Stack>
    </Backdrop>
}

export default Connect;