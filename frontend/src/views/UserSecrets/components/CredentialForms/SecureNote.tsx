import { FormControl } from "@app/components/v2";
import { InfisicalSecretInput } from "@app/components/v2/InfisicalSecretInput";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const SecureNote = ({ control, errors }: any) => {
    const { t } = useTranslation();
    const fields = ['title', 'content'];
    return (
        <div>
            {fields.map((fieldName) => (
                <Controller
                    control={control}
                    name={fieldName}
                    key={fieldName}
                    render={({ field }) => (
                        <FormControl
                            label={t(`user-secrets.fields.${fieldName}`)}
                            isError={Boolean(errors[fieldName])}
                            errorText={errors[fieldName]?.message}
                        >
                            <InfisicalSecretInput
                                {...field}
                                required={true}
                                containerClassName="text-bunker-300 hover:border-primary-400/50 border border-mineshaft-600 bg-mineshaft-900 px-2 py-1.5"
                            />
                        </FormControl>
                    )}
                />
            ))}
        </div>
    )
}

export const SecureNoteFormSchema = z
    .object({
        title: z
            .string()
            .min(1, 'Title is required')
            .max(100, 'Title must be 100 characters or less'),
        content: z
            .string()
            .min(1, 'Content is required')
            .max(1000, 'Content must be 1000 characters or less'),
    });
