import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import {
  ApiResponse,
  ContactPayload,
  ContactResponse,
  FeedbackPayload,
  Profile,
  Project,
} from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private readonly http = inject(HttpClient);

  getProfile() {
    return this.http
      .get<ApiResponse<Profile>>('/api/profile')
      .pipe(map((response) => response.data));
  }

  getProjects() {
    return this.http
      .get<ApiResponse<Project[]>>('/api/projects')
      .pipe(map((response) => response.data));
  }

  sendMessage(payload: ContactPayload) {
    return this.http.post<ContactResponse>('/api/contact', payload);
  }

  sendFeedback(payload: FeedbackPayload) {
    return this.http.post<ContactResponse>('/api/feedback', payload);
  }
}
