const { faker } = require("@faker-js/faker");

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const fullName = faker.person.fullName();
const email = faker.internet.email();
const phone = faker.phone.number();
const address = faker.location.postalAddress();
const bio = faker.person.bio();

console.log({ firstName, lastName, fullName, email, phone, address, bio });
