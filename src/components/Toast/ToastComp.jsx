import { useEffect } from 'react';
import { showToast } from '../../lib/toast-utils';

function ToastComp(props) {
    // Auto-show toast if name is provided
    useEffect(() => {
        if (props.name && props.autoShow) {
            showToast.cart(props.name);
        }
    }, [props.name, props.autoShow]);

    return null; // This component doesn't render anything, it just triggers toasts
}

// Export a utility function for easy toast usage
export const showCartToast = (itemName) => {
    showToast.cart(itemName);
};

export default ToastComp;