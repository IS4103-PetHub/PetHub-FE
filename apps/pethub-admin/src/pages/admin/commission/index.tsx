import { Container, Group, Transition } from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { sortBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  AccountStatusEnum,
  AccountTypeEnum,
  EMPTY_STATE_DELAY_MS,
  TABLE_PAGE_SIZE,
} from "shared-utils";
import { PageTitle } from "web-ui";
import LargeCreateButton from "web-ui/shared/LargeCreateButton";
import NoSearchResultsMessage from "web-ui/shared/NoSearchResultsMessage";
import SadDimmedMessage from "web-ui/shared/SadDimmedMessage";
import SearchBar from "web-ui/shared/SearchBar";
import api from "@/api/axiosConfig";
import CommissionRuleModal from "@/components/commission/CommissionRuleModal";
import CommissionRuleTable from "@/components/commission/CommissionRuleTable";
import NoPermissionsMessage from "@/components/common/NoPermissionsMessage";
import { CommissionRule, Permission } from "@/types/types";

interface CommissionProps {
  permissions: Permission[];
}

export default function Commission({ permissions }: CommissionProps) {
  /*
   *   Permissions
   */
  // TODO: permissions
  // const permissionCodes = permissions.map((permission) => permission.code);
  // const canWrite = permissionCodes.includes(PermissionsCodeEnum.WriteCommissionGroups);
  // const canRead = permissionCodes.includes(PermissionsCodeEnum.ReadCommissionGroups);
  const canWrite = true;
  const canRead = true;

  const commissionRules = dummyData;
  /*
   * Component State
   */
  const [isCreateModalOpen, { close: closeCreate, open: openCreate }] =
    useDisclosure(false);
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<CommissionRule[]>(commissionRules);
  const [isSearching, setIsSearching] = useToggle();
  const [hasNoFetchedRecords, setHasNoFetchedRecords] = useToggle();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "commissionRuleId",
    direction: "asc",
  });

  // Recompute records whenever the current page or sort status changes
  useEffect(() => {
    const from = (page - 1) * TABLE_PAGE_SIZE;
    const to = from + TABLE_PAGE_SIZE;
    const sortedTags = sortBy(commissionRules, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      sortedTags.reverse();
    }
    // Slice the sorted array to get the records for the current page
    const newRecords = sortedTags.slice(from, to);
    // Update the records state
    setRecords(newRecords);
  }, [page, sortStatus, commissionRules]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // display empty state message if no records fetched after some time
      if (commissionRules.length === 0) {
        setHasNoFetchedRecords(true);
      }
    }, EMPTY_STATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (searchStr: string) => {
    if (searchStr.length === 0) {
      setIsSearching(false);
      setRecords(commissionRules);
      setPage(1);
      return;
    }
    // search by id or name
    setIsSearching(true);
    const results = commissionRules.filter((rule: CommissionRule) =>
      rule.name.toLowerCase().includes(searchStr.toLowerCase()),
    );
    setRecords(results);
    setPage(1);
  };

  if (!canRead) {
    return <NoPermissionsMessage />;
  }

  const renderContent = () => {
    if (dummyData.length === 0) {
      // TODO: Uncomment when get API is up
      //   if (isLoading) {
      //     return <CenterLoader />;
      //   }
      return (
        <Transition
          mounted={hasNoFetchedRecords}
          transition="fade"
          duration={100}
        >
          {(styles) => (
            <div style={styles}>
              <SadDimmedMessage
                title="No Commission Group found"
                subtitle="Click 'Create Commission Group' to create a new Group"
              />
            </div>
          )}
        </Transition>
      );
    }
    return (
      <>
        <SearchBar text="Search by commission name" onSearch={handleSearch} />
        {isSearching && records.length === 0 ? (
          <NoSearchResultsMessage />
        ) : (
          <CommissionRuleTable
            commissionRules={records}
            isSearching={isSearching}
            page={page}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            onPageChange={setPage}
            disabled={!canWrite}
            totalNumGroup={commissionRules.length}
            canWrite={canWrite}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Commision Group Management</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Container fluid>
          <Group position="apart">
            <PageTitle title="Commission Group" />
            {canWrite ? (
              <LargeCreateButton
                text="Create Commission Group"
                onClick={openCreate}
              />
            ) : null}
          </Group>
          {renderContent()}
        </Container>
        <CommissionRuleModal
          opened={isCreateModalOpen}
          canWrite={canWrite}
          onClose={closeCreate}
          // refetch={}
        />
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  const userId = session.user["userId"];
  const permissions = await (
    await api.get(`/rbac/users/${userId}/permissions`)
  ).data;
  return { props: { permissions } };
}

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
