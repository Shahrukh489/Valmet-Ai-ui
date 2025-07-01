import { toast } from 'react-toastify';
import { ShoppingCart, CheckCircle } from 'lucide-react';

function ToastComp(props) {
    // This component now uses react-toastify instead of Bootstrap Toast
    const showToast = () => {
        toast.success(
            <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>{props.name} Added to Cart</span>
            </div>,
            {
                position: 'bottom-right',
                className: 'bg-card border text-foreground'
            }
        );
    };

    // Auto-show toast if name is provided
    if (props.name && props.autoShow) {
        showToast();
    }

    return null; // This component doesn't render anything, it just triggers toasts
}

// Export a utility function for easy toast usage
export const showCartToast = (itemName) => {
    toast.success(
        <div className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4 text-success" />
            <span>{itemName} added to cart</span>
        </div>,
        {
            position: 'bottom-right',
            className: 'bg-card border text-foreground'
        }
    );
};

export default ToastComp;