
import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import{HttpClient, HttpParams, HttpHeaders}from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'user-task-list';
  addUser!: FormGroup;
  addUserRequest = [];
  responseData: any= [];
  id: any;
  showAddUserForm: boolean = false;
  selectedUserData!: any;
  
  toggleAddUserForm() {
    this.showAddUserForm = !this.showAddUserForm;
    
    if (this.showAddUserForm) {
      this.addUser.reset();
    }
  }
  
  
  
  constructor(private http:HttpClient, private formBuilder:FormBuilder) {
    this.responseData = [];
  }
  ngOnInit() {
    this.addUser = this.formBuilder.group({
      name: ['', Validators.required],
      gender:['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required]
    });

    this.getSearchResult();
  }

  onSubmit() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer 77b93a34a5df74f49c9d811cead52f5df1430badfee64af4876f894ad0191c16'
      })
    };
  
    this.http.post('https://gorest.co.in/public/v2/users', this.addUser.value, httpOptions)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.responseData.push(response.data);
          this.addUser.reset();
          this.showAddUserForm = false;
          alert('User added successfully');
        },
        (error: any) => {
          console.log('Error occurred: ', error);
          if (error.status === 422) {
            console.log('Validation Error:', error.error);
          }
        }
      );
  }
  
  
  
    getSearchResult(){
    this.http.get('https://gorest.co.in/public/v2/users').subscribe
      (response=>
        {
          //console.log(response.item());
          let resSTR = JSON.stringify(response);
          let resJSON = JSON.parse(resSTR);
          console.log(resJSON.body);
          this.responseData = resJSON;
       } ,
      error =>{
        console.log("error occur ", error)
      });
  }

  deleteData(id: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer 77b93a34a5df74f49c9d811cead52f5df1430badfee64af4876f894ad0191c16'
      })
    };
  
    this.http.delete(`https://gorest.co.in/public/v2/users/${id}`, httpOptions)
      .subscribe(
        () => {
          this.responseData = this.responseData.filter((user: any) => user.id !== id);
          alert("User deleted successfully");
        },
        error => {
          console.log("Error occurred: ", error);
        }
      );
  }
  
  viewData(user:any){
    this.responseData=user;
  }

  editData(user:any){
    let userData={
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status
    }
    this.addUser.setValue(userData);
    this.id = user.id;
}

editUser(){
    console.log(this.addUser.value);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer 77b93a34a5df74f49c9d811cead52f5df1430badfee64af4876f894ad0191c16'
      })
    };
        console.log(httpOptions);
        this.http.put(
          "https://gorest.co.in/public/v2/users/"+this.id,this.addUser.value,httpOptions).subscribe(response=>{
            console.log(response);
            
          },
          error =>{
            console.log("error occur ", error)
          }); 
  }
  
  saveChanges() {
    // Send a PUT request to the API endpoint to save the changes
    this.http.put('https://gorest.co.in/public/v2/users/{id}', this.selectedUserData).subscribe((response) => {
      console.log('Changes saved successfully:', response);
      // Optionally, you can update the table data or perform any other actions
    })
}
}


