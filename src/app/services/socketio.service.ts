import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from "ngx-device-detector";

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  image: string;
  scale: number; taken: boolean; pointX : number; pointY: number; start: any; zoom: HTMLElement; timer;
  zoomOuter:HTMLElement;
  private distance1: number;
  constructor(private deviceService: DeviceDetectorService) {
     
  }

  setupSocketConnection(code: String) {
    console.log("Connection on " + environment.SOCKET_ENDPOINT);
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('code', code);
    this.zoom = document.getElementById("zoom") as HTMLElement;
    
    if (this.deviceService.isMobile() || this.deviceService.isTablet()){
      this.zoom.addEventListener("touchmove", (e) => {
        this.moveImage(e);
      });
      
      this.zoom.addEventListener("touchstart", (e) => {
        this.takeImage(e);
      });

      this.zoom.addEventListener("touchend", () => {
        this.dropImage();
      });
    }else{
      this.zoom.addEventListener("pointerdown", (e: MouseEvent) => {
        this.takeImage(e);
      });
      this.zoom.addEventListener("pointerup", () => {
        this.dropImage();
      });

      this.zoom.addEventListener("pointermove", (e: MouseEvent) => {
        this.moveImage(e);
      });

      this.zoom.addEventListener("mousewheel", (e: WheelEvent) => {
        this.zoomImage(e);
      })
    }


    this.socket.on('newPos', (e) => {
      var p = this.convertPercentintoPoint(e.percentx, e.percenty);
      this.setTransformP(p.x, p.y, e.scale);
    });
    
    this.socket.on('receiveImage', (data) => {
      this.zoomOuter = document.getElementsByClassName("zoom-outer")[0] as HTMLElement;
      
      this.image = "";
      console.log("Image reçue");
      this.scale = 1;
      this.taken = false;
      this.pointX = 0;
      this.pointY = 0;
      this.start = { x: 0, y: 0 };
      
      this.image=data.base64;
      this.putImage(data.width, data.height);
      this.setTransform();
     
    });
  }

  takeImage(e){
    if (e.cancelable) {
      e.preventDefault();
    }
    if (e instanceof TouchEvent){
      if (e.touches.length > 1){
        this.taken = false;
        this.distance1 = Math.hypot(e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY);
      }else{
        this.start = { x: e.touches[0].clientX - this.pointX, y: e.touches[0].clientY - this.pointY };
        this.taken = true;
      }
    }else{
      this.taken = true;
      this.start = { x: e.clientX - this.pointX, y: e.clientY - this.pointY };
    }
    
    console.log("mousedown");
  }

  moveImage(e){
    if (e.cancelable) {
      e.preventDefault();
   }
    
    if(e instanceof TouchEvent && e.touches.length >= 2) {
        var dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY);

          var xsssss = Math.min(e.touches[0].clientX, e.touches[1].clientX) +
        (e.touches[0].clientX + e.touches[1].clientX)/2;
        
        var ysssss = Math.min(e.touches[0].clientY, e.touches[1].clientY) +
        (e.touches[0].clientY + e.touches[1].clientY)/2;
        
        var xs = (xsssss - this.pointX)/this.scale;
        var ys = (ysssss - this.pointY)/this.scale;
        // this.scale = dist / 100;
        var delta = dist - this.distance1;
        // console.log(delta, this.distance1, dist);
        console.log(delta);
        
        (delta > 0) ? (this.scale *= 1.007) : (this.scale /= 1.007);
        this.distance1 = dist;
        if(delta = 0)
          return;
        var tmp = this.scale
        this.pointX = xsssss - xs * tmp;
        this.pointY = ysssss - ys * tmp;
        this.setTransform();
    }

    if (!this.taken) {
      return;
    }
    
    if (e instanceof TouchEvent){
      if(e.touches.length < 2){
        this.pointX = (e.touches[0].clientX - this.start.x);
        this.pointY = (e.touches[0].clientY - this.start.y);
        this.setTransform();
      }
    }else{
      this.pointX = (e.clientX - this.start.x);
      this.pointY = (e.clientY - this.start.y);     
      this.setTransform(); 
    }
  }

  dropImage(){
    this.taken = false;
    console.log("mouseup");
    this.sendChange();
  }

  zoomImage(e){
    
    if (e.cancelable) {
      e.preventDefault();
   }
    clearInterval(this.timer);
    var xs = (e.clientX - this.pointX) / this.scale,
    ys = (e.clientY - this.pointY) / this.scale,
    delta = -e.deltaY;
    (delta > 0) ? (this.scale *= 1.05) : (this.scale /= 1.05);
    this.pointX = e.clientX - xs * this.scale;
    this.pointY = e.clientY - ys * this.scale;
    
    this.timer = setInterval(() => {
      this.sendChange();
      clearInterval(this.timer);
    }, 3000);

    this.setTransform();
  }

  setTransform(): void{
    var tmp = this.convertPointintoPercent(this.pointX, this.pointY);
    console.log(tmp);
    
    // this.zoom.style.transform = "translate(" + this.pointX + "px, " + this.pointY + "px) scale(" +
    // this.scale + ")";
    this.zoom.style.transform = "translate(" + tmp.x * 50 + "%, " + tmp.y * 50 + "%) scale(" +
    this.scale + ")";
  }
  
  setTransformP(pointx, pointy, scale): void{
    this.pointX = pointx;
    this.pointY = pointy;
    this.scale = scale;
    var tmp = this.convertPointintoPercent(this.pointX, this.pointY);
    console.log(tmp);
    
    // this.zoom.style.transform = "translate(" + pointx + "px, " + pointy + "px) scale(" +
    // scale + ")";
    this.zoom.style.transform = "translate(" + tmp.x * 50 + "%, " + tmp.y* 50  + "%) scale(" +
    this.scale + ")";
  }

  sendChange(): void {
    var p = this.convertPointintoPercent(this.pointX, this.pointY);
    this.socket.emit('change', {  scale: this.scale, 
      percentx: p.x, 
      percenty: p.y,
      pointx: this.pointX, 
      pointy: this.pointY,
      start: this.start });
  }


  convertPercentintoPoint(percentX, percentY) : any{
    var posX = percentX * this.zoomOuter.offsetWidth;
    var posY = percentY * this.zoomOuter.offsetHeight;
    return {x:posX, y:posY};
  }

  convertPointintoPercent(posX, posY) : any{
    var percentX = posX / this.zoomOuter.offsetWidth;
    var percentY = posY /this.zoomOuter.offsetHeight;
    return {x:percentX, y:percentY};
  }

  putImage(percentX, percentY) : any {
    var img = document.getElementById("container-media") as HTMLElement;

    img.style.width = percentX *  100 + "%";
    // img.style.maxHeight = percentY *  100 + "%";
    // img.style.maxHeight = percentY *  100 + "%";
  }

  closeSocketConnection() {
    this.image = "";
    this.socket.close();
  }

  sendImage(message: string | ArrayBuffer){
    this.zoom = document.getElementById("zoom") as HTMLElement;
    this.zoomOuter = document.getElementsByClassName("zoom-outer")[0] as HTMLElement;
    console.log("Send : Image");
    const img = new Image();
    img.src = message as string;

    img.onload = () => {
      this.socket.emit('image', {width: img.width / this.zoomOuter.offsetWidth,
                          height: img.height / this.zoomOuter.offsetHeight,
                          base64: message });
    }
  }
  
}
