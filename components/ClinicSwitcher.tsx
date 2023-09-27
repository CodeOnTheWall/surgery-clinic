"use client";

// React Hooks
import { useState } from "react";
// Next
import { useParams, useRouter } from "next/navigation";
// Prisma Client Clinic Model
import { Clinic } from "@prisma/client";
// Components
import { useClinicModal } from "@/hooks/UseClinicModal";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface ClinicSwitcherProps extends PopoverTriggerProps {
  clinics: Clinic[];
}

export default function ClinicSwitcher({
  className,
  // default value of empty array
  clinics = [],
}: ClinicSwitcherProps) {
  // if this gets called, the clinicModal gets opened
  const onOpen = useClinicModal((state) => state.onOpen);

  const params = useParams();
  const router = useRouter();

  // formattedClinics is an array, where each clinic has a name and id
  // id is for key and param purposes
  const formattedClinics = clinics.map((clinic) => ({
    name: clinic.name,
    id: clinic.id,
    createdAt: clinic.createdAt,
    updatedAt: clinic.updatedAt,
    email: clinic.email,
  }));

  // find the clinic that has the same id as params.clinicId
  // since this will be the current active/selected store
  const currentClinic = formattedClinics.find(
    (clinic) => clinic.id === params.clinicId
  );

  // state of popover
  const [open, setOpen] = useState(false);

  interface FormattedClinicProps {
    id: string;
    name: string;
  }

  const onStoreSelect = (clinic: FormattedClinicProps) => {
    // once we click on a diff clinic, we will close the store switcher
    // and redirect to that store id
    setOpen(false);
    router.push(`/${clinic.id}`);
  };

  return (
    // remind that open and onOpenChange are props expected for
    // this shadcn component
    <Popover open={open} onOpenChange={setOpen}>
      {/* asChild is needed to avoid hydration errors */}
      {/* recommended to use with Trigger from shadcn docs when
      using non default react components */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          // comboboxrole identifies an element a san input that controls other elements
          // that can dynamically pop up to help te user set the value of that input
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Clinic"
          className={`justify-between ${className}`}
        >
          <StoreIcon className=" mr-2 h-4 w-4" />
          <div className=" w-max"> {currentClinic?.name}</div>
          {/* ml-auto pushes all the way to the right
          shrink0 so that it doesnt shrink to fit available space */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Clinic..." />
            <CommandEmpty>No Clinic found.</CommandEmpty>
            <CommandGroup heading="Clinics">
              {formattedClinics.map((clinic) => (
                <CommandItem
                  key={clinic.id}
                  onSelect={() => onStoreSelect(clinic)}
                  className=" text-sm"
                >
                  <StoreIcon className=" mr-2 h-4 w-4" />
                  {clinic.name}
                  <Check
                    className={`ml-auto h-4 w-4 ${
                      currentClinic?.id === clinic.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  onOpen();
                }}
              >
                <PlusCircle className=" mr-2 h-5 w-5" />
                Create Clinic
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
