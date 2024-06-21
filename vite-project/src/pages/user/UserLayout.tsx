import { Routes, Route, useNavigate } from "react-router-dom";
import ValidadeToken from "@/components/validateToken/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import { AccountContext, useAccount } from "@/components/account/AccountContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import Logout from "@/components/logout/Logout";
import { WebSocketProvider } from "@/components/websocket/WebSocketProvider";
import ButtonsGridPage from "@/components/buttons/buttonsGrid/ButtonsGridPages";
import {
  ButtonProvider,
  useButtons,
  ButtonInterface,
} from "@/components/buttons/buttonContext/ButtonsContext";

import LeftGrid from "@/components/leftGrid/LeftGrid";
import RightGrid from "@/components/rightGrid/RightGrid";
import { Ghost } from "lucide-react";
import { SensorInterface, useSensors } from "@/components/sensor/SensorContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";

interface User {
  id: string;
  name: string;
  guid: string;
  // Adicione aqui outros campos se necessário
}

function UserLayout() {
  const account = useAccount();
  const { updateAccount } = useAccount();
  // const webSocket = useWebSocket(account.accessToken)
  // console.log("MENSAGEM DO WEBSOCKET" + webSocket.data)
  const { setButtons, buttons } = useButtons();
  const {
    setSensors,
    updateSensor,
    replaceLatestSensor,
    clearSensorsByName,
    addSensors,
  } = useSensors();
  const [selectedOpt, setSelectedOpt] = useState<string>("floor");
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState("");
  const wss = useWebSocketData();
  
  // vamos trtar todas as mensagens recebidas pelo wss aqui
  const handleWebSocketMessage = (message: any) => {
    switch (message.mt) {
      case "SelectButtonsSuccess":
        const buttons: ButtonInterface[] = JSON.parse(message.result);
        setButtons(buttons);
        setSensors([]);
        break;
      case "SelectSensorHistoryResult":
        const sensorsArray: SensorInterface[] = JSON.parse(message.result);
        if (sensorsArray.length > 0) {
          const sensorName = sensorsArray[0].sensor_name;
          clearSensorsByName(sensorName); // Limpa os sensores com base no sensor_name
          addSensors(sensorsArray);
        }
        break;
      case "SelectAllSensorInfoResultSrc":
        console.log("SelectAllSensorInfoSrc" + message.result);
        const allSensors: SensorInterface[] = JSON.parse(message.result);
        addSensors(allSensors);
        break;
      case "SensorReceived":
        const sensorDataReceived = message.value; // Adicione este log para verificar os dados recebidos
        updateSensor(sensorDataReceived);
        break;

      default:
        console.log("Unknown message type:", message);
        break;
    }
  };
  const handleAdminToggle = () => {
    updateAccount({ isAdmin: true });
    console.log("IsAdmin tem que ir para true " + account.isAdmin);
    navigate("/admin/buttons"); // Redireciona para a rota admin/buttons
  };

  const handleOptChange = (newOpt: string) => {
    setSelectedOpt(newOpt);
  };

  return (
    <WebSocketProvider
      token={account.accessToken}
      onMessage={handleWebSocketMessage}
    >
      <div className="flex gap-1 p-1">
        <LeftGrid buttons={buttons} selectedUser={account} />

        <ButtonsGridPage
          buttons={buttons}
          selectedUser={account}
          onOptChange={handleOptChange}
        />

        <RightGrid
          onKeyChange={handleOptChange}
          buttons={buttons}
          selectedUser={account}
          selectedOpt={selectedOpt}
        />
      </div>
      {account.type === "admin" && (
        <Button variant="ghost" onClick={handleAdminToggle}>
          {" "}
          Visão de admin
        </Button>
      )}
      <Logout />
    </WebSocketProvider>
  );
}

export default ValidadeToken(UserLayout);
