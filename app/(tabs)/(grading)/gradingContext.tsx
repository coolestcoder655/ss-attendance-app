import { createContext, useState } from 'react';

interface Student {
    name: string;
    isAbsent: boolean;
    notes: string;
}

export const GradingContext = createContext(null);

export const GradingProvider = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
      <GradingContext value={{selectedStudent, setSelectedStudent}}>
          {children}
      </GradingContext>
  )
}