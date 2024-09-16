import {
    ButtonInterface,
    useButtons,
  } from "@/components/buttons/buttonContext/ButtonsContext";
  import { OctagonAlert } from "lucide-react";
  
  import { useEffect, useState } from "react";
  import { useWebSocketData } from "@/components/websocket/WebSocketProvider";
  import { useAccount } from "@/components/account/AccountContext";
  import { commonClasses } from "../ButtonsComponent";
  
  interface ButtonProps {
    button: ButtonInterface;
    handleClick?: () => void;
  }
  
  export default function ClockmButton({ button, handleClick }: ButtonProps) {
    const [clickedClass, setClickedClass] = useState("");
    const account = useAccount();
    const wss = useWebSocketData();
    const [initiatedByUser, setInitiatedByUser] = useState(false);

  
    const handleClickAlarm = () => {
      handleClick?.();
      setInitiatedByUser(true);
    };
    return (
      <div
        className={`${commonClasses} flex flex-col justify-between cursor-pointer bg-green-700 ${clickedClass}`}
        onClick={handleClickAlarm}
      >
        <div className="flex items-center gap-1 cursor-pointer ">
          <p className="text-sm font-medium leading-none text-white xl3:text-xl xl4:text-2xl">{button.button_name}</p>
        </div>
        <div className="flex font-extrabold text-xl justify-end text-white xl3:text-3xl xl4:text-4xl">
          {button.button_prt}
        </div>
      </div>
    );
  }