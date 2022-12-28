
export enum MedicineType {
  tabs = 1,
  drink,
  drug,
  painkiller
}

export interface IMedicine {
  id?: number,
  type?: MedicineType,
  name: string,
  model: string,
  price: string
}
export interface IMedicineView {
  id?: number,
  type: string,
  name: string,
  model: string,
  price: string
}
