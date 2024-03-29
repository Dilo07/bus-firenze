import { DashboardSetting } from '@npt/npt-template';
import { ROLES } from 'src/app/npt-template-menu/menu-item.service';
import { RefreshOption } from './bus-firenze-domain';

export const TIMEREFRESH =
  [
    { label: '1 Minute', code: RefreshOption.time1minute },
    { label: '5 Minutes', code: RefreshOption.time5minutes },
    { label: '10 Minutes', code: RefreshOption.time10minutes },
    { label: '30 Minutes', code: RefreshOption.time30minutes }
  ];


export const euroNations = [
  'IT', 'AT', 'BE', 'BG', 'CZ', 'CY', 'HR',
  'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT',
  'RO', 'SK', 'SI', 'ES', 'SE', 'HU'
];

export const worldNations = [
  { value: 'AF', text: 'Afghanistan' }, { value: 'AL', text: 'Albania' }, { value: 'DZ', text: 'Algeria' },
  { value: 'AD', text: 'Andorra' }, { value: 'AO', text: 'Angola' }, { value: 'AR', text: 'Argentina' },
  { value: 'AM', text: 'Armenia' }, { value: 'AW', text: 'Aruba' }, { value: 'AU', text: 'Australia' },
  { value: 'AT', text: 'Austria' }, { value: 'AZ', text: 'Azerbaijan' }, { value: 'BH', text: 'Bahrain' },
  { value: 'BD', text: 'Bangladesh' }, { value: 'BY', text: 'Belarus' }, { value: 'BE', text: 'Belgium' },
  { value: 'BZ', text: 'Belize' }, { value: 'BJ', text: 'Benin' }, { value: 'BT', text: 'Bhutan' },
  { value: 'BO', text: 'Bolivia' }, { value: 'BA', text: 'Bosnia And Herzegovina' }, { value: 'BW', text: 'Botswana' },
  { value: 'BR', text: 'Brazil' }, { value: 'IO', text: 'British Indian Ocean Territory' }, { value: 'BN', text: 'Brunei Darussalam' },
  { value: 'BG', text: 'Bulgaria' }, { value: 'BF', text: 'Burkina Faso' }, { value: 'BI', text: 'Burundi' }, { value: 'KH', text: 'Cambodia' },
  { value: 'CM', text: 'Cameroon' }, { value: 'CV', text: 'Cape Verde' }, { value: 'CF', text: 'Central African Republic' },
  { value: 'TD', text: 'Chad' }, { value: 'CL', text: 'Chile' }, { value: 'CN', text: 'China' }, { value: 'CO', text: 'Colombia' },
  { value: 'KM', text: 'Comoros' }, { value: 'CG', text: 'Congo' }, { value: 'CD', text: 'Congo, Democratic Republic' },
  { value: 'CK', text: 'Cook Islands' }, { value: 'CR', text: 'Costa Rica' }, { value: 'CI', text: 'Cote D\'Ivoire' },
  { value: 'HR', text: 'Croatia' }, { value: 'CU', text: 'Cuba' }, { value: 'CY', text: 'Cyprus' },
  { value: 'CZ', text: 'Czech Republic' }, { value: 'DK', text: 'Denmark' }, { value: 'DJ', text: 'Djibouti' }, { value: 'EC', text: 'Ecuador' },
  { value: 'EG', text: 'Egypt' }, { value: 'SV', text: 'El Salvador' }, { value: 'GQ', text: 'Equatorial Guinea' }, { value: 'ER', text: 'Eritrea' },
  { value: 'EE', text: 'Estonia' }, { value: 'ET', text: 'Ethiopia' }, { value: 'FK', text: 'Falkland Islands (Malvinas)' },
  { value: 'FO', text: 'Faroe Islands' }, { value: 'FJ', text: 'Fiji' }, { value: 'FI', text: 'Finland' },
  { value: 'FR', text: 'France' }, { value: 'PF', text: 'French Polynesia' }, { value: 'GA', text: 'Gabon' }, { value: 'GM', text: 'Gambia' },
  { value: 'GE', text: 'Georgia' }, { value: 'DE', text: 'Germany' }, { value: 'GH', text: 'Ghana' }, { value: 'GI', text: 'Gibraltar' },
  { value: 'GR', text: 'Greece' }, { value: 'GL', text: 'Greenland' }, { value: 'GT', text: 'Guatemala' },
  { value: 'GN', text: 'Guinea' }, { value: 'GW', text: 'Guinea-Bissau' }, { value: 'GY', text: 'Guyana' },
  { value: 'HT', text: 'Haiti' }, { value: 'HN', text: 'Honduras' }, { value: 'HK', text: 'Hong Kong' },
  { value: 'HU', text: 'Hungary' }, { value: 'IS', text: 'Iceland' }, { value: 'IN', text: 'India' }, { value: 'ID', text: 'Indonesia' },
  { value: 'IR', text: 'Iran, Islamic Republic Of' }, { value: 'IQ', text: 'Iraq' }, { value: 'IE', text: 'Ireland' },
  { value: 'IL', text: 'Israel' }, { value: 'IT', text: 'Italy' }, { value: 'JP', text: 'Japan' }, { value: 'JO', text: 'Jordan' },
  { value: 'KP', text: 'KP' }, { value: 'KE', text: 'Kenya' }, { value: 'KI', text: 'Kiribati' }, { value: 'KR', text: 'Korea' },
  { value: 'KW', text: 'Kuwait' }, { value: 'KG', text: 'Kyrgyzstan' }, { value: 'LA', text: 'Lao People\'s Democratic Republic' },
  { value: 'LV', text: 'Latvia' }, { value: 'LB', text: 'Lebanon' }, { value: 'LS', text: 'Lesotho' },
  { value: 'LR', text: 'Liberia' }, { value: 'LY', text: 'Libyan Arab Jamahiriya' }, { value: 'LI', text: 'Liechtenstein' },
  { value: 'LT', text: 'Lithuania' }, { value: 'LU', text: 'Luxembourg' }, { value: 'MO', text: 'Macao' }, { value: 'MK', text: 'Macedonia' },
  { value: 'MG', text: 'Madagascar' }, { value: 'MW', text: 'Malawi' }, { value: 'MY', text: 'Malaysia' },
  { value: 'MV', text: 'Maldives' }, { value: 'ML', text: 'Mali' }, { value: 'MT', text: 'Malta' }, { value: 'MH', text: 'Marshall Islands' },
  { value: 'MR', text: 'Mauritania' }, { value: 'MU', text: 'Mauritius' }, { value: 'MX', text: 'Mexico' },
  { value: 'FM', text: 'Micronesia, Federated States Of' }, { value: 'MD', text: 'Moldova' }, { value: 'MC', text: 'Monaco' },
  { value: 'MN', text: 'Mongolia' }, { value: 'ME', text: 'Montenegro' }, { value: 'MA', text: 'Morocco' }, { value: 'MZ', text: 'Mozambique' },
  { value: 'NA', text: 'Namibia' }, { value: 'NL', text: 'Netherlands' }, { value: 'NC', text: 'New Caledonia' },
  { value: 'NZ', text: 'New Zealand' }, { value: 'NI', text: 'Nicaragua' }, { value: 'NE', text: 'Niger' }, { value: 'NG', text: 'Nigeria' },
  { value: 'NU', text: 'Niue' }, { value: 'NF', text: 'Norfolk Island' }, { value: 'NO', text: 'Norway' }, { value: 'OM', text: 'Oman' },
  { value: 'PK', text: 'Pakistan' }, { value: 'PA', text: 'Panama' }, { value: 'PG', text: 'Papua New Guinea' }, { value: 'PY', text: 'Paraguay' },
  { value: 'PE', text: 'Peru' }, { value: 'PH', text: 'Philippines' }, { value: 'PL', text: 'Poland' }, { value: 'PT', text: 'Portugal' },
  { value: 'QA', text: 'Qatar' }, { value: 'RO', text: 'Romania' }, { value: 'RU', text: 'Russian Federation' }, { value: 'RW', text: 'Rwanda' },
  { value: 'WS', text: 'Samoa' }, { value: 'SM', text: 'San Marino' }, { value: 'ST', text: 'Sao Tome And Principe' },
  { value: 'SA', text: 'Saudi Arabia' }, { value: 'SN', text: 'Senegal' }, { value: 'RS', text: 'Serbia' }, { value: 'SC', text: 'Seychelles' },
  { value: 'SL', text: 'Sierra Leone' }, { value: 'SG', text: 'Singapore' }, { value: 'SK', text: 'Slovakia' }, { value: 'SI', text: 'Slovenia' },
  { value: 'SB', text: 'Solomon Islands' }, { value: 'SO', text: 'Somalia' }, { value: 'ZA', text: 'South Africa' }, { value: 'ES', text: 'Spain' },
  { value: 'LK', text: 'Sri Lanka' }, { value: 'SD', text: 'Sudan' }, { value: 'SR', text: 'Suriname' }, { value: 'SZ', text: 'Swaziland' },
  { value: 'SE', text: 'Sweden' }, { value: 'CH', text: 'Switzerland' }, { value: 'SY', text: 'Syrian Arab Republic' },
  { value: 'TW', text: 'Taiwan' }, { value: 'TJ', text: 'Tajikistan' }, { value: 'TZ', text: 'Tanzania' }, { value: 'TH', text: 'Thailand' },
  { value: 'TL', text: 'Timor-Leste' }, { value: 'TG', text: 'Togo' }, { value: 'TK', text: 'Tokelau' }, { value: 'TO', text: 'Tonga' },
  { value: 'TN', text: 'Tunisia' }, { value: 'TR', text: 'Turkey' }, { value: 'TM', text: 'Turkmenistan' }, { value: 'TV', text: 'Tuvalu' },
  { value: 'UG', text: 'Uganda' }, { value: 'UA', text: 'Ukraine' }, { value: 'AE', text: 'United Arab Emirates' },
  { value: 'GB', text: 'United Kingdom' }, { value: 'US', text: 'United States' }, { value: 'UY', text: 'Uruguay' },
  { value: 'VU', text: 'Vanuatu' }, { value: 'VE', text: 'Venezuela' }, { value: 'VN', text: 'Viet Nam' },
  { value: 'WF', text: 'Wallis And Futuna' }, { value: 'YE', text: 'Yemen' }, { value: 'ZM', text: 'Zambia' }, { value: 'ZW', text: 'Zimbabwe' }];

