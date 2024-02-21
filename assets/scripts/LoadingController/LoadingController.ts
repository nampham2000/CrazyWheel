import { _decorator, Component, director, find, Node } from 'cc';
import { Constants } from '../Data/Constants';
const { ccclass, property } = _decorator;


@ccclass('LoadingController')
export class LoadingController extends Component {
    public async start() : Promise<void> {

            director.loadScene(Constants.sceneMenu);
    }
}


