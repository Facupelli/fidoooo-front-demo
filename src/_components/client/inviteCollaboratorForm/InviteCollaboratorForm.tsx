"use client";

import { TextField } from "@/_components/ui/textfield";
import { Controller, useForm } from "react-hook-form";
import { GoBackButton } from "../../ui/goBackButton/goBackButton";
import { Button } from "@/_components/ui/button";
import { LabelCheckbox } from "../../ui/labelCheckbox/labelCheckbox";
import { type EditCollaboratorForm } from "./interfaces";
import * as api from "@/server/root";
import { useToast } from "@/_components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { type User, type Business } from "@/types/db";
import { editCollaboratorSchema } from "./schemas/editCollaborator.schema";

const InviteCollaboratorForm = ({
  collaborator,
  business, // userId,
}: {
  collaborator?: User;
  business: Business;
  userId: string;
}) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EditCollaboratorForm>({
    resolver: zodResolver(editCollaboratorSchema),
    defaultValues: {
      user: {
        firstName: collaborator?.firstName,
        lastName: collaborator?.lastName,
        phoneNumber: collaborator?.phoneNumber,
        email: collaborator?.email,
      },
      business: {
        labels: collaborator?.business?.labels,
      },
    },
  });

  // const sendCollaboratorInvitation = api.business.sendCollaboratorInvitation;

  const assignUserToBusiness = api.business.assignUserToBusiness;

  const handleSendInvitation = async (data: EditCollaboratorForm) => {
    if (!data.business?.labels || !business) {
      return;
    }

    const userAssigned = await assignUserToBusiness({
      businessId: business.id,
      businessAdminId: business.admin.userId,
      receiverEmail: data.user.email,
      labels: data.business?.labels,
    });

    if (userAssigned.success) {
      toast({
        title: "Invitacion enviada!",
        description: `La invitacion se envio correctamente a ${data.user.email}`,
      });
      reset();
    } else {
      console.log("send invitation error:", userAssigned.message);
    }

    // sendCollaboratorInvitation.mutate(
    //   {
    //     senderId: userId,
    //     receiverEmail: data.user.email,
    //     labels: data.business?.labels,
    //   },
    //   {
    //     onSuccess() {
    //       toast({
    //         title: "Invitacion enviada!",
    //         description: `La invitacion se envio correctamente a ${data.user.email}`,
    //       });
    //       reset();
    //     },
    //     onError(error) {
    //       console.log("send invitation error:", error);
    //     },
    //   },
    // );
  };

  const handleSubmitForm = async (data: EditCollaboratorForm) => {
    await handleSendInvitation(data);
    return;
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <div className="col-span-3 grid grid-cols-3">
        <div className="border-r border-light-gray pr-8">
          <div className="grid gap-4">
            <TextField
              label="Email"
              placeholder="email"
              {...register("user.email")}
              error={errors.user?.email?.message}
            />
          </div>
        </div>

        {/* TODO: Que hacer con los permisos se definira mas adelante */}
        {/* <div className="grid gap-[28px] px-5">
          {businessPermissions.map((permission) => (
            <div key={permission.id} className="flex items-center gap-4">
              <Checkbox
                className="border-primary-purple"
                id={permission.id}
                {...register(
                  `permissions.${permission.value}` as keyof EditCollaboratorForm,
                )}
              />
              <Label htmlFor={permission.id}>{permission.label}</Label>
            </div>
          ))}
        </div> */}

        <div className="border-l border-light-gray pl-8">
          <p className="pb-3">
            Asignale etiquetas al colaborador en cada canal
          </p>

          <ol className="list-inside list-decimal">
            <li>Elige el canal</li>
            <li>Asigna las etiquetas de ese canal</li>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {business.labels?.map((label) => (
                <Controller
                  key={label.id}
                  name="business.labels"
                  control={control}
                  render={({ field }) => (
                    <LabelCheckbox
                      key={label.id}
                      label={label}
                      checked={field.value?.includes(label.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...(field.value ?? ""), label.id])
                          : field.onChange(
                              field.value?.filter(
                                (value) => value !== label.id,
                              ),
                            );
                      }}
                    />
                  )}
                />
              ))}
            </div>
          </ol>
        </div>
      </div>

      <div className="flex items-center justify-between pt-20">
        <GoBackButton variant="outline">Atrás</GoBackButton>
        <Button type="submit">Enviar invitación</Button>
      </div>
    </form>
  );
};

export { InviteCollaboratorForm };
