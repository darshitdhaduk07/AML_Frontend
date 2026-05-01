import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../../../core/services/file.service';
import { ToastService } from '../../../../core/services/toast.service';

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
        private toastService: ToastService
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
                this.toastService.error('Please select a valid CSV file.');
            }
        }
    }

    triggerUpload() {
        if (!this.selectedFile || !this.selectedType) {
            this.toastService.warning('Please select both a file and an ingestion type.');
            return;
        }

        this.isUploading = true;

        this.fileService
            .uploadFile(this.selectedFile, this.selectedType)
            .subscribe({
                next: (response: string) => {
                    this.isUploading = false;
                    this.uploadStatus = 'success';
                    this.toastService.success(response || 'File uploaded successfully');
                    // Reset form on success
                    this.selectedFile = null;
                    this.selectedType = '';
                },
                error: (error) => {
                    this.isUploading = false;
                    this.uploadStatus = 'error';
                    // We DO NOT set this.selectedFile = null here so the user can retry
                },
            });
    }

    removeFile() {
        this.selectedFile = null;
        this.uploadStatus = 'idle';
    }
}
