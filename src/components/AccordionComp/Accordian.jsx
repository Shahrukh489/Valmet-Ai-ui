
import React, { useEffect, useState } from "react";
import { ChevronDown, Loader2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

function Accordian(props) {
  const [chapterSections, setChapterSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const setSections = async () => {
        try {
            const response = await fetch('http://localhost:5034/v1/spareparts/api/spareparts/GetSectionTitles')
            var x = await response.json()
            setChapterSections(x.result)
        } catch (e) {
            //setError(e)
        } finally {
            setIsLoading(false)
        }
    }
    setSections();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const filteredSections = chapterSections?.filter((s) => {
    if(s.itemKey === props.relation) {
      console.log(s)
      return s
    }
  });

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="bg-muted/50 px-4 hover:bg-muted">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Chapter: {props.chapter} - {props.chapterTitles}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-3">
          <div className="space-y-2">
            {filteredSections?.map((s, index) => (
              <div key={index} className="text-sm">
                <Link 
                  to="#" 
                  className="text-foreground hover:text-primary transition-colors hover:underline"
                >
                  {s.section} - {s.title}
                </Link>   
              </div>  
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default Accordian