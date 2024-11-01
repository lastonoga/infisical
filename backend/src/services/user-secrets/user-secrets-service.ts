import { TUserSecretsDALFactory } from "./user-secrets-dal";
import {
  TCreateUserSecretDTO,
  TDeleteUserSecretDTO,
  TGetDetailedUserSecretDTO,
  TListUserSecretDTO,
  TUpdateUserSecretDTO,
} from "./user-secrets-types";
import { TKmsServiceFactory } from "../kms/kms-service";
import { KmsDataKey } from "../kms/kms-types";

type TUserSecretsServiceFactoryDep = {
  userSecretsDAL: TUserSecretsDALFactory;
  kmsService: Pick<TKmsServiceFactory, "createCipherPairWithDataKey">;
};

export type TUserSecretsServiceFactory = ReturnType<typeof userSecretsServiceFactory>;

export const userSecretsServiceFactory = ({
  userSecretsDAL,
  kmsService,
}: TUserSecretsServiceFactoryDep) => {
  const createUserSecret = async (data: TCreateUserSecretDTO) => {
    const { encryptor } =
      await kmsService.createCipherPairWithDataKey({
        type: KmsDataKey.Organization,
        orgId: data.actorOrgId as string
      });
    
    const encryptedValue = encryptor({ plainText: Buffer.from(data.value as string) }).cipherTextBlob

    const secret = await userSecretsDAL.createSecret({
      ...data,
      encryptedValue,
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

  const getUserSecret = async (data: TGetDetailedUserSecretDTO) => {
    const { decryptor } =
      await kmsService.createCipherPairWithDataKey({
        type: KmsDataKey.Organization,
        orgId: data.actorOrgId as string
      });

    const secret = await userSecretsDAL.findUserSecretById({
      id: data.id,
      userId: data.actorId,
      orgId: data.actorOrgId,
    });
    
    let value = decryptor({ cipherTextBlob: secret.encryptedValue }).toString();
    value = JSON.parse(value);

    secret.value = value;

    return secret;
  };

  const updateUserSecret = async (data: TUpdateUserSecretDTO) => {
    const { encryptor } =
      await kmsService.createCipherPairWithDataKey({
        type: KmsDataKey.Organization,
        orgId: data.actorOrgId as string
      });

    const encryptedValue = encryptor({ plainText: Buffer.from(data.value as string) }).cipherTextBlob

    const updateData = {
      key: data.key,
      type: data.type,
      encryptedValue,
    }

    const secret = await userSecretsDAL.updateSecret({
      id: data.id,
      userId: data.actorId,
      orgId: data.actorOrgId,
    }, updateData);

    return secret;
  };

  const listUserSecret = async (data: TListUserSecretDTO) => {
    const secret = await userSecretsDAL.listSecret({
      userId: data.actorId,
      orgId: data.actorOrgId,
    }, {
      limit: data.limit,
      offset: data.offset,
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
