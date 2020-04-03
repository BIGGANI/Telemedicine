import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Global } from './app.global';
import { Patient } from './app.model';
import { timer  } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.doctorroom.html'
  })
export class DoctorRoomComponent{
  timer1:any = timer(this.global.TimerValue,this.global.TimerValue);

  patients:Array<Patient> = new Array<Patient>();
  constructor(public httpClient:HttpClient , 
    public routing:Router ,
    public global:Global){
      this.RefreshPatients();
      if(this.global.IsDoctor==false){
        this.timer1.subscribe(
          ()=>{this.httpClient.post(global.ApiUrl+
            "TakeFinalReport", this.global.patientObj)
            .subscribe(res=>this.SuccessTestDone(res))
            ;
          }
        );    
      }
  }
  RefreshPatients(){
    this.httpClient.get(this.global.ApiUrl +  "CurrentPatients")
    .subscribe(res=>this.Success(res),
    res=>this.Error(res));
  }
  PatientAttended(callPatient:Patient){
    callPatient.Medication = this.global.patientObj.Medication;
    this.httpClient.post(this.global.ApiUrl +  "PatientAttended"
    , callPatient)
    
    .subscribe(res=>this.PatientCompleted(res),
    res=>this.Error(res));
  }
  CallPatient(callPatient:Patient){
    this.httpClient.post(this.global.ApiUrl +  "CallPatient"
    , callPatient)
    .subscribe(res=>this.NextPatient(res),
    res=>this.Error(res));
  }
  PatientCompleted(res){
    if(res){
      if(this.global.IsDoctor){
        this.global.patientObj = new Patient();
        this.RefreshPatients();
      }
      else{
      this.global.patientObj = res;
      }
    }
  }
  NextPatient(res){
    if(res){
    this.global.patientObj = res;
    }
    this.RefreshPatients();
  }
  SuccessTestDone(res){
    if(res){
      this.global.patientObj = res;
      this.routing.navigate(['/FinalReport']);
    }
  }
  Success(res){
    this.patients = res;
    
  }
  Error(res){
    alert(res.status);
  }
}