type ClientUser = Pick<User, "id" | "username" | "email" | "profilePic">;

type ClientStaff = Pick<
  Staff,
  "id" | "username" | "email" | "profilePic" | "role" | "alias"
>;

type ClientRestaurant = Omit<Restaurant, "createdAt" | "updatedAt">;

type ClientDish = Omit<Dish, "restaurantId" | "createdAt" | "updatedAt">;

type ClientTable = Omit<RestaurantTable,  "createdAt" | "updatedAt" | "restaurantId">

export const createClientStaff = (staff: Staff): ClientStaff => {
  return {
    id: staff.id,
    username: staff.username,
    email: staff.email,
    profilePic: staff.profilePic,
    role: staff.role,
    alias: staff.alias,
  };
};

export const createClientUser = (user: User): ClientUser => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profilePic: user.profilePic,
  };
};

export const createClientRestaurant = (
  restaurant: Restaurant
): ClientRestaurant => {
  return {
    id: restaurant.id,
    serialNo: restaurant.serialNo,
    name: restaurant.name,
    email: restaurant.email,
    phoneNumber: restaurant.phoneNumber,
    logoUrl: restaurant.logoUrl,
    slug: restaurant.slug,
    openingTime: restaurant.openingTime,
    closingTime: restaurant.closingTime,
  };
};

export const createClientDish = (dish: ClientDish): ClientDish => {
  return {
    id: dish.id,
    name: dish.name,
    description: dish.description,
    price: dish.price,

    category: dish.category,
    tags: dish.tags,
    isVeg: dish.isVeg,
    imageUrl: dish.imageUrl,
    
    isAvailable: dish.isAvailable,
    discountPercentage: dish.discountPercentage,
    preparationTime: dish.preparationTime,
  };
};

export const createClientTable = (
  table: ClientTable
): ClientTable => {
  return {
    backupCode: table.backupCode,
    capacity: table.capacity,
    id: table.id,
    isOccupied: table.isOccupied,
    name: table.name,
    qrcode: table.qrcode,
    serialNo: table.serialNo,
  }
}
