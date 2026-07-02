import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  return { toast, showToast };
};
