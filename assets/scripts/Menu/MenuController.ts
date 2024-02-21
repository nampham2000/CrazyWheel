import { _decorator, Component, director, Input, input, Node } from 'cc';
import { Constants } from '../Data/Constants';
const { ccclass, property } = _decorator;

@ccclass('MenuController')
export class MenuController extends Component {
    @property({
        type:Node,
        tooltip:"Pandel Tutorial"
    })
    private Pandel:Node;

    @property({
        type:Node,
        tooltip:"Background Tutorial"
    })
    private BackgroundGray:Node;

    private play():void {
        director.loadScene(Constants.sceneGame);
    }

    private offTutorial():void{
        this.BackgroundGray.active=false;
        this.Pandel.active=false;
    }

    private onTutorial():void{
        this.BackgroundGray.active=true;
        this.Pandel.active=true;
    }
}

