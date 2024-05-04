export class MessageDto {
  name: string;
  link: string;
  price: number;
  image: string;

  constructor(model: MessageDto) {
    this.name = model.name;
    this.link = model.link;
    this.price = model.price;
    this.image = model.image;
  }
}
