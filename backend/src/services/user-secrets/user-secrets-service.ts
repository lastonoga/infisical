import { TUserSecretsDALFactory } from "./user-secrets-dal";
import {
  TCreateUserSecretDTO,
  TDeleteUserSecretDTO,
  TGetDetailedUserSecretDTO,
  TListUserSecretDTO,
  TUpdateUserSecretDTO,
} from "./user-secrets-types";

type TUserSecretsServiceFactoryDep = {
  userSecretsDAL: TUserSecretsDALFactory;
};

export type TUserSecretsServiceFactory = ReturnType<typeof userSecretsServiceFactory>;

export const userSecretsServiceFactory = ({
  userSecretsDAL,
}: TUserSecretsServiceFactoryDep) => {
  const createUserSecret = async (data: TCreateUserSecretDTO) => {
    const secret = await userSecretsDAL.createSecret({
      ...data,
      userId: data.actorId,
      orgId: data.actorOrgId,
    });
    return secret;
  };

  const deleteUserSecret = async (data: TDeleteUserSecretDTO) => {
    const secret = await userSecretsDAL.deleteSecret({
      id: data.id,
      userId: data.actorId,
      orgId: data.actorOrgId,
    });
    return secret;
  };

  const updateUserSecret = async (data: TUpdateUserSecretDTO) => {
    const secret = await userSecretsDAL.updateSecret({
      id: data.id,
      userId: data.actorId,
      orgId: data.actorOrgId,
    }, data);
    return secret;
  };

  const listUserSecret = async (data: TListUserSecretDTO) => {
    const secret = await userSecretsDAL.listSecret({
      userId: data.actorId,
      orgId: data.actorOrgId,
      limit: data.limit,
      offset: data.offset,
    });
    
    return secret;
  };

  const getUserSecret = async (data: TGetDetailedUserSecretDTO) => {
    const secret = await userSecretsDAL.findUserSecretById({
      id: data.id,
      userId: data.actorId,
      orgId: data.actorOrgId,
    });
    return secret;
  };

  return {
    createUserSecret,
    deleteUserSecret,
    updateUserSecret,
    listUserSecret,
    getUserSecret
  };
};
