import { Check, InfoIcon } from "lucide-react";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover";
import { cn } from "~/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface ComboBoxItem {
    label: string;
    value: string;
    disabled?: boolean;
    disabledReason?: string;
}

interface ComboBoxProps {
    options: ComboBoxItem[];
    value: string;
    children: React.ReactNode;
    inputBox?: boolean;
    inputLabel?: string;
    setValue: (value: string) => void;
    footerItem?: React.ReactNode;
}

function ComboBox({ options, value, setValue, inputLabel, children, footerItem, inputBox }: ComboBoxProps) {
    const [open, setOpen] = useState(false);

    const idToValueMap = new Map<string, string>();
    for (const option of options) {
        const id = `${option.value} ${option.label}`;
        idToValueMap.set(id, option.value);
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="p-0 sm:min-w-[28rem] border-none">
                <Command className="border border-shallow-background">
                    {inputBox === false ? null : <CommandInput placeholder={inputLabel || "Search..."} />}
                    <TooltipProvider delayDuration={200}>
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={`${option.value} ${option.label}`}
                                        onSelect={(currentValue) => {
                                            setValue(idToValueMap.get(currentValue) || "");
                                            setOpen(false);
                                        }}
                                        className={
                                            option?.disabled === true
                                                ? "text-danger-foreground data-[selected=true]:bg-shallow-background/50 data-[selected=true]:text-danger-foreground"
                                                : ""
                                        }
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                                        {option.label}
                                        {option?.disabled === true ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InfoIcon aria-hidden className="w-btn-icon h-btn-icon ml-auto mr-2" />
                                                </TooltipTrigger>

                                                <TooltipContent>{option?.disabledReason || "Disabled"}</TooltipContent>
                                            </Tooltip>
                                        ) : null}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </TooltipProvider>
                    {footerItem}
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default ComboBox;
