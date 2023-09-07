import { InternalUser, PetBusiness, PetOwner } from "@/types/types";

type UserDetailsProps = {
  user: PetOwner | PetBusiness | InternalUser | null;
};

const UserDetails = ({ user }: UserDetailsProps) => {
  if (!user) return null;
  switch (user.AccountTypeEnum) {
    case "INTERNAL_USER":
      return <div>Admin</div>;
    case "PET_BUSINESS":
      return <div>PetBusiness</div>;
    case "PET_OWNER":
      const petOwner = user as PetOwner;
      return (
        <div>
          <h3>
            Details for {petOwner.firstName} {petOwner.lastName}
          </h3>
          <p>Other Detail 1: {petOwner.AccountTypeEnum}</p>
          <p>Other Detail 2: {petOwner.accountStatus}</p>
        </div>
      );
  }
};

export default UserDetails;
