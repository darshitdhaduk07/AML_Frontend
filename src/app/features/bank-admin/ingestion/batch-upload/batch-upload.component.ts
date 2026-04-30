import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../../../core/services/file.service';

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
        private fileService: FileService,
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

        this.fileService
            .uploadFile(this.selectedFile, this.selectedType)
            .subscribe({
                next: (response: string) => {
                    this.isUploading = false;
                    this.uploadStatus = 'success';
                    alert(response);
                },
                error: (error) => {
                    this.isUploading = false;
                    this.uploadStatus = 'error';
                    const errorMsg =
                        error.error || 'Upload failed. Please try again.';
                    alert(errorMsg);
                },
            });
    }

    removeFile() {
        this.selectedFile = null;
        this.uploadStatus = 'idle';
    }
}
