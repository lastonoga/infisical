import { TGenericPermission } from "@app/lib/types";

export type TCreateUserSecretDTO = {
  key: string;
  type: string;
  value: string;
} & TGenericPermission;

export type TUpdateUserSecretDTO = {
  id: string;
  key?: string;
  type?: string;
  value?: string;
} & TGenericPermission;

export type TDeleteUserSecretDTO = {
  id: string;
} & TGenericPermission;

export type TGetDetailedUserSecretDTO = {
  id: string;
} & TGenericPermission;

export type TListUserSecretDTO = TGenericPermission & {
  limit: number;
  offset: number;
};
