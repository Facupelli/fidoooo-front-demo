"use client";

import { LinkButton } from "@/_components/ui/linkButton";
import { SearchBar } from "@/_components/ui/searchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_components/ui/table";
import useDebounce from "@/hooks/useDebounce";
import { type Business } from "@/types/db";
import { useState } from "react";
import { useForm } from "react-hook-form";

const EmployeesTable = ({ business }: { business: Business | undefined }) => {
  const { register, watch } = useForm<{ name: string }>();
  const search = useDebounce(watch("name", ""), 500);
  const [collaborators] = useState(business?.employees ?? null);

  const filteredCollaborators = collaborators?.filter((collaborator) =>
    collaborator.userName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="flex justify-end">
        <SearchBar
          className="border-none bg-secondary-purple md:w-[650px]"
          {...register("name")}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre y Apellido</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCollaborators !== undefined ? (
            filteredCollaborators?.map((employee) => (
              <TableRow key={employee.userId}>
                <TableCell className="font-medium">
                  {employee.userName}
                </TableCell>
                <TableCell></TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">
                  <LinkButton href={`team/collaborator/${employee.userId}`}>
                    Editar
                  </LinkButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>
                No tienes ningun colaborador. Crea sus cuentas o envia una
                envitacion para agregar colaborades a tu negocio!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export { EmployeesTable };
