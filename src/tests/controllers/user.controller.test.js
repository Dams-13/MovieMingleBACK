const request = require("supertest");
const appPromise = require("../../../index");

describe("User Controller", () => {
  let app;
  let server;

  beforeAll(async () => {
    const result = await appPromise;
    app = result.app;
    server = result.server;
  });

  afterAll(() => {
    server.close();
  });

  it("l'inscription doit réussir avec un prénom unique", async function () {
    const uniqueFirstName = `Test${getRandomString(5)}`;
    const response = await request(app).post("/users/signup").send({
      firstName: uniqueFirstName,
      lastName: "Userbot",
      password: "mypassword",
      isAdmin: false,
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty("success", true);
  });

  function getRandomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  it("l'inscription doit échouer si firstName existe déjà", async function () {
    const existingUser = {
      firstName: "ExistingUser",
      lastName: "User",
      password: "password",
      isAdmin: false,
    };

    await request(app).post("/users/signup").send(existingUser);
    const response = await request(app)
      .post("/users/signup")
      .send(existingUser);

    expect(response.statusCode).toEqual(400);
  });
});