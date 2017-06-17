import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { GoogleMaps } from './google-maps';

@Injectable()
export class Locations {

	data: any = { locations: [] };
	latlong: any;


	constructor(public http: Http, public google: GoogleMaps) {
		
	}

	load(){

		if(this.data.locations.length > 0){
			return Promise.resolve(this.data);
		}

		return new Promise(resolve => {
			this.latlong = this.google.getLatitude();
			console.log('Entered inside ... ', resolve);
			// let headers= new Headers();
			// headers.append('Authorization', 'Bearer 2fd58a08-22d0-4891-9b60-63f7e0ad3f57');

			// let options = new RequestOptions({headers: headers});
			this.http.get('http://52.36.211.72:5555/gateway/Google%20Places%20API/1.0/place/nearbysearch/json?location='+this.latlong.latitude+','+this.latlong.longitude+'&radius=2500&type=gas_station&key=AIzaSyCgmk-cyWTmouW1v5I5vHqKTZz_IjnbFF4&APIKey=2fd58a08-22d0-4891-9b60-63f7e0ad3f57').map(res => res.json()).subscribe(data => {
				
				for(let result of data.results) {
					this.data.locations.push({latitude: result.geometry.location.lat, longitude: result.geometry.location.lng, title: result.name});
					console.log(JSON.stringify(this.data));
			}

				// this.data = data.results

				this.data = this.applyHaversine(this.data.locations);

				this.data.sort((locationA, locationB) => {
					return locationA.distance - locationB.distance;
				});

				resolve(this.data);
			});

		});

	}

	applyHaversine(locations){

		let usersLocation = {
			lat: this.latlong.latitude,
			lng: this.latlong.longitude
		};

		locations.map((location) => {

			let placeLocation = {
				lat: location.latitude,
				lng: location.longitude
			};

			location.distance = this.getDistanceBetweenPoints(
				usersLocation,
				placeLocation,
				'miles'
			).toFixed(2);
		});

		return locations;
	}

	getDistanceBetweenPoints(start, end, units){

	    let earthRadius = {
	        miles: 3958.8,
	        km: 6371
	    };
	 
	    let R = earthRadius[units || 'miles'];
	    let lat1 = start.lat;
	    let lon1 = start.lng;
	    let lat2 = end.lat;
	    let lon2 = end.lng;
	 
	    let dLat = this.toRad((lat2 - lat1));
	    let dLon = this.toRad((lon2 - lon1));
	    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	    Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
	    Math.sin(dLon / 2) *
	    Math.sin(dLon / 2);
	    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    let d = R * c;
	 
	    return d;

	}

	toRad(x){
		return x * Math.PI / 180;
	}

}
