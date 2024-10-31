export enum ReservedFolders {
  SecretReplication = "__reserve_replication_"
}

export type TUserSecretBase = {
  key: string;
  type: string;
  value: string;
}

export type TUserSecret = {
  id: string;
  createdAt: string;
  updatedAt: string;
} & TUserSecretBase;

export type TUpdateUserSecret = {
  id: string;
} & TUserSecretBase

export type TGetUserSecret = {
  id: string;
};

export type GetUserSecretsDTO = {
  limit: number;
  offset: number;
};

export type TDeleteUserSecret = {
  id: string;
};

export type TListUserSecrets = {
  userSecrets: TUserSecret[],
  totalCount: number
}

export type TCreateUserSecret = TUserSecretBase;
