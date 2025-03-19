import Backdrop from '@muim/Backdrop';
import Progress from '@muim/CircularProgress';

const Loading = () => <Backdrop open>
    <Progress color="inherit" />
</Backdrop>

export default Loading;