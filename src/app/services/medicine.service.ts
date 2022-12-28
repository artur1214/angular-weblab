import {IMedicine} from "../models/medicine";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const BASE_URL = 'http://127.0.0.1:8000/api/'

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  constructor(private http: HttpClient) {

  }

  getAll(): Observable<IMedicine[]> {
    return this.http.get<IMedicine[]>(BASE_URL + 'medicine/')
  }

  getAllTypes(): Observable<[number, string][]> {
    return this.http.get<[number, string][]>(BASE_URL + 'medicine_type/')
  }

  patch(id: string | number | undefined, fields: Partial<IMedicine>): Observable<IMedicine> {
    return this.http.patch<IMedicine>(BASE_URL + `medicine/${id ? (id + '/') : ''}`, fields)
  }

  create(fields: Partial<IMedicine>): Observable<IMedicine> {
    return this.http.post<IMedicine>(BASE_URL + `medicine/`, fields)
  }
  getOne() {

  }

  delete(id: string | number) {
    return this.http.delete(BASE_URL + `medicine/${id}/`)
  }

}
