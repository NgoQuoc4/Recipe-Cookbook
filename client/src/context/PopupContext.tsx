import { createContext, useContext, useState, type ReactNode } from "react";

interface Popup {
  isOpen: boolean;
  activeRecipeId: string | null;
  openPopup: (id: string) => void;
  closePopup: () => void;
}

const PopupContext = createContext<Popup | undefined>(undefined);

// Tạo provider popup
export function PopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);

  const openPopup = (id: string) => {
    setActiveRecipeId(id);
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
    setActiveRecipeId(null);
  };

  return (
    <PopupContext.Provider
      value={{ isOpen, activeRecipeId, openPopup, closePopup }}
    >
      {children}
    </PopupContext.Provider>
  );
}

// Tạo hook để sử dụng context popup
export function usePopup() {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("usePopup must be used within an PopupProvider");
  }
  return context;
}
