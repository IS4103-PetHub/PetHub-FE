import { createContext, useContext, useState } from "react";

type LoadingOverlayContextType = {
  visible: boolean;
  showOverlay: () => void;
  hideOverlay: () => void;
};

const LoadingOverlayContext = createContext<
  LoadingOverlayContextType | undefined
>(undefined);

export const useLoadingOverlay = () => {
  const context = useContext(LoadingOverlayContext);
  if (!context) {
    throw new Error(
      "useLoadingOverlay must be used within a LoadingOverlayProvider",
    );
  }
  return context;
};

interface LoadingOverlayProviderProps {
  children: React.ReactNode;
}

export const LoadingOverlayProvider = ({
  children,
}: LoadingOverlayProviderProps) => {
  const [visible, setVisible] = useState(false);

  const showOverlay = () => setVisible(true);
  const hideOverlay = () => setVisible(false);

  return (
    <LoadingOverlayContext.Provider
      value={{ visible, showOverlay, hideOverlay }}
    >
      {children}
    </LoadingOverlayContext.Provider>
  );
};
