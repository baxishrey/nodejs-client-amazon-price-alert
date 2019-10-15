export class User {
  name: string;
  email: string;
  picturePath: string;

  constructor(name, email, picturePath) {
    this.name = name;
    this.email = email;
    this.picturePath = picturePath;
  }
}
