import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy, mockReset } from "jest-mock-extended";

import { client } from "../../src/database/client";

jest.mock("../../src/database/client", () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>()
}));

beforeEach(() => {
    mockReset(clientMock)
});

export const clientMock = client as unknown as DeepMockProxy<PrismaClient>;