export const CONTRACT_TYPE = {
  rent: 'RENT',
  buy: 'BUY'
};

export const TICKETS_TYPE = {
  ticket: 'contrassegno',
  abbonamento: 'abbonamento',
  voucher: 'voucher'
};

export const FLEETMNG_TYPE = Object.freeze({
  dittaIndividuale: 'PERS',
  aziendaPrivata: 'PRVT',
  pubblicaAmm: 'PA',
  ente: 'ENTE'
});


export const BILLING_STATUS = {
  all: 'ALL',
  unknown: 'UNKNOWN',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED'
};

export const dashboardSettings: DashboardSetting[] = [
  {
    role: ROLES.MOVYON,
    cards: [
      {
        title: 'WELCOME.TITLE-FLEET', content: 'WELCOME.FLEET-MANAGER', icon: 'icon-manage_accounts',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../manage'
      },
      {
        title: 'WELCOME.TITLE-OBU', content: 'WELCOME.ADD-OBU', icon: 'icon-obu',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../manage-obu', state: { viewNotAssociated: true }
      },
      {
        title: 'MENU.Ticket', content: 'WELCOME.MANAGE-TICKET', icon: 'icon-wysiwyg',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../ticket'
      }
    ]
  },
  {
    role: ROLES.DRIVER,
    cards: [
      {
        title: 'WELCOME.TITLE-VEHICLE', content: 'WELCOME.VEHICLE-DRIVER', icon: 'icon-car',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../user-driver/association-driver'
      },
      {
        title: 'WELCOME.TITLE-TICKET', content: 'WELCOME.ADD-TICKET', icon: 'icon-wysiwyg',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../ticket'
      },
      {
        title: 'WELCOME.TITLE-MANAGE-TICKET', content: 'WELCOME.MANAGE-TICKET', icon: 'icon-wysiwyg',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../ticket', state: { index: 1 }
      }
    ]
  },
  {
    role: ROLES.FLEETMNG,
    cards: [
      {
        title: 'WELCOME.TITLE-VEHICLE', content: 'WELCOME.VEHICLE', icon: 'icon-car',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../vehicles'
      },
      {
        title: 'WELCOME.TITLE-DRIVERS', content: 'WELCOME.MANAGE-DRIVERS', icon: 'icon-driver',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../drivers'
      },
      {
        title: 'WELCOME.TITLE-MANAGE-TICKET', content: 'WELCOME.MANAGE-TICKET', icon: 'icon-wysiwyg',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../ticket', state: { index: 1 }
      }
    ]
  },
  {
    role: ROLES.INSTALLER,
    cards: [
      {
        title: 'WELCOME.TITLE-OBU', content: 'WELCOME.ADD-OBU', icon: 'icon-obu',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../manage-obu', state: { viewNotAssociated: true }
      },
      {
        title: 'WELCOME.TITLE-TEST', content: 'WELCOME.TEST', icon: 'icon-obu',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../manage-obu', state: { index: 1 }
      }
    ]
  },
  {
    role: ROLES.OPER_MOVYON,
    cards: [
      {
        title: 'WELCOME.TITLE-FLEET', content: 'WELCOME.FLEET-MANAGER', icon: 'icon-manage_accounts',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../manage-obu'
      },
      {
        title: 'WELCOME.TITLE-VALID-FLEET', content: 'WELCOME.VALID-FLEET', icon: 'icon-rule',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../validation/valid-fleet'
      },
      {
        title: 'WELCOME.TITLE-VALID-VEHICLE', content: 'WELCOME.VALID-VEHICLE', icon: 'icon-rule',
        cardClass: 'mat-card-movyon-blue', buttonClass: 'whiteButtons', routing: '../validation/valid-vehicle', state: { index: 1 }
      }
    ]
  }
];
