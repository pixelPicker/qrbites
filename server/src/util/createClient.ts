type clientUser = Pick<User, "id" | "username" | "email" | "profilePic">;

type clientStaff = Pick<
  Staff,
  "id" | "username" | "email" | "profilePic" | "role" | "alias"
>;

type clientRestaurant = Omit<Restaurant, "slug" | "createdAt" | "updatedAt">;

export const createClientStaff = (staff: Staff): clientStaff => {
  return {
    id: staff.id,
    username: staff.username,
    email: staff.email,
    profilePic: staff.profilePic,
    role: staff.role,
    alias: staff.alias,
  };
};

export const createClientUser = (user: User): clientUser => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profilePic: user.profilePic,
  };
};

export const createClientRestaurant = (
  restaurant: Restaurant
): clientRestaurant => {
  return {
    id: restaurant.id,
    serialNo: restaurant.serialNo,
    name: restaurant.name,
    email: restaurant.email,
    phoneNumber: restaurant.phoneNumber,
    logoUrl: restaurant.logoUrl,
    openingTime: restaurant.openingTime,
    closingTime: restaurant.closingTime,
  };
};
