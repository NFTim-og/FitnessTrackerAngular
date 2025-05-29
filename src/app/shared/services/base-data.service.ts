import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationParams } from '../models/pagination.model';

export abstract class BaseDataService<T> {
  protected dataSubject = new BehaviorSubject<T[]>([]);
  protected totalCountSubject = new BehaviorSubject<number>(0);
  
  data$ = this.dataSubject.asObservable();
  totalCount$ = this.totalCountSubject.asObservable();

  constructor(
    protected http: HttpClient,
    protected apiUrl: string
  ) {}

  protected buildHttpParams(params: PaginationParams): HttpParams {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.perPage.toString());
    
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    
    if (params.sortOrder) {
      httpParams = httpParams.set('sortOrder', params.sortOrder);
    }
    
    return httpParams;
  }
}
