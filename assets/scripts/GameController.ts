import { _decorator, Button, cclegacy, Color, color, ColorKey, Component, director, EventTouch, game, Input, input, log, Node, Quat, Sprite, Vec2, Vec3 } from 'cc';
import { GameView } from './GameView';
import { AudioController } from './AudioController/AudioController';
import { Constants } from './Data/Constants';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property({
        type: Node,
        tooltip: "Pandel"
    })
    private Pandel: Node;
    @property({
        type: GameView
    })
    private gameView: GameView;
    @property({
        type: AudioController
    })
    private AudioController: AudioController;
    @property({ type: Node })
    private click: Node;

    @property(Button)
    private btnReplay: Button;
    currentRotation = 0;
    selectedColorCode
    private previousColorCode: string = "165aa6";
    private colorofPandel: string = "";
    private rotationNumber: number = 1;
    private isClockwise: boolean = true;
    private countScore: number = 0;
    private rotationSpeed: number = 0;
    private hasMouseClickOccurred: boolean = false;
    private listHexString = ["8452a1", "165aa6", "50c7e6", "a2ce55", "fbd856", "f26a44", "ef4147", "e367a7"];
    private listLocation: Array<number> = [0, 45, 90, 135, 180, 225, 270, 315, 360];
    private checked: boolean = false;
    private apiload: boolean = false;
    private isLoading: boolean = false;
    private istrue:boolean=false;


    private interval;
    private time: number = 0;

    protected onLoad(): void {
            this.checked = false;
            this.selectedColorCode = "165aa6";
            director.resume();
            this.HandleAudioStorage();
            this.apiload = true;
            this.interval = setInterval(() => {
                this.time++;
            }, 1000);
            setTimeout(() => {
                this.rotationSpeed=90;
                this.click.on(Node.EventType.TOUCH_START, this.checkGameColor, this);
            }, 1000);
    }

    protected update(deltaTime: number): void {
        let rotationAmount = this.rotationSpeed * deltaTime * this.rotationNumber;
        if (!this.isClockwise) {
            rotationAmount *= -1;
        }
        this.currentRotation += rotationAmount;
        if (this.currentRotation >= 360) {
            this.currentRotation -= 360;
        } else if (this.currentRotation < 0) {
            this.currentRotation += 360;
        }

        this.Pandel.setRotationFromEuler(0, 0, this.currentRotation);
        this.gameView.ScoreOver.string = 'SCORE\n' + this.countScore.toString();
        this.gameView.Score.string = this.countScore.toString();
        this.gameView.BestScore.string = `${Constants.dataUser.highScore}`;
        let rotation = this.toRotation(this.selectedColorCode);
        if (this.hasMouseClickOccurred && !(this.currentRotation > rotation && this.currentRotation <= rotation + 45) && !this.checked) {
            this.isLoading = true;
            this.rotationSpeed = 0;
            this.click.off(Node.EventType.TOUCH_START, this.checkGameColor, this);
             this.isLoading = false;
            this.gameOver();
            this.checked = true;
        }
        if (this.currentRotation > rotation && this.currentRotation <= rotation + 45) {
            this.hasMouseClickOccurred = true;
        }
    }

    private randomColor(): void {
        const colorCodes = ["8452a1", "165aa6", "50c7e6", "a2ce55", "fbd856", "f26a44", "ef4147", "e367a7"];

        do {
            const randomIndex = Math.floor(Math.random() * colorCodes.length);
            this.selectedColorCode = colorCodes[randomIndex];
        } while (this.selectedColorCode === this.previousColorCode);

        this.previousColorCode = this.selectedColorCode;
        this.Pandel.getComponent(Sprite).color = new Color(this.selectedColorCode);
    }

    private checkRotation(rotation: number): string {
        let index = this.listLocation.findIndex((item) => rotation > item && rotation <= item + 45);
        this.colorofPandel = this.listHexString[index];
        return this.listHexString[index];
    }

    private toRotation(hex: string): number {
        let indexColor = this.listHexString.findIndex((item) => item === hex);
        let rotation = this.listLocation[indexColor];

        return rotation;
    }



    private checkGameColor(): boolean {
        if (this.countScore % 10 === 0) {
            this.rotationSpeed += 5;
        }
        if (this.checkRotation(this.currentRotation) === this.Pandel.getComponent(Sprite).color.toHEX()) {
            this.isClockwise = !this.isClockwise;
            this.countScore++;

            let logGame = {
                seconds: this.time,
                score: this.countScore,
                datetime: new Date().toLocaleString()
            }


            this.AudioController.onAudio(2);
            this.randomColor();
            this.hasMouseClickOccurred = false;
            return true;
        } else {
            this.isLoading = true;
            this.rotationSpeed = 0;
            this.click.off(Node.EventType.TOUCH_START, this.checkGameColor, this);
           this.isLoading = false;
            this.gameOver();
            return false;
        }
    }

    private pauseBtn(): void {
        this.gameView.Bgblur.active = true;
        this.gameView.PausePandel.active = true;
        this.click.off(Node.EventType.TOUCH_START, this.checkGameColor, this);
        director.pause();
    }

    private playBtn(): void {
        this.gameView.Bgblur.active = false;
        this.gameView.PausePandel.active = false;
        this.click.on(Node.EventType.TOUCH_START, this.checkGameColor, this);
        director.resume();
    }

    private menuBtn(): void {
        director.loadScene(Constants.sceneMenu);
        director.resume();
    }

    private gameOver(): void {
        this.click.off(Node.EventType.TOUCH_START, this.checkGameColor, this);
        this.gameView.GameOverPandel.active = true;
        this.AudioController.onAudio(1);
        this.checked = true;
        this.saveBestScore();
    }

    private replay(): void {
        if (this.isLoading) return;
        this.btnReplay.interactable = false; 
        this.btnReplay.node.active=false;
        director.loadScene('Game');
        director.resume();
    }

    private saveBestScore(): void {
        Constants.dataUser.highScore = Constants.dataUser.highScore < this.countScore ? this.countScore : Constants.dataUser.highScore;
    }

    private HandleAudioStorage(): void {
        if (Constants.volumeGameStatic === null) {
            Constants.volumeGameStatic = true;
        }
        if (Constants.volumeGameStatic === true) {
            this.gameView.UnMuteBtn.node.active = true;
            this.gameView.MuteBtn.node.active = false;
            this.AudioController.settingAudio(1);
        }
        else {
            this.gameView.UnMuteBtn.node.active = false;
            this.gameView.MuteBtn.node.active = true;
            this.AudioController.settingAudio(0);
        }
    }

    protected onTouchOnAudio(): void {
        Constants.volumeGameStatic = true;
        this.AudioController.settingAudio(1);
        this.gameView.UnMuteBtn.node.active = true;
        this.gameView.MuteBtn.node.active = false;
    }

    protected onTouchOffAudio(): void {
        Constants.volumeGameStatic = false;
        this.AudioController.settingAudio(0);
        this.gameView.UnMuteBtn.node.active = false;
        this.gameView.MuteBtn.node.active = true;
    }


}


