import { useAccount } from "@/components/AccountContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface User {
    id: string;
    name: string;
    // Adicione outras propriedades do usuário conforme necessário
  }
  
  interface ButtonsGridProps {
    user: User | null;
  }

export default function RightGrid() {
  return (
    <Card className="p-5 min-w-[364px] h-[500px]">
        <div className=" gap-6">
            Direita
      </div>
    </Card>
  );
}
