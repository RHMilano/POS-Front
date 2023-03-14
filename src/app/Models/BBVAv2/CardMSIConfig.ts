import { CardData } from "./CardData";
import { ConfiguracionMSI } from "./ConfiguracionMSI";
import { MsiList } from "./MsiList";

export class CardMSIConfig  {

    card: CardData;
    configMSI: ConfiguracionMSI;
    msiList: MsiList[];
    
  constructor() {
    this.card = new CardData();
    this.configMSI = new ConfiguracionMSI();
    this.msiList[36] = new MsiList();
   }
}
