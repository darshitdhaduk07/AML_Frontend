import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-batch-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.css']
})
export class BatchUploadComponent {
  selectedFile: File | null = null;
  isUploading = false;
  uploadStatus: 'idle' | 'success' | 'error' = 'idle';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file?.name.toLowerCase().endsWith('.csv')) {
      this.selectedFile = file;
      this.uploadStatus = 'idle';
    } else {
      this.selectedFile = null;
      this.uploadStatus = 'error';
    }
  }

  triggerUpload() {
    if (!this.selectedFile) return;
    this.isUploading = true;
    
    // SRS 3.2.3: Process batch and assign unique ID
    setTimeout(() => {
      this.isUploading = false;
      this.uploadStatus = 'success';
    }, 2000);
  }

  removeFile() {
    this.selectedFile = null;
    this.uploadStatus = 'idle';
  }
}