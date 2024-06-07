import { useContext } from 'react';
import cntxt from './context';

export default function Button() {
    const c = useContext(cntxt);

    return (
        // <cntxt.Consumer>
        //     {({ btn }) => (
        //         <button>{btn}</button>
        //     )}
        // </cntxt.Consumer>
        <button>{c.btn}</button>

    )
}