import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-batch-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.css'],
})
export class BatchUploadComponent {
  selectedFile: File | null = null;
  selectedType: string = '';
  isUploading = false;
  uploadStatus: 'idle' | 'success' | 'error' = 'idle';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.name.toLowerCase().endsWith('.csv')) {
        this.selectedFile = file;
        this.uploadStatus = 'idle';
      } else {
        this.selectedFile = null;
        this.uploadStatus = 'error';
        alert('Please select a valid CSV file.');
      }
    }
  }

  triggerUpload() {
    if (!this.selectedFile || !this.selectedType) {
      alert('Please select both a file and an ingestion type.');
      return;
    }

    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    const endpoint = `${environment.apiUrl}/api/files/${this.selectedType.toLowerCase()}`;

    // Retrieve the JWT token from AuthService
    const token = this.authService.getToken();

    // Set up headers with Bearer token
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    this.http
      .post(endpoint, formData, {
        headers: headers,
        responseType: 'text',
      })
      .subscribe({
        next: (response: string) => {
          this.isUploading = false;
          this.uploadStatus = 'success';
          alert(response);
        },
        error: (error) => {
          this.isUploading = false;
          this.uploadStatus = 'error';
          const errorMsg = error.error || 'Upload failed. Please try again.';
          alert(errorMsg);
        },
      });
  }

  removeFile() {
    this.selectedFile = null;
    this.uploadStatus = 'idle';
  }
}
