import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { PaginationParams, PaginationResponse } from '../interfaces/pagination.interface';

export abstract class BaseDataService<T> {
  protected dataSubject = new BehaviorSubject<T[]>([]);
  protected totalCountSubject = new BehaviorSubject<number>(0);
  
  data$ = this.dataSubject.asObservable();
  totalCount$ = this.totalCountSubject.asObservable();

  constructor(
    protected supabaseClient: SupabaseClient,
    protected tableName: string
  ) {}

  protected async fetchPaginatedData(
    params: PaginationParams,
    queryBuilder?: (query: any) => any
  ): Promise<PaginationResponse<T>> {
    try {
      // Get total count
      let countQuery = this.supabaseClient
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      if (queryBuilder) {
        countQuery = queryBuilder(countQuery);
      }

      const { count, error: countError } = await countQuery;
      if (countError) throw countError;

      // Get paginated data
      let dataQuery = this.supabaseClient
        .from(this.tableName)
        .select('*')
        .order('name', { ascending: true })
        .range(
          (params.page - 1) * params.perPage,
          params.page * params.perPage - 1
        );

      if (queryBuilder) {
        dataQuery = queryBuilder(dataQuery);
      }

      const { data, error } = await dataQuery;
      if (error) throw error;

      return {
        data: data || [],
        totalCount: count || 0
      };
    } catch (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      throw error;
    }
  }
}