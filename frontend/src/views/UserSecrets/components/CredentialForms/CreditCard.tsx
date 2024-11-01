import { FormControl, Input } from "@app/components/v2";
import { InfisicalSecretInput } from "@app/components/v2/InfisicalSecretInput";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const CreditCard = ({ control, errors, isView = false }: any) => {
    const { t } = useTranslation();
    const fields = ['card_number', 'expiry_date', 'cvv'];
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
                            {isView ? (
                                <Input
                                    {...field}
                                    isDisabled={isView}
                                />
                            ) : (
                                <InfisicalSecretInput
                                    {...field}
                                    required={true}
                                    disabled={isView}
                                    containerClassName="text-bunker-300 hover:border-primary-400/50 border border-mineshaft-600 bg-mineshaft-900 px-2 py-1.5"
                                />
                            )}
                        </FormControl>
                    )}
                />
            ))}
        </div>
    )
}

export const CreditCardFormSchema = z.object({
    card_number: z
        .string()
        .length(16, 'Card number must be 16 digits')
        .regex(/^\d+$/, 'Card number must contain only digits'),
    expiry_date: z
        .string()
        .regex(
            /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
            'Expiry date must be in MM/YY format'
        ),
    cvv: z
        .string()
        .length(3, 'CVV must be 3 digits')
        .regex(/^\d+$/, 'CVV must contain only digits'),
});
