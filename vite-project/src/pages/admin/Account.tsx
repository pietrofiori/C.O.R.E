import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Value } from "@radix-ui/react-select";
import TableUser from "@/components/TableUser";
import { Loader2 } from "lucide-react";
import CardCreateAccount from "@/components/CardCreateAccount";
//================================================

interface User {
  id: string;
  name: string;
  guid: string;
  email: string;
  sip: string;
  // Adicione aqui outros campos se necessário
}

export default function Account() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sip, setSip] = useState("");
  const [type, setType] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const { toast } = useToast();

  interface ContaProps {
    onUserCreated: () => void;
  }

  const passwordValidation = (password: string) => {
    setIsCreating(true)
    // Verifica se a senha tem pelo menos 6 caracteres
    if (password.length < 6) {
      toast({
        variant: "destructive",
        description: "A senha deve ter pelo menos 6 caracteres",
      });
      return false;
    }

    // Verifica se a senha contém pelo menos um caractere especial
    const specialCharacterRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!specialCharacterRegex.test(password)) {
      toast({
        variant: "destructive",
        description: "A senha deve conter pelo menos um caractere especial",
      });
      return false;
    }

    return true;
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleSipChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSip(event.target.value);
  };
  const handleTypeChange = (value: string) => {
    setType(value);
  };
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleCreateUser = async () => {
    console.log(
      `Nome: ${name},Email: ${email}, Senha: ${password}, SIP: ${sip}, Tipo de conta: ${type}`
    );

    setIsCreating(true);

    if (!passwordValidation(password)) {
      toast({
        variant: "destructive",
        description: "Senha inválida",
      });
      setIsCreating(false)
      return;
    }
    const obj = {
      email: email,
      password: password,
      name: name,
      sip: sip,
      type: type,
    };

    try {
      const response = await fetch("https://meet.wecom.com.br/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se o servidor retornar um código de status que não está no intervalo 200-299,
        // então nós lançamos um erro
        if (data.error === "emailDuplicated") {
          // Se a mensagem de erro for 'Email already exists', então exibimos um toast específico
          toast({
            variant: "destructive",
            description: "Email já está em uso",
          });
        } else {
          // Se a mensagem de erro for diferente, então exibimos um toast genérico
          toast({
            variant: "destructive",
            description: data.error,
          });
        }
        throw new Error(data.error);
      } else {
        console.log(data);
        // Exibe um toast de sucesso
        toast({
          description: "Conta criada com sucesso",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);

        //fazer com que atulize a lista de contas
      }
    } catch (error) {
      // Aqui você pode lidar com qualquer erro que possa ocorrer durante a criação da conta
    }
    setIsCreating(false);
  };
  const listUsers = async () => {
    try {
      const response = await fetch("https://meet.wecom.com.br/api/listUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
      });
      console.log(await response.json());
    } catch (error) {}
  };
  const deleteUsers = async (id: string) => {
    console.log(`id: ${id}`);
    const formData = {
      id: id,
    };
    try {
      const response = await fetch("https://meet.wecom.com.br/api/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
        body: JSON.stringify(formData),
      });
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    listUsers();
  }, []);
  const updateUsers = async (id: string) => {
    console.log(
      `id: ${id}, name: ${name}, email: ${email}, sip: ${sip}, type: ${type}`
    );
    const formData = {
      id: id,
      name: name,
      email: email,
      sip: sip,
      type: type,
    };
    try {
      const response = await fetch("https://meet.wecom.com.br/api/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": localStorage.getItem("token") || "",
        },
        body: JSON.stringify(formData),
      });
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    listUsers();
  }, []);

  return (
    //div que contem os cards
    <div className="px-2 flex flex-col md:flex-row gap-5 justify-center">
      <CardCreateAccount />
      {/* Card que contem a lista de usuarios */}
      <Card className="w-full min-h-[700px]">
        <ScrollArea className="h-[700px]">
          <TableUser />
        </ScrollArea>
      </Card>
    </div>
  );
}
