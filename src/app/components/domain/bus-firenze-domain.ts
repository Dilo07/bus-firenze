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
  euroClass: number;
  fleetManagerId: number;
  europeanGroup: number;
  europeanGroupLabel: string;
  numAxis: number;
  maxWeight: number;
  associationId: number;
  associationDate: number;
  obuId: string;
  hardware: number;
  installer: any;
  fileId: any;
  appointmentDate: any;
  deleted: any;
  status: string;
  expiresAt: any;
  contractType: string;
  allowContacted: boolean;
  certificateId: number;
  valid: boolean;
  id: number;
  lpn: string;
  lpnNat: string;
  documents: DocumentVehicle[];
  documentsObu: DocumentObu[];
  parentId: any;
}

export interface VehicleWarning {
  id: string;
  lpn: string;
  lpnNat: string;
  obuId: string;
  associationDate: { dateTime: Date };
}

export type VehicleStatus = 'ALL' | 'REGISTERED' | 'TEMP' | 'DELETED' | 'UNKNOWN';

export interface DocumentVehicle {
  fileId: number;
  valid: number;
  sink: number;
  type: DepositType;
}

export interface DocumentObu {
  fileId: number;
  obuId: string;
  type: DepositType;
}

export type DepositType = 'deposit' | 'revoke' | 'retention' | 'request' | 'remObu' | 'remObuFree' | 'remObuFail' | 'missingObu' | 'cert';

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

export interface VehicleWithoutTicket {
  id: number;
  displayName: string;
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
  fileName: string;
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

export interface SelectionCards {
  icon: string;
  title: string;
  subtitle: string;
  route: string;
  state?: object;
}
