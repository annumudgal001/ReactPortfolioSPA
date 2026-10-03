import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, Subject, startWith, switchMap } from 'rxjs';

import { PortfolioApiService } from './portfolio-api.service';

@Injectable({ providedIn: 'root' })
export class PortfolioStore {
  private readonly api = inject(PortfolioApiService);

  private readonly reload = new Subject<void>();
  readonly profile = toSignal(this.reload.pipe(startWith(undefined), switchMap(() => this.api.getProfile().pipe(catchError(() => of(null))))));

  readonly projects = toSignal(this.reload.pipe(startWith(undefined), switchMap(() => this.api.getProjects().pipe(catchError(() => of(null))))));
  refresh(): void { this.reload.next(); }
}
