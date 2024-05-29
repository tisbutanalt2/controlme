import Backdrop from '@muim/Backdrop';
import CircularProgress from '@muim/CircularProgress';

const Loading: FC<{ visible: boolean }> = ({ visible }) => <Backdrop open={visible}>
    <CircularProgress />
</Backdrop>

export default Loading;