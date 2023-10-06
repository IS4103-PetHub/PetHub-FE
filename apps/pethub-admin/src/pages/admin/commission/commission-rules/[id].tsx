import {
  Accordion,
  Badge,
  Container,
  Group,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { AccountStatusEnum, AccountTypeEnum } from "shared-utils";
import { getErrorMessageProps } from "shared-utils";
import { PageTitle } from "web-ui";
import DeleteActionButtonModal from "web-ui/shared/DeleteActionButtonModal";
import api from "@/api/axiosConfig";
import CommissionGroupAddPBModal from "@/components/commission/CommissionRuleAddPBModal";
import CommissionRuleInfoForm from "@/components/commission/CommissionRuleInfoForm";
import CommissionRulePetBusinessesTable from "@/components/commission/CommissionRulePetBusinessesTable";
import { PermissionsCodeEnum } from "@/types/constants";
import { CommissionRule, Permission } from "@/types/types";

interface CommissionRuleDetailsProps {
  ruleId: number;
  permissions: Permission[];
}

export default function CommissionRuleDetails({
  ruleId,
  permissions,
}: CommissionRuleDetailsProps) {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();
  const router = useRouter();

  //permissions
  // const permissionCodes = permissions.map((permission) => permission.code);
  // const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteCommissionRules);
  // const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadCommissionRules);

  const canWrite = true;
  const canRead = true;

  const [isEditingGroupInfo, setIsEditingGroupInfo] = useToggle();
  const [openedAccordions, setOpenedAccordions] = useState<string[]>([
    "commissionInfo",
    "commissionPetBusinesses",
  ]);

  // const { data: commissionRule, refetch } = useGetCommissionRuleById(ruleId);
  const commissionRule = dummyCommissionGroup;

  const handleChangeAccordion = (values: string[]) => {
    // prevent user from closing an accordion when updating
    if (!values.includes("commissionInfo") && isEditingGroupInfo) {
      return;
    }
    setOpenedAccordions(values);
  };

  const handleCancelEditGroupInfo = () => {
    setIsEditingGroupInfo(false);
    form.setValues({
      name: commissionRule?.name ?? "",
      commissionRate: commissionRule?.commissionRate ?? 0,
      default: commissionRule?.default ?? false,
    });
  };

  const formDefaultValues = {
    name: commissionRule ? commissionRule.name : "",
    commissionRate: commissionRule ? commissionRule.commissionRate : 0,
    default: commissionRule && commissionRule.default,
    // to show list of PB in the commissio group
    // petBusinesses: commissionRule ? commissionRule.petBusinesses : [],
  };

  const form = useForm({
    initialValues: formDefaultValues,
    validate: {
      name: isNotEmpty("Name is required"),
      commissionRate: isNotEmpty("Commission Rate is required"),
    },
  });

  // TODO: DELETE COMMISSION RULE
  // const deleteCommissionRuleMutation = useDeleteCommissionRule(queryClient);
  const handleDeleteCommissionRule = async (id?: number) => {
    if (!id) return;
    if (commissionRule?.default) {
      notifications.show({
        title: "Error Deleting Commission Rule",
        color: "red",
        icon: <IconX />,
        message: "Unable to Delete a Default Commission Rule",
      });
      return;
    }
    if (commissionRule?.petBusinesses.length != 0) {
      notifications.show({
        title: "Error Deleting Commission Rule",
        color: "red",
        icon: <IconX />,
        message:
          "Unable to Delete a Commission Rule with assigned pet businesses",
      });
      return;
    }
    try {
      // await deleteCommissionRuleMutation.mutateAsync(id);
      router.push("/admin/commission");
      notifications.show({
        title: "Commission Rule Deleted",
        color: "green",
        icon: <IconCheck />,
        message: `Commission Rule ID: ${id} deleted successfully.`,
      });
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Commission Rule", error),
      });
    }
  };

  // TODO: UPDATE COMMISSION GROUP DETAILS
  // const updateCommissionRuleMutation = useUpdateCommissionRule(queryClient);
  const handleUpdateCommissionRule = async (values: any) => {
    const payload = {
      commissionRuleId: commissionRule?.commissionRuleId,
      ...values,
    };
    console.log("UPDATING", payload);
    try {
      //   await updateCommissionRuleMutation.mutateAsync(payload);
      notifications.show({
        title: "Commission Rule Updated",
        color: "green",
        icon: <IconCheck />,
        message: "Commission Rule updated successfully!",
      });
      //   refetch();
      setIsEditingGroupInfo(false);
    } catch (error: any) {
      notifications.show({
        ...getErrorMessageProps("Error Updating Commission Rule", error),
      });
    }
  };

  return (
    <>
      <Head>
        <title>Commission Rule Details - Admin Portal - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container fluid>
        <Group position="apart">
          <Group position="left">
            <PageTitle title="Commission Rule Details" />
            <Badge size="lg">Rule Id: {ruleId}</Badge>
          </Group>
          {canWrite ? (
            <DeleteActionButtonModal
              title={`Are you sure you want to delete ${commissionRule?.name}?`}
              subtitle="The commission rule will no longer be availalbe."
              onDelete={() =>
                handleDeleteCommissionRule(commissionRule?.commissionRuleId)
              }
              large
            />
          ) : null}
        </Group>
      </Container>
      <Accordion
        multiple
        mb="xl"
        value={openedAccordions}
        onChange={(values) => handleChangeAccordion(values)}
      >
        <Accordion.Item value="commissionInfo">
          <Accordion.Control>
            <Group>
              <Text weight={600} size="xl">
                Commission Group Information
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel mb="xs">
            <CommissionRuleInfoForm
              commissionRule={commissionRule}
              form={form}
              isEditing={isEditingGroupInfo}
              onCancel={handleCancelEditGroupInfo}
              onClickEdit={() => setIsEditingGroupInfo(true)}
              onSubmit={handleUpdateCommissionRule}
              disabled={!canWrite}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="commissionPetBusinesses">
          <Accordion.Control>
            <Group>
              <Text weight={600} size="xl">
                Pet Businesses
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            {canWrite ? (
              <CommissionGroupAddPBModal commissionRule={commissionRule} />
            ) : null}

            <CommissionRulePetBusinessesTable
              commissionRule={commissionRule}
              disabled={!canWrite}
              // refetch={refetch}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

export async function getServerSideProps(context) {
  const ruleId = context.params.id;
  const session = await getSession(context);
  if (!session) return { props: { ruleId } };

  const userId = session.user["userId"];
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;
  return { props: { ruleId, permissions } };
}

const dummyCommissionGroup: CommissionRule = {
  commissionRuleId: 1,
  name: "Bronze",
  commissionRate: 5.5,
  default: true,
  createdAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  updatedAt: null,
  petBusinesses: [
    {
      userId: 1,
      companyName: "John's Company",
      uen: "12345678A",
      businessType: "SERVICE",
      businessDescription:
        "John's Company is a leading pet grooming service provider dedicated to enhancing the well-being of your beloved furry friends. With a passion for pets and a team of experienced groomers, we offer top-notch grooming services that go beyond mere pampering. We believe that grooming is an essential part of your pet's overall health and happiness.\n\nOur state-of-the-art grooming facility is designed to ensure the comfort and safety of your pets. We use only the finest pet-friendly products, and our team is trained to provide personalized care to meet your pet's unique needs.\n\nAt John Companys, we understand the significance of the bond between pets and their owners. That's why we strive to make every grooming experience a positive one. From bathing to nail trimming and ear cleaning to haircuts, we take care of it all.\n\nVisit our website at https://www.google.com to learn more about our services and book an appointment. Trust us to keep your pets looking and feeling their best!",
      contactNumber: "93727651",
      websiteURL: null,
      email: "john.doe@example.com",
      accountType: AccountTypeEnum.PetBusiness,
      accountStatus: AccountStatusEnum.Active,
      dateCreated: "2023-10-04T08:49:24.829Z",
      lastUpdated: null,
    },
    {
      userId: 2,
      companyName: "Smith's Pet Shop",
      uen: "12345678B",
      businessType: "SERVICE",
      businessDescription:
        "My Pet Shop is your one-stop destination for all your feline grooming needs. We are dedicated to providing the best grooming experience for cats of all breeds and sizes. Our passionate team of cat groomers is well-trained in handling cats with care and patience, ensuring a stress-free grooming session.\n\nWe understand that cats have unique grooming requirements, and we tailor our services to meet those needs. From fur brushing to nail trimming and ear cleaning to baths, we offer a comprehensive range of grooming services.\n\nAt Smith's Pet Shop, we believe that a well-groomed cat is a happy and healthy cat. Our grooming sessions not only keep your cats clean but also help in early detection of any health issues. We use premium, cat-friendly grooming products to ensure your cat's comfort and safety.\n\nVisit our website at https://www.google.com to explore our services and book an appointment. Let us pamper your feline friend and keep them looking and feeling their best!",
      contactNumber: "88712892",
      websiteURL: null,
      email: "jane.smith@example.com",
      accountType: AccountTypeEnum.PetBusiness,
      accountStatus: AccountStatusEnum.Active,
      dateCreated: "2023-10-04T08:49:25.069Z",
      lastUpdated: null,
    },
    {
      userId: 3,
      companyName: "Mike's Pet Business",
      uen: "12345678C",
      businessType: "SERVICE",
      businessDescription: "I like pets",
      contactNumber: "97128913",
      websiteURL: null,
      email: "mike.petbiz@example.com",
      accountType: AccountTypeEnum.PetBusiness,
      accountStatus: AccountStatusEnum.Active,
      dateCreated: "2023-10-04T08:49:25.223Z",
      lastUpdated: null,
    },
    {
      userId: 4,
      companyName: "Susan's Animal Store",
      uen: "12345678D",
      businessType: "SERVICE",
      businessDescription: "We groom rabbits",
      contactNumber: "98765432",
      websiteURL: null,
      email: "susan.animalstore@example.com",
      accountType: AccountTypeEnum.PetBusiness,
      accountStatus: AccountStatusEnum.Active,
      dateCreated: "2023-10-04T08:49:25.363Z",
      lastUpdated: null,
    },
    {
      userId: 5,
      companyName: "PetStore123",
      uen: "12345678E",
      businessType: "SERVICE",
      businessDescription: "We groom birds",
      contactNumber: "91789278",
      websiteURL: null,
      email: "linensoda@gmail.com",
      accountType: AccountTypeEnum.PetBusiness,
      accountStatus: AccountStatusEnum.Active,
      dateCreated: "2023-10-04T08:49:25.490Z",
      lastUpdated: null,
    },
  ],
};

const dummyData: CommissionRule[] = [
  {
    commissionRuleId: 1,
    name: "Bronze",
    commissionRate: 5.5,
    default: true,
    createdAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    updatedAt: null,
    petBusinesses: [
      {
        userId: 1,
        companyName: "John's Company",
        uen: "12345678A",
        businessType: "SERVICE",
        businessDescription:
          "John's Company is a leading pet grooming service provider dedicated to enhancing the well-being of your beloved furry friends. With a passion for pets and a team of experienced groomers, we offer top-notch grooming services that go beyond mere pampering. We believe that grooming is an essential part of your pet's overall health and happiness.\n\nOur state-of-the-art grooming facility is designed to ensure the comfort and safety of your pets. We use only the finest pet-friendly products, and our team is trained to provide personalized care to meet your pet's unique needs.\n\nAt John Companys, we understand the significance of the bond between pets and their owners. That's why we strive to make every grooming experience a positive one. From bathing to nail trimming and ear cleaning to haircuts, we take care of it all.\n\nVisit our website at https://www.google.com to learn more about our services and book an appointment. Trust us to keep your pets looking and feeling their best!",
        contactNumber: "93727651",
        websiteURL: null,
        email: "john.doe@example.com",
        accountType: AccountTypeEnum.PetBusiness,
        accountStatus: AccountStatusEnum.Active,
        dateCreated: "2023-10-04T08:49:24.829Z",
        lastUpdated: null,
      },
      {
        userId: 2,
        companyName: "Smith's Pet Shop",
        uen: "12345678B",
        businessType: "SERVICE",
        businessDescription:
          "My Pet Shop is your one-stop destination for all your feline grooming needs. We are dedicated to providing the best grooming experience for cats of all breeds and sizes. Our passionate team of cat groomers is well-trained in handling cats with care and patience, ensuring a stress-free grooming session.\n\nWe understand that cats have unique grooming requirements, and we tailor our services to meet those needs. From fur brushing to nail trimming and ear cleaning to baths, we offer a comprehensive range of grooming services.\n\nAt Smith's Pet Shop, we believe that a well-groomed cat is a happy and healthy cat. Our grooming sessions not only keep your cats clean but also help in early detection of any health issues. We use premium, cat-friendly grooming products to ensure your cat's comfort and safety.\n\nVisit our website at https://www.google.com to explore our services and book an appointment. Let us pamper your feline friend and keep them looking and feeling their best!",
        contactNumber: "88712892",
        websiteURL: null,
        email: "jane.smith@example.com",
        accountType: AccountTypeEnum.PetBusiness,
        accountStatus: AccountStatusEnum.Active,
        dateCreated: "2023-10-04T08:49:25.069Z",
        lastUpdated: null,
      },
      {
        userId: 3,
        companyName: "Mike's Pet Business",
        uen: "12345678C",
        businessType: "SERVICE",
        businessDescription: "I like pets",
        contactNumber: "97128913",
        websiteURL: null,
        email: "mike.petbiz@example.com",
        accountType: AccountTypeEnum.PetBusiness,
        accountStatus: AccountStatusEnum.Active,
        dateCreated: "2023-10-04T08:49:25.223Z",
        lastUpdated: null,
      },
      {
        userId: 4,
        companyName: "Susan's Animal Store",
        uen: "12345678D",
        businessType: "SERVICE",
        businessDescription: "We groom rabbits",
        contactNumber: "98765432",
        websiteURL: null,
        email: "susan.animalstore@example.com",
        accountType: AccountTypeEnum.PetBusiness,
        accountStatus: AccountStatusEnum.Active,
        dateCreated: "2023-10-04T08:49:25.363Z",
        lastUpdated: null,
      },
      {
        userId: 5,
        companyName: "PetStore123",
        uen: "12345678E",
        businessType: "SERVICE",
        businessDescription: "We groom birds",
        contactNumber: "91789278",
        websiteURL: null,
        email: "linensoda@gmail.com",
        accountType: AccountTypeEnum.PetBusiness,
        accountStatus: AccountStatusEnum.Active,
        dateCreated: "2023-10-04T08:49:25.490Z",
        lastUpdated: null,
      },
    ],
  },
  {
    commissionRuleId: 2,
    name: "Silver",
    commissionRate: 7.0,
    default: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    petBusinesses: [
      {
        userId: 6,
        companyName: "Groomer1",
        uen: "12345678E",
        businessType: null,
        businessDescription: null,
        contactNumber: "91627863",
        websiteURL: null,
        email: "groomer1@example.com",
        accountType: AccountTypeEnum.PetBusiness,
        accountStatus: AccountStatusEnum.Pending,
        dateCreated: "2023-10-04T08:49:25.623Z",
        lastUpdated: null,
      },
      {
        userId: 7,
        companyName: "Groomer2",
        uen: "12345678E",
        businessType: null,
        businessDescription: null,
        contactNumber: "87168812",
        websiteURL: null,
        email: "groomer2@example.com",
        accountType: AccountTypeEnum.PetBusiness,
        accountStatus: AccountStatusEnum.Pending,
        dateCreated: "2023-10-04T08:49:25.751Z",
        lastUpdated: null,
      },
      {
        userId: 8,
        companyName: "Groomer3",
        uen: "12345678E",
        businessType: null,
        businessDescription: null,
        contactNumber: "83192732",
        websiteURL: null,
        email: "groomer3@example.com",
        accountType: AccountTypeEnum.PetBusiness,
        accountStatus: AccountStatusEnum.Pending,
        dateCreated: "2023-10-04T08:49:25.867Z",
        lastUpdated: null,
      },
    ],
  },
  {
    commissionRuleId: 3,
    name: "Gold",
    commissionRate: 8.5,
    default: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    petBusinesses: [],
  },
];
