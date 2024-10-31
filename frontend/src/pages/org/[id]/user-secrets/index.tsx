import { useTranslation } from "react-i18next";
import Head from "next/head";
import { UserSecretsOverviewPage } from "@app/views/UserSecrets/UserSecretsOverviewPage";

const UserSecrets = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("common.head-title", { title: t("dashboard.title") })}</title>
        <link rel="icon" href="/infisical.ico" />
        <meta property="og:image" content="/images/message.png" />
        <meta property="og:title" content={String(t("dashboard.og-title"))} />
        <meta name="og:description" content={String(t("dashboard.og-description"))} />
      </Head>
      <div className="h-full">
        <UserSecretsOverviewPage />
      </div>
    </>
  );
};

// const UserSecrets = withPermission(
//   () => {
//     const router = useRouter();
//     const queryParams = router.query;
//     const { config } = useServerConfig();

//     return (
//       <div>
//         <Head>
//           <title>Secret scanning</title>
//           <link rel="icon" href="/infisical.ico" />
//           <meta property="og:image" content="/images/message.png" />
//         </Head>
//         <div className="flex h-full w-full justify-center bg-bunker-800 text-white">
//           <div className="w-full max-w-7xl px-6">
//             <div className="mt-6 text-3xl font-semibold text-gray-200">Secret Scanning</div>
//             <div className="mb-6 text-lg text-mineshaft-300">
//               Automatically monitor your GitHub activity and prevent secret leaks
//             </div>

//           </div>
//         </div>
//       </div>
//     );
//   },
//   { action: OrgPermissionActions.Read, subject: OrgPermissionSubjects.Member }
// );

Object.assign(UserSecrets, { requireAuth: true });

export default UserSecrets;
