import { createContext, useContext } from "react";
import { IRecusiveSetting } from "../../universal/model";

interface ILoadPrevNextContext {
  sliceStartState: [
    sliceStart: number,
    setSliceStart: React.Dispatch<React.SetStateAction<number>>,
  ];
  sliceEndState: [
    sliceEnd: number | undefined,
    setSliceEnd: React.Dispatch<React.SetStateAction<number | undefined>>,
  ];
  sliceCountState: [
    sliceCount: number,
    setSliceCount: React.Dispatch<React.SetStateAction<number>>,
  ];
  entries: any[];
  currentEntriesState: [
    currentEntries: any[],
    setCurrentEntries: React.Dispatch<React.SetStateAction<any[]>>,
  ];
}

export const LoadPrevNextContext = createContext<ILoadPrevNextContext | null>(
  null,
);

export const useLoadPrevNextContext = () => {
  const context = useContext(LoadPrevNextContext);
  if (!context) {
    throw new Error(
      'useLoadPrevNextContext must be used within a LoadPrevNextContext provider',
    );
  }
  return {
    sliceStartState: context.sliceStartState,
    sliceEndState: context.sliceEndState,
    sliceCountState: context.sliceCountState,
    entries: context.entries,
    currentEntriesState: context.currentEntriesState,
  };
};

export const UpdateVisibileEntriesFnContext = createContext<
  ((entryId: string) => void) | null
>(null);

export const useUpdateVisibileEntriesFnContext = () => {
  const context = useContext(UpdateVisibileEntriesFnContext);
  if (!context) {
    throw new Error(
      'useUpdateVisibileEntriesFnContext must be used within a UpdateVisibileEntriesFnContext provider',
    );
  }
  return context;
};

export const SettingsContext = createContext<
  IRecusiveSetting[] | null
>(null);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      'useSettingsContexst must be used within a SettingsContexst provider',
    );
  }
  return context;
};