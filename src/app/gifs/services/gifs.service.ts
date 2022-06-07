import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _apiKey: string = 'wENtU3DKYKFx47PEncCzHNhvcPmIZngp';
  private _servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  // TODO: Cambiar any por su tipo
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(sessionStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(sessionStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query: string) {
    query = query.trim().toLowerCase();

    if (this._historial.includes(query))
      this._historial.splice(this._historial.indexOf(query), 1);

    this._historial.unshift(query);
    this._historial = this._historial.splice(0, 10);

    sessionStorage.setItem('historial', JSON.stringify(this._historial));

    const params = new HttpParams()
      .set('api_key', this._apiKey)
      .set('q', query)
      .set('limit', '10');

    this.http
      .get<SearchGifsResponse>(`${this._servicioUrl}/search`, { params })
      .subscribe((resp) => {
        this.resultados = resp.data;
        sessionStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
