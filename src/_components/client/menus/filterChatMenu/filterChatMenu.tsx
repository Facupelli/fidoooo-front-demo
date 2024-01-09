import { type ChatFilters } from "@/_components/client/dashboard/interfaces";
import { Button } from "@/_components/ui/button";
import { Checkbox } from "@/_components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { Label } from "@/_components/ui/label";
import { LabelCheckbox } from "@/_components/ui/labelCheckbox/labelCheckbox";
import {
  type Label as LabelType,
  ConversationStatus,
  type User,
} from "@/types/db";
import { type Control, Controller } from "react-hook-form";

const FilterChatMenu = ({
  employees,
  control,
  labels,
}: {
  employees: User[] | undefined;
  labels: LabelType[] | undefined;
  control: Control<ChatFilters>;
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="h-[56px]" type="button">
            Filtrar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-42" align="end">
          <DropdownMenuGroup className="grid gap-[5px]">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2 text-base leading-5 text-primary-purple focus:text-primary-purple">
                <span>Empleados</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <ByEmployeeMenu employees={employees} control={control} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2 text-base leading-5 text-primary-purple focus:text-primary-purple">
                <span>Etiquetas</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <ByLabel labels={labels} control={control} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2 text-base leading-5 text-primary-purple focus:text-primary-purple">
                <span>Estados de chat</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <ByChatStatus control={control} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const ByEmployeeMenu = ({
  employees,
  control,
}: {
  employees: User[] | undefined;
  control: Control<ChatFilters>;
}) => {
  return (
    <>
      {employees !== undefined && employees.length > 0 ? (
        employees?.map((employee) => (
          <DropdownMenuItem
            key={employee.id}
            className="flex items-center gap-2 leading-5 text-primary-purple focus:text-primary-purple"
            onSelect={(e) => e.preventDefault()}
          >
            <Controller
              control={control}
              name="employees"
              render={({ field }) => (
                <Checkbox
                  id={employee.id}
                  checked={field.value?.includes(employee.id)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...field.value, employee.id])
                      : field.onChange(
                          field.value?.filter((value) => value !== employee.id),
                        );
                  }}
                />
              )}
            />
            <Label htmlFor={employee.id} className="text-base">
              {employee.firstName} {employee.lastName}
            </Label>
          </DropdownMenuItem>
        ))
      ) : (
        <DropdownMenuItem className="leading-5 text-primary-purple">
          No tienes ningun colaborador!
        </DropdownMenuItem>
      )}
    </>
  );
};

const ByLabel = ({
  labels,
  control,
}: {
  labels: LabelType[] | undefined;
  control: Control<ChatFilters>;
}) => {
  return (
    <>
      {labels !== undefined && labels?.length > 0 ? (
        labels?.map((label) => (
          <DropdownMenuItem
            key={label.id}
            className="flex items-center gap-2 leading-5 text-primary-purple hover:bg-transparent focus:bg-transparent focus:text-primary-purple"
            onSelect={(e) => e.preventDefault()}
          >
            <Controller
              key={label.id}
              control={control}
              name="labels"
              render={({ field }) => (
                <LabelCheckbox
                  label={label}
                  checked={field.value?.includes(label.id)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...field.value, label.id])
                      : field.onChange(
                          field.value?.filter((value) => value !== label.id),
                        );
                  }}
                />
              )}
            />
          </DropdownMenuItem>
        ))
      ) : (
        <DropdownMenuItem className="leading-5 text-primary-purple">
          No has creado ninguna etiqueta!
        </DropdownMenuItem>
      )}
    </>
  );
};

const ByChatStatus = ({ control }: { control: Control<ChatFilters> }) => {
  return (
    <>
      <DropdownMenuItem
        className="flex items-center gap-2 leading-5 text-primary-purple focus:text-primary-purple"
        onSelect={(e) => e.preventDefault()}
      >
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Checkbox
              id={ConversationStatus.EXPIRED}
              checked={field.value?.includes(ConversationStatus.EXPIRED)}
              onCheckedChange={(checked) => {
                return checked
                  ? field.onChange([...field.value, ConversationStatus.EXPIRED])
                  : field.onChange(
                      field.value?.filter(
                        (value) => value !== ConversationStatus.EXPIRED,
                      ),
                    );
              }}
            />
          )}
        />
        <Label htmlFor={ConversationStatus.EXPIRED} className="text-base">
          Expirado
        </Label>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="flex items-center gap-2 leading-5 text-primary-purple focus:text-primary-purple"
        onSelect={(e) => e.preventDefault()}
      >
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Checkbox
              id={ConversationStatus.IN_PROGRESS}
              checked={field.value?.includes(ConversationStatus.IN_PROGRESS)}
              onCheckedChange={(checked) => {
                return checked
                  ? field.onChange([
                      ...field.value,
                      ConversationStatus.IN_PROGRESS,
                    ])
                  : field.onChange(
                      field.value?.filter(
                        (value) => value !== ConversationStatus.IN_PROGRESS,
                      ),
                    );
              }}
            />
          )}
        />
        <Label htmlFor={ConversationStatus.IN_PROGRESS} className="text-base">
          En curso
        </Label>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="flex items-center gap-2 leading-5 text-primary-purple focus:text-primary-purple"
        onSelect={(e) => e.preventDefault()}
      >
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Checkbox
              id={ConversationStatus.COMPLETED}
              checked={field.value?.includes(ConversationStatus.COMPLETED)}
              onCheckedChange={(checked) => {
                return checked
                  ? field.onChange([
                      ...field.value,
                      ConversationStatus.COMPLETED,
                    ])
                  : field.onChange(
                      field.value?.filter(
                        (value) => value !== ConversationStatus.COMPLETED,
                      ),
                    );
              }}
            />
          )}
        />
        <Label htmlFor={ConversationStatus.COMPLETED} className="text-base">
          Finalizado
        </Label>
      </DropdownMenuItem>
    </>
  );
};

export { FilterChatMenu };
