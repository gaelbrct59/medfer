import {Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
@Injectable({
  providedIn: 'root'
})
export class ImageCompressComponent {
  constructor(private imageCompress: NgxImageCompressService) { }
  file: any;
  localUrl: any;
  localCompressedURl: any;
  sizeOfOriginalImage: number;
  sizeOFCompressedImage: number;

  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;
  public compressFile(image, socket) : any{
    var orientation = -1;
    this.sizeOfOriginalImage = this.imageCompress.byteCount(image) / (1024 * 1024);
    this.imageCompress.compressFile(image, orientation, 100, 100).then(
      result =>  { socket.emit('image',result); }
      );
  }
}