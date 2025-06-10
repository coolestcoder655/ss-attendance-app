import { createContext, useState } from "react";

interface Student {
  name: string;
  isAbsent: boolean;
  notes: string;
}

export const GradingContext = createContext(null);

import { ReactNode } from "react";

interface GradingProviderProps {
  children: ReactNode;
}

export const GradingProvider = ({ children }: GradingProviderProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <GradingContext value={{ selectedStudent, setSelectedStudent }}>
      {children}
    </GradingContext>
  );
};
