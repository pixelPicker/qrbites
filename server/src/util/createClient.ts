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
interface clientRestaurant {
  id: string;
  serialNo: number;
  name: string;
  email: string;
  phoneNumber: string[] | null;
  logoUrl: string | null;
  openingTime: string | null;
  closingTime: string | null;
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

export const createClientRestaurant = ({
  id,
  serialNo,
  name,
  email,
  phoneNumber,
  logoUrl,
  openingTime,
  closingTime,
}: clientRestaurant): clientRestaurant => {
  return {
    id,
    serialNo,
    name,
    email,
    phoneNumber,
    logoUrl,
    openingTime,
    closingTime,
  }
}