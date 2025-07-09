import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertCircle, Info, ShoppingCart } from "lucide-react";

// Modern toast utility functions to replace react-toastify
export const showToast = {
  success: (message, options = {}) => {
    toast({
      title: options.title || "Success",
      description: message,
      variant: "default",
      ...options,
    });
  },

  error: (message, options = {}) => {
    toast({
      title: options.title || "Error",
      description: message,
      variant: "destructive",
      ...options,
    });
  },

  warning: (message, options = {}) => {
    toast({
      title: options.title || "Warning",
      description: message,
      variant: "default",
      ...options,
    });
  },

  info: (message, options = {}) => {
    toast({
      title: options.title || "Info",
      description: message,
      variant: "default",
      ...options,
    });
  },

  // Specialized toast for cart operations
  cart: (itemName, options = {}) => {
    toast({
      title: "Added to Cart",
      description: `${itemName} has been added to your cart`,
      variant: "default",
      ...options,
    });
  },

  // Generic toast with custom content
  custom: (title, description, options = {}) => {
    toast({
      title,
      description,
      ...options,
    });
  }
};

// Legacy compatibility functions for easy migration
export const legacyToast = {
  success: (message, options = {}) => showToast.success(message, options),
  error: (message, options = {}) => showToast.error(message, options),
  warn: (message, options = {}) => showToast.warning(message, options),
  info: (message, options = {}) => showToast.info(message, options),
};

// Export individual functions for convenience
export const { success, error, warning, info, cart, custom } = showToast;