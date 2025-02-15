import { useCallback, useState } from "react";  

interface Translate {  
  x: number;  
  y: number;  
}  

export const useCenteredTree = (): [Translate, (element: HTMLDivElement | null) => void] => {  
  const [translate, setTranslate] = useState<Translate>({ x: 0, y: 0 });  

  const containerRef = useCallback((containerElem: HTMLDivElement | null) => {  
    if (containerElem !== null) {  
      const { width, height } = containerElem.getBoundingClientRect();  
      setTranslate({ x: width / 2, y: 100 });  
    }  
  }, []);  

  return [translate, containerRef];  
};