import { useModule } from '@context/Module';

const Module: FC<{ name: string; persistent?: boolean }> = props => {
    const isCurrent = useModule() === props.name;
    if (!isCurrent && !props.persistent) return null;

    return <div hidden={!isCurrent}>
        {props.children}
    </div>
}

export default Module;