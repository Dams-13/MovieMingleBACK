const request = require("supertest");
const appPromise = require("../../../index");

describe("User routes", () => {
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

  const adminToken = "admintokenJWT";

  test("GET /users/list doit renvoyer 200 et la liste des utilisateurs pour l'administrateur", async () => {
    const response = await request(app)
      .get("/users/list")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test("GET /users/:firstName doit renvoyer 200 et un objet utilisateur pour l'administrateur", async () => {
    const firstName = "John";
    const response = await request(app)
      .get(`/users/${firstName}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("firstName", firstName);
  });

  test("POST /users/signup doit renvoyer 201 et un message de réussite", async () => {
    const uniqueName = `Test${getRandomString(5)}`;
    const newUser = {
      firstName: uniqueName,
      lastName: "Nomtest",
      password: "mypassword",
      isAdmin: false,
    };

    const response = await request(app).post("/users/signup").send(newUser);

    expect(response.status).toBe(201);
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
});
