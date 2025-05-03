interface clientUser {
  id: string;
  username: string;
  email: string;
  profilePic: string | null;
}
interface clientStaff {
  id: string;
  username: string;
  email: string;
  profilePic: string | null;
  role: "staff" | "admin" | "manager";
  alias: string | null;
}

export const createClientStaff = ({
  id,
  username,
  email,
  profilePic,
  role,
  alias,
}: clientStaff): clientStaff => {
  return {
    id: id,
    username: username,
    email: email,
    profilePic: profilePic,
    role: role,
    alias: alias,
  };
};

//     password: string | null;
//     provider: "magic_link" | "google";
//     createdAt: string;
//     updatedAt: string;
//     emailVerificationToken: string | null;
//     isVerified: boolean | null;
export const createClientUser = ({
  id,
  username,
  email,
  profilePic,
}: clientUser): clientUser => {
  return {
    id,
    username,
    email,
    profilePic,
  };
};
