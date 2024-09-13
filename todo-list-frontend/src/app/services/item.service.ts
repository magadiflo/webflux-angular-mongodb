import { inject, Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ItemStatus } from '../model/item-status.enum';
import { Item } from '../model/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private readonly _http = inject(HttpClient);
  private readonly _ngZone = inject(NgZone);
  private readonly _baseUrl = `${environment.apiUrl}/api/v1/items`;

  public findAllItems(): Observable<Item> {
    return new Observable<Item>(subscriber => {

      const eventSource = new EventSource(this._baseUrl);

      //* Procesar mensajes entrantes
      eventSource.onmessage = (event) => {
        const item = JSON.parse(event.data);
        this._ngZone.run(() => subscriber.next(item));
      }

      //* Manejo de errores
      eventSource.onerror = (error) => {
        if(eventSource.readyState === 0) {
          //* La conexión ha sido cerrada por el servidor
          eventSource.close();
          subscriber.complete();
        } else {
          subscriber.error(error);
        }
      }
    });
  }

  public findItemById(id: string): Observable<Item> {
    return this._http.get<Item>(`${this._baseUrl}/${id}`);
  }

  public addItem(description: string): Observable<Item> {
    return this._http.post<Item>(this._baseUrl, { description });
  }

  public updateDescription(id: string, version: number, description: string): Observable<Item> {
    return this._http.patch<Item>(`${this._baseUrl}/${id}`, { description }, ItemService.buildOptions(version));
  }

  public updateStatus(id: string, version: number, status: ItemStatus): Observable<Item> {
    return this._http.patch<Item>(`${this._baseUrl}/${id}`, { status }, ItemService.buildOptions(version));
  }

  public deleteItem(id: string, version: number): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/${id}`, ItemService.buildOptions(version));
  }

  private static buildOptions(version: number) {
    const headers = new HttpHeaders().set('if-match', String(version));
    return { headers };
  }

}
