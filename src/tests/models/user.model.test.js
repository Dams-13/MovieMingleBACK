const { DataTypes } = require("sequelize");
const { sequelize } = require("../../models/postgres.db");
const sinon = require("sinon");
const { expect } = require("chai");
const faker = require("faker");
const User = require("../../models/user.model");

describe("src/models/user.model", () => {
  const sandbox = sinon.createSandbox();

  beforeAll(() => {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
        },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        isAdmin: { type: DataTypes.BOOLEAN, allowNull: false },
      },
      { sequelize, tableName: "user" }
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  afterAll(() => {
    sequelize.close();
  });

  describe("Propriétés de l'utilisateur", () => {
    it("Doit avoir un identifiant de propriété de type UUID", () => {
      expect(User.rawAttributes.id.type.key).to.eql(DataTypes.UUID.key);
    });

    it("Doit avoir une propriété firstName de type STRING", () => {
      expect(User.rawAttributes.firstName.type.key).to.eql(
        DataTypes.STRING.key
      );
    });
  });

  describe("Opérations CRUD utilisateur", () => {
    it("Doit créer un nouvel utilisateur", async () => {
      const newUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: faker.internet.password(),
        isAdmin: faker.datatype.boolean(),
      };

      const userStub = sandbox.stub(User, "create").resolves(newUser);

      const createdUser = await User.create(newUser);

      expect(userStub.calledOnce).to.be.true;
      expect(createdUser).to.deep.equal(newUser);
    });
  });
});
