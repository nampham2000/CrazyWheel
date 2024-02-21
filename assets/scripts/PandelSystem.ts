import { _decorator, CCInteger, Collider2D, Component, Node, Quat, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PandelSystem')
export class PandelSystem extends Component {
    @property({ 
        type: CCInteger,
        tooltip: 'Speed Spin' 
    })
    private speed: number = 2;
    @property({
        type:CCInteger,
        tooltip: 'Direction Value'
    })
    private direction:number=1;

    public get Direction(): number {
        return this.direction;
    }
    public set Direction(value: number) {
        this.direction = value;
    }

    public get Speed(): number {
        return this.speed;
    }
    public set Speed(value: number) {
        this.speed = value;
    }
    
    private pivotPoint=new Vec3(0,0)

    public get PivotPoint():Vec3{
        return this.pivotPoint;
    }
    
    private rotationAngle:number;
    protected update(deltaTime: number):void {
        const offset = Vec3.subtract(new Vec3(), this.node.position, this.pivotPoint);
        this.rotationAngle = this.direction*this.Speed * deltaTime;
        const rotationQuat = new Quat();
        Quat.fromAxisAngle(rotationQuat, Vec3.FORWARD, this.rotationAngle);
        Vec3.transformQuat(offset, offset, rotationQuat);
        const currentRotation = this.node.getRotation();
        const newRotation = new Quat();
        this.node.setRotation(Quat.multiply(newRotation, rotationQuat, currentRotation));
        this.node.setPosition(Vec3.add(new Vec3(), this.pivotPoint, offset));
        // this.node.getComponent(Collider2D).apply();
    }
}


