import { ResourceAction } from 'src/app-constants/enums';

export interface Permission {
  resource: string;
  action: ResourceAction[];
}
