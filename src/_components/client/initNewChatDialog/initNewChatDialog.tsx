"use client";

import {
  type FieldErrors,
  type UseFormRegister,
  useForm,
} from "react-hook-form";
import {
  type FormEvent,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { Button } from "@/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/_components/ui/dialog";
import { HeadingLarge } from "@/_components/ui/headings/headingLarge";
import { HeadingMedium } from "@/_components/ui/headings/headingMedium";
import { TextField } from "@/_components/ui/textfield";
import { ChatsIcon } from "@/icons";
import { SearchBar } from "../../ui/searchBar";
import useDebounce from "@/hooks/useDebounce";
import {
  ComponentFormat,
  ComponentType,
  type WhatsAppMessageTemplate,
} from "@/types/whatsapp";
import { useMutation } from "@tanstack/react-query";
import * as api from "@/server/root";
import { type NewChatForm } from "./interfaces";
import { generateVariablesToFill, transformTemplate } from "./utils";

const InitNewChatDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" aria-label="show settings">
          <ChatsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:min-w-fit">
        <InitNewChatForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

const InitNewChatForm = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewChatForm>();

  const [templates, setTemplates] = useState<WhatsAppMessageTemplate[] | null>(
    null,
  );
  const templateCategory = watch("templateCategory");
  const selectedTemplateId = watch("templateId");

  const selectedTemplate = templates?.find(
    (template) => template.id === selectedTemplateId,
  );

  const sendWhatsappMessage = useMutation({
    mutationFn: api.whatsapp.sendTemplateMessage,
  });

  const [step, setStep] = useState(1);
  const totalSteps = 2;

  const handleNextStep = async (event: FormEvent) => {
    event.preventDefault();

    if (step === totalSteps) {
      return;
    }

    const templates = await api.business.getMessageTemplates({
      templateCategory,
    });
    setTemplates(templates ?? null);

    setStep((prevStep) => prevStep + 1);
  };

  const handleInitNewChat = (data: NewChatForm) => {
    if (!selectedTemplate) {
      return;
    }

    sendWhatsappMessage.mutate(
      {
        to: data.to,
        template: transformTemplate(selectedTemplate, data.variables),
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(handleInitNewChat)}>
      {step === 1 && <NewChatFromSetp1 register={register} errors={errors} />}
      {step === 2 && (
        <NewChatFromSetp2
          register={register}
          errors={errors}
          templates={templates}
          selectedTemplate={selectedTemplate}
        />
      )}

      <DialogFooter>
        {step === totalSteps ? (
          <Button type="submit" className="w-full">
            enviar
          </Button>
        ) : (
          <Button type="button" className="w-full" onClick={handleNextStep}>
            Siguiente
          </Button>
        )}
      </DialogFooter>
    </form>
  );
};

const NewChatFromSetp1 = ({
  register,
}: {
  register: UseFormRegister<NewChatForm>;
  errors: FieldErrors;
}) => {
  return (
    <>
      <div className="grid gap-8 py-4">
        <div className="grid gap-4">
          <HeadingLarge>Iniciar un nuevo chat</HeadingLarge>
          <TextField
            label="Teléfono"
            placeholder="Teléfono"
            className="bg-transparent"
            {...register("to")}
            required
          />
        </div>
        <div className="grid gap-4">
          <HeadingMedium>Tipo de mensaje</HeadingMedium>
          <TextField
            label="Categoría"
            placeholder="Categoría"
            className="bg-transparent"
            {...register("templateCategory")}
          />
        </div>
      </div>
    </>
  );
};

interface SearchTemplateForm {
  search: string;
}

const NewChatFromSetp2 = ({
  register,
  templates,
  selectedTemplate,
}: {
  register: UseFormRegister<NewChatForm>;
  errors: FieldErrors;
  templates: WhatsAppMessageTemplate[] | null;
  selectedTemplate: WhatsAppMessageTemplate | undefined;
}) => {
  const { register: registerSearch, watch } = useForm<SearchTemplateForm>();

  const search = useDebounce(watch("search", ""), 500);
  const templatesFiltered = templates?.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase()),
  );

  const matches = generateVariablesToFill(selectedTemplate);

  return (
    <div className="grid gap-8 py-4 ">
      <div className="grid gap-4">
        <HeadingLarge>Elige un mensaje predeterminado</HeadingLarge>

        {selectedTemplate ? (
          <WhatsAppMessageTemplateBody
            template={selectedTemplate}
            selectedTemplate={selectedTemplate}
            register={register}
          >
            <WhatsappMessageTemplateHeader template={selectedTemplate} />
          </WhatsAppMessageTemplateBody>
        ) : (
          <>
            <SearchBar {...registerSearch("search")} />
            <div className="flex h-[300px] flex-col gap-2 overflow-y-auto">
              {templatesFiltered &&
                templatesFiltered.length > 0 &&
                templatesFiltered.map((template) => (
                  <WhatsAppMessageTemplateBody
                    key={template.id}
                    template={template}
                    selectedTemplate={selectedTemplate}
                    register={register}
                  />
                ))}
            </div>
          </>
        )}

        {matches.headerVariables && (
          <div>
            <div>Header</div>
            {matches.headerVariables?.map((match, index) => (
              <TextField
                key={index}
                label={match.name.split("-")[1] ?? match.name}
                placeholder={match.name}
                {...register(`variables.header.${index}`)}
                required
              />
            ))}
          </div>
        )}

        {matches.bodyVariables && (
          <div>
            <div>Body</div>
            {matches.bodyVariables?.map((match, index) => (
              <TextField
                key={index}
                label={match.name.split("-")[1] ?? ""}
                placeholder={match.name}
                {...register(`variables.body.${index}`)}
                required
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const WhatsappMessageTemplateHeader = ({
  template,
}: {
  template: WhatsAppMessageTemplate;
}) => {
  const header = template.components.find(
    (component) => component.type === ComponentType.HEADER,
  );

  if (header?.format === ComponentFormat.TEXT) {
    return <div>{header.text}</div>;
  }

  if (header?.format === ComponentFormat.IMAGE) {
    return <div>imagen</div>;
  }

  return null;
};

const WhatsAppMessageTemplateBody = ({
  template,
  register,
  selectedTemplate,
  children,
}: {
  template: WhatsAppMessageTemplate;
  register: UseFormRegister<NewChatForm>;
  selectedTemplate: WhatsAppMessageTemplate | undefined;
  children?: ReactNode;
}) => {
  return (
    <div key={template.id}>
      <input
        className="hidden"
        type="radio"
        value={template.id}
        id={template.id}
        {...register("templateId")}
      />
      <label htmlFor={template.id}>
        <div
          className={`grid gap-[5px] rounded-[10px] border p-1 ${
            selectedTemplate?.id === template.id
              ? "border-primary-purple"
              : "border-f-black"
          }`}
        >
          <p>{template.name}</p>
          <div
            className={`cursor-pointer rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px]  p-3  ${
              selectedTemplate?.id === template.id
                ? "bg-secondary-purple"
                : "bg-light-gray"
            } `}
          >
            <div>{children}</div>
            {
              template.components.filter(
                (component) => component.type === ComponentType.BODY,
              )[0]?.text
            }
          </div>
        </div>
      </label>
    </div>
  );
};

export { InitNewChatDialog };
