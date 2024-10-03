import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function Tooltip({elements,content}) {
    return (
      <TooltipProvider>
        <TooltipUI>
          <TooltipTrigger asChild>
            {elements}
          </TooltipTrigger>
          <TooltipContent>
            <p>{content}</p>
          </TooltipContent>
        </TooltipUI>
      </TooltipProvider>
    )
  }