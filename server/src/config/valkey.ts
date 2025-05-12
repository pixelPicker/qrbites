import {Redis} from "ioredis";

const valkeyConnection = new Redis({maxRetriesPerRequest: null})

export default valkeyConnection;
