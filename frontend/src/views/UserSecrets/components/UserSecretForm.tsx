import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalContent,
  Menu,
  MenuItem,
} from "@app/components/v2";
import {
  useWorkspace
} from "@app/context";
import { useCreateUserSecret } from "@app/hooks/api";
import { WebLogin, WebLoginFormSchema } from "./CredentialForms/WebLogin";
import { useUpdateUserSecret } from "@app/hooks/api/userSecrets/mutations";
import { CreditCard, CreditCardFormSchema } from "./CredentialForms/CreditCard";
import { useTranslation } from "react-i18next";
import { SecureNote, SecureNoteFormSchema } from "./CredentialForms/SecureNote";

const CREDENTIALS = {
  WebLogin: {
    component: WebLogin,
    schema: WebLoginFormSchema,
  },
  CreditCard: {
    component: CreditCard,
    schema: CreditCardFormSchema,
  },
  SecureNote: {
    component: SecureNote,
    schema: SecureNoteFormSchema,
  }
}

const UserSecretsForm = z
  .object({
    key: z.string().trim().min(1, "Key is required"),
    type: z.string().trim(),
  })

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';

type Props = {
  action: typeof CREATE_ACTION | typeof UPDATE_ACTION;
  defaultValues?: {
    [key: string]: any;
  };
  id?: string;
  type?: keyof typeof CREDENTIALS;
  // modal props
  isOpen?: boolean;
  onClose: () => void;
  onTogglePopUp: (isOpen: boolean) => void;
  onExecute: (...args: any) => void;
};

export const UserSecretForm = ({
  action = 'create',
  defaultValues = {
    type: "WebLogin",
  },
  id,
  isOpen,
  onClose,
  onTogglePopUp,
  onExecute,
}: Props) => {
  const { t } = useTranslation();
  const [secretType, setSecretType] = useState<keyof typeof CREDENTIALS>(defaultValues.type);

  const { currentWorkspace } = useWorkspace();

  const currentCredential = CREDENTIALS[secretType];
  const CredentialFormComponent = currentCredential.component;

  const schema = z.intersection(UserSecretsForm, currentCredential.schema);
  type TFormSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors }
  } = useForm<TFormSchema>({ resolver: zodResolver(schema) });
  const { mutateAsync: createUserSecret } = useCreateUserSecret();
  const { mutateAsync: updateUserSecret } = useUpdateUserSecret();

  watch('type');

  const updateSecretType = (type: keyof typeof CREDENTIALS) => {
    setSecretType(type);
    setValue('type', type);
  }

  const handleFormSubmit = async ({ key, ...values }: any) => {
    const value = JSON.stringify(values);
    const type = secretType;

    if (action === CREATE_ACTION) {
      await createUserSecret({
        key,
        type,
        value,
      });
    } else {
      await updateUserSecret({
        id: id as any,
        key,
        type,
        value,
      });
    }

    await onExecute();
    await reset();
    await onClose();
  }

  useEffect(() => {
    Object.entries(defaultValues).forEach(([key, value]) => {
      setValue(key as any, value, { shouldDirty: true });
    });
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onTogglePopUp}>
      <ModalContent
        className="max-h-[80vh] overflow-y-auto"
        title="Create & Update"
        subTitle="Create & update your secret"
      >

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FormControl
            label="Type"
            isRequired
            isError={Boolean(errors?.type)}
            errorText={errors?.type?.message}
          >
            <Menu>
              {action === CREATE_ACTION ? (
                Object.entries(CREDENTIALS).map(([key, _]) => (
                  <MenuItem
                    onClick={() => updateSecretType(key as keyof typeof CREDENTIALS)}
                    key={key}
                    isSelected={key === secretType}>
                    {t(`user-secrets.types.${key}`)}
                  </MenuItem>
                ))
              ) : (
                <MenuItem
                  key={secretType}
                  isSelected={true}>
                  {t(`user-secrets.types.${secretType}`)}
                </MenuItem>
              )}
            </Menu>
            {/* 
            <Select
              position="popper"
              value={'WebLogin'}
              defaultValue={'WebLogin'}
              onValueChange={(value) => {
                if (value) setValue('type', value);
              }}
              placeholder="Type your secret name"
              className="w-full border border-mineshaft-500"
              dropdownContainerClassName="text-bunker-200 bg-mineshaft-800 border border-mineshaft-600 z-50 max-h-96 border-gray-700"
            >
              <SelectItem value="WebLogin">Web Login</SelectItem>
            </Select> */}
          </FormControl>
          <FormControl
            label="Key"
            isRequired
            isError={Boolean(errors?.key)}
            errorText={errors?.key?.message}
          >
            <Input
              {...register("key")}
              placeholder="Type your secret name"
              autoCapitalization={currentWorkspace?.autoCapitalization}
            />
          </FormControl>
          <CredentialFormComponent control={control} errors={errors} />
          <div className="mt-7 flex items-center">
            <Button
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              key="layout-create-project-submit"
              className="mr-4"
              type="submit"
            >
              {action === CREATE_ACTION ? 'Create' : 'Update'} Secret
            </Button>
            <Button
              key="layout-cancel-create-project"
              onClick={onClose}
              variant="plain"
              colorSchema="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
