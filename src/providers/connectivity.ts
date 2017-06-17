import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

declare var Connection;

@Injectable()
export class Connectivity {

  onDevice: boolean;

  constructor(public platform: Platform, public network: Network){
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    if(this.onDevice && this.network.onConnect().subscribe(() => { return true })){
      // return this.network.connection !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }

  isOffline(): boolean {
    // if(this.onDevice && Network.connection){
    if(this.onDevice && this.network.onDisconnect().subscribe(() => { return true })){
      // return Network.connection === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }
  
}