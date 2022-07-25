process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let popsicle = { name: "popsicle", price: 1.45 };

beforeEach(function () {
  items.push(popsicle);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(items);
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(popsicle);
  });
  test("Responds with 404 for invalid cat", async () => {
    const res = await request(app).get(`/items/hii`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating a item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "chips", price: 3.14 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "chips", price: 3.14 } });
  });
  test("Responds with 400 if name or price is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating a item's name and price", async () => {
    const res = await request(app)
      .patch(`/items/${popsicle.name}`)
      .send({ name: "cheerios", price: 4.13 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "cheerios", price: 4.13 } });
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app)
      .patch(`/items/adfaslje`)
      .send({ name: "cheerios", price: 4.13 });
    expect(res.statusCode).toBe(404);
  });
});

describe("/DELETE /items/:name", () => {
  test("Deleting a item", async () => {
    const res = await request(app).delete(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/adsfasdf`);
    expect(res.statusCode).toBe(404);
  });
});
