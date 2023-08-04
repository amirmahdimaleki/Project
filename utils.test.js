import { comparePassword } from "./utils/utils";
import bcrypt from "bcrypt";

describe("comparePassword", () => {
  it("should return a promise that resolves to true if the passwords match", async () => {
    const plainText = "password";
    const hash = await bcrypt.hash(plainText, 10);

    const result = await comparePassword(plainText, hash);

    expect(result).toBeTruthy();
  });

  it("should return a promise that rejects if the passwords do not match", async () => {
    const plainText = "password";
    const differentHash = await bcrypt.hash("different password", 10);

    const result = await comparePassword(plainText, differentHash);

    expect(result).toBeFalsy();
  });
});