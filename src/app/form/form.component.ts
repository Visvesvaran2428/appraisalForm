import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  appraisalForm: FormGroup;
  isSubmitting = false;

  ratings = [
    { value: 1, viewValue: '1 - Unsatisfactory' },
    { value: 2, viewValue: '2 - Needs Improvement' },
    { value: 3, viewValue: '3 - Meets Expectations' },
    { value: 4, viewValue: '4 - Exceeds Expectations' },
    { value: 5, viewValue: '5 - Outstanding' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.appraisalForm = this.fb.group({
      employeeInformation: this.fb.group({
        employeeName: ['', Validators.required],
        jobTitle: ['', Validators.required],
        department: ['', Validators.required],
        reviewDate: ['', Validators.required],
        reviewer: ['', Validators.required]
      }),
      goals: this.fb.array([this.createGoal()]),
      competencies: this.fb.array([this.createCompetency()]), // Correctly initialized as FormArray
      feedback: this.fb.group({
        peers: [''],
        subordinates: [''],
        self: ['']
      }),
      overallPerformance: this.fb.group({
        rating: ['', Validators.required],
        comments: ['']
      }),
      developmentNeeds: this.fb.group({
        strengths: [''],
        improvement: [''],
        training: [''],
        plan: ['']
      }),
      futureGoals: this.fb.array([this.createFutureGoal()]),
      commentsSignatures: this.fb.group({
        employeeComments: [''],
        employeeSignature: ['', Validators.required],
        reviewerSignature: ['', Validators.required]
      }),
      additionalComments: ['']
    });
  }

  ngOnInit() {}

  get goals() {
    return this.appraisalForm.get('goals') as FormArray;
  }

  get futureGoals() {
    return this.appraisalForm.get('futureGoals') as FormArray;
  }

  get competencies() {
    return this.appraisalForm.get('competencies') as FormArray; // Correctly defined getter
  }

  createGoal(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      measurement: ['', Validators.required],
      achievement: [''],
      comments: ['']
    });
  }

  addGoal() {
    this.goals.push(this.createGoal());
  }

  createCompetency(): FormGroup {
    return this.fb.group({
      category: ['', Validators.required],
      rating: ['', Validators.required],
      comments: ['']
    });
  }

  addCompetency() {
    this.competencies.push(this.createCompetency());
  }

  createFutureGoal(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      measurement: ['', Validators.required]
    });
  }

  addFutureGoal() {
    this.futureGoals.push(this.createFutureGoal());
  }

  onSubmit() {
    if (this.appraisalForm.valid) {
      this.isSubmitting = true; // Indicates submission is in progress
      this.http.post('http://localhost:3000/appraisals', this.appraisalForm.value)
        .subscribe({
          next: (response) => {
            console.log('Success:', response);
          },
          error: (error) => {
            console.error('Error:', error);
          },
          complete: () => {
            this.isSubmitting = false; 
          }
        });
    } else {
      console.error('Form is invalid');
    }
  }
}

