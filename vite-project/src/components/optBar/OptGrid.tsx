import { Separator } from "@/components/ui/separator";
import {
  ButtonInterface,
  useButtons,
} from "@/components/buttons/buttonContext/ButtonsContext";
import { useEffect, useState } from "react";
import OptComponent from "@/components/optBar/OptComponent";
import { useAccount } from "@/components/account/AccountContext";
import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import TestKeyboard from "../testeKeyboard";
import UserComponent from "../chat/OptUser";
import { useUsers } from "../user/UserContext";

interface OptGridProps {
  buttons: ButtonInterface[];
  selectedUser: User | null;
  selectedOpt: string;
  interactive: string;
  setClickedButtonId: (id: number | null) => void;
  clickedButtonId: number | null;
  clickedUser: string | null;
  setClickedUser: (newUser: string | null) => void;
  //   selectedPage : string
}

interface User {
  id: string;
  name: string;
  guid: string;
}

export default function OptGrid({
  buttons,
  selectedUser,
  selectedOpt,
  setClickedButtonId,
  clickedButtonId,
  clickedUser,
  setClickedUser,
  interactive,
}: OptGridProps) {
  const [clickedPosition, setClickedPosition] = useState<{
    i: number;
    j: number;
  } | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const wss = useWebSocketData();
  const account = useAccount();
  const { users } = useUsers();
  const { setStopCombo } = useButtons();

  const handleClickedUser = (newUser: string | null) => {
    if (setClickedUser) {
      setClickedUser(newUser);
    }
  };

  useEffect(() => {
    const buttonInCombo = buttons.find((button) => button.comboStart);
    if (buttonInCombo) {
      setClickedButtonId(buttonInCombo.id);
    }
  }, [buttons]); // useEffect para monitorar quando foi recebido um combo

  if (selectedOpt === "chat") {
    // quando for do TIPO CHAT O TRATAMENTO É DIFERENTE
    // precisamos melhorar isso ~vitor ~pietro
    const grid = Array(1) // Alterado para uma única linha
      .fill(null)
      .map(() => Array(12).fill({ variant: "default" })); // Ajuste o número de colunas conforme necessário

    users.forEach((user, index) => {
      const x = 1; // Sempre na primeira linha
      const y = index + 1; // Calcula a posição y

      if (y <= 12) {
        // Ajuste o número de colunas conforme necessário
        grid[x - 1][y - 1] = user;
      }
    });

    return (
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {grid[0].map((user, j) => (
            <div key={`${0}-${j}`}>
              <UserComponent
                user={user}
                onClick={() => {
                  handleClickedUser(
                    clickedUser === user.guid ? null : user.guid
                  );
                }}
                clickedUser={clickedUser}
                selectedOpt={selectedOpt}
              />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (selectedOpt != "chat") {
    const grid =
      interactive === "top"
        ? Array(1)
            .fill(null)
            .map(() => Array(12).fill({ variant: "default" }))
        : Array(2)
            .fill(null)
            .map(() => Array(12).fill({ variant: "default" }));

    buttons.forEach((button) => {
      const x = Number(button.position_x);
      const y = Number(button.position_y);

      if (!isNaN(x) && !isNaN(y)) {
        grid[y - 1][x - 1] = button;
      }
    });
    return (
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {grid[0].map((button, j) => (
            <div key={`${0}-${j}`}>
              <OptComponent
                button={button}
                selectedUser={selectedUser}
                clickedPosition={clickedPosition}
                selectedOpt={selectedOpt}
                isClicked={clickedButtonId === button.id} // true or false
                onClick={() => {
                  if (account.isAdmin) {
                    setClickedPosition({ i: 1, j: j + 1 });
                    console.log(
                      `Clicked position state:`,
                      "i: " + clickedPosition?.i + " j: " + clickedPosition?.j
                    );
                  } else {
                    // usuario
                    if (
                      (clickedButtonId !== button.id &&
                        button.button_type === "sensor") ||
                      button.button_type === "camera"
                    ) {
                      // enviar mensagem para consultar imagem da camera ou infos do sensor
                      wss?.sendMessage({
                        api: "user",
                        mt: "SelectDeviceHistory",
                        id: button.button_prt,
                      });
                    }
                    if (button.comboStart) {
                      setStopCombo(button.id);
                      // Atualizar o botão clicado
                      setClickedButtonId(button.id);
                    } else {
                      // Se o botão não inicia um combo, apenas atualiza o botão clicado
                      setClickedButtonId(
                        clickedButtonId === button.id ? null : button.id
                      );
                    }
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// const clickedButton = buttons.filter(button => button.id === clickedButtonId)[0];