import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import AccordianItem from "./AccordianItem";

function AccordianComp(props) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="bg-muted/50 px-4 hover:bg-muted">
          Section 1
        </AccordionTrigger>
        <AccordionContent className="px-4 py-3">
          <AccordianItem />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="bg-muted/50 px-4 hover:bg-muted">
          Section 2
        </AccordionTrigger>
        <AccordionContent className="px-4 py-3">
          <AccordianItem />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default AccordianComp;
