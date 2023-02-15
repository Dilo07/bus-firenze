import { Coordinate } from '@npt/npt-map';

export class FleetManager {
  id: number;
  name: string;
  surname: string;
  contractCode: string;
  idSap: number;
  fiscalCode: string;
  companyType: string;
  pIva: string;
  companyName: string;
  address: string;
  city: string;
  district: string;
  cap: string;
  contacts: Contact[];
  fileId: number;
  country: string;
  extraUE: boolean;
  codeDest: string;
  failedCheck: boolean;
  documents: FleetDocument[];
}

export interface Contact {
  code: number;
  value: string;
}

export class CompleteFleetManager extends FleetManager {
  vehicles: Vehicle[];
  ticketId?: string;
}

export class Driver {
  id: number;
  name: string;
  surname: string;
  contacts: Contact[];
  fleetManagerId: number;
}

export interface DriverVehicle {
  id: number;
  displayName: string;
  status: boolean;
  dateIns: Date;
}

export class Vehicle {
  id: number;
  fleetManagerId: number;
  certificateId: number;
  lpn: string;
  lpnNat: string;
  euroClass: number;
  europeanGroup: number;
  europeanGroupLabel: string;
  expiresAt: LocalDate;
  numAxis: number;
  maxWeight: number;
  associationDate: Date;
  appointmentDate: Date;
  obuId: string;
  hardware: number;
  contractType: string;
  allowContacted: boolean;
  status: string;
  documents: DocumentVehicle[];
  documentsObu: DocumentObu[];
}

export interface DocumentVehicle {
  fileId: number;
  valid: Date;
  sink: Date;
  type: DepositType;
}

export interface DocumentObu {
  fileId: number;
  obuId: string;
  type: DepositType;
}

export type DepositType = 'deposit' | 'revoke' | 'retention' | 'request' | 'remObu' | 'remObuFree' | 'remObuFail' | 'missingObu';

export class VehicleTripPersistence {
  ticketNumber: string;
  ticketExpiresAt: number;
  id: number;
  start: number;
  end: number;
  obuId: string;
  type: string;
  shape: LineString;
  duration: number;
  engine: boolean;
  tripLength: number;
}

export class LineString {
  points: Points;
}

export class Points {
  dimension: number;
  measures: number;
  coordinates: Coordinate[];
}

export interface ColumnSort {
  active: string;
  direction: 1 | -1;
}

export class Obu {
  vehicleId: number;
  obuId: string;
}

export interface TripStat {
  innerLength: number;
  outerLength: number;
  innerDuration: number;
  outerDuration: number;
}

export interface RepairShops {
  name: string;
  surname: string;
  mail: string;
  mobileNumber: string;
  contactRange: string;
  nameShop: string;
  address: string;
}

export interface Modules {
  name: string;
  path: string;
}

export interface Ticket {
  ticketId: string;
  vehicleId: number;
  lpn: string;
  lpnNat: string;
  userIns: User;
  userDel: User;
  dateIns: Date;
  dateSink: Date;
  dateDel: Date;
  ticketStart: Date;
  ticketEnd: Date;
  ticketSubscription: boolean;
  type: string;
  code: string;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  guid: string;
}

export interface RefreshInterface {
  label: string;
  code: RefreshOption.time1minute | RefreshOption.time5minutes | RefreshOption.time10minutes | RefreshOption.time30minutes;
}

export enum RefreshOption {
  time1minute,
  time5minutes,
  time10minutes,
  time30minutes
}

export interface VatValidation {
  address: string;
  name: string;
  valid: boolean;
}

export interface FleetDocument {
  fileId: number;
  type: FleetDocumentTypes;
  valid: Date;
}

export type FleetDocumentTypes = 'reqForm' | 'idDoc' | 'comReg';

export interface BillingItemsAgg {
  nptGopId: number;
  typeId: number;
  startPeriod: Date;
  endPeriod: Date;
  price: number;
  quantity: number;
  priceTot: number;
  items: BillingItems;
  billingType: BillingType;
}

export interface BillingItems {
  id: number;
  lpn: string;
  lpnNat: string;
  startPeriod: LocalDate;
  endPeriod: LocalDate;
  price: number;
  quantity: number;
  billingType: BillingType;
  typeId: number;
}

export type BillingType =
  'INSTALL' | 'DELTA_NOT_MERGEABLE' | 'DELTA_MERGEABLE' | 'UNINSTALL' | 'MISSED_APPOINTMENT' | 'CANCELLED_APPOINTMENT' | 'REVERSAL';

export interface LocalDate {
  year: number;
  month: number;
  day: number;
}

export interface PenalType {
  typeId: number;
  billingType: BillingType;
}

export interface AddPenal {
  penalType: number;
  date: string;
}
