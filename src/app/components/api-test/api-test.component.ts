import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTestService } from '../../shared/services/api-test.service';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h2>API Integration Test</h2>

      <div class="card mt-3">
        <div class="card-body">
          <h5 class="card-title">Test Results</h5>

          <div class="mt-3">
            <h6>Health Endpoint:</h6>
            <div *ngIf="testResults['health'] !== undefined">
              <span [class]="testResults['health'] ? 'text-success' : 'text-danger'">
                {{ testResults['health'] ? '✓ Success' : '✗ Failed' }}
              </span>
            </div>
            <div *ngIf="testResults['health'] === undefined">
              <span class="text-secondary">Not tested</span>
            </div>
          </div>

          <div class="mt-3">
            <h6>User Registration:</h6>
            <div *ngIf="testResults['registration'] !== undefined">
              <span [class]="testResults['registration'] ? 'text-success' : 'text-danger'">
                {{ testResults['registration'] ? '✓ Success' : '✗ Failed' }}
              </span>
            </div>
            <div *ngIf="testResults['registration'] === undefined">
              <span class="text-secondary">Not tested</span>
            </div>
          </div>

          <div class="mt-4">
            <button class="btn btn-primary" (click)="runTests()" [disabled]="isRunningTests">
              {{ isRunningTests ? 'Running Tests...' : 'Run Tests' }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <p>
          <strong>Note:</strong> Make sure the backend server is running on
          <code>http://localhost:3000</code> before running these tests.
        </p>
        <div>
          <strong>Backend Setup:</strong>
          <ol>
            <li>Navigate to the backend directory: <code>cd backend</code></li>
            <li>Install dependencies: <code>npm install</code></li>
            <li>Start the server: <code>npm run dev</code></li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
    }
  `]
})
export class ApiTestComponent implements OnInit {
  testResults: { [key: string]: boolean } = {};
  isRunningTests = false;

  constructor(private apiTestService: ApiTestService) {}

  ngOnInit(): void {
    console.log('ApiTestComponent - Initializing');
  }

  runTests(): void {
    console.log('ApiTestComponent - Running tests');
    this.isRunningTests = true;
    this.testResults = {};

    this.apiTestService.runAllTests().subscribe({
      next: (results) => {
        console.log('ApiTestComponent - Test results:', results);
        this.testResults = results;
        this.isRunningTests = false;
      },
      error: (error) => {
        console.error('ApiTestComponent - Error running tests:', error);
        this.isRunningTests = false;
      }
    });
  }
}
